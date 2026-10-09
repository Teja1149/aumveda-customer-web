import {
    ArrowLeft,
    Check,
    ChevronRight,
    CreditCard,
    Home,
    Leaf,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingBag,
    Truck
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import {
    useCart
} from "../context/CartContext";

import {
    getCustomerAddresses
} from "../services/addressService";

import "../styles/checkout.css";


const BUY_NOW_STORAGE_KEY =
    "aumveda_buy_now";


/* ============================================================
   FORMAT PRICE
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
   READ BUY NOW DATA
============================================================ */

function readBuyNowData() {

    try {

        const saved =
            sessionStorage.getItem(
                BUY_NOW_STORAGE_KEY
            );


        if (!saved) {

            return null;

        }


        const parsed =
            JSON.parse(
                saved
            );


        if (
            !parsed ||
            !parsed.product
        ) {

            return null;

        }


        return parsed;

    }
    catch (error) {

        console.error(
            "Unable to read Buy Now product:",
            error
        );


        return null;

    }

}


/* ============================================================
   CHECKOUT
============================================================ */

function Checkout() {

    const navigate =
        useNavigate();


    const location =
        useLocation();


    /* ========================================================
       AUTH
    ======================================================== */

    const {
        user,
        isAuthenticated,
        loading: authLoading
    } =
        useAuth();


    /* ========================================================
       CART
    ======================================================== */

    const {
        items,
        loading: cartLoading,
        totalQuantity: cartTotalQuantity,
        subtotal: cartSubtotal
    } =
        useCart();


    /* ========================================================
       CHECKOUT MODE
    ======================================================== */

    const searchParams =
        new URLSearchParams(
            location.search
        );


    const isBuyNow =
        searchParams.get(
            "mode"
        ) ===
        "buy-now";


    /* ========================================================
       BUY NOW DATA
    ======================================================== */

    const buyNowData =
        isBuyNow
            ? (
                location.state?.buyNow ||
                readBuyNowData()
            )
            : null;


    const buyNowProduct =
        buyNowData?.product ||
        null;


    const buyNowQuantity =
        Math.max(
            1,
            Number(
                buyNowData?.quantity ||
                1
            )
        );


    const buyNowVariant =
        buyNowProduct?.variant ||
        {};


    const buyNowPrice =
        Number(
            buyNowVariant?.price ??
            buyNowProduct?.price ??
            0
        );


    /* ========================================================
       BUY NOW ITEM
    ======================================================== */

    const buyNowItems =
        buyNowProduct
            ? [
                {
                    id:
                        `buy-now-${buyNowProduct.id}`,

                    quantity:
                        buyNowQuantity,

                    price:
                        buyNowPrice,

                    line_total:
                        buyNowPrice *
                        buyNowQuantity,

                    product:
                        buyNowProduct,

                    variant:
                        buyNowVariant
                }
            ]
            : [];


    /* ========================================================
       CHECKOUT ITEMS
    ======================================================== */

    const checkoutItems =
        isBuyNow
            ? buyNowItems
            : items;


    const checkoutTotalQuantity =
        isBuyNow
            ? buyNowQuantity
            : Number(
                cartTotalQuantity ||
                0
            );


    const checkoutSubtotal =
        isBuyNow
            ? (
                buyNowPrice *
                buyNowQuantity
            )
            : Number(
                cartSubtotal ||
                0
            );


    /* ========================================================
       ADDRESS STATE
    ======================================================== */

    const [
        addresses,
        setAddresses
    ] =
        useState([]);


    const [
        addressesLoading,
        setAddressesLoading
    ] =
        useState(true);


    const [
        addressError,
        setAddressError
    ] =
        useState("");


    const [
        selectedAddressId,
        setSelectedAddressId
    ] =
        useState("");


    /* ========================================================
       PAYMENT
    ======================================================== */

    const [
        paymentMethod,
        setPaymentMethod
    ] =
        useState("cod");


    /* ========================================================
       AUTH PROTECTION
    ======================================================== */

    useEffect(() => {

        if (
            !authLoading &&
            !isAuthenticated
        ) {

            const destination =
                `${location.pathname}${location.search}`;


            navigate(
                "/login",
                {
                    replace: true,

                    state: {
                        from: {
                            pathname:
                                destination
                        }
                    }
                }
            );

        }

    }, [
        authLoading,
        isAuthenticated,
        navigate,
        location.pathname,
        location.search
    ]);


    /* ========================================================
       LOAD ADDRESSES
    ======================================================== */

    useEffect(() => {

        if (
            authLoading ||
            !user?.id
        ) {

            return;

        }


        let cancelled =
            false;


        async function loadAddresses() {

            try {

                setAddressesLoading(
                    true
                );


                setAddressError("");


                const result =
                    await getCustomerAddresses(
                        user.id
                    );


                if (cancelled) {

                    return;

                }


                const nextAddresses =
                    Array.isArray(result)
                        ? result
                        : [];


                setAddresses(
                    nextAddresses
                );


                const preferredAddress =
                    nextAddresses.find(
                        address =>
                            address.is_default
                    ) ||
                    nextAddresses[0] ||
                    null;


                setSelectedAddressId(
                    preferredAddress?.id ||
                    ""
                );

            }
            catch (error) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Checkout address loading failed:",
                    error
                );


                setAddressError(
                    error?.message ||
                    "Unable to load your saved addresses."
                );

            }
            finally {

                if (!cancelled) {

                    setAddressesLoading(
                        false
                    );

                }

            }

        }


        loadAddresses();


        return () => {

            cancelled =
                true;

        };

    }, [
        authLoading,
        user?.id
    ]);


    /* ========================================================
       SELECTED ADDRESS
    ======================================================== */

    const selectedAddress =
        addresses.find(
            address =>
                String(
                    address.id
                ) ===
                String(
                    selectedAddressId
                )
        ) ||
        null;


    /* ========================================================
       TOTALS
    ======================================================== */

    const deliveryCharge =
        0;


    const total =
        checkoutSubtotal +
        deliveryCharge;


    /* ========================================================
       BACK
    ======================================================== */

    function handleBack() {

        if (isBuyNow) {

            navigate(
                "/products"
            );


            return;

        }


        navigate(
            "/cart"
        );

    }


    /* ========================================================
       PAYMENT CHANGE
    ======================================================== */

    function handlePaymentChange(
        method
    ) {

        setPaymentMethod(
            method
        );


        setAddressError("");

    }


    /* ========================================================
       PLACE ORDER
    ======================================================== */

    function handlePlaceOrder() {

        setAddressError("");


        if (!selectedAddress) {

            setAddressError(
                "Please select a delivery address before continuing."
            );


            return;

        }


        if (
            paymentMethod ===
            "online"
        ) {

            setAddressError(
                "Online payment integration is coming next. Please select Cash on Delivery for current testing."
            );


            return;

        }


        if (isBuyNow) {

            window.alert(
                "Buy Now checkout is ready. Real order creation will be connected next."
            );


            return;

        }


        window.alert(
            "Cart checkout is ready. Real order creation will be connected next."
        );

    }


    /* ========================================================
       AUTH LOADING
    ======================================================== */

    if (authLoading) {

        return (

            <main
                className="
                    checkout-page
                    checkout-page--loading
                "
            >

                <div
                    className="
                        checkout-loading
                    "
                >

                    <div
                        className="
                            checkout-loading__spinner
                        "
                    />


                    <p>
                        Preparing checkout...
                    </p>

                </div>

            </main>

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
        !isBuyNow &&
        cartLoading &&
        !items.length
    ) {

        return (

            <main
                className="
                    checkout-page
                    checkout-page--loading
                "
            >

                <div
                    className="
                        checkout-loading
                    "
                >

                    <div
                        className="
                            checkout-loading__spinner
                        "
                    />


                    <p>
                        Loading your order...
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       EMPTY CHECKOUT
    ======================================================== */

    if (!checkoutItems.length) {

        return (

            <main
                className="
                    checkout-page
                    checkout-page--empty
                "
            >

                <div
                    className="
                        checkout-empty
                    "
                >

                    <div
                        className="
                            checkout-empty__icon
                        "
                    >

                        <ShoppingBag
                            size={34}
                        />

                    </div>


                    <span>
                        AUMVEDA CHECKOUT
                    </span>


                    <h1>

                        {
                            isBuyNow
                                ? "Product unavailable"
                                : "Your cart is empty"
                        }

                    </h1>


                    <p>

                        {
                            isBuyNow
                                ? "Please return to our products and select an item to purchase."
                                : "Add your preferred Ayurvedic products before proceeding to checkout."
                        }

                    </p>


                    <Link
                        to="/products"
                    >

                        Explore Products

                        <ChevronRight
                            size={17}
                        />

                    </Link>

                </div>

            </main>

        );

    }


    /* ========================================================
       CHECKOUT PAGE
    ======================================================== */

    return (

        <main
            className="
                checkout-page
            "
        >

            <div
                className="
                    checkout-container
                "
            >

                {/* =================================================
                    TOP
                ================================================= */}

                <div
                    className="
                        checkout-top
                    "
                >

                    <button
                        type="button"
                        onClick={
                            handleBack
                        }
                    >

                        <ArrowLeft
                            size={16}
                        />


                        {
                            isBuyNow
                                ? "Back to Products"
                                : "Back to Cart"
                        }

                    </button>


                    <div
                        className="
                            checkout-secure
                        "
                    >

                        <ShieldCheck
                            size={16}
                        />

                        Secure Checkout

                    </div>

                </div>


                {/* =================================================
                    HEADER
                ================================================= */}

                <header
                    className="
                        checkout-header
                    "
                >

                    <span>

                        {
                            isBuyNow
                                ? "BUY NOW"
                                : "COMPLETE YOUR ORDER"
                        }

                    </span>


                    <h1>
                        Checkout
                    </h1>


                    <p>

                        {
                            isBuyNow
                                ? "Complete your purchase for the selected AUMVEDA product."
                                : "Confirm your delivery address and review your AUMVEDA order."
                        }

                    </p>

                </header>


                {/* =================================================
                    LAYOUT
                ================================================= */}

                <div
                    className="
                        checkout-layout
                    "
                >

                    <div
                        className="
                            checkout-main
                        "
                    >

                        {/* =================================================
                            STEP 1
                            DELIVERY ADDRESS
                        ================================================= */}

                        <section
                            className="
                                checkout-card
                            "
                        >

                            <div
                                className="
                                    checkout-card__heading
                                "
                            >

                                <div
                                    className="
                                        checkout-step-icon
                                    "
                                >

                                    <MapPin
                                        size={18}
                                    />

                                </div>


                                <div>

                                    <span>
                                        STEP 1
                                    </span>


                                    <h2>
                                        Delivery Address
                                    </h2>


                                    <p>
                                        Select one of your saved
                                        delivery addresses.
                                    </p>

                                </div>

                            </div>


                            {
                                addressError && (

                                    <div
                                        className="
                                            checkout-message
                                            checkout-message--error
                                        "
                                    >

                                        {addressError}

                                    </div>

                                )
                            }


                            {
                                addressesLoading
                                    ? (

                                        <div
                                            className="
                                                checkout-address-loading
                                            "
                                        >

                                            <div
                                                className="
                                                    checkout-mini-spinner
                                                "
                                            />

                                            Loading your addresses...

                                        </div>

                                    )
                                    : addresses.length === 0
                                        ? (

                                            <div
                                                className="
                                                    checkout-no-address
                                                "
                                            >

                                                <MapPin
                                                    size={25}
                                                />


                                                <div>

                                                    <h3>
                                                        No delivery address available
                                                    </h3>


                                                    <p>
                                                        Add an address from
                                                        your profile before
                                                        continuing.
                                                    </p>

                                                </div>


                                                <Link
                                                    to="/profile"
                                                >

                                                    Add Address

                                                    <ChevronRight
                                                        size={15}
                                                    />

                                                </Link>

                                            </div>

                                        )
                                        : (

                                            <div
                                                className="
                                                    checkout-addresses
                                                "
                                            >

                                                {
                                                    addresses.map(
                                                        address => {

                                                            const selected =
                                                                String(
                                                                    selectedAddressId
                                                                ) ===
                                                                String(
                                                                    address.id
                                                                );


                                                            return (

                                                                <button
                                                                    key={
                                                                        address.id
                                                                    }
                                                                    type="button"
                                                                    className={
                                                                        selected
                                                                            ? "checkout-address checkout-address--selected"
                                                                            : "checkout-address"
                                                                    }
                                                                    onClick={() => {

                                                                        setSelectedAddressId(
                                                                            address.id
                                                                        );


                                                                        setAddressError("");

                                                                    }}
                                                                >

                                                                    <div
                                                                        className="
                                                                            checkout-address__radio
                                                                        "
                                                                    >

                                                                        {
                                                                            selected && (

                                                                                <Check
                                                                                    size={13}
                                                                                />

                                                                            )
                                                                        }

                                                                    </div>


                                                                    <div
                                                                        className="
                                                                            checkout-address__content
                                                                        "
                                                                    >

                                                                        <div
                                                                            className="
                                                                                checkout-address__top
                                                                            "
                                                                        >

                                                                            <strong>
                                                                                {
                                                                                    address.label ||
                                                                                    "Address"
                                                                                }
                                                                            </strong>


                                                                            {
                                                                                address.is_default && (

                                                                                    <span>
                                                                                        Default
                                                                                    </span>

                                                                                )
                                                                            }

                                                                        </div>


                                                                        <h3>
                                                                            {
                                                                                address.recipient_name
                                                                            }
                                                                        </h3>


                                                                        <p>

                                                                            {
                                                                                address.address_line1
                                                                            }


                                                                            {
                                                                                address.address_line2 && (
                                                                                    <>
                                                                                        <br />

                                                                                        {
                                                                                            address.address_line2
                                                                                        }
                                                                                    </>
                                                                                )
                                                                            }


                                                                            <br />


                                                                            {
                                                                                address.city
                                                                            },{" "}

                                                                            {
                                                                                address.state
                                                                            }{" "}

                                                                            -{" "}

                                                                            {
                                                                                address.postal_code
                                                                            }


                                                                            <br />


                                                                            {
                                                                                address.country
                                                                            }

                                                                        </p>


                                                                        <small>
                                                                            Phone: {
                                                                                address.phone
                                                                            }
                                                                        </small>

                                                                    </div>

                                                                </button>

                                                            );

                                                        }
                                                    )
                                                }

                                            </div>

                                        )
                            }


                            <div
                                className="
                                    checkout-manage-address
                                "
                            >

                                <Link
                                    to="/profile"
                                >

                                    Manage addresses in Profile

                                    <ChevronRight
                                        size={14}
                                    />

                                </Link>

                            </div>

                        </section>


                        {/* =================================================
                            STEP 2
                            REVIEW ITEMS
                        ================================================= */}

                        <section
                            className="
                                checkout-card
                            "
                        >

                            <div
                                className="
                                    checkout-card__heading
                                "
                            >

                                <div
                                    className="
                                        checkout-step-icon
                                    "
                                >

                                    <Package
                                        size={18}
                                    />

                                </div>


                                <div>

                                    <span>
                                        STEP 2
                                    </span>


                                    <h2>
                                        Review Items
                                    </h2>


                                    <p>

                                        {
                                            isBuyNow
                                                ? "Review the product selected with Buy Now."
                                                : "Confirm the products in your wellness order."
                                        }

                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    checkout-products
                                "
                            >

                                {
                                    checkoutItems.map(
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

                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="
                                                        checkout-product
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            checkout-product__image
                                                        "
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

                                                                    <Leaf
                                                                        size={24}
                                                                    />

                                                                )
                                                        }

                                                    </div>


                                                    <div
                                                        className="
                                                            checkout-product__details
                                                        "
                                                    >

                                                        <strong>
                                                            {
                                                                product.name ||
                                                                "AUMVEDA Product"
                                                            }
                                                        </strong>


                                                        {
                                                            variant.name && (

                                                                <span>
                                                                    {
                                                                        variant.name
                                                                    }
                                                                </span>

                                                            )
                                                        }


                                                        <small>
                                                            Quantity: {
                                                                quantity
                                                            }
                                                        </small>

                                                    </div>


                                                    <div
                                                        className="
                                                            checkout-product__price
                                                        "
                                                    >

                                                        ₹
                                                        {
                                                            formatPrice(
                                                                lineTotal
                                                            )
                                                        }

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )
                                }

                            </div>

                        </section>


                        {/* =================================================
                            STEP 3
                            PAYMENT
                        ================================================= */}

                        <section
                            className="
                                checkout-card
                            "
                        >

                            <div
                                className="
                                    checkout-card__heading
                                "
                            >

                                <div
                                    className="
                                        checkout-step-icon
                                    "
                                >

                                    <CreditCard
                                        size={18}
                                    />

                                </div>


                                <div>

                                    <span>
                                        STEP 3
                                    </span>


                                    <h2>
                                        Payment Method
                                    </h2>


                                    <p>
                                        Select your preferred
                                        payment method.
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    checkout-payment-options
                                "
                            >

                                {/* COD */}

                                <button
                                    type="button"
                                    className={
                                        paymentMethod ===
                                        "cod"
                                            ? "checkout-payment checkout-payment--selected"
                                            : "checkout-payment"
                                    }
                                    onClick={() =>
                                        handlePaymentChange(
                                            "cod"
                                        )
                                    }
                                >

                                    <span
                                        className="
                                            checkout-payment__radio
                                        "
                                    >

                                        {
                                            paymentMethod ===
                                            "cod" && (

                                                <Check
                                                    size={12}
                                                />

                                            )
                                        }

                                    </span>


                                    <Truck
                                        size={20}
                                    />


                                    <span>

                                        <strong>
                                            Cash on Delivery
                                        </strong>


                                        <small>
                                            Pay when your order arrives
                                        </small>

                                    </span>

                                </button>


                                {/* ONLINE */}

                                <button
                                    type="button"
                                    className={
                                        paymentMethod ===
                                        "online"
                                            ? "checkout-payment checkout-payment--selected"
                                            : "checkout-payment"
                                    }
                                    onClick={() =>
                                        handlePaymentChange(
                                            "online"
                                        )
                                    }
                                >

                                    <span
                                        className="
                                            checkout-payment__radio
                                        "
                                    >

                                        {
                                            paymentMethod ===
                                            "online" && (

                                                <Check
                                                    size={12}
                                                />

                                            )
                                        }

                                    </span>


                                    <CreditCard
                                        size={20}
                                    />


                                    <span>

                                        <strong>
                                            Online Payment
                                        </strong>


                                        <small>
                                            UPI, cards and supported
                                            online methods
                                        </small>

                                    </span>

                                </button>

                            </div>


                            <div
                                className="
                                    checkout-payment-note
                                "
                            >

                                {
                                    paymentMethod ===
                                    "online"
                                        ? (
                                            <>
                                                Online payment integration
                                                will be connected next.
                                                Please select Cash on
                                                Delivery for current testing.
                                            </>
                                        )
                                        : (
                                            <>
                                                Cash on Delivery is selected.
                                            </>
                                        )
                                }

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}

                    <aside
                        className="
                            checkout-summary
                        "
                    >

                        <div
                            className="
                                checkout-summary__header
                            "
                        >

                            <span>

                                {
                                    isBuyNow
                                        ? "BUY NOW SUMMARY"
                                        : "ORDER SUMMARY"
                                }

                            </span>


                            <h2>
                                Your Order
                            </h2>

                        </div>


                        <div
                            className="
                                checkout-summary__rows
                            "
                        >

                            <div>

                                <span>
                                    Items
                                </span>


                                <strong>
                                    {
                                        checkoutTotalQuantity
                                    }
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
                                            checkoutSubtotal
                                        )
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Delivery
                                </span>


                                <strong
                                    className="
                                        checkout-free
                                    "
                                >
                                    FREE
                                </strong>

                            </div>

                        </div>


                        <div
                            className="
                                checkout-summary__divider
                            "
                        />


                        <div
                            className="
                                checkout-summary__total
                            "
                        >

                            <span>
                                Total
                            </span>


                            <strong>
                                ₹
                                {
                                    formatPrice(
                                        total
                                    )
                                }
                            </strong>

                        </div>


                        {/* =================================================
                            FULL DELIVERY ADDRESS
                        ================================================= */}

                        {
                            selectedAddress && (

                                <div
                                    className="
                                        checkout-summary-address
                                    "
                                >

                                    <div
                                        className="
                                            checkout-summary-address__label
                                        "
                                    >

                                        <Home
                                            size={15}
                                        />

                                        Delivering to

                                    </div>


                                    <strong
                                        className="
                                            checkout-summary-address__name
                                        "
                                    >

                                        {
                                            selectedAddress
                                                .recipient_name
                                        }

                                    </strong>


                                    <div
                                        className="
                                            checkout-summary-address__full
                                        "
                                    >

                                        {
                                            selectedAddress
                                                .address_line1 && (

                                                <p>
                                                    {
                                                        selectedAddress
                                                            .address_line1
                                                    }
                                                </p>

                                            )
                                        }


                                        {
                                            selectedAddress
                                                .address_line2 && (

                                                <p>
                                                    {
                                                        selectedAddress
                                                            .address_line2
                                                    }
                                                </p>

                                            )
                                        }


                                        <p>

                                            {
                                                selectedAddress.city
                                            },{" "}

                                            {
                                                selectedAddress.state
                                            }{" "}

                                            -{" "}

                                            {
                                                selectedAddress
                                                    .postal_code
                                            }

                                        </p>


                                        {
                                            selectedAddress
                                                .country && (

                                                <p>
                                                    {
                                                        selectedAddress
                                                            .country
                                                    }
                                                </p>

                                            )
                                        }


                                        {
                                            selectedAddress
                                                .phone && (

                                                <p
                                                    className="
                                                        checkout-summary-address__phone
                                                    "
                                                >

                                                    Phone:{" "}

                                                    {
                                                        selectedAddress
                                                            .phone
                                                    }

                                                </p>

                                            )
                                        }

                                    </div>

                                </div>

                            )
                        }


                        {/* =================================================
                            PLACE ORDER
                        ================================================= */}

                        <button
                            type="button"
                            className="
                                checkout-place-order
                            "
                            onClick={
                                handlePlaceOrder
                            }
                            disabled={
                                !selectedAddress ||
                                addressesLoading
                            }
                        >

                            Place Order

                            <ChevronRight
                                size={18}
                            />

                        </button>


                        {
                            !selectedAddress && (

                                <p
                                    className="
                                        checkout-summary-warning
                                    "
                                >

                                    Select a delivery address
                                    to continue.

                                </p>

                            )
                        }


                        {/* =================================================
                            TRUST
                        ================================================= */}

                        <div
                            className="
                                checkout-summary-trust
                            "
                        >

                            <ShieldCheck
                                size={17}
                            />


                            <div>

                                <strong>
                                    Secure Checkout
                                </strong>


                                <span>
                                    Your account and order
                                    information are protected.
                                </span>

                            </div>

                        </div>


                        <div
                            className="
                                checkout-summary-trust
                            "
                        >

                            <Leaf
                                size={17}
                            />


                            <div>

                                <strong>
                                    Authentic Ayurveda
                                </strong>


                                <span>
                                    Carefully selected AUMVEDA
                                    wellness products.
                                </span>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );

}


export default Checkout;