import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    ArrowLeft,
    Leaf,
    ShieldCheck
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useEffect
} from "react";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";

import "../styles/cart.css";


/* ============================================================
   PRICE FORMAT
============================================================ */

function formatPrice(value) {

    const amount =
        Number(
            value || 0
        );


    return new Intl.NumberFormat(
        "en-IN",
        {
            maximumFractionDigits: 0
        }
    ).format(
        amount
    );

}


/* ============================================================
   CART PAGE
============================================================ */

function Cart() {

    const navigate =
        useNavigate();


    /* ========================================================
       AUTH
    ======================================================== */

    const {
        isAuthenticated,
        loading: authLoading
    } =
        useAuth();


    /* ========================================================
       CART
    ======================================================== */

    const {
        items,
        loading,
        error,
        totalQuantity,
        subtotal,
        updateCartItem,
        removeFromCart,
        clearCart
    } =
        useCart();


    /* ========================================================
       PROTECT CART
    ======================================================== */

    useEffect(() => {

        if (
            !authLoading &&
            !isAuthenticated
        ) {

            navigate(
                "/login",
                {
                    replace: true
                }
            );

        }

    }, [
        authLoading,
        isAuthenticated,
        navigate
    ]);


    /* ========================================================
       DECREASE QUANTITY

       Quantity 1:
       clicking minus removes product completely.
    ======================================================== */

    async function decreaseQuantity(
        item
    ) {

        if (
            !item ||
            loading
        ) {

            return;

        }


        const currentQuantity =
            Number(
                item.quantity ||
                1
            );


        try {

            if (
                currentQuantity <= 1
            ) {

                await removeFromCart(
                    item.id
                );


                return;

            }


            await updateCartItem(
                item.id,
                currentQuantity - 1
            );

        }
        catch (error) {

            console.error(
                "Cart quantity decrease failed:",
                error
            );

        }

    }


    /* ========================================================
       INCREASE QUANTITY
    ======================================================== */

    async function increaseQuantity(
        item
    ) {

        if (
            !item ||
            loading
        ) {

            return;

        }


        const currentQuantity =
            Number(
                item.quantity ||
                1
            );


        const stock =
            Number(
                item?.variant
                    ?.stock_quantity ||
                0
            );


        if (
            stock > 0 &&
            currentQuantity >= stock
        ) {

            return;

        }


        try {

            await updateCartItem(
                item.id,
                currentQuantity + 1
            );

        }
        catch (error) {

            console.error(
                "Cart quantity increase failed:",
                error
            );

        }

    }


    /* ========================================================
       CLEAR CART
    ======================================================== */

    async function handleClearCart() {

        if (!items.length) {

            return;

        }


        const confirmed =
            window.confirm(
                "Remove all products from your cart?"
            );


        if (!confirmed) {

            return;

        }


        try {

            await clearCart();

        }
        catch (error) {

            console.error(
                "Clear cart failed:",
                error
            );

        }

    }


    /* ========================================================
       CHECKOUT
    ======================================================== */

    function handleCheckout() {

        if (!items.length) {

            return;

        }


        navigate(
            "/checkout"
        );

    }


    /* ========================================================
       AUTH LOADING
    ======================================================== */

    if (authLoading) {

        return (

            <section
                className="aumveda-cart-page"
            >

                <div
                    className="aumveda-cart-loading"
                >

                    <div
                        className="aumveda-cart-loading__spinner"
                    />


                    <p>
                        Preparing your cart...
                    </p>

                </div>

            </section>

        );

    }


    /* ========================================================
       NOT AUTHENTICATED
    ======================================================== */

    if (!isAuthenticated) {

        return null;

    }


    /* ========================================================
       CART LOADING
    ======================================================== */

    if (
        loading &&
        !items.length
    ) {

        return (

            <section
                className="aumveda-cart-page"
            >

                <div
                    className="aumveda-cart-loading"
                >

                    <div
                        className="aumveda-cart-loading__spinner"
                    />


                    <p>
                        Loading your cart...
                    </p>

                </div>

            </section>

        );

    }


    /* ========================================================
       EMPTY CART
    ======================================================== */

    if (!items.length) {

        return (

            <section
                className="aumveda-cart-page"
            >

                <div
                    className="aumveda-cart-empty"
                >

                    <div
                        className="aumveda-cart-empty__icon"
                    >

                        <ShoppingBag
                            size={38}
                            strokeWidth={1.4}
                        />

                    </div>


                    <span
                        className="aumveda-cart-empty__eyebrow"
                    >
                        YOUR WELLNESS JOURNEY
                    </span>


                    <h1>
                        Your cart is empty
                    </h1>


                    <p>
                        Discover authentic Ayurvedic
                        products crafted for your
                        everyday wellness.
                    </p>


                    <Link
                        to="/products"
                        className="aumveda-cart-primary-button"
                    >

                        Explore Products

                        <ArrowRight
                            size={18}
                        />

                    </Link>

                </div>

            </section>

        );

    }


    /* ========================================================
       CART
    ======================================================== */

    return (

        <section
            className="aumveda-cart-page"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="aumveda-cart-header"
            >

                <div>

                    <span
                        className="aumveda-cart-eyebrow"
                    >
                        YOUR WELLNESS CART
                    </span>


                    <h1>
                        Your Cart
                    </h1>


                    <p>
                        Review your selected Ayurvedic
                        essentials before continuing.
                    </p>

                </div>


                <div
                    className="aumveda-cart-header__count"
                >

                    <ShoppingBag
                        size={19}
                    />


                    <span>
                        {totalQuantity}
                    </span>


                    {
                        totalQuantity === 1
                            ? "item"
                            : "items"
                    }

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {
                error && (

                    <div
                        className="aumveda-cart-error"
                    >
                        {error}
                    </div>

                )
            }


            {/* =================================================
                MAIN
            ================================================= */}

            <div
                className="aumveda-cart-layout"
            >

                {/* =================================================
                    CART ITEMS
                ================================================= */}

                <div
                    className="aumveda-cart-items"
                >

                    <div
                        className="aumveda-cart-items__top"
                    >

                        <div>

                            <strong>
                                Cart Items
                            </strong>


                            <span>

                                {items.length}

                                {
                                    items.length === 1
                                        ? " product"
                                        : " products"
                                }

                            </span>

                        </div>


                        <button
                            type="button"
                            className="aumveda-cart-clear"
                            onClick={
                                handleClearCart
                            }
                            disabled={
                                loading
                            }
                        >

                            <Trash2
                                size={15}
                            />

                            Clear Cart

                        </button>

                    </div>


                    <div
                        className="aumveda-cart-item-list"
                    >

                        {
                            items.map(
                                item => {

                                    const product =
                                        item.product ||
                                        {};


                                    const variant =
                                        item.variant ||
                                        {};


                                    const quantity =
                                        Number(
                                            item.quantity ||
                                            1
                                        );


                                    const price =
                                        Number(
                                            variant.price ??
                                            item.price ??
                                            product.price ??
                                            0
                                        );


                                    const comparePrice =
                                        Number(
                                            variant.compare_at_price ??
                                            product.compare_at_price ??
                                            0
                                        );


                                    const stock =
                                        Number(
                                            variant.stock_quantity ||
                                            0
                                        );


                                    const lineTotal =
                                        Number(
                                            item.line_total ??
                                            item.subtotal ??
                                            (
                                                price *
                                                quantity
                                            )
                                        );


                                    return (

                                        <article
                                            key={
                                                item.id
                                            }
                                            className="aumveda-cart-item"
                                        >

                                            {/* =================================
                                                IMAGE
                                            ================================= */}

                                            <Link
                                                to={
                                                    product.slug
                                                        ? `/products/${product.slug}`
                                                        : "/products"
                                                }
                                                className="aumveda-cart-item__image"
                                            >

                                                {
                                                    product.image
                                                        ? (

                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name ||
                                                                    "AUMVEDA product"
                                                                }
                                                            />

                                                        )
                                                        : (

                                                            <div
                                                                className="aumveda-cart-item__image-placeholder"
                                                            >

                                                                <Leaf
                                                                    size={28}
                                                                />

                                                            </div>

                                                        )
                                                }

                                            </Link>


                                            {/* =================================
                                                DETAILS
                                            ================================= */}

                                            <div
                                                className="aumveda-cart-item__details"
                                            >

                                                <Link
                                                    to={
                                                        product.slug
                                                            ? `/products/${product.slug}`
                                                            : "/products"
                                                    }
                                                    className="aumveda-cart-item__name"
                                                >

                                                    {
                                                        product.name ||
                                                        "AUMVEDA Product"
                                                    }

                                                </Link>


                                                {
                                                    variant.name && (

                                                        <span
                                                            className="aumveda-cart-item__variant"
                                                        >
                                                            {
                                                                variant.name
                                                            }
                                                        </span>

                                                    )
                                                }


                                                {
                                                    (
                                                        product.short_description ||
                                                        product.description
                                                    ) && (

                                                        <p>

                                                            {
                                                                product.short_description ||
                                                                product.description
                                                            }

                                                        </p>

                                                    )
                                                }


                                                <div
                                                    className="aumveda-cart-item__price"
                                                >

                                                    <strong>

                                                        ₹
                                                        {
                                                            formatPrice(
                                                                price
                                                            )
                                                        }

                                                    </strong>


                                                    {
                                                        comparePrice >
                                                        price && (

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

                                                </div>

                                            </div>


                                            {/* =================================
                                                QUANTITY
                                            ================================= */}

                                            <div
                                                className="aumveda-cart-item__quantity"
                                            >

                                                <span>
                                                    Quantity
                                                </span>


                                                <div
                                                    className="aumveda-quantity-control"
                                                >

                                                    <button
                                                        type="button"
                                                        aria-label={
                                                            quantity <= 1
                                                                ? "Remove product from cart"
                                                                : "Decrease quantity"
                                                        }
                                                        title={
                                                            quantity <= 1
                                                                ? "Remove from cart"
                                                                : "Decrease quantity"
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item
                                                            )
                                                        }
                                                    >

                                                        <Minus
                                                            size={14}
                                                        />

                                                    </button>


                                                    <strong>
                                                        {
                                                            quantity
                                                        }
                                                    </strong>


                                                    <button
                                                        type="button"
                                                        aria-label="Increase quantity"
                                                        title={
                                                            stock > 0 &&
                                                            quantity >= stock
                                                                ? "Maximum stock reached"
                                                                : "Increase quantity"
                                                        }
                                                        disabled={
                                                            loading ||
                                                            (
                                                                stock > 0 &&
                                                                quantity >= stock
                                                            )
                                                        }
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item
                                                            )
                                                        }
                                                    >

                                                        <Plus
                                                            size={14}
                                                        />

                                                    </button>

                                                </div>


                                                {
                                                    stock > 0 && (

                                                        <small>

                                                            {stock}{" "}
                                                            available

                                                        </small>

                                                    )
                                                }

                                            </div>


                                            {/* =================================
                                                TOTAL
                                            ================================= */}

                                            <div
                                                className="aumveda-cart-item__total"
                                            >

                                                <span>
                                                    Total
                                                </span>


                                                <strong>

                                                    ₹
                                                    {
                                                        formatPrice(
                                                            lineTotal
                                                        )
                                                    }

                                                </strong>

                                            </div>

                                        </article>

                                    );

                                }
                            )
                        }

                    </div>


                    <Link
                        to="/products"
                        className="aumveda-cart-continue"
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Continue Shopping

                    </Link>

                </div>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <aside
                    className="aumveda-cart-summary"
                >

                    <div
                        className="aumveda-cart-summary__heading"
                    >

                        <span>
                            ORDER SUMMARY
                        </span>


                        <h2>
                            Your Selection
                        </h2>

                    </div>


                    <div
                        className="aumveda-cart-summary__rows"
                    >

                        <div>

                            <span>
                                Items
                            </span>


                            <strong>
                                {totalQuantity}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Subtotal
                            </span>


                            <strong>

                                ₹
                                {
                                    formatPrice(
                                        subtotal
                                    )
                                }

                            </strong>

                        </div>


                        <div>

                            <span>
                                Delivery
                            </span>


                            <strong
                                className="aumveda-free"
                            >
                                FREE
                            </strong>

                        </div>

                    </div>


                    <div
                        className="aumveda-cart-summary__divider"
                    />


                    <div
                        className="aumveda-cart-summary__total"
                    >

                        <span>
                            Total
                        </span>


                        <strong>

                            ₹
                            {
                                formatPrice(
                                    subtotal
                                )
                            }

                        </strong>

                    </div>


                    <button
                        type="button"
                        className="aumveda-checkout-button"
                        onClick={
                            handleCheckout
                        }
                        disabled={
                            !items.length
                        }
                    >

                        Proceed to Checkout

                        <ArrowRight
                            size={18}
                        />

                    </button>


                    <div
                        className="aumveda-cart-trust"
                    >

                        <div>

                            <ShieldCheck
                                size={18}
                            />

                            <span>
                                Secure checkout
                            </span>

                        </div>


                        <div>

                            <Leaf
                                size={18}
                            />

                            <span>
                                Authentic Ayurveda
                            </span>

                        </div>

                    </div>


                    <p
                        className="aumveda-cart-summary__note"
                    >
                        Delivery address and payment
                        details will be reviewed during
                        checkout.
                    </p>

                </aside>

            </div>

        </section>

    );

}


export default Cart;