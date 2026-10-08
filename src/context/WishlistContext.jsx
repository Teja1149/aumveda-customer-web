import {
    createContext,
    useContext,
    useMemo,
    useState
} from "react";


const WishlistContext =
    createContext(null);


const WISHLIST_KEY =
    "aumveda_wishlist";


/* ============================================================
   READ WISHLIST
============================================================ */

function readWishlist() {

    try {

        const saved =
            localStorage.getItem(
                WISHLIST_KEY
            );


        const parsed =
            saved
                ? JSON.parse(saved)
                : [];


        return Array.isArray(parsed)
            ? parsed
            : [];

    }
    catch {

        return [];

    }

}


/* ============================================================
   PROVIDER
============================================================ */

export function WishlistProvider({
    children
}) {

    const [
        wishlistIds,
        setWishlistIds
    ] = useState(
        () =>
            readWishlist()
    );


    /* ========================================================
       SAVE
    ======================================================== */

    function saveWishlist(
        nextWishlist
    ) {

        setWishlistIds(
            nextWishlist
        );


        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(
                nextWishlist
            )
        );


        window.dispatchEvent(
            new CustomEvent(
                "aumveda-wishlist-updated"
            )
        );

    }


    /* ========================================================
       CHECK WISHLIST
    ======================================================== */

    function isWishlisted(
        productId
    ) {

        return wishlistIds.includes(
            productId
        );

    }


    /* ========================================================
       ADD
    ======================================================== */

    function addToWishlist(
        productId
    ) {

        if (
            !productId ||
            wishlistIds.includes(
                productId
            )
        ) {

            return;

        }


        saveWishlist([
            ...wishlistIds,
            productId
        ]);

    }


    /* ========================================================
       REMOVE
    ======================================================== */

    function removeFromWishlist(
        productId
    ) {

        saveWishlist(
            wishlistIds.filter(
                id =>
                    id !== productId
            )
        );

    }


    /* ========================================================
       TOGGLE
    ======================================================== */

    function toggleWishlist(
        productId
    ) {

        if (!productId) {

            return;

        }


        if (
            wishlistIds.includes(
                productId
            )
        ) {

            removeFromWishlist(
                productId
            );

        }
        else {

            addToWishlist(
                productId
            );

        }

    }


    /* ========================================================
       CLEAR
    ======================================================== */

    function clearWishlist() {

        saveWishlist([]);

    }


    /* ========================================================
       COUNT
    ======================================================== */

    const wishlistCount =
        wishlistIds.length;


    /* ========================================================
       CONTEXT VALUE
    ======================================================== */

    const value =
        useMemo(
            () => ({

                wishlistIds,

                wishlistCount,

                isWishlisted,

                addToWishlist,

                removeFromWishlist,

                toggleWishlist,

                clearWishlist

            }),
            [
                wishlistIds,
                wishlistCount
            ]
        );


    return (

        <WishlistContext.Provider
            value={
                value
            }
        >

            {children}

        </WishlistContext.Provider>

    );

}


/* ============================================================
   HOOK
============================================================ */

export function useWishlist() {

    const context =
        useContext(
            WishlistContext
        );


    if (!context) {

        throw new Error(
            "useWishlist must be used inside WishlistProvider"
        );

    }


    return context;

}