/* eslint-disable react-refresh/only-export-components */

import {
    createContext,
    useCallback,
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
   WRITE WISHLIST
============================================================ */

function writeWishlist(
    nextWishlist
) {

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

    const saveWishlist =
        useCallback(
            nextWishlist => {

                setWishlistIds(
                    nextWishlist
                );


                writeWishlist(
                    nextWishlist
                );

            },
            []
        );


    /* ========================================================
       CHECK WISHLIST
    ======================================================== */

    const isWishlisted =
        useCallback(
            productId => {

                return wishlistIds.includes(
                    productId
                );

            },
            [
                wishlistIds
            ]
        );


    /* ========================================================
       ADD
    ======================================================== */

    const addToWishlist =
        useCallback(
            productId => {

                if (!productId) {

                    return;

                }


                setWishlistIds(
                    previousWishlist => {

                        if (
                            previousWishlist.includes(
                                productId
                            )
                        ) {

                            return previousWishlist;

                        }


                        const nextWishlist = [
                            ...previousWishlist,
                            productId
                        ];


                        writeWishlist(
                            nextWishlist
                        );


                        return nextWishlist;

                    }
                );

            },
            []
        );


    /* ========================================================
       REMOVE
    ======================================================== */

    const removeFromWishlist =
        useCallback(
            productId => {

                if (!productId) {

                    return;

                }


                setWishlistIds(
                    previousWishlist => {

                        const nextWishlist =
                            previousWishlist.filter(
                                id =>
                                    id !== productId
                            );


                        if (
                            nextWishlist.length ===
                            previousWishlist.length
                        ) {

                            return previousWishlist;

                        }


                        writeWishlist(
                            nextWishlist
                        );


                        return nextWishlist;

                    }
                );

            },
            []
        );


    /* ========================================================
       TOGGLE
    ======================================================== */

    const toggleWishlist =
        useCallback(
            productId => {

                if (!productId) {

                    return;

                }


                setWishlistIds(
                    previousWishlist => {

                        const exists =
                            previousWishlist.includes(
                                productId
                            );


                        const nextWishlist =
                            exists
                                ? previousWishlist.filter(
                                    id =>
                                        id !== productId
                                )
                                : [
                                    ...previousWishlist,
                                    productId
                                ];


                        writeWishlist(
                            nextWishlist
                        );


                        return nextWishlist;

                    }
                );

            },
            []
        );


    /* ========================================================
       CLEAR
    ======================================================== */

    const clearWishlist =
        useCallback(
            () => {

                saveWishlist(
                    []
                );

            },
            [
                saveWishlist
            ]
        );


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
                wishlistCount,
                isWishlisted,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                clearWishlist
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