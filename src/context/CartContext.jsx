import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../services/api";

import {
    useAuth,
} from "./AuthContext";


// ============================================================
// CART CONTEXT
// ============================================================

const CartContext =
    createContext(null);


// ============================================================
// CART PROVIDER
// ============================================================

export function CartProvider({
    children,
}) {

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const {
        isAuthenticated,
        loading: authLoading,
    } = useAuth();


    // ========================================================
    // STATE
    // ========================================================

    const [
        cart,
        setCart,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState(null);


    // ========================================================
    // ERROR MESSAGE HELPER
    // ========================================================

    const getErrorMessage = useCallback(
        (error, fallback) => {

            if (!error) {
                return fallback;
            }


            // Axios / API error response

            const responseData =
                error?.response?.data;


            if (
                typeof responseData ===
                "string"
            ) {

                return responseData;

            }


            if (
                responseData?.detail
            ) {

                if (
                    typeof responseData.detail ===
                    "string"
                ) {

                    return responseData.detail;

                }


                if (
                    Array.isArray(
                        responseData.detail
                    )
                ) {

                    return responseData.detail
                        .map(
                            item =>
                                item?.msg ||
                                String(item)
                        )
                        .join(", ");

                }

            }


            if (
                responseData?.message
            ) {

                return responseData.message;

            }


            if (
                error?.message
            ) {

                return error.message;

            }


            return fallback;

        },
        []
    );


    // ========================================================
    // EXTRACT CART DATA
    // ========================================================
    //
    // Supports all of these response formats:
    //
    // 1. Axios raw response:
    //
    // {
    //     data: {
    //         status: "success",
    //         data: {...cart}
    //     }
    // }
    //
    // 2. API interceptor response:
    //
    // {
    //     status: "success",
    //     data: {...cart}
    // }
    //
    // 3. Direct cart:
    //
    // {
    //     items: [],
    //     total_quantity: 2,
    //     subtotal: 698
    // }
    //
    // ========================================================

    const extractCart = useCallback(
        (response) => {

            if (!response) {
                return null;
            }


            // ------------------------------------------------
            // Axios raw response
            // ------------------------------------------------

            const axiosPayload =
                response?.data;


            if (
                axiosPayload &&
                typeof axiosPayload ===
                    "object" &&
                (
                    axiosPayload?.data !==
                    undefined ||
                    axiosPayload?.status !==
                    undefined
                )
            ) {

                if (
                    axiosPayload?.data !==
                    undefined
                ) {

                    return axiosPayload.data;

                }


                return axiosPayload;

            }


            // ------------------------------------------------
            // API interceptor response
            // ------------------------------------------------

            if (
                response?.data !==
                undefined
            ) {

                return response.data;

            }


            // ------------------------------------------------
            // Direct cart object
            // ------------------------------------------------

            return response;

        },
        []
    );


    // ========================================================
    // NORMALIZE QUANTITY
    // ========================================================

    const normalizeQuantity = useCallback(
        (quantity) => {

            const numericQuantity =
                Number(quantity);


            if (
                !Number.isFinite(
                    numericQuantity
                )
            ) {

                return null;

            }


            if (
                numericQuantity < 1
            ) {

                return null;

            }


            if (
                !Number.isInteger(
                    numericQuantity
                )
            ) {

                return null;

            }


            return numericQuantity;

        },
        []
    );


    // ========================================================
    // REFRESH CART
    // ========================================================

    const refreshCart = useCallback(
        async () => {

            // ------------------------------------------------
            // User is not authenticated
            // ------------------------------------------------

            if (!isAuthenticated) {

                setCart(null);

                setError(null);

                return null;

            }


            try {

                setLoading(true);

                setError(null);


                console.log(
                    "AUMVEDA CART: Loading cart..."
                );


                const response =
                    await api.get(
                        "/cart"
                    );


                const nextCart =
                    extractCart(
                        response
                    );


                if (nextCart) {

                    setCart(
                        nextCart
                    );

                }
                else {

                    setCart(
                        null
                    );

                }


                console.log(
                    "AUMVEDA CART: Cart loaded",
                    nextCart
                );


                return nextCart;

            }
            catch (error) {

                console.error(
                    "AUMVEDA CART: Failed to load cart:",
                    error
                );


                const message =
                    getErrorMessage(
                        error,
                        "Failed to load cart."
                    );


                setError(
                    message
                );


                // ------------------------------------------------
                // Do not destroy an already loaded cart just
                // because a refresh failed.
                // ------------------------------------------------

                return null;

            }
            finally {

                setLoading(false);

            }

        },
        [
            isAuthenticated,
            extractCart,
            getErrorMessage,
        ]
    );


    // ========================================================
    // LOAD CART AFTER AUTHENTICATION
    // ========================================================

    useEffect(() => {

        if (authLoading) {

            return;

        }


        if (!isAuthenticated) {

            setCart(null);

            setError(null);

            setLoading(false);

            return;

        }


        refreshCart();

    }, [
        authLoading,
        isAuthenticated,
        refreshCart,
    ]);


    // ========================================================
    // ADD TO CART
    // ========================================================

    const addToCart = useCallback(
        async (
            product,
            quantity = 1
        ) => {

            // ------------------------------------------------
            // Authentication
            // ------------------------------------------------

            if (!isAuthenticated) {

                throw new Error(
                    "Please sign in to add products to your cart."
                );

            }


            // ------------------------------------------------
            // Variant ID
            // ------------------------------------------------

            const variantId =
                product?.variant_id ||
                product?.variant?.id;


            if (!variantId) {

                throw new Error(
                    "Product variant is missing."
                );

            }


            // ------------------------------------------------
            // Quantity
            // ------------------------------------------------

            const normalizedQuantity =
                normalizeQuantity(
                    quantity
                );


            if (
                normalizedQuantity ===
                null
            ) {

                throw new Error(
                    "Quantity must be a positive whole number."
                );

            }


            // ------------------------------------------------
            // Stock validation
            // ------------------------------------------------

            const variantStock =
                product?.variant
                    ?.stock_quantity;


            const productStock =
                product?.stock_quantity;


            if (
                product?.in_stock === false ||
                variantStock === 0 ||
                productStock === 0
            ) {

                throw new Error(
                    "This product is out of stock."
                );

            }


            if (
                Number.isFinite(
                    Number(variantStock)
                ) &&
                Number(variantStock) >
                    0 &&
                normalizedQuantity >
                    Number(variantStock)
            ) {

                throw new Error(
                    `Only ${variantStock} item(s) are currently available.`
                );

            }


            try {

                setError(null);


                console.log(
                    "AUMVEDA CART: Adding item",
                    {
                        variantId,
                        quantity:
                            normalizedQuantity,
                    }
                );


                const response =
                    await api.post(
                        "/cart/items",
                        {
                            variant_id:
                                variantId,

                            quantity:
                                normalizedQuantity,
                        }
                    );


                const nextCart =
                    extractCart(
                        response
                    );


                if (nextCart) {

                    setCart(
                        nextCart
                    );

                }
                else {

                    await refreshCart();

                }


                console.log(
                    "AUMVEDA CART: Item added successfully"
                );


                return (
                    nextCart ||
                    cart
                );

            }
            catch (error) {

                console.error(
                    "AUMVEDA CART: Failed to add product:",
                    error
                );


                const message =
                    getErrorMessage(
                        error,
                        "Failed to add product to cart."
                    );


                setError(
                    message
                );


                throw new Error(
                    message
                );

            }

        },
        [
            isAuthenticated,
            normalizeQuantity,
            extractCart,
            refreshCart,
            getErrorMessage,
            cart,
        ]
    );


    // ========================================================
    // UPDATE CART ITEM
    // ========================================================

    const updateCartItem = useCallback(
        async (
            itemId,
            quantity
        ) => {

            if (!isAuthenticated) {

                throw new Error(
                    "Please sign in to manage your cart."
                );

            }


            if (!itemId) {

                throw new Error(
                    "Cart item ID is missing."
                );

            }


            const normalizedQuantity =
                normalizeQuantity(
                    quantity
                );


            if (
                normalizedQuantity ===
                null
            ) {

                throw new Error(
                    "Quantity must be a positive whole number."
                );

            }


            try {

                setError(null);


                console.log(
                    "AUMVEDA CART: Updating item",
                    {
                        itemId,
                        quantity:
                            normalizedQuantity,
                    }
                );


                const response =
                    await api.patch(
                        `/cart/items/${itemId}`,
                        {
                            quantity:
                                normalizedQuantity,
                        }
                    );


                const nextCart =
                    extractCart(
                        response
                    );


                if (nextCart) {

                    setCart(
                        nextCart
                    );

                }
                else {

                    await refreshCart();

                }


                console.log(
                    "AUMVEDA CART: Item updated successfully"
                );


                return (
                    nextCart ||
                    cart
                );

            }
            catch (error) {

                console.error(
                    "AUMVEDA CART: Failed to update item:",
                    error
                );


                const message =
                    getErrorMessage(
                        error,
                        "Failed to update cart item."
                    );


                setError(
                    message
                );


                throw new Error(
                    message
                );

            }

        },
        [
            isAuthenticated,
            normalizeQuantity,
            extractCart,
            refreshCart,
            getErrorMessage,
            cart,
        ]
    );


    // ========================================================
    // REMOVE FROM CART
    // ========================================================

    const removeFromCart = useCallback(
        async (
            itemId
        ) => {

            if (!isAuthenticated) {

                throw new Error(
                    "Please sign in to manage your cart."
                );

            }


            if (!itemId) {

                throw new Error(
                    "Cart item ID is missing."
                );

            }


            try {

                setError(null);


                console.log(
                    "AUMVEDA CART: Removing item",
                    itemId
                );


                const response =
                    await api.delete(
                        `/cart/items/${itemId}`
                    );


                const nextCart =
                    extractCart(
                        response
                    );


                if (nextCart) {

                    setCart(
                        nextCart
                    );

                }
                else {

                    await refreshCart();

                }


                console.log(
                    "AUMVEDA CART: Item removed successfully"
                );


                return (
                    nextCart ||
                    cart
                );

            }
            catch (error) {

                console.error(
                    "AUMVEDA CART: Failed to remove item:",
                    error
                );


                const message =
                    getErrorMessage(
                        error,
                        "Failed to remove cart item."
                    );


                setError(
                    message
                );


                throw new Error(
                    message
                );

            }

        },
        [
            isAuthenticated,
            extractCart,
            refreshCart,
            getErrorMessage,
            cart,
        ]
    );


    // ========================================================
    // CLEAR CART
    // ========================================================

    const clearCart = useCallback(
        async () => {

            if (!isAuthenticated) {

                throw new Error(
                    "Please sign in to manage your cart."
                );

            }


            try {

                setError(null);


                console.log(
                    "AUMVEDA CART: Clearing cart..."
                );


                const response =
                    await api.delete(
                        "/cart"
                    );


                const nextCart =
                    extractCart(
                        response
                    );


                if (nextCart) {

                    setCart(
                        nextCart
                    );

                }
                else {

                    /*
                        If the backend returns a successful
                        empty response instead of the complete
                        cart object, explicitly reset the local
                        cart.
                    */

                    setCart({
                        items: [],
                        item_count: 0,
                        total_quantity: 0,
                        subtotal: 0,
                    });

                }


                console.log(
                    "AUMVEDA CART: Cart cleared successfully"
                );


                return (
                    nextCart || {
                        items: [],
                        item_count: 0,
                        total_quantity: 0,
                        subtotal: 0,
                    }
                );

            }
            catch (error) {

                console.error(
                    "AUMVEDA CART: Failed to clear cart:",
                    error
                );


                const message =
                    getErrorMessage(
                        error,
                        "Failed to clear cart."
                    );


                setError(
                    message
                );


                throw new Error(
                    message
                );

            }

        },
        [
            isAuthenticated,
            extractCart,
            getErrorMessage,
        ]
    );


    // ========================================================
    // CART VALUES
    // ========================================================

    const items =
        useMemo(
            () =>
                Array.isArray(
                    cart?.items
                )
                    ? cart.items
                    : [],
            [
                cart,
            ]
        );


    // --------------------------------------------------------
    // ITEM COUNT
    // --------------------------------------------------------

    const itemCount =
        useMemo(
            () => {

                if (
                    cart?.item_count !==
                    undefined &&
                    cart?.item_count !==
                    null
                ) {

                    return Number(
                        cart.item_count
                    ) || 0;

                }


                return items.length;

            },
            [
                cart,
                items,
            ]
        );


    // --------------------------------------------------------
    // TOTAL QUANTITY
    // --------------------------------------------------------

    const totalQuantity =
        useMemo(
            () => {

                if (
                    cart?.total_quantity !==
                    undefined &&
                    cart?.total_quantity !==
                    null
                ) {

                    return Number(
                        cart.total_quantity
                    ) || 0;

                }


                return items.reduce(
                    (
                        total,
                        item
                    ) => {

                        return (
                            total +
                            (
                                Number(
                                    item?.quantity
                                ) || 0
                            )
                        );

                    },
                    0
                );

            },
            [
                cart,
                items,
            ]
        );


    // --------------------------------------------------------
    // SUBTOTAL
    // --------------------------------------------------------

    const subtotal =
        useMemo(
            () => {

                if (
                    cart?.subtotal !==
                    undefined &&
                    cart?.subtotal !==
                    null
                ) {

                    return Number(
                        cart.subtotal
                    ) || 0;

                }


                return items.reduce(
                    (
                        total,
                        item
                    ) => {

                        const quantity =
                            Number(
                                item?.quantity
                            ) || 0;


                        const itemSubtotal =
                            Number(
                                item?.subtotal
                            );


                        if (
                            Number.isFinite(
                                itemSubtotal
                            )
                        ) {

                            return (
                                total +
                                itemSubtotal
                            );

                        }


                        const price =
                            Number(
                                item?.price ??
                                item?.variant
                                    ?.price ??
                                0
                            );


                        return (
                            total +
                            (
                                price *
                                quantity
                            )
                        );

                    },
                    0
                );

            },
            [
                cart,
                items,
            ]
        );


    // ========================================================
    // FIND PRODUCT CART ITEM
    // ========================================================

    const getCartItem =
        useCallback(
            (product) => {

                const variantId =
                    product?.variant_id ||
                    product?.variant?.id;


                if (!variantId) {

                    return null;

                }


                return (
                    items.find(
                        item =>
                            String(
                                item?.variant_id
                            ) ===
                            String(
                                variantId
                            )
                    ) ||
                    null
                );

            },
            [
                items,
            ]
        );


    // ========================================================
    // CHECK PRODUCT IN CART
    // ========================================================

    const isProductInCart =
        useCallback(
            (product) => {

                return Boolean(
                    getCartItem(
                        product
                    )
                );

            },
            [
                getCartItem,
            ]
        );


    // ========================================================
    // CONTEXT VALUE
    // ========================================================

    const value =
        useMemo(
            () => ({

                // --------------------------------------------
                // Cart
                // --------------------------------------------

                cart,

                items,

                loading,

                error,


                // --------------------------------------------
                // Cart totals
                // --------------------------------------------

                itemCount,

                totalQuantity,

                subtotal,


                // --------------------------------------------
                // Cart actions
                // --------------------------------------------

                refreshCart,

                addToCart,

                updateCartItem,

                removeFromCart,

                clearCart,


                // --------------------------------------------
                // Product helpers
                // --------------------------------------------

                getCartItem,

                isProductInCart,

            }),
            [
                cart,
                items,
                loading,
                error,
                itemCount,
                totalQuantity,
                subtotal,
                refreshCart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                getCartItem,
                isProductInCart,
            ]
        );


    // ========================================================
    // PROVIDER
    // ========================================================

    return (

        <CartContext.Provider
            value={value}
        >

            {children}

        </CartContext.Provider>

    );

}


// ============================================================
// USE CART
// ============================================================

export function useCart() {

    const context =
        useContext(
            CartContext
        );


    if (!context) {

        throw new Error(
            "useCart must be used inside CartProvider."
        );

    }


    return context;

}


export default CartContext;
