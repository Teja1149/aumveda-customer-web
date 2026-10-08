import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";


import MainLayout
    from "../layouts/MainLayout";


import HomePage
    from "../pages/HomePage";


import Products
    from "../pages/Products";


import ProductDetails
    from "../pages/ProductDetails";


import Wishlist
    from "../pages/Wishlist";


import Cart
    from "../pages/Cart";


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


                </Routes>

            </MainLayout>

        </BrowserRouter>

    );

}


export default AppRouter;