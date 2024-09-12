import React, { useState, useEffect } from "react";
import {
    createBrowserRouter,
    Navigate,
    Outlet,
    RouterProvider,
} from "react-router-dom";
// @ts-ignore
import AuthContext from "./providers/authentication.ts";
// @ts-ignore
import { Home } from "./components/Home/Home.tsx";
// @ts-ignore
import { Navbar } from "./components/Navbar/Navbar.tsx";
// @ts-ignore
import Footer from "./components/Footer/Footer.tsx";
// @ts-ignore
import Brands from "./components/Brands/Brands.tsx";
// @ts-ignore
import ManufacturerModels from "./components/Manufacturer-Models/Manufacturer-Models.tsx";
// @ts-ignore
import Model from "./components/Model/Model.tsx";
// @ts-ignore
import About from "./components/About/About.tsx";
// @ts-ignore
import Contacts from "./components/Contacts/Contacts.tsx";
// @ts-ignore
import Search from "./components/Search/Search.tsx";
// @ts-ignore
import FoundTires from "./components/FoundTires/FoundTires.tsx";
// @ts-ignore
import ShoppingCart from "./components/Shopping-Cart/Shopping-Cart.tsx";
// @ts-ignore
import LoginInformation from "./components/LoginInformation/LoginInformation.tsx";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export default function App() {
    const [openNavbar, setOpenNavbar] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentProfileBtn, setCurrentProfileBtn] = useState("orders");

    // Get initial authentication state based on local storage
    const getInitialAuthState = () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                // @ts-ignore
                const { userId, firstName, lastName } = jwtDecode(token || "");

                return {
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    isLoggedIn: true,
                };
            } catch (error) {
                console.warn("Failed to decode token:", error);
            }
        }
        return {
            userId: null,
            firstName: null,
            lastName: null,
            isLoggedIn: false,
        };
    };

    // Initialize the state with the result of getInitialAuthState()
    const [authValue, setAuthState] = useState(getInitialAuthState());

    // Check authentication status on component mount to ensure it's synced
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            try {
                // @ts-ignore
                const { userId, firstName, lastName } = jwtDecode(token);

                setAuthState({
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    isLoggedIn: true,
                });
            } catch (error) {
                console.warn("Failed to decode token:", error);
                setAuthState({
                    userId: null,
                    firstName: null,
                    lastName: null,
                    isLoggedIn: false,
                });
            }
        }
    }, []);

    const ProtectedRoute = ({ user, children }) => {
        if (!user) {
            return <Navigate to="/" replace />;
        }

        return children;
    };

    function Layout() {
        return (
            <>
                <Navbar
                    openNavbar={openNavbar}
                    setOpenNavbar={setOpenNavbar}
                    currentProfileBtn={currentProfileBtn}
                    setCurrentProfileBtn={setCurrentProfileBtn}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <Outlet />
                <Footer />
            </>
        );
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />,
            children: [
                { path: "/", element: <Home /> },
                { path: "brands", element: <Brands /> },
                {
                    path: "tires/manufacturers/:manufacturer_name/tire-models",
                    element: (
                        <ManufacturerModels
                            setOpenNavbar={setOpenNavbar}
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    ),
                },
                {
                    path: "tires/manufacturers/:manufacturer_name/tire-model/:tireId",
                    element: <Model setOpenNavbar={setOpenNavbar} />,
                },
                { path: "about", element: <About /> },
                { path: "contacts", element: <Contacts /> },
                { path: "search/", element: <Search /> },
                {
                    path: "loginInformation",
                    element: (
                        <ProtectedRoute user={authValue.isLoggedIn}>
                            <LoginInformation
                                currentProfileBtn={currentProfileBtn}
                                setCurrentProfileBtn={setCurrentProfileBtn}
                            />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "search/sizes",
                    element: (
                        <FoundTires
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    ),
                },
                {
                    path: "search/models",
                    element: (
                        <FoundTires
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                    ),
                },
                {
                    path: "shopping_cart",
                    element: (
                        <ProtectedRoute user={authValue.isLoggedIn}>
                            <ShoppingCart />
                        </ProtectedRoute>
                    ),
                },
            ],
        },
    ]);

    return (
        <div className="container">
            <AuthContext.Provider value={{ ...authValue, setAuthState }}>
                <RouterProvider router={router} />
            </AuthContext.Provider>
        </div>
    );
}
