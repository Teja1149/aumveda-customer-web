import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Heart,
    ShoppingBag,
    Star,
    Minus,
    Plus,
    Check,
    ArrowLeft,
    ShieldCheck,
    Leaf,
    PackageCheck
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProductBySlug,
    getProducts
} from "../services/productService";

import ProductGrid from "../components/products/ProductGrid";

import "../styles/product-details.css";



const WISHLIST_KEY =
    "aumveda_wishlist";

const CART_KEY =
    "aumveda_cart";



function formatPrice(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "—";

    }

    return new Intl.NumberFormat(
        "en-IN",
        {
            maximumFractionDigits: 0
        }
    ).format(
        Number(value)
    );

}



function readWishlist() {

    try {

        const saved =
            localStorage.getItem(
                WISHLIST_KEY
            );

        return new Set(
            saved
                ? JSON.parse(saved)
                : []
        );

    } catch {

        return new Set();

    }

}



function readCart() {

    try {

        const saved =
            localStorage.getItem(
                CART_KEY
            );

        return saved
            ? JSON.parse(saved)
            : [];

    } catch {

        return [];

    }

}



function ProductDetails() {

    const {
        slug
    } = useParams();


    const navigate =
        useNavigate();



    const [
        product,
        setProduct
    ] = useState(null);


    const [
        relatedProducts,
        setRelatedProducts
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        selectedImage,
        setSelectedImage
    ] = useState(null);


    const [
        selectedVariant,
        setSelectedVariant
    ] = useState(null);


    const [
        quantity,
        setQuantity
    ] = useState(1);


    const [
        wishlistIds,
        setWishlistIds
    ] = useState(
        () => readWishlist()
    );


    const [
        cartItems,
        setCartItems
    ] = useState(
        () => readCart()
    );


    const [
        addedToCart,
        setAddedToCart
    ] = useState(false);



    // ========================================================
    // LOAD PRODUCT
    // ========================================================

    useEffect(() => {

        async function loadProduct() {

            try {

                setLoading(true);

                setError("");


                const productData =
                    await getProductBySlug(
                        slug
                    );


                if (!productData) {

                    throw new Error(
                        "Product not found"
                    );

                }


                setProduct(
                    productData
                );


                // ------------------------------------------------
                // IMAGES
                // ------------------------------------------------

                const images =
                    productData.product_images ||
                    [];


                const sortedImages =
                    [...images].sort(
                        (a, b) => {

                            if (
                                a.is_primary &&
                                !b.is_primary
                            ) {
                                return -1;
                            }

                            if (
                                !a.is_primary &&
                                b.is_primary
                            ) {
                                return 1;
                            }

                            return (
                                (a.sort_order || 9999) -
                                (b.sort_order || 9999)
                            );

                        }
                    );


                if (
                    sortedImages.length > 0
                ) {

                    setSelectedImage(
                        sortedImages[0]
                    );

                }


                // ------------------------------------------------
                // VARIANTS
                // ------------------------------------------------

                const variants =
                    (
                        productData.product_variants ||
                        []
                    ).filter(
                        variant =>
                            variant.is_active !== false
                    );


                const defaultVariant =
                    variants.find(
                        variant =>
                            variant.is_default
                    ) ||
                    variants[0] ||
                    null;


                setSelectedVariant(
                    defaultVariant
                );


                // ------------------------------------------------
                // RELATED PRODUCTS
                // ------------------------------------------------

                try {

                    const allProducts =
                        await getProducts();


                    const related =
                        allProducts
                            .filter(
                                item =>
                                    item.id !==
                                    productData.id &&
                                    item.category_id ===
                                    productData.category_id
                            )
                            .slice(0, 4);


                    setRelatedProducts(
                        related
                    );

                } catch {

                    setRelatedProducts([]);

                }


            } catch (loadError) {

                console.error(
                    "Product details loading failed:",
                    loadError
                );


                setError(
                    "Unable to load this product."
                );

            } finally {

                setLoading(false);

            }

        }


        if (slug) {

            loadProduct();

        }

    }, [slug]);



    // ========================================================
    // SAVE WISHLIST
    // ========================================================

    useEffect(() => {

        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(
                [...wishlistIds]
            )
        );

    }, [wishlistIds]);



    // ========================================================
    // SAVE CART
    // ========================================================

    useEffect(() => {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(
                cartItems
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "aumveda-cart-updated"
            )
        );

    }, [cartItems]);



    // ========================================================
    // PRODUCT IMAGES
    // ========================================================

    const productImages =
        useMemo(() => {

            if (!product) {

                return [];

            }


            return [
                ...(product.product_images || [])
            ].sort(
                (a, b) => {

                    if (
                        a.is_primary &&
                        !b.is_primary
                    ) {
                        return -1;
                    }

                    if (
                        !a.is_primary &&
                        b.is_primary
                    ) {
                        return 1;
                    }

                    return (
                        (a.sort_order || 9999) -
                        (b.sort_order || 9999)
                    );

                }
            );

        }, [product]);



    // ========================================================
    // VARIANTS
    // ========================================================

    const variants =
        useMemo(() => {

            return (
                product?.product_variants ||
                []
            ).filter(
                variant =>
                    variant.is_active !== false
            );

        }, [product]);



    // ========================================================
    // CURRENT PRICE
    // ========================================================

    const currentPrice =
        selectedVariant?.price ??
        product?.price ??
        0;


    const comparePrice =
        selectedVariant?.compare_at_price ??
        product?.compare_at_price ??
        null;


    const stockQuantity =
        selectedVariant?.stock_quantity ??
        0;


    const inStock =
        stockQuantity > 0;



    const discount =
        comparePrice &&
        Number(comparePrice) >
        Number(currentPrice)

            ? Math.round(

                (
                    (
                        Number(comparePrice) -
                        Number(currentPrice)
                    ) /
                    Number(comparePrice)
                ) * 100

            )

            : 0;



    // ========================================================
    // WISHLIST
    // ========================================================

    function toggleWishlist() {

        if (!product) {
            return;
        }


        setWishlistIds(
            previous => {

                const next =
                    new Set(previous);


                if (
                    next.has(product.id)
                ) {

                    next.delete(
                        product.id
                    );

                } else {

                    next.add(
                        product.id
                    );

                }


                return next;

            }
        );

    }



    // ========================================================
    // ADD TO CART
    // ========================================================

    function addToCart() {

        if (
            !product ||
            !selectedVariant ||
            !inStock
        ) {

            return;

        }


        const cartProduct = {

            id:
                product.id,

            variant_id:
                selectedVariant.id,

            variant_name:
                selectedVariant.name,

            name:
                product.name,

            slug:
                product.slug,

            image:
                productImages[0]?.image_url ||
                null,

            price:
                Number(currentPrice),

            compare_at_price:
                comparePrice
                    ? Number(comparePrice)
                    : null,

            quantity

        };


        setCartItems(
            previous => {

                const existingIndex =
                    previous.findIndex(
                        item =>
                            item.id ===
                                product.id &&
                            item.variant_id ===
                                selectedVariant.id
                    );


                if (
                    existingIndex >= 0
                ) {

                    return previous.map(
                        (item, index) =>

                            index ===
                            existingIndex

                                ? {

                                    ...item,

                                    quantity:
                                        Number(
                                            item.quantity || 0
                                        ) +
                                        quantity

                                }

                                : item
                    );

                }


                return [
                    ...previous,
                    cartProduct
                ];

            }
        );


        setAddedToCart(
            true
        );


        setTimeout(() => {

            setAddedToCart(
                false
            );

        }, 1800);

    }



    // ========================================================
    // QUANTITY
    // ========================================================

    function decreaseQuantity() {

        setQuantity(
            previous =>
                Math.max(
                    1,
                    previous - 1
                )
        );

    }



    function increaseQuantity() {

        setQuantity(
            previous => {

                if (
                    stockQuantity <= 0
                ) {

                    return previous;

                }


                return Math.min(
                    stockQuantity,
                    previous + 1
                );

            }
        );

    }



    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <main className="product-details-page">

                <div className="product-details-loading">

                    <div className="product-details-spinner" />

                    <p>
                        Loading product...
                    </p>

                </div>

            </main>

        );

    }



    // ========================================================
    // ERROR
    // ========================================================

    if (
        error ||
        !product
    ) {

        return (

            <main className="product-details-page">

                <div className="product-details-error">

                    <PackageCheck
                        size={48}
                    />

                    <h1>
                        Product unavailable
                    </h1>

                    <p>
                        {
                            error ||
                            "This product could not be found."
                        }
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/products"
                            )
                        }
                    >
                        <ArrowLeft
                            size={17}
                        />

                        Back to Products
                    </button>

                </div>

            </main>

        );

    }



    // ========================================================
    // RENDER
    // ========================================================

    return (

        <main className="product-details-page">

            {/* =================================================
                BREADCRUMB
            ================================================= */}

            <div className="product-details-container">

                <button
                    type="button"
                    className="product-details-back"
                    onClick={() =>
                        navigate(
                            "/products"
                        )
                    }
                >

                    <ArrowLeft
                        size={16}
                    />

                    Back to Products

                </button>



                {/* =================================================
                    MAIN PRODUCT
                ================================================= */}

                <section className="product-details-main">


                    {/* IMAGE GALLERY */}

                    <div className="product-details-gallery">


                        <div className="product-details-thumbnails">

                            {
                                productImages.map(
                                    image => (

                                        <button
                                            key={
                                                image.id
                                            }

                                            type="button"

                                            className={
                                                `
                                                product-details-thumbnail
                                                ${
                                                    selectedImage?.id ===
                                                    image.id
                                                        ? "is-active"
                                                        : ""
                                                }
                                                `
                                            }

                                            onClick={() =>
                                                setSelectedImage(
                                                    image
                                                )
                                            }

                                        >

                                            <img
                                                src={
                                                    image.image_url
                                                }

                                                alt={
                                                    image.alt_text ||
                                                    product.name
                                                }
                                            />

                                        </button>

                                    )
                                )
                            }

                        </div>



                        <div className="product-details-main-image">

                            {
                                discount > 0 &&

                                <span className="product-details-discount">

                                    Save {discount}%

                                </span>
                            }


                            <button
                                type="button"
                                className={
                                    `
                                    product-details-wishlist
                                    ${
                                        wishlistIds.has(
                                            product.id
                                        )
                                            ? "is-active"
                                            : ""
                                    }
                                    `
                                }
                                onClick={
                                    toggleWishlist
                                }
                                aria-label="Wishlist"
                            >

                                <Heart
                                    size={21}
                                    fill={
                                        wishlistIds.has(
                                            product.id
                                        )
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            </button>


                            {
                                selectedImage ? (

                                    <img
                                        src={
                                            selectedImage.image_url
                                        }
                                        alt={
                                            selectedImage.alt_text ||
                                            product.name
                                        }
                                    />

                                ) : (

                                    <div className="product-details-no-image">

                                        <Leaf
                                            size={50}
                                        />

                                        <span>
                                            Image unavailable
                                        </span>

                                    </div>

                                )
                            }

                        </div>

                    </div>



                    {/* PRODUCT INFORMATION */}

                    <div className="product-details-info">


                        <p className="product-details-eyebrow">
                            AYURVEDIC WELLNESS
                        </p>


                        <h1>
                            {product.name}
                        </h1>


                        <div className="product-details-rating">

                            <div>

                                <Star
                                    size={17}
                                    fill="currentColor"
                                />

                                <strong>
                                    {
                                        Number(
                                            product.average_rating ||
                                            0
                                        ).toFixed(1)
                                    }
                                </strong>

                            </div>

                            <span>
                                {
                                    product.review_count ||
                                    0
                                } reviews
                            </span>

                        </div>



                        <p className="product-details-short-description">

                            {
                                product.short_description ||
                                product.description
                            }

                        </p>



                        {/* PRICE */}

                        <div className="product-details-price">

                            <strong>
                                ₹
                                {
                                    formatPrice(
                                        currentPrice
                                    )
                                }
                            </strong>


                            {
                                comparePrice &&
                                Number(
                                    comparePrice
                                ) >
                                Number(
                                    currentPrice
                                ) &&

                                <del>
                                    ₹
                                    {
                                        formatPrice(
                                            comparePrice
                                        )
                                    }
                                </del>
                            }


                            {
                                discount > 0 &&

                                <span>
                                    {discount}% OFF
                                </span>
                            }

                        </div>



                        {/* VARIANTS */}

                        {
                            variants.length > 0 &&

                            <div className="product-details-option">

                                <div className="product-details-option-header">

                                    <span>
                                        Size
                                    </span>

                                    <strong>
                                        {
                                            selectedVariant?.name ||
                                            "Select"
                                        }
                                    </strong>

                                </div>


                                <div className="product-details-variants">

                                    {
                                        variants.map(
                                            variant => (

                                                <button

                                                    key={
                                                        variant.id
                                                    }

                                                    type="button"

                                                    className={
                                                        `
                                                        product-details-variant
                                                        ${
                                                            selectedVariant?.id ===
                                                            variant.id
                                                                ? "is-active"
                                                                : ""
                                                        }
                                                        `
                                                    }

                                                    disabled={
                                                        Number(
                                                            variant.stock_quantity ||
                                                            0
                                                        ) <= 0
                                                    }

                                                    onClick={() => {

                                                        setSelectedVariant(
                                                            variant
                                                        );

                                                        setQuantity(
                                                            1
                                                        );

                                                    }}

                                                >

                                                    {
                                                        variant.name
                                                    }

                                                </button>

                                            )
                                        )
                                    }

                                </div>

                            </div>

                        }



                        {/* STOCK */}

                        <div className="product-details-stock">

                            <span
                                className={
                                    inStock
                                        ? "in-stock"
                                        : "out-of-stock"
                                }
                            >

                                <span />

                                {
                                    inStock
                                        ? stockQuantity <= 10
                                            ? `Only ${stockQuantity} left in stock`
                                            : "In Stock"
                                        : "Out of Stock"
                                }

                            </span>

                        </div>



                        {/* QUANTITY + CART */}

                        <div className="product-details-purchase">

                            <div className="product-details-quantity">

                                <button
                                    type="button"
                                    onClick={
                                        decreaseQuantity
                                    }
                                    disabled={
                                        !inStock ||
                                        quantity <= 1
                                    }
                                    aria-label="Decrease quantity"
                                >

                                    <Minus
                                        size={16}
                                    />

                                </button>


                                <span>
                                    {quantity}
                                </span>


                                <button
                                    type="button"
                                    onClick={
                                        increaseQuantity
                                    }
                                    disabled={
                                        !inStock ||
                                        quantity >=
                                            stockQuantity
                                    }
                                    aria-label="Increase quantity"
                                >

                                    <Plus
                                        size={16}
                                    />

                                </button>

                            </div>



                            <button

                                type="button"

                                className={
                                    `
                                    product-details-cart
                                    ${
                                        addedToCart
                                            ? "is-added"
                                            : ""
                                    }
                                    `
                                }

                                disabled={
                                    !inStock ||
                                    !selectedVariant
                                }

                                onClick={
                                    addToCart
                                }

                            >

                                {
                                    addedToCart ? (

                                        <>
                                            <Check
                                                size={18}
                                            />

                                            Added to Cart
                                        </>

                                    ) : (

                                        <>
                                            <ShoppingBag
                                                size={18}
                                            />

                                            Add To Cart
                                        </>

                                    )
                                }

                            </button>

                        </div>



                        {/* TRUST INFORMATION */}

                        <div className="product-details-trust">

                            <div>

                                <Leaf
                                    size={19}
                                />

                                <span>
                                    Ayurvedic Formulation
                                </span>

                            </div>


                            <div>

                                <ShieldCheck
                                    size={19}
                                />

                                <span>
                                    Quality Focused
                                </span>

                            </div>


                            <div>

                                <PackageCheck
                                    size={19}
                                />

                                <span>
                                    Secure Packaging
                                </span>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <section className="product-details-description">

                    <div className="product-details-description-header">

                        <p>
                            ROOTED IN AYURVEDA
                        </p>

                        <h2>
                            Product Information
                        </h2>

                    </div>


                    <div className="product-details-information-grid">


                        {
                            product.description &&

                            <article>

                                <h3>
                                    Description
                                </h3>

                                <p>
                                    {
                                        product.description
                                    }
                                </p>

                            </article>
                        }



                        {
                            product.ingredients &&

                            <article>

                                <h3>
                                    Ingredients
                                </h3>

                                <p>
                                    {
                                        product.ingredients
                                    }
                                </p>

                            </article>
                        }



                        {
                            product.benefits &&

                            <article>

                                <h3>
                                    Benefits
                                </h3>

                                <p>
                                    {
                                        product.benefits
                                    }
                                </p>

                            </article>
                        }



                        {
                            product.directions &&

                            <article>

                                <h3>
                                    Directions
                                </h3>

                                <p>
                                    {
                                        product.directions
                                    }
                                </p>

                            </article>
                        }



                        {
                            product.warnings &&

                            <article>

                                <h3>
                                    Warnings
                                </h3>

                                <p>
                                    {
                                        product.warnings
                                    }
                                </p>

                            </article>
                        }

                    </div>

                </section>



                {/* =================================================
                    RELATED PRODUCTS
                ================================================= */}

                {
                    relatedProducts.length > 0 &&

                    <section className="product-details-related">

                        <div className="product-details-related-header">

                            <p>
                                YOU MAY ALSO LIKE
                            </p>

                            <h2>
                                Related Products
                            </h2>

                        </div>


                        <ProductGrid

                            products={
                                relatedProducts
                            }

                            wishlistIds={
                                wishlistIds
                            }

                            addedProductId={
                                null
                            }

                            onToggleWishlist={
                                productId => {

                                    setWishlistIds(
                                        previous => {

                                            const next =
                                                new Set(
                                                    previous
                                                );


                                            if (
                                                next.has(
                                                    productId
                                                )
                                            ) {

                                                next.delete(
                                                    productId
                                                );

                                            } else {

                                                next.add(
                                                    productId
                                                );

                                            }


                                            return next;

                                        }
                                    );

                                }
                            }

                            onAddToCart={
                                relatedProduct => {

                                    setCartItems(
                                        previous => {

                                            const existing =
                                                previous.find(
                                                    item =>
                                                        item.id ===
                                                        relatedProduct.id
                                                );


                                            if (
                                                existing
                                            ) {

                                                return previous.map(
                                                    item =>

                                                        item.id ===
                                                        relatedProduct.id

                                                            ? {

                                                                ...item,

                                                                quantity:
                                                                    Number(
                                                                        item.quantity || 0
                                                                    ) +
                                                                    1

                                                            }

                                                            : item
                                                );

                                            }


                                            return [

                                                ...previous,

                                                {
                                                    ...relatedProduct,
                                                    quantity: 1
                                                }

                                            ];

                                        }
                                    );

                                }
                            }

                        />

                    </section>

                }

            </div>

        </main>

    );

}


export default ProductDetails;