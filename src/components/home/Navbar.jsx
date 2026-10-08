
import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Heart,
    Menu,
    Search,
    ShoppingCart,
    UserRound,
    X,
    LogOut,
    ChevronDown
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

    const location = useLocation();
    const navigate = useNavigate();

    // ========================================================
    // AUTHENTICATION
    // ========================================================

    const {
        user,
        isAuthenticated,
        loading: authLoading,
        displayName,
        logout
    } = useAuth();


    // ========================================================
    // CART
    // ========================================================

    const cartContext = useCart();

    const totalQuantity = Number(
        cartContext?.totalQuantity ??
        cartContext?.items?.reduce(
            (total, item) =>
                total + Number(item?.quantity || 0),
            0
        ) ??
        0
    );


    // ========================================================
    // WISHLIST
    // ========================================================

    const {
        wishlistCount
    } = useWishlist();

    const safeWishlistCount = Number(
        wishlistCount || 0
    );


    // ========================================================
    // STATE
    // ========================================================

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        mobileMenuOpen,
        setMobileMenuOpen
    ] = useState(false);

    const [
        profileMenuOpen,
        setProfileMenuOpen
    ] = useState(false);

    const profileWrapperRef = useRef(null);


    // ========================================================
    // BRAND LOGO
    // ========================================================

    const LOGO_URL =
        "https://ihjbssbqwknyyzoewrik.supabase.co/storage/v1/object/public/site-assets/branding/logo%20without%20bg.webp";


    // ========================================================
    // ACTIVE ROUTES
    // ========================================================

    const activePath = location.pathname;

    const isHomeActive =
        activePath === "/";

    const isProductsActive =
        activePath === "/products" ||
        activePath.startsWith("/products/");

    const isWishlistActive =
        activePath === "/wishlist";

    const isCartActive =
        activePath === "/cart";

    const isProfileActive =
        activePath === "/profile";

    const isAboutActive =
        activePath === "/about";

    const isContactActive =
        activePath === "/contact";


    // ========================================================
    // NAVIGATION CSS
    // ========================================================

    function navClass(isActive) {

        return [
            "aumveda-nav-link",
            isActive
                ? "aumveda-nav-link--active"
                : ""
        ]
            .filter(Boolean)
            .join(" ");

    }


    // ========================================================
    // CLOSE MENUS
    // ========================================================

    function closeMobileMenu() {
        setMobileMenuOpen(false);
    }

    function closeProfileMenu() {
        setProfileMenuOpen(false);
    }


    // ========================================================
    // SEARCH
    // ========================================================

    function handleSearch(event) {

        event.preventDefault();

        const query = searchText.trim();

        if (!query) {
            return;
        }

        closeMobileMenu();
        closeProfileMenu();

        navigate(
            `/products?search=${encodeURIComponent(query)}`
        );

    }


    // ========================================================
    // WISHLIST NAVIGATION
    // ========================================================

    function handleWishlistClick() {

        closeMobileMenu();
        closeProfileMenu();

        navigate("/wishlist");

    }


    // ========================================================
    // CART NAVIGATION
    // ========================================================

    function handleCartClick() {

        if (authLoading) {
            return;
        }

        closeMobileMenu();
        closeProfileMenu();

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        navigate("/cart");

    }


    // ========================================================
    // PROFILE ICON NAVIGATION
    // ========================================================

    function handleProfileClick() {

        if (authLoading) {
            return;
        }

        closeMobileMenu();
        closeProfileMenu();

        // Guest -> Login
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // Logged-in customer -> Profile
        navigate("/profile");

    }


    // ========================================================
    // ACCOUNT DROPDOWN TOGGLE
    // ========================================================

    function handleAccountMenuToggle() {

        if (authLoading) {
            return;
        }

        if (!isAuthenticated) {

            closeProfileMenu();

            navigate("/login");

            return;
        }

        closeMobileMenu();

        setProfileMenuOpen(
            previous => !previous
        );

    }


    // ========================================================
    // USERNAME CLICK
    // ========================================================

    function handleUsernameClick() {

        closeProfileMenu();
        closeMobileMenu();

        // Navigation is handled by Link to="/profile"

    }


    // ========================================================
    // LOGOUT
    // ========================================================

    async function handleLogout() {

        try {

            await logout();

            closeProfileMenu();
            closeMobileMenu();

            navigate("/", {
                replace: true
            });

        }
        catch (error) {

            console.error(
                "AUMVEDA logout failed:",
                error
            );

        }

    }


    // ========================================================
    // CLOSE MENUS ON ROUTE CHANGE
    // ========================================================

    useEffect(() => {

        setMobileMenuOpen(false);
        setProfileMenuOpen(false);

    }, [
        location.pathname,
        location.hash
    ]);


    // ========================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ========================================================

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                profileWrapperRef.current &&
                !profileWrapperRef.current.contains(
                    event.target
                )
            ) {

                setProfileMenuOpen(false);

            }

        }

        function handleEscape(event) {

            if (event.key === "Escape") {

                setProfileMenuOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // ========================================================
    // CLOSE ACCOUNT MENU AFTER LOGOUT
    // ========================================================

    useEffect(() => {

        if (!isAuthenticated) {

            setProfileMenuOpen(false);

        }

    }, [isAuthenticated]);


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <header className="aumveda-navbar">

            <div className="aumveda-navbar__inner">

                {/* =============================================
                    BRAND
                ============================================= */}

                <Link
                    to="/"
                    className="aumveda-brand"
                    aria-label="AUMVEDA Home"
                    onClick={() => {
                        closeMobileMenu();
                        closeProfileMenu();
                    }}
                >

                    <div className="aumveda-brand-wrapper">

                        <img
                            src={LOGO_URL}
                            alt="AUMVEDA Wellness"
                            className="aumveda-brand__logo"
                        />

                        <span className="aumveda-brand__tagline">
                            Ancient Wisdom • Modern Wellness
                        </span>

                    </div>

                </Link>


                {/* =============================================
                    SEARCH
                ============================================= */}

                <form
                    className="aumveda-search"
                    onSubmit={handleSearch}
                >

                    <Search
                        size={20}
                        strokeWidth={1.75}
                        className="aumveda-search__icon"
                    />

                    <input
                        type="search"
                        value={searchText}
                        onChange={
                            event =>
                                setSearchText(event.target.value)
                        }
                        placeholder="Search Ayurvedic products, herbs & wellness..."
                        aria-label="Search AUMVEDA"
                    />

                    <button
                        type="submit"
                        className="aumveda-search__button"
                    >
                        Search
                    </button>

                </form>


                {/* =============================================
                    DESKTOP NAVIGATION
                ============================================= */}

                <nav
                    className="aumveda-nav-links"
                    aria-label="Main navigation"
                >

                    <Link
                        to="/"
                        className={navClass(isHomeActive)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        className={navClass(isProductsActive)}
                    >
                        Products
                    </Link>

                    <Link
                        to="/about"
                        className={navClass(isAboutActive)}
                    >
                        About
                    </Link>

                    <Link
                        to="/contact"
                        className={navClass(isContactActive)}
                    >
                        Contact
                    </Link>

                </nav>


                {/* =============================================
                    ACTIONS
                ============================================= */}

                <div className="aumveda-navbar__actions">

                    {/* =========================================
                        WISHLIST
                    ========================================= */}

                    <button
                        type="button"
                        className={`aumveda-action ${
                            isWishlistActive
                                ? "aumveda-action--active"
                                : ""
                        }`}
                        onClick={handleWishlistClick}
                        aria-label={
                            safeWishlistCount > 0
                                ? `Wishlist with ${safeWishlistCount} items`
                                : "Wishlist"
                        }
                        title="Wishlist"
                    >

                        <span className="aumveda-action__icon-shell">

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
                                safeWishlistCount > 0 && (

                                    <span className="aumveda-action__badge">

                                        {
                                            safeWishlistCount > 99
                                                ? "99+"
                                                : safeWishlistCount
                                        }

                                    </span>

                                )
                            }

                        </span>

                        <span className="aumveda-action__label">
                            Wishlist
                        </span>

                    </button>


                    {/* =========================================
                        CART
                    ========================================= */}

                    <button
                        type="button"
                        className={`aumveda-action ${
                            isCartActive
                                ? "aumveda-action--active"
                                : ""
                        }`}
                        onClick={handleCartClick}
                        aria-label={
                            totalQuantity > 0
                                ? `Cart with ${totalQuantity} items`
                                : "Cart"
                        }
                        title="Cart"
                        disabled={authLoading}
                    >

                        <span className="aumveda-action__icon-shell">

                            <ShoppingCart
                                size={20}
                                strokeWidth={1.7}
                            />

                            {
                                totalQuantity > 0 && (

                                    <span className="aumveda-action__badge">

                                        {
                                            totalQuantity > 99
                                                ? "99+"
                                                : totalQuantity
                                        }

                                    </span>

                                )
                            }

                        </span>

                        <span className="aumveda-action__label">
                            Cart
                        </span>

                    </button>


                    {/* =========================================
                        PROFILE + ACCOUNT DROPDOWN
                    ========================================= */}

                    <div
                        className="aumveda-profile-wrapper"
                        ref={profileWrapperRef}
                    >

                        <div className="aumveda-profile-actions">

                            {/* PROFILE ICON */}

                            <button
                                type="button"
                                className={`aumveda-action ${
                                    isProfileActive
                                        ? "aumveda-action--active"
                                        : ""
                                }`}
                                onClick={handleProfileClick}
                                aria-label={
                                    isAuthenticated
                                        ? "Open my profile"
                                        : "Log in to my account"
                                }
                                title={
                                    isAuthenticated
                                        ? "My Profile"
                                        : "Login"
                                }
                                disabled={authLoading}
                            >

                                <span className="aumveda-action__icon-shell">

                                    <UserRound
                                        size={20}
                                        strokeWidth={1.7}
                                    />

                                </span>

                                <span className="aumveda-action__label">

                                    {
                                        isAuthenticated
                                            ? "Account"
                                            : "Profile"
                                    }

                                </span>

                            </button>


                            {/* SEPARATE DROPDOWN ARROW */}

                            {
                                isAuthenticated && (

                                    <button
                                        type="button"
                                        className="aumveda-profile-dropdown-toggle"
                                        onClick={handleAccountMenuToggle}
                                        aria-label="Toggle account dropdown"
                                        aria-haspopup="menu"
                                        aria-expanded={profileMenuOpen}
                                        aria-controls="aumveda-account-menu"
                                        disabled={authLoading}
                                        title="Account menu"
                                    >

                                        <ChevronDown
                                            size={16}
                                            strokeWidth={1.9}
                                            className={
                                                profileMenuOpen
                                                    ? "aumveda-profile-chevron--open"
                                                    : ""
                                            }
                                        />

                                    </button>

                                )
                            }

                        </div>


                        {/* =====================================
                            PROFILE DROPDOWN
                        ===================================== */}

                        {
                            isAuthenticated &&
                            profileMenuOpen && (

                                <div
                                    id="aumveda-account-menu"
                                    className="aumveda-profile-menu"
                                    role="menu"
                                    aria-label="Account menu"
                                >

                                    <div className="aumveda-profile-menu__header">

                                        <div className="aumveda-profile-menu__avatar">

                                            <UserRound size={18} />

                                        </div>


                                        <div className="aumveda-profile-menu__user">

                                            <Link
                                                to="/profile"
                                                onClick={handleUsernameClick}
                                                className="aumveda-profile-menu__name"
                                                role="menuitem"
                                                title="Open my profile"
                                            >

                                                {
                                                    displayName ||
                                                    user?.email?.split("@")[0] ||
                                                    "My Profile"
                                                }

                                            </Link>

                                            <span>
                                                {user?.email}
                                            </span>

                                        </div>

                                    </div>


                                    {/* PROFILE MENU ITEM */}

                                    <Link
                                        to="/profile"
                                        onClick={handleUsernameClick}
                                        className="aumveda-profile-menu__profile-link"
                                        role="menuitem"
                                    >

                                        <UserRound size={16} />

                                        <span>
                                            My Profile
                                        </span>

                                    </Link>


                                    <div className="aumveda-profile-menu__divider" />


                                    {/* LOGOUT */}

                                    <button
                                        type="button"
                                        className="aumveda-profile-menu__logout"
                                        onClick={handleLogout}
                                        role="menuitem"
                                    >

                                        <LogOut size={16} />

                                        <span>
                                            Logout
                                        </span>

                                    </button>

                                </div>

                            )
                        }

                    </div>


                    {/* =========================================
                        MOBILE MENU BUTTON
                    ========================================= */}

                    <button
                        type="button"
                        className="aumveda-mobile-toggle"
                        aria-label="Toggle Menu"
                        aria-expanded={mobileMenuOpen}
                        onClick={() =>
                            setMobileMenuOpen(
                                previous => !previous
                            )
                        }
                    >

                        {
                            mobileMenuOpen
                                ? <X size={23} />
                                : <Menu size={23} />
                        }

                    </button>

                </div>

            </div>


            {/* ================================================
                MOBILE NAVIGATION
            ================================================ */}

            {
                mobileMenuOpen && (

                    <nav
                        className="aumveda-mobile-nav"
                        aria-label="Mobile navigation"
                    >

                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                        >
                            Home
                        </Link>


                        <Link
                            to="/products"
                            onClick={closeMobileMenu}
                        >
                            Products
                        </Link>


                        <button
                            type="button"
                            onClick={handleWishlistClick}
                        >

                            Wishlist

                            {
                                safeWishlistCount > 0 && (

                                    <span>
                                        {safeWishlistCount}
                                    </span>

                                )
                            }

                        </button>


                        <button
                            type="button"
                            onClick={handleCartClick}
                        >

                            Cart

                            {
                                totalQuantity > 0 && (

                                    <span>
                                        {totalQuantity}
                                    </span>

                                )
                            }

                        </button>


                        {/* PROFILE IN MOBILE */}

                        <button
                            type="button"
                            onClick={handleProfileClick}
                            disabled={authLoading}
                        >

                            {
                                isAuthenticated
                                    ? "My Profile"
                                    : "Login / Profile"
                            }

                        </button>


                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
                        >
                            About
                        </Link>


                        <Link
                            to="/contact"
                            onClick={closeMobileMenu}
                        >
                            Contact
                        </Link>


                        {
                            isAuthenticated && (

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>

                            )
                        }

                    </nav>

                )
            }

        </header>

    );

}

export default Navbar;
