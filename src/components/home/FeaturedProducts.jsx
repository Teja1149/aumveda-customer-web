import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    getProducts,
} from "../../services/productService";

import ProductGrid from "../products/ProductGrid";

import BotanicalDoodles from "../common/BotanicalDoodles";

import "../../styles/featured-products.css";


// ============================================================
// CONFIGURATION
// ============================================================

const FEATURED_PRODUCT_LIMIT = 8;

const WISHLIST_STORAGE_KEY =
    "aumveda_wishlist";

const CART_STORAGE_KEY =
    "aumveda_cart";


// ============================================================
// SAFE LOCAL STORAGE HELPERS
// ============================================================

function getWishlistIds() {

    try {

        const stored =
            localStorage.getItem(
                WISHLIST_STORAGE_KEY
            );

        if (!stored) {
            return new Set();
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return new Set();
        }

        return new Set(parsed);

    } catch (error) {

        console.error(
            "Wishlist storage read failed:",
            error
        );

        return new Set();

    }

}


function getCartItems() {

    try {

        const stored =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Cart storage read failed:",
            error
        );

        return [];

    }

}


// ============================================================
// FEATURED PRODUCTS
// ============================================================

function FeaturedProducts() {

    const [
        products,
        setProducts
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        wishlistIds,
        setWishlistIds
    ] = useState(
        () => getWishlistIds()
    );


    const [
        addedProductId,
        setAddedProductId
    ] = useState(null);


    // ========================================================
    // LOAD PRODUCTS
    //
    // SAME API AS PRODUCTS PAGE
    // ========================================================

    useEffect(() => {

        let isMounted = true;


        async function loadFeaturedProducts() {

            try {

                const data =
                    await getProducts();


                if (!isMounted) {
                    return;
                }


                const productList =
                    Array.isArray(data)
                        ? data
                        : [];


                // ---------------------------------------------
                // SAME PRODUCTS AS PRODUCTS PAGE
                // ONLY SHOW FIRST 8 ON HOME
                // ---------------------------------------------

                setProducts(
                    productList.slice(
                        0,
                        FEATURED_PRODUCT_LIMIT
                    )
                );


            } catch (error) {

                console.error(
                    "Featured products loading failed:",
                    error
                );


                if (isMounted) {

                    setProducts([]);

                }

            } finally {

                if (isMounted) {

                    setLoading(false);

                }

            }

        }


        loadFeaturedProducts();


        return () => {

            isMounted = false;

        };

    }, []);


    // ========================================================
    // SAVE WISHLIST
    // ========================================================

    useEffect(() => {

        try {

            localStorage.setItem(
                WISHLIST_STORAGE_KEY,
                JSON.stringify(
                    Array.from(wishlistIds)
                )
            );

        } catch (error) {

            console.error(
                "Wishlist storage save failed:",
                error
            );

        }

    }, [wishlistIds]);


    // ========================================================
    // WISHLIST
    // ========================================================

    function handleToggleWishlist(productId) {

        setWishlistIds(
            previous => {

                const updated =
                    new Set(previous);


                if (
                    updated.has(productId)
                ) {

                    updated.delete(
                        productId
                    );

                } else {

                    updated.add(
                        productId
                    );

                }


                return updated;

            }
        );

    }


    // ========================================================
    // ADD TO CART
    //
    // Uses SAME PRODUCT OBJECT from Products page
    // ========================================================

    function handleAddToCart(product) {

        try {

            const existingCart =
                getCartItems();


            const existingItem =
                existingCart.find(
                    item =>
                        item.id ===
                        product.id
                );


            let updatedCart;


            if (existingItem) {

                updatedCart =
                    existingCart.map(
                        item => {

                            if (
                                item.id !==
                                product.id
                            ) {

                                return item;

                            }


                            return {

                                ...item,

                                quantity:
                                    Number(
                                        item.quantity || 1
                                    ) + 1,

                            };

                        }
                    );

            } else {

                updatedCart = [

                    ...existingCart,

                    {

                        ...product,

                        quantity: 1,

                    },

                ];

            }


            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(
                    updatedCart
                )
            );


            setAddedProductId(
                product.id
            );


            window.dispatchEvent(
                new CustomEvent(
                    "aumveda-cart-updated"
                )
            );


            window.setTimeout(() => {

                setAddedProductId(null);

            }, 1200);


        } catch (error) {

            console.error(
                "Add to cart failed:",
                error
            );

        }

    }


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <section
                className="
                    featured-products
                    products-wrapper
                "
                id="featured-products"
            >

                <BotanicalDoodles
                    variant="products"
                />


                <div
                    className="
                        featured-products__heading
                    "
                >

                    <p>
                        CURATED FOR YOUR WELLNESS
                    </p>

                    <h2>
                        Featured Products
                    </h2>

                </div>


                <div
                    className="
                        featured-products__loading
                    "
                >
                    Loading...
                </div>

            </section>

        );

    }


    // ========================================================
    // NO PRODUCTS
    // ========================================================

    if (!products.length) {

        return (

            <section
                className="
                    featured-products
                    products-wrapper
                "
                id="featured-products"
            >

                <BotanicalDoodles
                    variant="products"
                />


                <div
                    className="
                        featured-products__heading
                    "
                >

                    <p>
                        CURATED FOR YOUR WELLNESS
                    </p>

                    <h2>
                        Featured Products
                    </h2>

                </div>


                <div
                    className="
                        featured-products__empty
                    "
                >
                    Featured products will appear here.
                </div>

            </section>

        );

    }


    // ========================================================
    // MAIN
    // ========================================================

    return (

        <section
            className="
                featured-products
                products-wrapper
            "
            id="featured-products"
        >

            <BotanicalDoodles
                variant="products"
            />


            {/* ==================================================
                HEADING
            ================================================== */}

            <div
                className="
                    featured-products__heading
                "
            >

                <p>
                    CURATED FOR YOUR WELLNESS
                </p>


                <h2>
                    Featured Products
                </h2>

            </div>


            {/* ==================================================
                SAME PRODUCT GRID + SAME PRODUCT CARD
                USED BY PRODUCTS PAGE
            ================================================== */}

            <div
                className="
                    featured-products__grid-wrapper
                "
            >

                <ProductGrid

                    products={
                        products
                    }

                    wishlistIds={
                        wishlistIds
                    }

                    addedProductId={
                        addedProductId
                    }

                    onToggleWishlist={
                        handleToggleWishlist
                    }

                    onAddToCart={
                        handleAddToCart
                    }

                />

            </div>


            {/* ==================================================
                VIEW ALL
            ================================================== */}

            <div
                className="
                    featured-products__view-all
                "
            >

                <Link
                    to="/products"
                    className="
                        featured-products__view-all-button
                    "
                >
                    View All Products
                    <span>→</span>
                </Link>

            </div>

        </section>

    );

}


export default FeaturedProducts;