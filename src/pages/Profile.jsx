import {
    useEffect,
    useState
} from "react";

import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    Edit3,
    Heart,
    Home,
    LogOut,
    Mail,
    MapPin,
    Package,
    Pencil,
    Phone,
    Plus,
    Save,
    ShoppingBag,
    Star,
    Trash2,
    UserRound,
    X
} from "lucide-react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import {
    useWishlist
} from "../context/WishlistContext";

import {
    useCart
} from "../context/CartContext";

import {
    getCustomerProfile,
    updateCustomerProfile
} from "../services/profileService";

import {
    createCustomerAddress,
    deleteCustomerAddress,
    getCustomerAddresses,
    setDefaultAddress,
    updateCustomerAddress
} from "../services/addressService";

import "../styles/profile.css";


const EMPTY_ADDRESS_FORM = {
    label: "Home",
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false
};


/* ============================================================
   PROFILE PAGE
============================================================ */

function Profile() {

    const navigate =
        useNavigate();


    /* ========================================================
       AUTH
    ======================================================== */

    const {
        user,
        loading: authLoading,
        isAuthenticated,
        logout,
        refreshUser
    } =
        useAuth();


    /* ========================================================
       CONTEXTS
    ======================================================== */

    const wishlistContext =
        useWishlist();


    const cartContext =
        useCart();


    /* ========================================================
       PROFILE STATE
    ======================================================== */

    const [
        profile,
        setProfile
    ] = useState(null);


    const [
        profileLoading,
        setProfileLoading
    ] = useState(true);


    const [
        editing,
        setEditing
    ] = useState(false);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        loggingOut,
        setLoggingOut
    ] = useState(false);


    const [
        successMessage,
        setSuccessMessage
    ] = useState("");


    const [
        errorMessage,
        setErrorMessage
    ] = useState("");


    /* ========================================================
       PROFILE FORM
    ======================================================== */

    const [
        formData,
        setFormData
    ] = useState({
        fullName: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        marketingOptIn: false
    });


    /* ========================================================
       ADDRESS STATE
    ======================================================== */

    const [
        addresses,
        setAddresses
    ] = useState([]);


    const [
        addressesLoading,
        setAddressesLoading
    ] = useState(true);


    const [
        addressFormOpen,
        setAddressFormOpen
    ] = useState(false);


    const [
        editingAddressId,
        setEditingAddressId
    ] = useState(null);


    const [
        addressSaving,
        setAddressSaving
    ] = useState(false);


    const [
        addressActionId,
        setAddressActionId
    ] = useState(null);


    const [
        addressError,
        setAddressError
    ] = useState("");


    const [
        addressSuccess,
        setAddressSuccess
    ] = useState("");


    const [
        addressForm,
        setAddressForm
    ] = useState(
        EMPTY_ADDRESS_FORM
    );


    /* ========================================================
       COUNTS
    ======================================================== */

    const wishlistCount =
        Number(
            wishlistContext?.wishlistCount ??
            wishlistContext?.wishlistIds?.length ??
            0
        );


    const cartCount =
        Number(
            cartContext?.totalQuantity ??
            cartContext?.cartItems?.reduce(
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
       LOAD PROFILE
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


        async function loadProfile() {

            try {

                const data =
                    await getCustomerProfile(
                        user.id
                    );


                if (cancelled) {

                    return;

                }


                setProfile(
                    data
                );


                setFormData({
                    fullName:
                        data?.full_name ||
                        user?.user_metadata?.full_name ||
                        "",

                    phone:
                        data?.phone ||
                        "",

                    dateOfBirth:
                        data?.date_of_birth ||
                        "",

                    gender:
                        data?.gender ||
                        "",

                    marketingOptIn:
                        Boolean(
                            data?.marketing_opt_in
                        )
                });


                setErrorMessage("");

            }
            catch (error) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Profile loading failed:",
                    error
                );


                setErrorMessage(
                    error?.message ||
                    "Unable to load your profile."
                );

            }
            finally {

                if (!cancelled) {

                    setProfileLoading(
                        false
                    );

                }

            }

        }


        loadProfile();


        return () => {

            cancelled =
                true;

        };

    }, [
        authLoading,
        user?.id,
        user?.user_metadata?.full_name
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

                const data =
                    await getCustomerAddresses(
                        user.id
                    );


                if (cancelled) {

                    return;

                }


                setAddresses(
                    Array.isArray(data)
                        ? data
                        : []
                );


                setAddressError("");

            }
            catch (error) {

                if (cancelled) {

                    return;

                }


                console.error(
                    "Address loading failed:",
                    error
                );


                setAddressError(
                    error?.message ||
                    "Unable to load saved addresses."
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
       DERIVED PROFILE VALUES
    ======================================================== */

    const displayName =
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "AUMVEDA Customer";


    const defaultAddress =
        addresses.find(
            address =>
                address.is_default
        ) ||
        addresses[0] ||
        null;


    const nameParts =
        displayName
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    let initials =
        "A";


    if (
        nameParts.length === 1
    ) {

        initials =
            nameParts[0]
                .slice(0, 2)
                .toUpperCase();

    }
    else if (
        nameParts.length > 1
    ) {

        initials =
            (
                nameParts[0][0] +
                nameParts[
                    nameParts.length - 1
                ][0]
            ).toUpperCase();

    }


    const memberDateValue =
        profile?.created_at ||
        user?.created_at;


    let memberSince =
        "AUMVEDA Member";


    if (memberDateValue) {

        const memberDate =
            new Date(
                memberDateValue
            );


        if (
            !Number.isNaN(
                memberDate.getTime()
            )
        ) {

            memberSince =
                memberDate.toLocaleDateString(
                    "en-IN",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );

        }

    }


    /* ========================================================
       HELPERS
    ======================================================== */

    function formatDate(
        value
    ) {

        if (!value) {

            return "Not provided";

        }


        const date =
            new Date(
                `${value}T00:00:00`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    function validatePhone(
        value
    ) {

        const cleanPhone =
            String(
                value || ""
            ).trim();


        if (!cleanPhone) {

            return true;

        }


        return /^[0-9+\-\s()]{7,20}$/
            .test(
                cleanPhone
            );

    }


    /* ========================================================
       PROFILE EDIT
    ======================================================== */

    function handleStartEdit() {

        setFormData({
            fullName:
                profile?.full_name ||
                displayName ||
                "",

            phone:
                profile?.phone ||
                "",

            dateOfBirth:
                profile?.date_of_birth ||
                "",

            gender:
                profile?.gender ||
                "",

            marketingOptIn:
                Boolean(
                    profile?.marketing_opt_in
                )
        });


        setErrorMessage("");

        setSuccessMessage("");

        setEditing(
            true
        );

    }


    function handleCancelEdit() {

        setErrorMessage("");

        setEditing(
            false
        );

    }


    function handleChange(
        event
    ) {

        const {
            name,
            value,
            type,
            checked
        } =
            event.target;


        setFormData(
            previous => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value
            })
        );

    }


    async function handleSave(
        event
    ) {

        event.preventDefault();


        if (
            saving ||
            !user?.id
        ) {

            return;

        }


        const cleanName =
            formData
                .fullName
                .trim();


        if (!cleanName) {

            setErrorMessage(
                "Please enter your full name."
            );

            return;

        }


        if (
            !validatePhone(
                formData.phone
            )
        ) {

            setErrorMessage(
                "Please enter a valid phone number."
            );

            return;

        }


        try {

            setSaving(
                true
            );


            setErrorMessage("");

            setSuccessMessage("");


            const updated =
                await updateCustomerProfile({
                    userId:
                        user.id,

                    fullName:
                        cleanName,

                    phone:
                        formData.phone,

                    dateOfBirth:
                        formData.dateOfBirth,

                    gender:
                        formData.gender,

                    marketingOptIn:
                        formData.marketingOptIn
                });


            if (
                typeof refreshUser ===
                "function"
            ) {

                await refreshUser();

            }


            setProfile(
                updated
            );


            setFormData({
                fullName:
                    updated?.full_name ||
                    cleanName,

                phone:
                    updated?.phone ||
                    "",

                dateOfBirth:
                    updated?.date_of_birth ||
                    "",

                gender:
                    updated?.gender ||
                    "",

                marketingOptIn:
                    Boolean(
                        updated?.marketing_opt_in
                    )
            });


            setEditing(
                false
            );


            setSuccessMessage(
                "Your profile has been updated successfully."
            );

        }
        catch (error) {

            console.error(
                "Profile save failed:",
                error
            );


            setErrorMessage(
                error?.message ||
                "Unable to save your profile."
            );

        }
        finally {

            setSaving(
                false
            );

        }

    }


    /* ========================================================
       REFRESH ADDRESSES
    ======================================================== */

    async function refreshAddresses() {

        if (!user?.id) {

            return [];

        }


        const data =
            await getCustomerAddresses(
                user.id
            );


        const normalized =
            Array.isArray(data)
                ? data
                : [];


        setAddresses(
            normalized
        );


        return normalized;

    }


    /* ========================================================
       ADD ADDRESS
    ======================================================== */

    function handleAddAddress() {

        setEditingAddressId(
            null
        );


        setAddressForm({
            ...EMPTY_ADDRESS_FORM,

            recipientName:
                profile?.full_name ||
                displayName ||
                "",

            phone:
                profile?.phone ||
                "",

            isDefault:
                addresses.length === 0
        });


        setAddressError("");

        setAddressSuccess("");

        setAddressFormOpen(
            true
        );

    }


    /* ========================================================
       EDIT ADDRESS
    ======================================================== */

    function handleEditAddress(
        address
    ) {

        setEditingAddressId(
            address.id
        );


        setAddressForm({
            label:
                address.label ||
                "Home",

            recipientName:
                address.recipient_name ||
                "",

            phone:
                address.phone ||
                "",

            addressLine1:
                address.address_line1 ||
                "",

            addressLine2:
                address.address_line2 ||
                "",

            city:
                address.city ||
                "",

            state:
                address.state ||
                "",

            postalCode:
                address.postal_code ||
                "",

            country:
                address.country ||
                "India",

            isDefault:
                Boolean(
                    address.is_default
                )
        });


        setAddressError("");

        setAddressSuccess("");

        setAddressFormOpen(
            true
        );

    }


    function handleAddressChange(
        event
    ) {

        const {
            name,
            value,
            type,
            checked
        } =
            event.target;


        let nextValue =
            type === "checkbox"
                ? checked
                : value;


        if (
            name === "postalCode"
        ) {

            nextValue =
                value
                    .replace(
                        /\D/g,
                        ""
                    )
                    .slice(
                        0,
                        6
                    );

        }


        setAddressForm(
            previous => ({
                ...previous,

                [name]:
                    nextValue
            })
        );

    }


    function handleCloseAddressForm() {

        if (addressSaving) {

            return;

        }


        setAddressFormOpen(
            false
        );


        setEditingAddressId(
            null
        );


        setAddressError("");

    }


    /* ========================================================
       SAVE ADDRESS
    ======================================================== */

    async function handleAddressSave(
        event
    ) {

        event.preventDefault();


        if (
            addressSaving ||
            !user?.id
        ) {

            return;

        }


        if (
            !addressForm
                .recipientName
                .trim()
        ) {

            setAddressError(
                "Recipient name is required."
            );

            return;

        }


        if (
            !addressForm
                .phone
                .trim()
        ) {

            setAddressError(
                "Phone number is required."
            );

            return;

        }


        if (
            !validatePhone(
                addressForm.phone
            )
        ) {

            setAddressError(
                "Please enter a valid phone number."
            );

            return;

        }


        if (
            !addressForm
                .addressLine1
                .trim()
        ) {

            setAddressError(
                "Address line 1 is required."
            );

            return;

        }


        if (
            !addressForm
                .city
                .trim()
        ) {

            setAddressError(
                "City is required."
            );

            return;

        }


        if (
            !addressForm
                .state
                .trim()
        ) {

            setAddressError(
                "State is required."
            );

            return;

        }


        if (
            !/^\d{6}$/.test(
                addressForm
                    .postalCode
                    .trim()
            )
        ) {

            setAddressError(
                "Please enter a valid 6-digit PIN code."
            );

            return;

        }


        try {

            setAddressSaving(
                true
            );


            setAddressError("");

            setAddressSuccess("");


            const isEditing =
                Boolean(
                    editingAddressId
                );


            const payload = {
                customerId:
                    user.id,

                label:
                    addressForm
                        .label
                        .trim() ||
                    "Home",

                recipientName:
                    addressForm
                        .recipientName
                        .trim(),

                phone:
                    addressForm
                        .phone
                        .trim(),

                addressLine1:
                    addressForm
                        .addressLine1
                        .trim(),

                addressLine2:
                    addressForm
                        .addressLine2
                        .trim(),

                city:
                    addressForm
                        .city
                        .trim(),

                state:
                    addressForm
                        .state
                        .trim(),

                postalCode:
                    addressForm
                        .postalCode
                        .trim(),

                country:
                    addressForm
                        .country
                        .trim() ||
                    "India",

                isDefault:
                    addresses.length === 0
                        ? true
                        : addressForm.isDefault
            };


            if (isEditing) {

                await updateCustomerAddress({
                    addressId:
                        editingAddressId,

                    ...payload
                });

            }
            else {

                await createCustomerAddress(
                    payload
                );

            }


            await refreshAddresses();


            setAddressFormOpen(
                false
            );


            setEditingAddressId(
                null
            );


            setAddressSuccess(
                isEditing
                    ? "Address updated successfully."
                    : "Address added successfully."
            );

        }
        catch (error) {

            console.error(
                "Address save failed:",
                error
            );


            setAddressError(
                error?.message ||
                "Unable to save address."
            );

        }
        finally {

            setAddressSaving(
                false
            );

        }

    }


    /* ========================================================
       SET DEFAULT ADDRESS
    ======================================================== */

    async function handleSetDefault(
        address
    ) {

        if (
            !user?.id ||
            address.is_default ||
            addressActionId
        ) {

            return;

        }


        try {

            setAddressActionId(
                address.id
            );


            setAddressError("");

            setAddressSuccess("");


            await setDefaultAddress(
                address.id,
                user.id
            );


            await refreshAddresses();


            setAddressSuccess(
                "Default delivery address updated."
            );

        }
        catch (error) {

            console.error(
                "Set default address failed:",
                error
            );


            setAddressError(
                error?.message ||
                "Unable to set default address."
            );

        }
        finally {

            setAddressActionId(
                null
            );

        }

    }


    /* ========================================================
       DELETE ADDRESS
    ======================================================== */

    async function handleDeleteAddress(
        address
    ) {

        if (
            !user?.id ||
            addressActionId
        ) {

            return;

        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this address?"
            );


        if (!confirmed) {

            return;

        }


        try {

            setAddressActionId(
                address.id
            );


            setAddressError("");

            setAddressSuccess("");


            const wasDefault =
                Boolean(
                    address.is_default
                );


            await deleteCustomerAddress(
                address.id,
                user.id
            );


            let refreshed =
                await getCustomerAddresses(
                    user.id
                );


            refreshed =
                Array.isArray(
                    refreshed
                )
                    ? refreshed
                    : [];


            if (
                wasDefault &&
                refreshed.length > 0 &&
                !refreshed.some(
                    item =>
                        item.is_default
                )
            ) {

                await setDefaultAddress(
                    refreshed[0].id,
                    user.id
                );


                refreshed =
                    await getCustomerAddresses(
                        user.id
                    );


                refreshed =
                    Array.isArray(
                        refreshed
                    )
                        ? refreshed
                        : [];

            }


            setAddresses(
                refreshed
            );


            setAddressSuccess(
                "Address deleted successfully."
            );

        }
        catch (error) {

            console.error(
                "Address deletion failed:",
                error
            );


            setAddressError(
                error?.message ||
                "Unable to delete address."
            );

        }
        finally {

            setAddressActionId(
                null
            );

        }

    }


    /* ========================================================
       LOGOUT
    ======================================================== */

    async function handleLogout() {

        if (loggingOut) {

            return;

        }


        try {

            setLoggingOut(
                true
            );


            await logout();


            navigate(
                "/",
                {
                    replace: true
                }
            );

        }
        catch (error) {

            console.error(
                "Logout failed:",
                error
            );


            setErrorMessage(
                error?.message ||
                "Unable to sign out."
            );

        }
        finally {

            setLoggingOut(
                false
            );

        }

    }


    /* ========================================================
       ADDRESS ICON
    ======================================================== */

    function renderAddressIcon(
        label
    ) {

        const normalized =
            String(
                label || ""
            )
                .trim()
                .toLowerCase();


        if (
            normalized === "work" ||
            normalized === "office"
        ) {

            return (
                <BriefcaseBusiness
                    size={17}
                />
            );

        }


        return (
            <Home
                size={17}
            />
        );

    }


    /* ========================================================
       AUTH LOADING
    ======================================================== */

    if (authLoading) {

        return (

            <main
                className="
                    profile-page
                    profile-page--state
                "
            >

                <div
                    className="
                        profile-state-card
                    "
                >

                    <div
                        className="
                            profile-loading-ring
                        "
                    />


                    <p>
                        Loading your AUMVEDA profile...
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       NOT AUTHENTICATED
    ======================================================== */

    if (!isAuthenticated) {

        return (

            <main
                className="
                    profile-page
                    profile-page--state
                "
            >

                <div
                    className="
                        profile-state-card
                    "
                >

                    <div
                        className="
                            profile-state-card__icon
                        "
                    >

                        <UserRound
                            size={26}
                        />

                    </div>


                    <h1>
                        Sign in to access your profile
                    </h1>


                    <p>
                        Sign in to manage your personal
                        information and AUMVEDA account.
                    </p>


                    <Link
                        to="/login"
                        className="
                            profile-state-card__button
                        "
                    >

                        Sign In

                        <ArrowRight
                            size={15}
                        />

                    </Link>

                </div>

            </main>

        );

    }


    /* ========================================================
       PROFILE LOADING
    ======================================================== */

    if (profileLoading) {

        return (

            <main
                className="
                    profile-page
                    profile-page--state
                "
            >

                <div
                    className="
                        profile-state-card
                    "
                >

                    <div
                        className="
                            profile-loading-ring
                        "
                    />


                    <p>
                        Loading your AUMVEDA profile...
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================================
       MAIN PAGE
    ======================================================== */

    return (

        <main
            className="
                profile-page
            "
        >

            <div
                className="
                    profile-page__orb
                    profile-page__orb--one
                "
            />


            <div
                className="
                    profile-page__orb
                    profile-page__orb--two
                "
            />


            <div
                className="
                    profile-container
                "
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <header
                    className="
                        profile-page__header
                    "
                >

                    <span
                        className="
                            profile-page__eyebrow-text
                        "
                    >
                        YOUR AUMVEDA ACCOUNT
                    </span>


                    <h1>
                        My Profile
                    </h1>


                    <p>
                        Manage your personal information,
                        saved delivery addresses and
                        AUMVEDA account details.
                    </p>

                </header>


                {/* =================================================
                    GLOBAL MESSAGES
                ================================================= */}

                {
                    successMessage && (

                        <div
                            className="
                                profile-global-message
                                profile-global-message--success
                            "
                        >

                            <Check
                                size={16}
                            />

                            {successMessage}

                        </div>

                    )
                }


                {
                    errorMessage && (

                        <div
                            className="
                                profile-global-message
                                profile-global-message--error
                            "
                        >
                            {errorMessage}
                        </div>

                    )
                }


                {/* =================================================
                    PROFILE LAYOUT
                ================================================= */}

                <section
                    className="
                        profile-layout
                    "
                >

                    {/* =================================================
                        LEFT PROFILE CARD
                    ================================================= */}

                    <aside
                        className="
                            profile-identity-card
                        "
                    >

                        <div
                            className="
                                profile-avatar-shell
                            "
                        >

                            {
                                profile?.avatar_url
                                    ? (

                                        <img
                                            src={
                                                profile.avatar_url
                                            }
                                            alt={
                                                displayName
                                            }
                                            className="
                                                profile-avatar-image
                                            "
                                        />

                                    )
                                    : (

                                        <div
                                            className="
                                                profile-avatar
                                            "
                                        >
                                            {initials}
                                        </div>

                                    )
                            }


                            {
                                profile?.is_active && (

                                    <span
                                        className="
                                            profile-avatar__status
                                        "
                                    >

                                        <Check
                                            size={11}
                                        />

                                    </span>

                                )
                            }

                        </div>


                        <h2>
                            {displayName}
                        </h2>


                        <p
                            className="
                                profile-identity-card__email
                            "
                        >
                            {user?.email}
                        </p>


                        <div
                            className="
                                profile-member-chip
                            "
                        >

                            <CalendarDays
                                size={13}
                            />

                            Member since {
                                memberSince
                            }

                        </div>


                        <div
                            className="
                                profile-identity-card__divider
                            "
                        />


                        <div
                            className="
                                profile-quick-links
                            "
                        >

                            <Link
                                to="/wishlist"
                                className="
                                    profile-quick-link
                                "
                            >

                                <span
                                    className="
                                        profile-quick-link__icon
                                    "
                                >

                                    <Heart
                                        size={16}
                                    />

                                </span>


                                <span
                                    className="
                                        profile-quick-link__content
                                    "
                                >

                                    <strong>
                                        Wishlist
                                    </strong>

                                    <small>
                                        {wishlistCount} saved items
                                    </small>

                                </span>


                                <ArrowRight
                                    size={14}
                                />

                            </Link>


                            <Link
                                to="/cart"
                                className="
                                    profile-quick-link
                                "
                            >

                                <span
                                    className="
                                        profile-quick-link__icon
                                    "
                                >

                                    <ShoppingBag
                                        size={16}
                                    />

                                </span>


                                <span
                                    className="
                                        profile-quick-link__content
                                    "
                                >

                                    <strong>
                                        Cart
                                    </strong>

                                    <small>
                                        {cartCount} items
                                    </small>

                                </span>


                                <ArrowRight
                                    size={14}
                                />

                            </Link>


                            <Link
                                to="/products"
                                className="
                                    profile-quick-link
                                "
                            >

                                <span
                                    className="
                                        profile-quick-link__icon
                                    "
                                >

                                    <Package
                                        size={16}
                                    />

                                </span>


                                <span
                                    className="
                                        profile-quick-link__content
                                    "
                                >

                                    <strong>
                                        Products
                                    </strong>

                                    <small>
                                        Continue shopping
                                    </small>

                                </span>


                                <ArrowRight
                                    size={14}
                                />

                            </Link>

                        </div>


                        <button
                            type="button"
                            className="
                                profile-logout-button
                            "
                            onClick={
                                handleLogout
                            }
                            disabled={
                                loggingOut
                            }
                        >

                            <LogOut
                                size={16}
                            />


                            {
                                loggingOut
                                    ? "Signing Out..."
                                    : "Sign Out"
                            }

                        </button>

                    </aside>


                    {/* =================================================
                        RIGHT CONTENT
                    ================================================= */}

                    <div
                        className="
                            profile-main
                        "
                    >

                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <article
                            className="
                                profile-card
                            "
                        >

                            <div
                                className="
                                    profile-card__header
                                "
                            >

                                <div>

                                    <span
                                        className="
                                            profile-card__label
                                        "
                                    >
                                        PERSONAL DETAILS
                                    </span>


                                    <h2>
                                        Personal Information
                                    </h2>

                                </div>


                                {
                                    !editing && (

                                        <button
                                            type="button"
                                            className="
                                                profile-edit-button
                                            "
                                            onClick={
                                                handleStartEdit
                                            }
                                        >

                                            <Edit3
                                                size={15}
                                            />

                                            Edit Profile

                                        </button>

                                    )
                                }

                            </div>


                            {
                                !editing
                                    ? (

                                        <div
                                            className="
                                                profile-information-grid
                                            "
                                        >

                                            <InfoItem
                                                label="Full Name"
                                                value={
                                                    displayName
                                                }
                                            />


                                            <InfoItem
                                                label="Email Address"
                                                value={
                                                    user?.email ||
                                                    "Not available"
                                                }
                                            />


                                            <InfoItem
                                                label="Phone Number"
                                                value={
                                                    profile?.phone ||
                                                    "Not provided"
                                                }
                                            />


                                            <InfoItem
                                                label="Date of Birth"
                                                value={
                                                    formatDate(
                                                        profile?.date_of_birth
                                                    )
                                                }
                                            />


                                            <InfoItem
                                                label="Gender"
                                                value={
                                                    profile?.gender
                                                        ? profile.gender.replaceAll(
                                                            "_",
                                                            " "
                                                        )
                                                        : "Not provided"
                                                }
                                                className="
                                                    profile-capitalize
                                                "
                                            />


                                            <div
                                                className="
                                                    profile-information-item
                                                "
                                            >

                                                <span>
                                                    Account Status
                                                </span>


                                                <strong
                                                    className={
                                                        profile?.is_active
                                                            ? "profile-status profile-status--active"
                                                            : "profile-status profile-status--inactive"
                                                    }
                                                >

                                                    {
                                                        profile?.is_active
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </strong>

                                            </div>


                                            <InfoItem
                                                label="Wellness Updates"
                                                value={
                                                    profile?.marketing_opt_in
                                                        ? "Subscribed"
                                                        : "Not subscribed"
                                                }
                                                wide
                                            />

                                        </div>

                                    )
                                    : (

                                        <form
                                            className="
                                                profile-form
                                            "
                                            onSubmit={
                                                handleSave
                                            }
                                        >

                                            <ProfileField
                                                label="Full Name"
                                                htmlFor="profile-full-name"
                                            >

                                                <UserRound
                                                    size={17}
                                                />

                                                <input
                                                    id="profile-full-name"
                                                    name="fullName"
                                                    type="text"
                                                    value={
                                                        formData.fullName
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Enter full name"
                                                    autoComplete="name"
                                                />

                                            </ProfileField>


                                            <ProfileField
                                                label="Email Address"
                                                htmlFor="profile-email"
                                                readOnly
                                            >

                                                <Mail
                                                    size={17}
                                                />

                                                <input
                                                    id="profile-email"
                                                    type="email"
                                                    value={
                                                        user?.email ||
                                                        ""
                                                    }
                                                    readOnly
                                                />

                                            </ProfileField>


                                            <ProfileField
                                                label="Phone Number"
                                                htmlFor="profile-phone"
                                            >

                                                <Phone
                                                    size={17}
                                                />

                                                <input
                                                    id="profile-phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={
                                                        formData.phone
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Enter phone number"
                                                    autoComplete="tel"
                                                />

                                            </ProfileField>


                                            <ProfileField
                                                label="Date of Birth"
                                                htmlFor="profile-date-of-birth"
                                            >

                                                <CalendarDays
                                                    size={17}
                                                />

                                                <input
                                                    id="profile-date-of-birth"
                                                    name="dateOfBirth"
                                                    type="date"
                                                    value={
                                                        formData.dateOfBirth
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </ProfileField>


                                            <ProfileField
                                                label="Gender"
                                                htmlFor="profile-gender"
                                            >

                                                <UserRound
                                                    size={17}
                                                />

                                                <select
                                                    id="profile-gender"
                                                    name="gender"
                                                    value={
                                                        formData.gender
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                >

                                                    <option value="">
                                                        Select gender
                                                    </option>

                                                    <option value="male">
                                                        Male
                                                    </option>

                                                    <option value="female">
                                                        Female
                                                    </option>

                                                    <option value="other">
                                                        Other
                                                    </option>

                                                    <option value="prefer_not_to_say">
                                                        Prefer not to say
                                                    </option>

                                                </select>

                                            </ProfileField>


                                            <div
                                                className="
                                                    profile-field
                                                    profile-field--marketing
                                                "
                                            >

                                                <label
                                                    className="
                                                        profile-checkbox
                                                    "
                                                >

                                                    <input
                                                        type="checkbox"
                                                        name="marketingOptIn"
                                                        checked={
                                                            formData.marketingOptIn
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />


                                                    <span
                                                        className="
                                                            profile-checkbox__box
                                                        "
                                                    >

                                                        <Check
                                                            size={13}
                                                        />

                                                    </span>


                                                    <span
                                                        className="
                                                            profile-checkbox__content
                                                        "
                                                    >

                                                        <strong>
                                                            Wellness Updates
                                                        </strong>


                                                        <small>
                                                            Receive product updates,
                                                            wellness information
                                                            and AUMVEDA offers.
                                                        </small>

                                                    </span>

                                                </label>

                                            </div>


                                            <div
                                                className="
                                                    profile-form__actions
                                                "
                                            >

                                                <button
                                                    type="button"
                                                    className="
                                                        profile-cancel-button
                                                    "
                                                    onClick={
                                                        handleCancelEdit
                                                    }
                                                    disabled={
                                                        saving
                                                    }
                                                >

                                                    <X
                                                        size={15}
                                                    />

                                                    Cancel

                                                </button>


                                                <button
                                                    type="submit"
                                                    className="
                                                        profile-save-button
                                                    "
                                                    disabled={
                                                        saving
                                                    }
                                                >

                                                    <Save
                                                        size={15}
                                                    />


                                                    {
                                                        saving
                                                            ? "Saving..."
                                                            : "Save Changes"
                                                    }

                                                </button>

                                            </div>

                                        </form>

                                    )
                            }

                        </article>


                        {/* =================================================
                            SAVED ADDRESSES
                        ================================================= */}

                        <article
                            className="
                                profile-card
                                profile-address-section
                            "
                        >

                            <div
                                className="
                                    profile-card__header
                                    profile-address-header
                                "
                            >

                                <div>

                                    <span
                                        className="
                                            profile-card__label
                                        "
                                    >
                                        DELIVERY DETAILS
                                    </span>


                                    <h2>
                                        Saved Addresses
                                    </h2>


                                    <p
                                        className="
                                            profile-address-header__description
                                        "
                                    >
                                        Manage the addresses used
                                        for your AUMVEDA orders.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="
                                        profile-add-address-button
                                    "
                                    onClick={
                                        handleAddAddress
                                    }
                                >

                                    <Plus
                                        size={16}
                                    />

                                    Add New Address

                                </button>

                            </div>


                            {
                                addressSuccess && (

                                    <div
                                        className="
                                            profile-address-message
                                            profile-address-message--success
                                        "
                                    >

                                        <Check
                                            size={15}
                                        />

                                        {addressSuccess}

                                    </div>

                                )
                            }


                            {
                                addressError &&
                                !addressFormOpen && (

                                    <div
                                        className="
                                            profile-address-message
                                            profile-address-message--error
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
                                                profile-address-loading
                                            "
                                        >

                                            <div
                                                className="
                                                    profile-address-loading__spinner
                                                "
                                            />

                                            Loading saved addresses...

                                        </div>

                                    )
                                    : addresses.length === 0
                                        ? (

                                            <div
                                                className="
                                                    profile-address-empty
                                                "
                                            >

                                                <div
                                                    className="
                                                        profile-address-empty__icon
                                                    "
                                                >

                                                    <MapPin
                                                        size={24}
                                                    />

                                                </div>


                                                <h3>
                                                    No saved address yet
                                                </h3>


                                                <p>
                                                    Add your delivery
                                                    address now so
                                                    checkout is faster.
                                                </p>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleAddAddress
                                                    }
                                                >

                                                    <Plus
                                                        size={15}
                                                    />

                                                    Add Your First Address

                                                </button>

                                            </div>

                                        )
                                        : (

                                            <div
                                                className="
                                                    profile-address-list
                                                "
                                            >

                                                {
                                                    addresses.map(
                                                        address => (

                                                            <AddressCard
                                                                key={
                                                                    address.id
                                                                }
                                                                address={
                                                                    address
                                                                }
                                                                busy={
                                                                    addressActionId ===
                                                                    address.id
                                                                }
                                                                renderAddressIcon={
                                                                    renderAddressIcon
                                                                }
                                                                onDefault={
                                                                    handleSetDefault
                                                                }
                                                                onEdit={
                                                                    handleEditAddress
                                                                }
                                                                onDelete={
                                                                    handleDeleteAddress
                                                                }
                                                            />

                                                        )
                                                    )
                                                }

                                            </div>

                                        )
                            }

                        </article>


                        {/* =================================================
                            ACCOUNT INFORMATION
                        ================================================= */}

                        <article
                            className="
                                profile-card
                            "
                        >

                            <div
                                className="
                                    profile-card__header
                                "
                            >

                                <div>

                                    <span
                                        className="
                                            profile-card__label
                                        "
                                    >
                                        ACCOUNT INFORMATION
                                    </span>


                                    <h2>
                                        AUMVEDA Account
                                    </h2>

                                </div>

                            </div>


                            <div
                                className="
                                    profile-account-details
                                "
                            >

                                <div>

                                    <span>
                                        Customer ID
                                    </span>


                                    <strong
                                        className="
                                            profile-account-id
                                        "
                                    >
                                        {user?.id}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Account Type
                                    </span>


                                    <strong>
                                        Customer
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Member Since
                                    </span>


                                    <strong>
                                        {memberSince}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Current Address
                                    </span>


                                    <strong>

                                        {
                                            defaultAddress
                                                ? `${defaultAddress.city}, ${defaultAddress.state}`
                                                : "Not added"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </article>

                    </div>

                </section>

            </div>


            {/* =================================================
                ADDRESS MODAL
            ================================================= */}

            {
                addressFormOpen && (

                    <div
                        className="
                            profile-address-modal
                        "
                        role="presentation"
                    >

                        <button
                            type="button"
                            className="
                                profile-address-modal__backdrop
                            "
                            onClick={
                                handleCloseAddressForm
                            }
                            aria-label="Close address form"
                        />


                        <div
                            className="
                                profile-address-modal__panel
                            "
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="address-modal-title"
                        >

                            <div
                                className="
                                    profile-address-modal__header
                                "
                            >

                                <div>

                                    <span>
                                        DELIVERY ADDRESS
                                    </span>


                                    <h2
                                        id="address-modal-title"
                                    >

                                        {
                                            editingAddressId
                                                ? "Edit Address"
                                                : "Add New Address"
                                        }

                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleCloseAddressForm
                                    }
                                    disabled={
                                        addressSaving
                                    }
                                    aria-label="Close address form"
                                >

                                    <X
                                        size={19}
                                    />

                                </button>

                            </div>


                            {
                                addressError && (

                                    <div
                                        className="
                                            profile-address-message
                                            profile-address-message--error
                                        "
                                    >
                                        {addressError}
                                    </div>

                                )
                            }


                            <form
                                className="
                                    profile-address-form
                                "
                                onSubmit={
                                    handleAddressSave
                                }
                            >

                                <div
                                    className="
                                        profile-address-form__grid
                                    "
                                >

                                    <AddressField
                                        label="Address Label"
                                        htmlFor="address-label"
                                    >

                                        <input
                                            id="address-label"
                                            name="label"
                                            type="text"
                                            value={
                                                addressForm.label
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="Home, Office, Hostel..."
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="Recipient Name"
                                        htmlFor="address-recipient"
                                    >

                                        <input
                                            id="address-recipient"
                                            name="recipientName"
                                            type="text"
                                            value={
                                                addressForm.recipientName
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="Enter recipient name"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="Phone Number"
                                        htmlFor="address-phone"
                                    >

                                        <input
                                            id="address-phone"
                                            name="phone"
                                            type="tel"
                                            value={
                                                addressForm.phone
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="Enter phone number"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="Address Line 1"
                                        htmlFor="address-line1"
                                        full
                                    >

                                        <input
                                            id="address-line1"
                                            name="addressLine1"
                                            type="text"
                                            value={
                                                addressForm.addressLine1
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="House / Flat / Building / Street"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="Address Line 2"
                                        htmlFor="address-line2"
                                        full
                                    >

                                        <input
                                            id="address-line2"
                                            name="addressLine2"
                                            type="text"
                                            value={
                                                addressForm.addressLine2
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="Area, locality or landmark"
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="City"
                                        htmlFor="address-city"
                                    >

                                        <input
                                            id="address-city"
                                            name="city"
                                            type="text"
                                            value={
                                                addressForm.city
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="City"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="State"
                                        htmlFor="address-state"
                                    >

                                        <input
                                            id="address-state"
                                            name="state"
                                            type="text"
                                            value={
                                                addressForm.state
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="State"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="PIN Code"
                                        htmlFor="address-postal-code"
                                    >

                                        <input
                                            id="address-postal-code"
                                            name="postalCode"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={
                                                addressForm.postalCode
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            placeholder="500001"
                                            required
                                        />

                                    </AddressField>


                                    <AddressField
                                        label="Country"
                                        htmlFor="address-country"
                                    >

                                        <input
                                            id="address-country"
                                            name="country"
                                            type="text"
                                            value={
                                                addressForm.country
                                            }
                                            onChange={
                                                handleAddressChange
                                            }
                                            required
                                        />

                                    </AddressField>

                                </div>


                                {
                                    addresses.length > 0 && (

                                        <label
                                            className="
                                                profile-address-default-checkbox
                                            "
                                        >

                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                checked={
                                                    addressForm.isDefault
                                                }
                                                onChange={
                                                    handleAddressChange
                                                }
                                            />


                                            <span
                                                className="
                                                    profile-address-default-checkbox__box
                                                "
                                            >

                                                <Check
                                                    size={13}
                                                />

                                            </span>


                                            <span>

                                                <strong>
                                                    Make this my default address
                                                </strong>


                                                <small>
                                                    This address will be
                                                    selected automatically
                                                    during checkout.
                                                </small>

                                            </span>

                                        </label>

                                    )
                                }


                                <div
                                    className="
                                        profile-address-form__actions
                                    "
                                >

                                    <button
                                        type="button"
                                        className="
                                            profile-address-form__cancel
                                        "
                                        onClick={
                                            handleCloseAddressForm
                                        }
                                        disabled={
                                            addressSaving
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="
                                            profile-address-form__save
                                        "
                                        disabled={
                                            addressSaving
                                        }
                                    >

                                        <Save
                                            size={15}
                                        />


                                        {
                                            addressSaving
                                                ? "Saving..."
                                                : editingAddressId
                                                    ? "Update Address"
                                                    : "Save Address"
                                        }

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )
            }

        </main>

    );

}


/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
    label,
    value,
    className = "",
    wide = false
}) {

    return (

        <div
            className={`
                profile-information-item
                ${
                    wide
                        ? "profile-information-item--wide"
                        : ""
                }
            `}
        >

            <span>
                {label}
            </span>


            <strong
                className={
                    className
                }
            >
                {value}
            </strong>

        </div>

    );

}


/* ============================================================
   PROFILE FIELD
============================================================ */

function ProfileField({
    label,
    htmlFor,
    children,
    readOnly = false
}) {

    return (

        <div
            className="
                profile-field
            "
        >

            <label
                htmlFor={
                    htmlFor
                }
            >
                {label}
            </label>


            <div
                className={`
                    profile-input-shell
                    ${
                        readOnly
                            ? "profile-input-shell--readonly"
                            : ""
                    }
                `}
            >

                {children}

            </div>

        </div>

    );

}


/* ============================================================
   ADDRESS FIELD
============================================================ */

function AddressField({
    label,
    htmlFor,
    children,
    full = false
}) {

    return (

        <div
            className={`
                profile-address-field
                ${
                    full
                        ? "profile-address-field--full"
                        : ""
                }
            `}
        >

            <label
                htmlFor={
                    htmlFor
                }
            >
                {label}
            </label>


            {children}

        </div>

    );

}


/* ============================================================
   ADDRESS CARD
============================================================ */

function AddressCard({
    address,
    busy,
    renderAddressIcon,
    onDefault,
    onEdit,
    onDelete
}) {

    return (

        <div
            className={`
                profile-address-card
                ${
                    address.is_default
                        ? "profile-address-card--default"
                        : ""
                }
            `}
        >

            <div
                className="
                    profile-address-card__top
                "
            >

                <div
                    className="
                        profile-address-card__label
                    "
                >

                    <span
                        className="
                            profile-address-card__icon
                        "
                    >

                        {
                            renderAddressIcon(
                                address.label
                            )
                        }

                    </span>


                    <span>
                        {
                            address.label ||
                            "Address"
                        }
                    </span>

                </div>


                {
                    address.is_default && (

                        <span
                            className="
                                profile-address-default-badge
                            "
                        >

                            <Star
                                size={11}
                                fill="currentColor"
                            />

                            Current Address

                        </span>

                    )
                }

            </div>


            <div
                className="
                    profile-address-card__body
                "
            >

                <strong
                    className="
                        profile-address-recipient
                    "
                >
                    {
                        address.recipient_name
                    }
                </strong>


                <div
                    className="
                        profile-address-phone
                    "
                >

                    <Phone
                        size={13}
                    />

                    {
                        address.phone
                    }

                </div>


                <address>

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

                </address>

            </div>


            <div
                className="
                    profile-address-card__actions
                "
            >

                {
                    !address.is_default && (

                        <button
                            type="button"
                            className="
                                profile-address-default-button
                            "
                            onClick={() =>
                                onDefault(
                                    address
                                )
                            }
                            disabled={
                                busy
                            }
                        >

                            <Star
                                size={13}
                            />

                            Set as Default

                        </button>

                    )
                }


                <button
                    type="button"
                    className="
                        profile-address-edit-button
                    "
                    onClick={() =>
                        onEdit(
                            address
                        )
                    }
                    disabled={
                        busy
                    }
                >

                    <Pencil
                        size={13}
                    />

                    Edit

                </button>


                <button
                    type="button"
                    className="
                        profile-address-delete-button
                    "
                    onClick={() =>
                        onDelete(
                            address
                        )
                    }
                    disabled={
                        busy
                    }
                >

                    <Trash2
                        size={13}
                    />

                    Delete

                </button>

            </div>

        </div>

    );

}


export default Profile;