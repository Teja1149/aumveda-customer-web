import {
    Heart,
    ShoppingBag,
    Star,
    Check
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
    } = useAuth();


    /* ========================================================
       CART
    ======================================================== */

    const {
        addToCart,
        getCartItem
    } = useCart();


    /* ========================================================
       WISHLIST
    ======================================================== */

    const {
        isWishlisted,
        toggleWishlist
    } = useWishlist();


    const productIsWishlisted =
        isWishlisted(
            product.id
        );


    /* ========================================================
       CART LOADING
    ======================================================== */

    const [
        addingToCart,
        setAddingToCart
    ] = useState(false);


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

        if (
            !product?.slug
        ) {

            return;

        }


        navigate(
            `/products/${product.slug}`
        );

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
       ADD TO CART
    ======================================================== */

    async function handleAddToCart(
        event
    ) {

        event.stopPropagation();


        /* ----------------------------------------------------
           OUT OF STOCK
        ---------------------------------------------------- */

        if (
            product.in_stock ===
            false
        ) {

            return;

        }


        /* ----------------------------------------------------
           LOGIN REQUIRED
        ---------------------------------------------------- */

        if (
            !isAuthenticated
        ) {

            navigate(
                "/login"
            );


            return;

        }


        /* ----------------------------------------------------
           PREVENT DOUBLE CLICK
        ---------------------------------------------------- */

        if (
            addingToCart
        ) {

            return;

        }


        try {

            setAddingToCart(
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

            setAddingToCart(
                false
            );

        }

    }


    /* ========================================================
       CHECK REAL CART STATE
    ======================================================== */

    const cartItem =
        getCartItem(
            product
        );


    const productIsInCart =
        Boolean(
            cartItem
        );


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
                    event => {

                        if (
                            event.key ===
                            "Enter" ||
                            event.key ===
                            " "
                        ) {

                            event.preventDefault();

                            openProduct();

                        }

                    }
                }

            >

                {/* DISCOUNT */}

                {
                    discount > 0 &&

                    <span
                        className="
                            product-card__discount
                        "
                    >

                        Save {discount}%

                    </span>
                }


                {/* PRODUCT IMAGE */}

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


                {/* =================================================
                    WISHLIST
                ================================================= */}

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

                {/* PRODUCT TITLE */}

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
                            event => {

                                if (
                                    event.key ===
                                    "Enter" ||
                                    event.key ===
                                    " "
                                ) {

                                    event.preventDefault();

                                    openProduct();

                                }

                            }
                        }

                    >

                        {
                            product.name
                        }

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


                {/* =================================================
                    RATING
                ================================================= */}

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


                {/* =================================================
                    PRICE
                ================================================= */}

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
                            ) &&

                            <del>

                                ₹
                                {
                                    formatPrice(
                                        product.compare_at_price
                                    )
                                }

                            </del>
                        }

                    </div>

                </div>


                {/* =================================================
                    CART BUTTON
                ================================================= */}

                <button

                    type="button"

                    className={`
                        product-card__cart
                        ${
                            productIsInCart
                                ? "is-added"
                                : ""
                        }
                        ${
                            product.in_stock === false
                                ? "is-disabled"
                                : ""
                        }
                    `}

                    onClick={
                        handleAddToCart
                    }

                    disabled={
                        product.in_stock === false ||
                        addingToCart
                    }

                >

                    {
                        product.in_stock === false ? (

                            <>

                                <ShoppingBag
                                    size={16}
                                />

                                Out of Stock

                            </>

                        ) : addingToCart ? (

                            <>

                                <ShoppingBag
                                    size={16}
                                />

                                Adding...

                            </>

                        ) : productIsInCart ? (

                            <>

                                <Check
                                    size={16}
                                />

                                Added to Cart

                            </>

                        ) : (

                            <>

                                <ShoppingBag
                                    size={16}
                                />

                                Add To Cart

                            </>

                        )
                    }

                </button>

            </div>

        </motion.article>

    );

}


export default ProductCard;