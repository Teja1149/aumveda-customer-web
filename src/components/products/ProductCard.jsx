import {
    Heart,
    Minus,
    Plus,
    ShoppingBag,
    Star
} from "lucide-react";

import {
    motion
} from "framer-motion";

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useCart
} from "../../context/CartContext";

import {
    useAuth
} from "../../context/AuthContext";

import {
    useWishlist
} from "../../context/WishlistContext";

import "../../styles/product-card.css";


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
   PRODUCT CARD
============================================================ */

function ProductCard({
    product
}) {

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
        addToCart,
        getCartItem,
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


    const productIsWishlisted =
        isWishlisted(
            product.id
        );


    /* ========================================================
       ACTION LOADING
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
       DISCOUNT
    ======================================================== */

    const discount =

        product.compare_at_price &&
        product.price &&
        Number(
            product.compare_at_price
        ) >
        Number(
            product.price
        )

            ? Math.round(
                (
                    (
                        Number(
                            product.compare_at_price
                        ) -
                        Number(
                            product.price
                        )
                    ) /
                    Number(
                        product.compare_at_price
                    )
                ) * 100
            )

            : 0;


    /* ========================================================
       PRODUCT DETAILS
    ======================================================== */

    function openProduct() {

        if (!product?.slug) {

            return;

        }


        navigate(
            `/products/${product.slug}`
        );

    }


    function handleProductKeyDown(
        event
    ) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openProduct();

        }

    }


    /* ========================================================
       WISHLIST
    ======================================================== */

    function handleWishlist(
        event
    ) {

        event.stopPropagation();


        toggleWishlist(
            product.id
        );

    }


    /* ========================================================
       REAL CART STATE
    ======================================================== */

    const cartItem =
        getCartItem(
            product
        );


    const productIsInCart =
        Boolean(
            cartItem
        );


    const cartQuantity =
        Number(
            cartItem?.quantity ||
            0
        );


    /* ========================================================
       STOCK
    ======================================================== */

    const stockQuantity =
        Number(
            cartItem?.variant?.stock_quantity ??
            product?.variant?.stock_quantity ??
            product?.stock_quantity ??
            0
        );


    const maximumStockReached =
        stockQuantity > 0 &&
        cartQuantity >= stockQuantity;


    /* ========================================================
       ADD TO CART
    ======================================================== */

    async function handleAddToCart(
        event
    ) {

        event.stopPropagation();


        if (
            product.in_stock ===
            false
        ) {

            return;

        }


        if (!isAuthenticated) {

            navigate(
                "/login"
            );

            return;

        }


        if (cartActionLoading) {

            return;

        }


        try {

            setCartActionLoading(
                true
            );


            await addToCart(
                product,
                1
            );

        }
        catch (error) {

            console.error(
                "Add to cart failed:",
                error
            );

        }
        finally {

            setCartActionLoading(
                false
            );

        }

    }


    /* ========================================================
       DECREASE QUANTITY
    ======================================================== */

    async function handleDecreaseQuantity(
        event
    ) {

        event.stopPropagation();


        if (
            !cartItem ||
            cartActionLoading
        ) {

            return;

        }


        try {

            setCartActionLoading(
                true
            );


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
        catch (error) {

            console.error(
                "Decrease cart quantity failed:",
                error
            );

        }
        finally {

            setCartActionLoading(
                false
            );

        }

    }


    /* ========================================================
       INCREASE QUANTITY
    ======================================================== */

    async function handleIncreaseQuantity(
        event
    ) {

        event.stopPropagation();


        if (
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
        catch (error) {

            console.error(
                "Increase cart quantity failed:",
                error
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

    function handleBuyNow(
        event
    ) {

        event.stopPropagation();


        if (
            product.in_stock ===
            false ||
            buyNowLoading
        ) {

            return;

        }


        try {

            setBuyNowLoading(
                true
            );


            const buyNowPayload = {
                product,
                quantity: 1
            };


            sessionStorage.setItem(
                BUY_NOW_STORAGE_KEY,
                JSON.stringify(
                    buyNowPayload
                )
            );


            /*
             * If already authenticated:
             *
             * Product → Checkout directly.
             */

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


            /*
             * If not authenticated:
             *
             * Login first, then LoginPage's existing
             * "from.pathname" redirect takes customer
             * back to the Buy Now checkout.
             *
             * sessionStorage preserves the selected product.
             */

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
        catch (error) {

            console.error(
                "Buy now failed:",
                error
            );


            setBuyNowLoading(
                false
            );

        }

    }


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <motion.article
            className="product-card"

            initial={{
                opacity: 0,
                y: 22
            }}

            whileInView={{
                opacity: 1,
                y: 0
            }}

            viewport={{
                once: true,
                amount: 0.12
            }}

            transition={{
                duration: 0.45
            }}

            whileHover={{
                y: -6
            }}
        >

            {/* =================================================
                IMAGE
            ================================================= */}

            <div
                className="
                    product-card__image-box
                    product-card__clickable
                "
                onClick={
                    openProduct
                }
                role="button"
                tabIndex={0}
                onKeyDown={
                    handleProductKeyDown
                }
            >

                {
                    discount > 0 && (

                        <span
                            className="
                                product-card__discount
                            "
                        >
                            Save {discount}%
                        </span>

                    )
                }


                <img
                    src={
                        product.image
                    }
                    alt={
                        product.name
                    }
                    className="
                        product-card__image
                    "
                    loading="lazy"
                />


                <button
                    type="button"
                    className={`
                        product-card__wishlist
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
                        size={18}
                        fill={
                            productIsWishlisted
                                ? "currentColor"
                                : "none"
                        }
                    />

                </button>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className="
                    product-card__content
                "
            >

                {/* TITLE */}

                <div
                    className="
                        product-card__title-row
                    "
                >

                    <h3
                        className="
                            product-card__title-link
                        "
                        onClick={
                            openProduct
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={
                            handleProductKeyDown
                        }
                    >
                        {product.name}
                    </h3>

                </div>


                {/* DESCRIPTION */}

                <p
                    className="
                        product-card__description
                    "
                >
                    {
                        product.short_description ||
                        product.description
                    }
                </p>


                {/* RATING */}

                <div
                    className="
                        product-card__rating
                    "
                >

                    <Star
                        size={15}
                        fill="currentColor"
                    />


                    <span>
                        {
                            Number(
                                product.rating ||
                                0
                            ).toFixed(1)
                        }
                    </span>


                    <small>
                        (
                        {
                            product.review_count ||
                            0
                        }
                        )
                    </small>

                </div>


                {/* PRICE */}

                <div
                    className="
                        product-card__price-row
                    "
                >

                    <div
                        className="
                            product-card__prices
                        "
                    >

                        <strong>
                            ₹
                            {
                                formatPrice(
                                    product.price
                                )
                            }
                        </strong>


                        {
                            product.compare_at_price &&
                            Number(
                                product.compare_at_price
                            ) >
                            Number(
                                product.price
                            ) && (

                                <del>
                                    ₹
                                    {
                                        formatPrice(
                                            product.compare_at_price
                                        )
                                    }
                                </del>

                            )
                        }

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                    className="
                        product-card__actions
                    "
                >

                    {/* =============================================
                        CART SIDE
                    ============================================= */}

                    {
                        productIsInCart
                            ? (

                                <div
                                    className="
                                        product-card__quantity-control
                                    "
                                    onClick={
                                        event =>
                                            event.stopPropagation()
                                    }
                                >

                                    <button
                                        type="button"
                                        aria-label={
                                            cartQuantity <= 1
                                                ? "Remove from cart"
                                                : "Decrease quantity"
                                        }
                                        title={
                                            cartQuantity <= 1
                                                ? "Remove from cart"
                                                : "Decrease quantity"
                                        }
                                        disabled={
                                            cartActionLoading
                                        }
                                        onClick={
                                            handleDecreaseQuantity
                                        }
                                    >

                                        <Minus
                                            size={15}
                                        />

                                    </button>


                                    <strong>
                                        {cartQuantity}
                                    </strong>


                                    <button
                                        type="button"
                                        aria-label="Increase quantity"
                                        title={
                                            maximumStockReached
                                                ? "Maximum stock reached"
                                                : "Increase quantity"
                                        }
                                        disabled={
                                            cartActionLoading ||
                                            maximumStockReached
                                        }
                                        onClick={
                                            handleIncreaseQuantity
                                        }
                                    >

                                        <Plus
                                            size={15}
                                        />

                                    </button>

                                </div>

                            )
                            : (

                                <button
                                    type="button"
                                    className={`
                                        product-card__cart
                                        ${
                                            product.in_stock ===
                                            false
                                                ? "is-disabled"
                                                : ""
                                        }
                                    `}
                                    onClick={
                                        handleAddToCart
                                    }
                                    disabled={
                                        product.in_stock ===
                                        false ||
                                        cartActionLoading
                                    }
                                >

                                    <ShoppingBag
                                        size={15}
                                    />


                                    {
                                        product.in_stock ===
                                        false
                                            ? "Out of Stock"
                                            : cartActionLoading
                                                ? "Adding..."
                                                : "Add to Cart"
                                    }

                                </button>

                            )
                    }


                    {/* =============================================
                        BUY NOW
                    ============================================= */}

                    <button
                        type="button"
                        className="
                            product-card__buy-now
                        "
                        onClick={
                            handleBuyNow
                        }
                        disabled={
                            product.in_stock ===
                            false ||
                            buyNowLoading
                        }
                    >

                        {
                            buyNowLoading
                                ? "Opening..."
                                : "Buy Now"
                        }

                    </button>

                </div>

            </div>

        </motion.article>

    );

}


export default ProductCard;