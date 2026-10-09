import {
    useEffect,
    useState
} from "react";

import {
    ArrowLeft,
    Heart,
    Leaf,
    Minus,
    PackageCheck,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Star
} from "lucide-react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getProductBySlug,
    getProducts
} from "../services/productService";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";

import {
    useWishlist
} from "../context/WishlistContext";

import ProductGrid
    from "../components/products/ProductGrid";

import "../styles/product-details.css";


const BUY_NOW_STORAGE_KEY =
    "aumveda_buy_now";


/* ============================================================
   FORMAT PRICE
============================================================ */

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


/* ============================================================
   PRODUCT DETAILS
============================================================ */

function ProductDetails() {

    const {
        slug
    } =
        useParams();


    const navigate =
        useNavigate();


    /* ========================================================
       AUTH
    ======================================================== */

    const {
        isAuthenticated
    } =
        useAuth();


    /* ========================================================
       CART
    ======================================================== */

    const {
        items,
        addToCart,
        updateCartItem,
        removeFromCart
    } =
        useCart();


    /* ========================================================
       WISHLIST
    ======================================================== */

    const {
        isWishlisted,
        toggleWishlist
    } =
        useWishlist();


    /* ========================================================
       PRODUCT STATE
    ======================================================== */

    const [
        product,
        setProduct
    ] =
        useState(null);


    const [
        relatedProducts,
        setRelatedProducts
    ] =
        useState([]);


    const [
        loading,
        setLoading
    ] =
        useState(true);


    const [
        error,
        setError
    ] =
        useState("");


    /* ========================================================
       PRODUCT SELECTION
    ======================================================== */

    const [
        productImages,
        setProductImages
    ] =
        useState([]);


    const [
        variants,
        setVariants
    ] =
        useState([]);


    const [
        selectedImage,
        setSelectedImage
    ] =
        useState(null);


    const [
        selectedVariant,
        setSelectedVariant
    ] =
        useState(null);


    /* ========================================================
       ACTION STATE
    ======================================================== */

    const [
        cartActionLoading,
        setCartActionLoading
    ] =
        useState(false);


    const [
        buyNowLoading,
        setBuyNowLoading
    ] =
        useState(false);


    /* ========================================================
       LOAD PRODUCT
    ======================================================== */

    useEffect(() => {

        if (!slug) {

            return;

        }


        let cancelled =
            false;


        async function loadProduct() {

            try {

                setLoading(
                    true
                );


                setError("");


                const productData =
                    await getProductBySlug(
                        slug
                    );


                if (cancelled) {

                    return;

                }


                if (!productData) {

                    throw new Error(
                        "Product not found"
                    );

                }


                setProduct(
                    productData
                );


                /* =============================================
                   IMAGES
                ============================================= */

                const images =
                    [
                        ...(
                            productData.product_images ||
                            []
                        )
                    ].sort(
                        (
                            first,
                            second
                        ) => {

                            if (
                                first.is_primary &&
                                !second.is_primary
                            ) {

                                return -1;

                            }


                            if (
                                !first.is_primary &&
                                second.is_primary
                            ) {

                                return 1;

                            }


                            return (
                                Number(
                                    first.sort_order ||
                                    9999
                                ) -
                                Number(
                                    second.sort_order ||
                                    9999
                                )
                            );

                        }
                    );


                setProductImages(
                    images
                );


                setSelectedImage(
                    images[0] ||
                    null
                );


                /* =============================================
                   VARIANTS
                ============================================= */

                const activeVariants =
                    (
                        productData.product_variants ||
                        []
                    ).filter(
                        variant =>
                            variant.is_active !==
                            false
                    );


                setVariants(
                    activeVariants
                );


                const defaultVariant =
                    activeVariants.find(
                        variant =>
                            variant.is_default
                    ) ||
                    activeVariants[0] ||
                    null;


                setSelectedVariant(
                    defaultVariant
                );


                /* =============================================
                   RELATED PRODUCTS
                ============================================= */

                try {

                    const allProducts =
                        await getProducts();


                    if (cancelled) {

                        return;

                    }


                    const related =
                        (
                            Array.isArray(
                                allProducts
                            )
                                ? allProducts
                                : []
                        )
                            .filter(
                                item =>
                                    item.id !==
                                    productData.id &&
                                    item.category_id ===
                                    productData.category_id
                            )
                            .slice(
                                0,
                                4
                            );


                    setRelatedProducts(
                        related
                    );

                }
                catch (relatedError) {

                    console.error(
                        "Related products loading failed:",
                        relatedError
                    );


                    if (!cancelled) {

                        setRelatedProducts(
                            []
                        );

                    }

                }

            }
            catch (loadError) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Product details loading failed:",
                    loadError
                );


                setError(
                    "Unable to load this product."
                );

            }
            finally {

                if (!cancelled) {

                    setLoading(
                        false
                    );

                }

            }

        }


        loadProduct();


        return () => {

            cancelled =
                true;

        };

    }, [
        slug
    ]);


    /* ========================================================
       MAIN IMAGE
    ======================================================== */

    const mainImage =
        selectedImage?.image_url ||
        product?.image ||
        null;


    /* ========================================================
       PRICE
    ======================================================== */

    const currentPrice =
        Number(
            selectedVariant?.price ??
            product?.price ??
            0
        );


    const comparePrice =
        selectedVariant?.compare_at_price ??
        product?.compare_at_price ??
        null;


    /* ========================================================
       STOCK
    ======================================================== */

    const stockQuantity =
        Number(
            selectedVariant?.stock_quantity ??
            0
        );


    const inStock =
        stockQuantity > 0;


    /* ========================================================
       DISCOUNT
    ======================================================== */

    const discount =
        comparePrice &&
        Number(
            comparePrice
        ) >
        currentPrice
            ? Math.round(
                (
                    (
                        Number(
                            comparePrice
                        ) -
                        currentPrice
                    ) /
                    Number(
                        comparePrice
                    )
                ) * 100
            )
            : 0;


    /* ========================================================
       ACTIONABLE PRODUCT
    ======================================================== */

    const actionableProduct =
        product
            ? {
                ...product,

                image:
                    mainImage,

                price:
                    currentPrice,

                compare_at_price:
                    comparePrice,

                variant:
                    selectedVariant
            }
            : null;


    /* ========================================================
       FIND SELECTED VARIANT IN REAL CART
    ======================================================== */

    const cartItem =
        product &&
        selectedVariant
            ? (
                items.find(
                    item => {

                        const itemProductId =
                            item?.product?.id ??
                            item?.product_id ??
                            null;


                        const itemVariantId =
                            item?.variant?.id ??
                            item?.variant_id ??
                            null;


                        return (
                            String(
                                itemProductId
                            ) ===
                            String(
                                product.id
                            ) &&
                            String(
                                itemVariantId
                            ) ===
                            String(
                                selectedVariant.id
                            )
                        );

                    }
                ) ||
                null
            )
            : null;


    const productIsInCart =
        Boolean(
            cartItem
        );


    const cartQuantity =
        Number(
            cartItem?.quantity ||
            0
        );


    const maximumStockReached =
        stockQuantity > 0 &&
        cartQuantity >=
        stockQuantity;


    /* ========================================================
       WISHLIST
    ======================================================== */

    const productIsWishlisted =
        product
            ? isWishlisted(
                product.id
            )
            : false;


    function handleWishlist() {

        if (!product) {

            return;

        }


        toggleWishlist(
            product.id
        );

    }


    /* ========================================================
       VARIANT CHANGE
    ======================================================== */

    function handleVariantChange(
        variant
    ) {

        if (
            cartActionLoading ||
            buyNowLoading
        ) {

            return;

        }


        setSelectedVariant(
            variant
        );

    }


    /* ========================================================
       ADD TO CART

       Initial quantity is always 1.
    ======================================================== */

    async function handleAddToCart() {

        if (
            !product ||
            !selectedVariant ||
            !actionableProduct ||
            !inStock ||
            cartActionLoading
        ) {

            return;

        }


        if (!isAuthenticated) {

            navigate(
                "/login",
                {
                    state: {
                        from: {
                            pathname:
                                `/products/${product.slug}`
                        }
                    }
                }
            );


            return;

        }


        try {

            setCartActionLoading(
                true
            );


            await addToCart(
                actionableProduct,
                1
            );

        }
        catch (cartError) {

            console.error(
                "Product details add to cart failed:",
                cartError
            );

        }
        finally {

            setCartActionLoading(
                false
            );

        }

    }


    /* ========================================================
       DECREASE CART QUANTITY
    ======================================================== */

    async function handleDecreaseQuantity() {

        if (
            !productIsInCart ||
            !cartItem ||
            cartActionLoading
        ) {

            return;

        }


        try {

            setCartActionLoading(
                true
            );


            /*
             * Quantity 1:
             * remove the entire item.
             */

            if (
                cartQuantity <= 1
            ) {

                await removeFromCart(
                    cartItem.id
                );


                return;

            }


            await updateCartItem(
                cartItem.id,
                cartQuantity - 1
            );

        }
        catch (cartError) {

            console.error(
                "Product details quantity decrease failed:",
                cartError
            );

        }
        finally {

            setCartActionLoading(
                false
            );

        }

    }


    /* ========================================================
       INCREASE CART QUANTITY
    ======================================================== */

    async function handleIncreaseQuantity() {

        if (
            !productIsInCart ||
            !cartItem ||
            cartActionLoading ||
            maximumStockReached
        ) {

            return;

        }


        try {

            setCartActionLoading(
                true
            );


            await updateCartItem(
                cartItem.id,
                cartQuantity + 1
            );

        }
        catch (cartError) {

            console.error(
                "Product details quantity increase failed:",
                cartError
            );

        }
        finally {

            setCartActionLoading(
                false
            );

        }

    }


    /* ========================================================
       BUY NOW
    ======================================================== */

    function handleBuyNow() {

        if (
            !product ||
            !selectedVariant ||
            !actionableProduct ||
            !inStock ||
            buyNowLoading
        ) {

            return;

        }


        try {

            setBuyNowLoading(
                true
            );


            /*
             * Not in cart:
             * Buy Now quantity = 1
             *
             * Already in cart:
             * Buy Now uses current cart quantity.
             */

            const buyNowQuantity =
                productIsInCart
                    ? cartQuantity
                    : 1;


            const buyNowPayload = {

                product:
                    actionableProduct,

                quantity:
                    buyNowQuantity

            };


            /*
             * Buy Now remains separate
             * from the normal cart.
             */

            sessionStorage.setItem(
                BUY_NOW_STORAGE_KEY,
                JSON.stringify(
                    buyNowPayload
                )
            );


            if (isAuthenticated) {

                navigate(
                    "/checkout?mode=buy-now",
                    {
                        state: {
                            buyNow:
                                buyNowPayload
                        }
                    }
                );


                return;

            }


            navigate(
                "/login",
                {
                    state: {
                        from: {
                            pathname:
                                "/checkout?mode=buy-now"
                        }
                    }
                }
            );

        }
        catch (buyError) {

            console.error(
                "Buy Now failed:",
                buyError
            );


            setBuyNowLoading(
                false
            );

        }

    }


    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {

        return (

            <main
                className="product-details-page"
            >

                <div
                    className="product-details-loading"
                >

                    <div
                        className="product-details-spinner"
                    />


                    <p>
                        Loading product...
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       ERROR
    ======================================================== */

    if (
        error ||
        !product
    ) {

        return (

            <main
                className="product-details-page"
            >

                <div
                    className="product-details-error"
                >

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


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <main
            className="product-details-page"
        >

            <div
                className="product-details-container"
            >

                {/* =================================================
                    BACK
                ================================================= */}

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
                    MAIN PRODUCT AREA
                ================================================= */}

                <section
                    className="product-details-main"
                >

                    {/* =================================================
                        IMAGE GALLERY
                    ================================================= */}

                    <div
                        className="product-details-gallery"
                    >

                        {
                            productImages.length >
                            0 && (

                                <div
                                    className="product-details-thumbnails"
                                >

                                    {
                                        productImages.map(
                                            image => (

                                                <button
                                                    key={
                                                        image.id
                                                    }
                                                    type="button"
                                                    className={`
                                                        product-details-thumbnail
                                                        ${
                                                            selectedImage?.id ===
                                                            image.id
                                                                ? "is-active"
                                                                : ""
                                                        }
                                                    `}
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

                            )
                        }


                        <div
                            className="product-details-main-image"
                        >

                            {
                                discount > 0 && (

                                    <span
                                        className="product-details-discount"
                                    >
                                        Save {discount}%
                                    </span>

                                )
                            }


                            <button
                                type="button"
                                className={`
                                    product-details-wishlist
                                    ${
                                        productIsWishlisted
                                            ? "is-active"
                                            : ""
                                    }
                                `}
                                onClick={
                                    handleWishlist
                                }
                                aria-label={
                                    productIsWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                                title={
                                    productIsWishlisted
                                        ? "Remove from wishlist"
                                        : "Add to wishlist"
                                }
                            >

                                <Heart
                                    size={21}
                                    fill={
                                        productIsWishlisted
                                            ? "currentColor"
                                            : "none"
                                    }
                                />

                            </button>


                            {
                                mainImage
                                    ? (

                                        <img
                                            src={
                                                mainImage
                                            }
                                            alt={
                                                selectedImage?.alt_text ||
                                                product.name
                                            }
                                        />

                                    )
                                    : (

                                        <div
                                            className="product-details-no-image"
                                        >

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


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div
                        className="product-details-info"
                    >

                        <p
                            className="product-details-eyebrow"
                        >
                            AYURVEDIC WELLNESS
                        </p>


                        <h1>
                            {product.name}
                        </h1>


                        {/* =================================================
                            RATING
                        ================================================= */}

                        <div
                            className="product-details-rating"
                        >

                            <div>

                                <Star
                                    size={17}
                                    fill="currentColor"
                                />


                                <strong>

                                    {
                                        Number(
                                            product.average_rating ??
                                            product.rating ??
                                            0
                                        ).toFixed(
                                            1
                                        )
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


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <p
                            className="product-details-short-description"
                        >

                            {
                                product.short_description ||
                                product.description
                            }

                        </p>


                        {/* =================================================
                            PRICE
                        ================================================= */}

                        <div
                            className="product-details-price"
                        >

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
                                currentPrice && (

                                    <del>

                                        ₹
                                        {
                                            formatPrice(
                                                comparePrice
                                            )
                                        }

                                    </del>

                                )
                            }


                            {
                                discount > 0 && (

                                    <span>
                                        {discount}% OFF
                                    </span>

                                )
                            }

                        </div>


                        {/* =================================================
                            VARIANTS
                        ================================================= */}

                        {
                            variants.length >
                            0 && (

                                <div
                                    className="product-details-option"
                                >

                                    <div
                                        className="product-details-option-header"
                                    >

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


                                    <div
                                        className="product-details-variants"
                                    >

                                        {
                                            variants.map(
                                                variant => (

                                                    <button
                                                        key={
                                                            variant.id
                                                        }
                                                        type="button"
                                                        className={`
                                                            product-details-variant
                                                            ${
                                                                selectedVariant?.id ===
                                                                variant.id
                                                                    ? "is-active"
                                                                    : ""
                                                            }
                                                        `}
                                                        disabled={
                                                            Number(
                                                                variant.stock_quantity ||
                                                                0
                                                            ) <= 0 ||
                                                            cartActionLoading
                                                        }
                                                        onClick={() =>
                                                            handleVariantChange(
                                                                variant
                                                            )
                                                        }
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

                            )
                        }


                        {/* =================================================
                            STOCK
                        ================================================= */}

                        <div
                            className="product-details-stock"
                        >

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


                        {/* =================================================
                            PURCHASE

                            NOT IN CART:
                            Add To Cart + Buy Now

                            IN CART:
                            Quantity + Buy Now
                        ================================================= */}

                        <div
                            className={`
                                product-details-purchase
                                ${
                                    productIsInCart
                                        ? "is-in-cart"
                                        : ""
                                }
                            `}
                        >

                            {/* =============================================
                                NOT IN CART
                                ADD TO CART
                            ============================================= */}

                            {
                                !productIsInCart && (

                                    <button
                                        type="button"
                                        className="product-details-cart"
                                        disabled={
                                            !inStock ||
                                            !selectedVariant ||
                                            cartActionLoading
                                        }
                                        onClick={
                                            handleAddToCart
                                        }
                                    >

                                        <ShoppingBag
                                            size={18}
                                        />


                                        {
                                            cartActionLoading
                                                ? "Adding..."
                                                : "Add To Cart"
                                        }

                                    </button>

                                )
                            }


                            {/* =============================================
                                IN CART
                                REAL BACKEND QUANTITY
                            ============================================= */}

                            {
                                productIsInCart && (

                                    <div
                                        className="product-details-quantity"
                                    >

                                        <button
                                            type="button"
                                            onClick={
                                                handleDecreaseQuantity
                                            }
                                            disabled={
                                                cartActionLoading
                                            }
                                            aria-label={
                                                cartQuantity <= 1
                                                    ? "Remove product from cart"
                                                    : "Decrease quantity"
                                            }
                                            title={
                                                cartQuantity <= 1
                                                    ? "Remove from cart"
                                                    : "Decrease quantity"
                                            }
                                        >

                                            <Minus
                                                size={16}
                                            />

                                        </button>


                                        <span>

                                            {
                                                cartActionLoading
                                                    ? "..."
                                                    : cartQuantity
                                            }

                                        </span>


                                        <button
                                            type="button"
                                            onClick={
                                                handleIncreaseQuantity
                                            }
                                            disabled={
                                                cartActionLoading ||
                                                maximumStockReached
                                            }
                                            aria-label="Increase quantity"
                                            title={
                                                maximumStockReached
                                                    ? "Maximum stock reached"
                                                    : "Increase quantity"
                                            }
                                        >

                                            <Plus
                                                size={16}
                                            />

                                        </button>

                                    </div>

                                )
                            }


                            {/* =============================================
                                BUY NOW
                            ============================================= */}

                            <button
                                type="button"
                                className="product-details-buy-now"
                                disabled={
                                    !inStock ||
                                    !selectedVariant ||
                                    buyNowLoading
                                }
                                onClick={
                                    handleBuyNow
                                }
                            >

                                {
                                    buyNowLoading
                                        ? "Opening..."
                                        : "Buy Now"
                                }

                            </button>

                        </div>


                        {/* =================================================
                            CART STATUS
                        ================================================= */}

                        {
                            productIsInCart && (

                                <div
                                    className="product-details-cart-status"
                                >

                                    <ShoppingBag
                                        size={14}
                                    />

                                    Added to cart — quantity changes
                                    are reflected in your cart.

                                </div>

                            )
                        }


                        {/* =================================================
                            TRUST
                        ================================================= */}

                        <div
                            className="product-details-trust"
                        >

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

                <section
                    className="product-details-description"
                >

                    <div
                        className="product-details-description-header"
                    >

                        <p>
                            ROOTED IN AYURVEDA
                        </p>


                        <h2>
                            Product Information
                        </h2>

                    </div>


                    <div
                        className="product-details-information-grid"
                    >

                        {
                            product.description && (

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

                            )
                        }


                        {
                            product.ingredients && (

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

                            )
                        }


                        {
                            product.benefits && (

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

                            )
                        }


                        {
                            product.directions && (

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

                            )
                        }


                        {
                            product.warnings && (

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

                            )
                        }

                    </div>

                </section>


                {/* =================================================
                    RELATED PRODUCTS
                ================================================= */}

                {
                    relatedProducts.length >
                    0 && (

                        <section
                            className="product-details-related"
                        >

                            <div
                                className="product-details-related-header"
                            >

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
                            />

                        </section>

                    )
                }

            </div>

        </main>

    );

}


export default ProductDetails;