import {
    useEffect,
    useMemo,
    useState
} from "react";


import {
    useSearchParams
} from "react-router-dom";


import {
    Search,
    SlidersHorizontal,
    X,
    RotateCcw,
    Heart,
    ShoppingBag,
    PackageSearch
} from "lucide-react";


import ProductGrid
    from "../components/products/ProductGrid";


import ProductFilters
    from "../components/products/ProductFilters";


import ProductSort
    from "../components/products/ProductSort";


import {
    getProducts,
    getCategories
} from "../services/productService";


import {
    useWishlist
} from "../context/WishlistContext";


import {
    useCart
} from "../context/CartContext";


import "../styles/products.css";


/* ============================================================
   CATEGORY SLUG HELPER
============================================================ */

function slugifyCategory(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* ============================================================
   PRODUCTS PAGE
============================================================ */

function Products() {

    const [
        searchParams,
        setSearchParams
    ] = useSearchParams();


    /* ========================================================
       PRODUCTS
    ======================================================== */

    const [
        products,
        setProducts
    ] = useState([]);


    const [
        categories,
        setCategories
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    /* ========================================================
       FILTER STATES
    ======================================================== */

    const [
        searchQuery,
        setSearchQuery
    ] = useState(
        () =>
            searchParams.get(
                "search"
            ) || ""
    );


    const [
        sortBy,
        setSortBy
    ] = useState(
        "popular"
    );


    const [
        wishlistOnly,
        setWishlistOnly
    ] = useState(false);


    const [
        mobileFiltersOpen,
        setMobileFiltersOpen
    ] = useState(false);


    /* ========================================================
       WISHLIST
    ======================================================== */

    const {
        wishlistIds,
        wishlistCount
    } = useWishlist();


    /* ========================================================
       CART
    ======================================================== */

    const cartContext =
        useCart();


    const cartCount =
        Number(
            cartContext?.totalQuantity ??
            cartContext?.items?.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item?.quantity || 0
                    ),
                0
            ) ??
            0
        );


    /* ========================================================
       LOAD DATA
    ======================================================== */

    async function loadData() {

        setLoading(true);

        setError("");


        try {

            const [
                productsData,
                categoriesData
            ] = await Promise.all([

                getProducts(),

                getCategories()

            ]);


            setProducts(
                Array.isArray(
                    productsData
                )
                    ? productsData
                    : []
            );


            setCategories(
                Array.isArray(
                    categoriesData
                )
                    ? categoriesData
                    : []
            );

        }
        catch (loadError) {

            console.error(
                "Products page loading failed:",
                loadError
            );


            setError(
                "Unable to load products. Please try again."
            );

        }
        finally {

            setLoading(false);

        }

    }


    /* ========================================================
       INITIAL LOAD
    ======================================================== */

    useEffect(() => {

        let cancelled =
            false;


        async function initialLoad() {

            try {

                const [
                    productsData,
                    categoriesData
                ] = await Promise.all([

                    getProducts(),

                    getCategories()

                ]);


                if (cancelled) {

                    return;

                }


                setProducts(
                    Array.isArray(
                        productsData
                    )
                        ? productsData
                        : []
                );


                setCategories(
                    Array.isArray(
                        categoriesData
                    )
                        ? categoriesData
                        : []
                );


                setError("");

            }
            catch (loadError) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Products page loading failed:",
                    loadError
                );


                setError(
                    "Unable to load products. Please try again."
                );

            }
            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        initialLoad();


        return () => {

            cancelled =
                true;

        };

    }, []);


    /* ========================================================
       SEARCH FROM NAVBAR URL
    ======================================================== */

    const urlSearchQuery =
        searchParams.get(
            "search"
        ) || "";


    useEffect(() => {

        if (
            urlSearchQuery &&
            urlSearchQuery !==
            searchQuery
        ) {

            setSearchQuery(
                urlSearchQuery
            );

        }

    }, [
        urlSearchQuery,
        searchQuery
    ]);


    /* ========================================================
       SELECTED CATEGORY FROM URL

       Supports:
       ?category=<UUID>
       ?category=<slug>
    ======================================================== */

    const selectedCategory =
        useMemo(() => {

            const categoryParam =
                searchParams.get(
                    "category"
                );


            if (
                !categoryParam ||
                !categories.length
            ) {

                return "all";

            }


            const normalizedParam =
                String(
                    categoryParam
                )
                    .trim()
                    .toLowerCase();


            const matchedCategory =
                categories.find(
                    category => {

                        /* DATABASE ID */

                        const categoryId =
                            String(
                                category.id ||
                                ""
                            )
                                .trim()
                                .toLowerCase();


                        if (
                            categoryId ===
                            normalizedParam
                        ) {

                            return true;

                        }


                        /* CATEGORY NAME */

                        const categoryNameSlug =
                            slugifyCategory(
                                category.name
                            );


                        /* DATABASE SLUG */

                        const databaseSlug =
                            slugifyCategory(
                                category.slug ||
                                category.category_slug ||
                                ""
                            );


                        return (
                            categoryNameSlug ===
                            normalizedParam
                        ) || (
                            databaseSlug ===
                            normalizedParam
                        );

                    }
                );


            return matchedCategory?.id ||
                "all";

        }, [
            searchParams,
            categories
        ]);


    /* ========================================================
       CATEGORY MAP
    ======================================================== */

    const categoryMap =
        useMemo(() => {

            return Object.fromEntries(
                categories.map(
                    category => [
                        category.id,
                        category.name
                    ]
                )
            );

        }, [
            categories
        ]);


    /* ========================================================
       CATEGORY COUNTS
    ======================================================== */

    const categoryCounts =
        useMemo(() => {

            const counts = {};


            products.forEach(
                product => {

                    if (
                        product.category_id
                    ) {

                        counts[
                            product.category_id
                        ] = (
                            counts[
                                product.category_id
                            ] || 0
                        ) + 1;

                    }

                }
            );


            return counts;

        }, [
            products
        ]);


    /* ========================================================
       FILTER + SEARCH + SORT
    ======================================================== */

    const filteredProducts =
        useMemo(() => {

            let result =
                [...products];


            /* ==================================================
               CATEGORY
            ================================================== */

            if (
                selectedCategory !==
                "all"
            ) {

                result =
                    result.filter(
                        product =>
                            String(
                                product.category_id ||
                                ""
                            ) ===
                            String(
                                selectedCategory
                            )
                    );

            }


            /* ==================================================
               SEARCH
            ================================================== */

            const query =
                searchQuery
                    .trim()
                    .toLowerCase();


            if (query) {

                result =
                    result.filter(
                        product => {

                            const categoryName =
                                categoryMap[
                                    product.category_id
                                ] || "";


                            const searchableText =
                                [

                                    product.name,

                                    product.short_description,

                                    product.description,

                                    categoryName

                                ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .toLowerCase();


                            return searchableText
                                .includes(
                                    query
                                );

                        }
                    );

            }


            /* ==================================================
               WISHLIST
            ================================================== */

            if (
                wishlistOnly
            ) {

                result =
                    result.filter(
                        product =>
                            wishlistIds.includes(
                                product.id
                            )
                    );

            }


            /* ==================================================
               SORT
            ================================================== */

            result.sort(
                (a, b) => {

                    const popularityDifference =
                        (
                            (
                                Number(
                                    b.rating ||
                                    0
                                ) * 1000
                            ) +

                            Number(
                                b.review_count ||
                                0
                            )
                        ) -

                        (
                            (
                                Number(
                                    a.rating ||
                                    0
                                ) * 1000
                            ) +

                            Number(
                                a.review_count ||
                                0
                            )
                        );


                    switch (
                        sortBy
                    ) {

                        case "price_low":

                            return (
                                Number(
                                    a.price || 0
                                ) -
                                Number(
                                    b.price || 0
                                )
                            );


                        case "price_high":

                            return (
                                Number(
                                    b.price || 0
                                ) -
                                Number(
                                    a.price || 0
                                )
                            );


                        case "rating":

                            return (
                                Number(
                                    b.rating || 0
                                ) -
                                Number(
                                    a.rating || 0
                                )
                            );


                        case "name":

                            return (
                                a.name || ""
                            ).localeCompare(
                                b.name ||
                                ""
                            );


                        case "popular":

                            return popularityDifference;


                        default:

                            return popularityDifference;

                    }

                }
            );


            return result;

        }, [

            products,

            selectedCategory,

            searchQuery,

            sortBy,

            wishlistOnly,

            wishlistIds,

            categoryMap

        ]);


    /* ========================================================
       CATEGORY CHANGE
    ======================================================== */

    function handleCategoryChange(
        categoryId
    ) {

        if (
            categoryId ===
            "all"
        ) {

            const params =
                new URLSearchParams(
                    searchParams
                );


            params.delete(
                "category"
            );


            setSearchParams(
                params
            );


            return;

        }


        const categoryExists =
            categories.some(
                category =>
                    String(
                        category.id
                    ) ===
                    String(
                        categoryId
                    )
            );


        if (
            !categoryExists
        ) {

            return;

        }


        const params =
            new URLSearchParams(
                searchParams
            );


        params.set(
            "category",
            categoryId
        );


        setSearchParams(
            params
        );

    }


    /* ========================================================
       SEARCH CHANGE
    ======================================================== */

    function handleSearchChange(
        value
    ) {

        setSearchQuery(
            value
        );


        const params =
            new URLSearchParams(
                searchParams
            );


        if (
            value.trim()
        ) {

            params.set(
                "search",
                value
            );

        }
        else {

            params.delete(
                "search"
            );

        }


        setSearchParams(
            params,
            {
                replace: true
            }
        );

    }


    /* ========================================================
       CLEAR FILTERS
    ======================================================== */

    function clearFilters() {

        setSearchQuery("");

        setSortBy(
            "popular"
        );

        setWishlistOnly(
            false
        );

        setSearchParams({});

    }


    /* ========================================================
       ACTIVE FILTER CHECK
    ======================================================== */

    const hasActiveFilters =
        Boolean(
            searchQuery.trim()
        ) ||

        selectedCategory !==
        "all" ||

        wishlistOnly ||

        sortBy !==
        "popular";


    /* ========================================================
       UI
    ======================================================== */

    return (

        <main
            className="products-page"
        >

            {/* =================================================
                DECORATIVE BACKGROUND
            ================================================= */}

            <div
                className="
                    products-page__orb
                    products-page__orb--one
                "
            />


            <div
                className="
                    products-page__orb
                    products-page__orb--two
                "
            />


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header
                className="
                    products-page__header
                "
            >

                <p
                    className="
                        products-page__eyebrow
                    "
                >

                    AYURVEDIC COLLECTIONS

                </p>


                <h1>

                    Our Products

                </h1>


                <p
                    className="
                        products-page__subtitle
                    "
                >

                    Discover authentic Ayurvedic
                    products crafted with nature's wisdom.

                </p>

            </header>


            {/* =================================================
                SEARCH
            ================================================= */}

            <section
                className="
                    products-search
                "
            >

                <Search
                    size={19}
                />


                <input

                    type="search"

                    value={
                        searchQuery
                    }

                    onChange={
                        event =>
                            handleSearchChange(
                                event.target.value
                            )
                    }

                    placeholder="Search products, herbs & wellness..."

                    aria-label="Search products"

                />


                {
                    searchQuery &&

                    <button

                        type="button"

                        className="
                            products-search__clear
                        "

                        onClick={() =>
                            handleSearchChange("")
                        }

                        aria-label="
                            Clear search
                        "

                    >

                        <X
                            size={17}
                        />

                    </button>
                }

            </section>


            {/* =================================================
                SHOP
            ================================================= */}

            <section
                className="
                    products-shop
                "
            >

                {/* DESKTOP FILTER */}

                <aside
                    className="
                        products-shop__sidebar
                    "
                >

                    <ProductFilters

                        categories={
                            categories
                        }

                        selectedCategory={
                            selectedCategory
                        }

                        categoryCounts={
                            categoryCounts
                        }

                        totalProducts={
                            products.length
                        }

                        onCategoryChange={
                            handleCategoryChange
                        }

                        onClear={
                            clearFilters
                        }

                        hasActiveFilters={
                            hasActiveFilters
                        }

                    />

                </aside>


                {/* PRODUCTS */}

                <div
                    className="
                        products-shop__main
                    "
                >

                    {/* TOOLBAR */}

                    <div
                        className="
                            products-toolbar
                        "
                    >

                        <div
                            className="
                                products-toolbar__left
                            "
                        >

                            <button

                                type="button"

                                className="
                                    products-mobile-filter
                                "

                                onClick={() =>
                                    setMobileFiltersOpen(
                                        true
                                    )
                                }

                            >

                                <SlidersHorizontal
                                    size={17}
                                />

                                Filters

                            </button>


                            <div
                                className="
                                    products-result-count
                                "
                            >

                                <strong>

                                    {
                                        filteredProducts.length
                                    }

                                </strong>


                                <span>

                                    {
                                        filteredProducts.length ===
                                        1
                                            ? " Product"
                                            : " Products"
                                    }

                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                products-toolbar__right
                            "
                        >

                            {/* WISHLIST FILTER */}

                            <button

                                type="button"

                                className={`
                                    products-toolbar-action
                                    ${
                                        wishlistOnly
                                            ? "is-active"
                                            : ""
                                    }
                                `}

                                onClick={() =>
                                    setWishlistOnly(
                                        previous =>
                                            !previous
                                    )
                                }

                            >

                                <Heart

                                    size={16}

                                    fill={
                                        wishlistOnly
                                            ? "currentColor"
                                            : "none"
                                    }

                                />


                                Wishlist


                                <span>

                                    {
                                        wishlistCount
                                    }

                                </span>

                            </button>


                            {/* CART COUNT */}

                            <div
                                className="
                                    products-cart-summary
                                "
                            >

                                <ShoppingBag
                                    size={16}
                                />

                                Cart


                                <span>

                                    {
                                        cartCount
                                    }

                                </span>

                            </div>


                            {/* SORT */}

                            <ProductSort

                                value={
                                    sortBy
                                }

                                onChange={
                                    setSortBy
                                }

                            />

                        </div>

                    </div>


                    {/* =================================================
                        ACTIVE FILTERS
                    ================================================= */}

                    {
                        hasActiveFilters &&

                        <div
                            className="
                                products-active-filters
                            "
                        >

                            {
                                searchQuery &&

                                <span>

                                    Search:

                                    <strong>

                                        "
                                        {
                                            searchQuery
                                        }
                                        "

                                    </strong>

                                </span>
                            }


                            {
                                selectedCategory !==
                                "all" &&

                                <span>

                                    {
                                        categoryMap[
                                            selectedCategory
                                        ] ||

                                        "Category"
                                    }

                                </span>
                            }


                            {
                                wishlistOnly &&

                                <span>

                                    Wishlist

                                </span>
                            }


                            <button

                                type="button"

                                onClick={
                                    clearFilters
                                }

                            >

                                <RotateCcw
                                    size={14}
                                />

                                Clear all

                            </button>

                        </div>
                    }


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    {
                        loading ? (

                            <div
                                className="
                                    products-loading-grid
                                "
                            >

                                {
                                    Array.from({
                                        length: 8
                                    }).map(
                                        (
                                            _,
                                            index
                                        ) => (

                                            <div

                                                key={
                                                    index
                                                }

                                                className="
                                                    product-skeleton
                                                "

                                            >

                                                <div
                                                    className="
                                                        product-skeleton__image
                                                    "
                                                />


                                                <div
                                                    className="
                                                        product-skeleton__line
                                                        product-skeleton__line--title
                                                    "
                                                />


                                                <div
                                                    className="
                                                        product-skeleton__line
                                                    "
                                                />


                                                <div
                                                    className="
                                                        product-skeleton__line
                                                        product-skeleton__line--short
                                                    "
                                                />

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        ) : error ? (

                            <div
                                className="
                                    products-state
                                    products-state--error
                                "
                            >

                                <PackageSearch
                                    size={42}
                                />


                                <h3>

                                    Products unavailable

                                </h3>


                                <p>

                                    {error}

                                </p>


                                <button

                                    type="button"

                                    onClick={
                                        loadData
                                    }

                                >

                                    Try Again

                                </button>

                            </div>

                        ) : filteredProducts.length ===
                        0 ? (

                            <div
                                className="
                                    products-state
                                "
                            >

                                <PackageSearch
                                    size={46}
                                />


                                <h3>

                                    No products found

                                </h3>


                                <p>

                                    Try another search
                                    or clear your filters.

                                </p>


                                <button

                                    type="button"

                                    onClick={
                                        clearFilters
                                    }

                                >

                                    Clear Filters

                                </button>

                            </div>

                        ) : (

                            <ProductGrid
                                products={
                                    filteredProducts
                                }
                            />

                        )
                    }

                </div>

            </section>


            {/* =================================================
                MOBILE FILTER DRAWER
            ================================================= */}

            {
                mobileFiltersOpen &&

                <div

                    className="
                        products-filter-overlay
                    "

                    onClick={() =>
                        setMobileFiltersOpen(
                            false
                        )
                    }

                >

                    <aside

                        className="
                            products-filter-drawer
                        "

                        onClick={
                            event =>
                                event.stopPropagation()
                        }

                    >

                        <div
                            className="
                                products-filter-drawer__header
                            "
                        >

                            <h3>

                                Filters

                            </h3>


                            <button

                                type="button"

                                onClick={() =>
                                    setMobileFiltersOpen(
                                        false
                                    )
                                }

                                aria-label="
                                    Close filters
                                "

                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        <ProductFilters

                            categories={
                                categories
                            }

                            selectedCategory={
                                selectedCategory
                            }

                            categoryCounts={
                                categoryCounts
                            }

                            totalProducts={
                                products.length
                            }

                            onCategoryChange={
                                category => {

                                    handleCategoryChange(
                                        category
                                    );


                                    setMobileFiltersOpen(
                                        false
                                    );

                                }
                            }

                            onClear={
                                clearFilters
                            }

                            hasActiveFilters={
                                hasActiveFilters
                            }

                        />

                    </aside>

                </div>
            }

        </main>

    );

}


export default Products;