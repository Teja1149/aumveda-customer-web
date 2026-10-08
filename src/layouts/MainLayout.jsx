import Navbar from "../components/home/Navbar";

function MainLayout({ children }) {
    return (
        <div className="aumveda-app">

            {/* GLOBAL NAVBAR — RENDERED ONCE */}
            <Navbar />

            {/* PAGE CONTENT */}
            <main className="aumveda-page-content">
                {children}
            </main>

        </div>
    );
}

export default MainLayout;