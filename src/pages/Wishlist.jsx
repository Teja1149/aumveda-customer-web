import {
    useEffect,
    useMemo,
    useState
} from "react";


import {
    ArrowLeft,
    Heart,
    Trash2
} from "lucide-react";


import {
    Link
} from "react-router-dom";


import {
    useWishlist
} from "../context/WishlistContext";


import {
    getProducts
} from "../services/productService";


import ProductGrid
    from "../components/products/ProductGrid";


import "../styles/wishlist.css";


function Wishlist() {

    /* ========================================================
       WISHLIST
    ======================================================== */

    const {
        wishlistIds,
        wishlistCount,
        clearWishlist
    } = useWishlist();


    /* ========================================================
       PRODUCTS
    ======================================================== */

    const [
        products,
        setProducts
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
       LOAD PRODUCTS
    ======================================================== */

    useEffect(() => {

        let cancelled =
            false;


        async function loadWishlistProducts() {

            try {

                const data =
                    await getProducts();


                if (cancelled) {

                    return;

                }


                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );

            }
            catch (loadError) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Wishlist products loading failed:",
                    loadError
                );


                setError(
                    "Unable to load your wishlist."
                );

            }
            finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        loadWishlistProducts();


        return () => {

            cancelled =
                true;

        };

    }, []);


    /* ========================================================
       FILTER SAVED PRODUCTS
    ======================================================== */

    const wishlistProducts =
        useMemo(() => {

            return products.filter(
                product =>
                    wishlistIds.includes(
                        product.id
                    )
            );

        }, [
            products,
            wishlistIds
        ]);


    /* ========================================================
       CLEAR
    ======================================================== */

    function handleClearWishlist() {

        if (
            wishlistCount === 0
        ) {

            return;

        }


        const confirmed =
            window.confirm(
                "Remove all products from your wishlist?"
            );


        if (!confirmed) {

            return;

        }


        clearWishlist();

    }


    /* ========================================================
       LOADING
    ======================================================== */

    if (loading) {

        return (

            <main
                className="wishlist-page"
            >

                <div
                    className="wishlist-state"
                >

                    <div
                        className="wishlist-loader"
                    />


                    <p>

                        Loading your wishlist...

                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       ERROR
    ======================================================== */

    if (error) {

        return (

            <main
                className="wishlist-page"
            >

                <div
                    className="wishlist-state"
                >

                    <Heart
                        size={42}
                    />


                    <h2>

                        Wishlist unavailable

                    </h2>


                    <p>

                        {error}

                    </p>


                    <Link
                        to="/products"
                        className="
                            wishlist-primary-button
                        "
                    >

                        Explore Products

                    </Link>

                </div>

            </main>

        );

    }


    /* ========================================================
       EMPTY
    ======================================================== */

    if (
        wishlistCount === 0 ||
        wishlistProducts.length === 0
    ) {

        return (

            <main
                className="wishlist-page"
            >

                <div
                    className="wishlist-empty"
                >

                    <div
                        className="
                            wishlist-empty__icon
                        "
                    >

                        <Heart
                            size={38}
                            strokeWidth={1.4}
                        />

                    </div>


                    <span>

                        YOUR AYURVEDIC FAVOURITES

                    </span>


                    <h1>

                        Your wishlist is empty

                    </h1>


                    <p>

                        Save your favourite Ayurvedic
                        products and wellness essentials
                        here so you can return to them
                        whenever you wish.

                    </p>


                    <Link
                        to="/products"
                        className="
                            wishlist-primary-button
                        "
                    >

                        Explore Products

                    </Link>

                </div>

            </main>

        );

    }


    /* ========================================================
       WISHLIST PAGE
    ======================================================== */

    return (

        <main
            className="wishlist-page"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className="wishlist-header"
            >

                <div>

                    <span
                        className="
                            wishlist-eyebrow
                        "
                    >

                        YOUR AYURVEDIC FAVOURITES

                    </span>


                    <h1>

                        My Wishlist

                    </h1>


                    <p>

                        Your personally selected
                        Ayurvedic wellness essentials.

                    </p>

                </div>


                <div
                    className="
                        wishlist-header__actions
                    "
                >

                    <div
                        className="
                            wishlist-count
                        "
                    >

                        <Heart
                            size={17}
                        />


                        <span>

                            {
                                wishlistCount
                            }

                            {
                                wishlistCount ===
                                1
                                    ? " item"
                                    : " items"
                            }

                        </span>

                    </div>


                    <button

                        type="button"

                        className="
                            wishlist-clear
                        "

                        onClick={
                            handleClearWishlist
                        }

                    >

                        <Trash2
                            size={15}
                        />

                        Clear Wishlist

                    </button>

                </div>

            </header>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <section
                className="
                    wishlist-products
                "
            >

                <ProductGrid
                    products={
                        wishlistProducts
                    }
                />

            </section>


            {/* =================================================
                BACK
            ================================================= */}

            <div
                className="
                    wishlist-footer
                "
            >

                <Link
                    to="/products"
                    className="
                        wishlist-back
                    "
                >

                    <ArrowLeft
                        size={17}
                    />

                    Continue Shopping

                </Link>

            </div>

        </main>

    );

}


export default Wishlist;