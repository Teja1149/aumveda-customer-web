import {
    useEffect,
    useState
} from "react";


import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    UserRound,
    X,
    LogOut
} from "lucide-react";


import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";


import {
    useAuth
} from "../../context/AuthContext";


import {
    useCart
} from "../../context/CartContext";


import {
    useWishlist
} from "../../context/WishlistContext";


import "../../styles/navbar.css";


function Navbar() {

    const location =
        useLocation();


    const navigate =
        useNavigate();


    /* ========================================================
       AUTH
    ======================================================== */

    const {
        user,
        isAuthenticated,
        loading: authLoading,
        displayName,
        logout
    } = useAuth();


    /* ========================================================
       CART
    ======================================================== */

    const cartContext =
        useCart();


    const totalQuantity =
        Number(
            cartContext?.totalQuantity ??
            cartContext?.items?.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item?.quantity || 0
                    ),
                0
            ) ??
            0
        );


    /* ========================================================
       WISHLIST
    ======================================================== */

    const {
        wishlistCount
    } = useWishlist();


    /* ========================================================
       SEARCH
    ======================================================== */

    const [
        searchText,
        setSearchText
    ] = useState("");


    /* ========================================================
       MOBILE MENU
    ======================================================== */

    const [
        mobileMenuOpen,
        setMobileMenuOpen
    ] = useState(false);


    /* ========================================================
       PROFILE MENU
    ======================================================== */

    const [
        profileMenuOpen,
        setProfileMenuOpen
    ] = useState(false);


    /* ========================================================
       LOGO
    ======================================================== */

    const LOGO_URL =
        "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/branding/logo%20without%20bg.webp";


    /* ========================================================
       ACTIVE ROUTES
    ======================================================== */

    const isHomeActive =
        location.pathname === "/";


    const isProductsActive =
        location.pathname === "/products" ||
        location.pathname.startsWith(
            "/products/"
        );


    const isWishlistActive =
        location.pathname === "/wishlist";


    const isCartActive =
        location.pathname === "/cart";


    const isAboutActive =
        location.pathname === "/about";


    const isContactActive =
        location.pathname === "/contact";


    /* ========================================================
       NAV CLASS
    ======================================================== */

    function navClass(
        isActive
    ) {

        return [
            "aumveda-nav-link",

            isActive
                ? "aumveda-nav-link--active"
                : ""

        ]
            .filter(Boolean)
            .join(" ");

    }


    /* ========================================================
       CLOSE MOBILE MENU
    ======================================================== */

    function closeMobileMenu() {

        setMobileMenuOpen(
            false
        );

    }


    /* ========================================================
       CLOSE PROFILE MENU
    ======================================================== */

    function closeProfileMenu() {

        setProfileMenuOpen(
            false
        );

    }


    /* ========================================================
       SEARCH
    ======================================================== */

    function handleSearch(
        event
    ) {

        event.preventDefault();


        const query =
            searchText.trim();


        if (!query) {

            return;

        }


        navigate(
            `/products?search=${encodeURIComponent(
                query
            )}`
        );


        closeMobileMenu();

        closeProfileMenu();

    }


    /* ========================================================
       WISHLIST
    ======================================================== */

    function handleWishlistClick() {

        closeMobileMenu();

        closeProfileMenu();


        navigate(
            "/wishlist"
        );

    }


    /* ========================================================
       CART
    ======================================================== */

    function handleCartClick() {

        if (
            authLoading
        ) {

            return;

        }


        closeMobileMenu();

        closeProfileMenu();


        if (
            !isAuthenticated
        ) {

            navigate(
                "/login"
            );


            return;

        }


        navigate(
            "/cart"
        );

    }


    /* ========================================================
       PROFILE
    ======================================================== */

    function handleProfileClick() {

        if (
            authLoading
        ) {

            return;

        }


        if (
            !isAuthenticated
        ) {

            closeProfileMenu();

            closeMobileMenu();


            navigate(
                "/login"
            );


            return;

        }


        setProfileMenuOpen(
            previous =>
                !previous
        );

    }


    /* ========================================================
       LOGOUT
    ======================================================== */

    async function handleLogout() {

        try {

            await logout();


            closeProfileMenu();

            closeMobileMenu();


            navigate("/");

        }
        catch (error) {

            console.error(
                "AUMVEDA logout failed:",
                error
            );

        }

    }


    /* ========================================================
       CLOSE MENUS ON ROUTE CHANGE
    ======================================================== */

    useEffect(() => {

        setMobileMenuOpen(
            false
        );


        setProfileMenuOpen(
            false
        );

    }, [
        location.pathname,
        location.hash
    ]);


    /* ========================================================
       OUTSIDE PROFILE CLICK
    ======================================================== */

    useEffect(() => {

        function handleOutsideClick(
            event
        ) {

            const target =
                event.target;


            if (
                !target ||
                typeof target.closest !==
                "function"
            ) {

                return;

            }


            if (
                !target.closest(
                    ".aumveda-profile-wrapper"
                )
            ) {

                setProfileMenuOpen(
                    false
                );

            }

        }


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    /* ========================================================
       RENDER
    ======================================================== */

    return (

        <header
            className="aumveda-navbar"
        >

            <div
                className="
                    aumveda-navbar__inner
                "
            >

                {/* ==================================================
                    BRAND
                ================================================== */}

                <Link

                    to="/"

                    className="
                        aumveda-brand
                    "

                    aria-label="
                        AUMVEDA Home
                    "

                    onClick={() => {

                        closeMobileMenu();

                        closeProfileMenu();

                    }}

                >

                    <div
                        className="
                            aumveda-brand-wrapper
                        "
                    >

                        <img

                            src={
                                LOGO_URL
                            }

                            alt="
                                AUMVEDA Wellness
                            "

                            className="
                                aumveda-brand__logo
                            "

                        />


                        <span
                            className="
                                aumveda-brand__tagline
                            "
                        >

                            Ancient Wisdom • Modern Wellness

                        </span>

                    </div>

                </Link>


                {/* ==================================================
                    SEARCH
                ================================================== */}

                <form

                    className="
                        aumveda-search
                    "

                    onSubmit={
                        handleSearch
                    }

                >

                    <Search

                        size={20}

                        strokeWidth={1.75}

                        className="
                            aumveda-search__icon
                        "

                    />


                    <input

                        type="search"

                        value={
                            searchText
                        }

                        onChange={
                            event =>
                                setSearchText(
                                    event.target.value
                                )
                        }

                        placeholder="
                            Search Ayurvedic products, herbs & wellness...
                        "

                        aria-label="
                            Search AUMVEDA
                        "

                    />


                    <button

                        type="submit"

                        className="
                            aumveda-search__button
                        "

                    >

                        Search

                    </button>

                </form>


                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

                <nav

                    className="
                        aumveda-nav-links
                    "

                    aria-label="
                        Main navigation
                    "

                >

                    <Link

                        to="/"

                        className={
                            navClass(
                                isHomeActive
                            )
                        }

                    >

                        Home

                    </Link>


                    <Link

                        to="/products"

                        className={
                            navClass(
                                isProductsActive
                            )
                        }

                    >

                        Products

                    </Link>


                    <Link

                        to="/about"

                        className={
                            navClass(
                                isAboutActive
                            )
                        }

                    >

                        About

                    </Link>


                    <Link

                        to="/contact"

                        className={
                            navClass(
                                isContactActive
                            )
                        }

                    >

                        Contact

                    </Link>

                </nav>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div
                    className="
                        aumveda-navbar__actions
                    "
                >

                    {/* =================================================
                        WISHLIST
                    ================================================= */}

                    <button

                        type="button"

                        className={`
                            aumveda-action
                            ${
                                isWishlistActive
                                    ? "aumveda-action--active"
                                    : ""
                            }
                        `}

                        onClick={
                            handleWishlistClick
                        }

                        aria-label={
                            wishlistCount > 0
                                ? `Wishlist with ${wishlistCount} items`
                                : "Wishlist"
                        }

                        title="
                            Wishlist
                        "

                    >

                        <span
                            className="
                                aumveda-action__icon-shell
                            "
                        >

                            <Heart

                                size={20}

                                strokeWidth={1.7}

                                fill={
                                    isWishlistActive
                                        ? "currentColor"
                                        : "none"
                                }

                            />


                            {
                                wishlistCount > 0 && (

                                    <span
                                        className="
                                            aumveda-action__badge
                                        "
                                    >

                                        {
                                            wishlistCount > 99
                                                ? "99+"
                                                : wishlistCount
                                        }

                                    </span>

                                )
                            }

                        </span>


                        <span
                            className="
                                aumveda-action__label
                            "
                        >

                            Wishlist

                        </span>

                    </button>


                    {/* =================================================
                        CART
                    ================================================= */}

                    <button

                        type="button"

                        className={`
                            aumveda-action
                            ${
                                isCartActive
                                    ? "aumveda-action--active"
                                    : ""
                            }
                        `}

                        onClick={
                            handleCartClick
                        }

                        aria-label={
                            totalQuantity > 0
                                ? `Cart with ${totalQuantity} items`
                                : "Cart"
                        }

                        title="
                            Cart
                        "

                    >

                        <span
                            className="
                                aumveda-action__icon-shell
                            "
                        >

                            <ShoppingCart

                                size={20}

                                strokeWidth={1.7}

                            />


                            {
                                totalQuantity > 0 && (

                                    <span
                                        className="
                                            aumveda-action__badge
                                        "
                                    >

                                        {
                                            totalQuantity > 99
                                                ? "99+"
                                                : totalQuantity
                                        }

                                    </span>

                                )
                            }

                        </span>


                        <span
                            className="
                                aumveda-action__label
                            "
                        >

                            Cart

                        </span>

                    </button>


                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <div
                        className="
                            aumveda-profile-wrapper
                        "
                    >

                        <button

                            type="button"

                            className="
                                aumveda-action
                            "

                            onClick={
                                handleProfileClick
                            }

                            aria-label="
                                Account
                            "

                            title="
                                Account
                            "

                        >

                            <span
                                className="
                                    aumveda-action__icon-shell
                                "
                            >

                                <UserRound

                                    size={20}

                                    strokeWidth={1.7}

                                />

                            </span>


                            <span
                                className="
                                    aumveda-action__label
                                "
                            >

                                {
                                    isAuthenticated
                                        ? "Account"
                                        : "Profile"
                                }

                            </span>

                        </button>


                        {/* =================================================
                            PROFILE MENU
                        ================================================= */}

                        {
                            isAuthenticated &&
                            profileMenuOpen && (

                                <div
                                    className="
                                        aumveda-profile-menu
                                    "
                                >

                                    <div
                                        className="
                                            aumveda-profile-menu__header
                                        "
                                    >

                                        <div
                                            className="
                                                aumveda-profile-menu__avatar
                                            "
                                        >

                                            <UserRound
                                                size={18}
                                            />

                                        </div>


                                        <div
                                            className="
                                                aumveda-profile-menu__user
                                            "
                                        >

                                            <strong>

                                                {
                                                    displayName
                                                }

                                            </strong>


                                            <span>

                                                {
                                                    user?.email
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            aumveda-profile-menu__divider
                                        "
                                    />


                                    <button

                                        type="button"

                                        className="
                                            aumveda-profile-menu__logout
                                        "

                                        onClick={
                                            handleLogout
                                        }

                                    >

                                        <LogOut
                                            size={16}
                                        />


                                        <span>

                                            Logout

                                        </span>

                                    </button>

                                </div>

                            )
                        }

                    </div>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    <button

                        type="button"

                        className="
                            aumveda-mobile-toggle
                        "

                        aria-label="
                            Toggle Menu
                        "

                        aria-expanded={
                            mobileMenuOpen
                        }

                        onClick={() =>
                            setMobileMenuOpen(
                                previous =>
                                    !previous
                            )
                        }

                    >

                        {
                            mobileMenuOpen
                                ? (
                                    <X
                                        size={23}
                                    />
                                )
                                : (
                                    <Menu
                                        size={23}
                                    />
                                )
                        }

                    </button>

                </div>

            </div>


            {/* ==================================================
                MOBILE NAVIGATION
            ================================================== */}

            {
                mobileMenuOpen && (

                    <nav
                        className="
                            aumveda-mobile-nav
                        "

                        aria-label="
                            Mobile navigation
                        "
                    >

                        <Link

                            to="/"

                            onClick={
                                closeMobileMenu
                            }

                        >

                            Home

                        </Link>


                        <Link

                            to="/products"

                            onClick={
                                closeMobileMenu
                            }

                        >

                            Products

                        </Link>


                        <button

                            type="button"

                            onClick={
                                handleWishlistClick
                            }

                        >

                            Wishlist


                            {
                                wishlistCount > 0 && (

                                    <span>

                                        {
                                            wishlistCount
                                        }

                                    </span>

                                )
                            }

                        </button>


                        <button

                            type="button"

                            onClick={
                                handleCartClick
                            }

                        >

                            Cart


                            {
                                totalQuantity > 0 && (

                                    <span>

                                        {
                                            totalQuantity
                                        }

                                    </span>

                                )
                            }

                        </button>


                        <Link

                            to="/about"

                            onClick={
                                closeMobileMenu
                            }

                        >

                            About

                        </Link>


                        <Link

                            to="/contact"

                            onClick={
                                closeMobileMenu
                            }

                        >

                            Contact

                        </Link>

                    </nav>

                )
            }

        </header>

    );

}


export default Navbar;