import AppRouter
    from "./routes/AppRouter";

import {
    AuthProvider
} from "./context/AuthContext";

import {
    CartProvider
} from "./context/CartContext";

import {
    WishlistProvider
} from "./context/WishlistContext";

import "./styles/aumveda-theme.css";


function App() {

    return (

        <AuthProvider>

            <CartProvider>

                <WishlistProvider>

                    <AppRouter />

                </WishlistProvider>

            </CartProvider>

        </AuthProvider>

    );

}


export default App;