import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import MainLayout
    from "../layouts/MainLayout";


import HomePage
    from "../pages/HomePage";


import LoginPage
    from "../pages/LoginPage";


import SignupPage
    from "../pages/SignupPage";


import Products
    from "../pages/Products";


import ProductDetails
    from "../pages/ProductDetails";


import Wishlist
    from "../pages/Wishlist";


import Cart
    from "../pages/Cart";


import Checkout
    from "../pages/Checkout";


import Profile
    from "../pages/Profile";


import About
    from "../pages/About";


import Contact
    from "../pages/Contact";



function AppRouter() {

    return (

        <BrowserRouter>

            <MainLayout>

                <Routes>


                    {/* =================================================
                        HOME
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <HomePage />
                        }
                    />


                    {/* =================================================
                        LOGIN
                    ================================================= */}

                    <Route
                        path="/login"
                        element={
                            <LoginPage />
                        }
                    />


                    {/* =================================================
                        SIGNUP
                    ================================================= */}

                    <Route
                        path="/signup"
                        element={
                            <SignupPage />
                        }
                    />


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <Route
                        path="/products"
                        element={
                            <Products />
                        }
                    />


                    {/* =================================================
                        PRODUCT DETAILS
                    ================================================= */}

                    <Route
                        path="/products/:slug"
                        element={
                            <ProductDetails />
                        }
                    />


                    {/* =================================================
                        WISHLIST
                    ================================================= */}

                    <Route
                        path="/wishlist"
                        element={
                            <Wishlist />
                        }
                    />


                    {/* =================================================
                        CART
                    ================================================= */}

                    <Route
                        path="/cart"
                        element={
                            <Cart />
                        }
                    />


                    {/* =================================================
                        CHECKOUT
                    ================================================= */}

                    <Route
                        path="/checkout"
                        element={
                            <Checkout />
                        }
                    />


                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <Route
                        path="/profile"
                        element={
                            <Profile />
                        }
                    />


                    {/* =================================================
                        ABOUT
                    ================================================= */}

                    <Route
                        path="/about"
                        element={
                            <About />
                        }
                    />


                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <Route
                        path="/contact"
                        element={
                            <Contact />
                        }
                    />


                    {/* =================================================
                        FALLBACK
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            <HomePage />
                        }
                    />


                </Routes>

            </MainLayout>

        </BrowserRouter>

    );

}


export default AppRouter;