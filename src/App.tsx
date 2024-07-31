import React, { useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

// import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

// @ts-ignore
import { Home } from "./components/Home/Home.tsx";
// @ts-ignore
import { Navbar } from "./components/Navbar/Navbar.tsx";
// @ts-ignore
import Footer from "./components/Footer/Footer.tsx";
// @ts-ignore
import Brands from "./components/Brands/Brands.tsx";
// @ts-ignore
import Models from "./components/Models/Models.tsx";
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



export default function App() {
    const [openNavbar, setOpenNavbar] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentProfileBtn, setCurrentProfileBtn] = useState("orders");

    function Layout() {
        return (
            <>
                <Navbar  openNavbar={openNavbar}
                            setOpenNavbar={setOpenNavbar}
                            currentProfileBtn={currentProfileBtn}
                            setCurrentProfileBtn={setCurrentProfileBtn}
                            setIsSidebarOpen={setIsSidebarOpen}/>
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
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "brands",
                    element: <Brands />,
                },
                {
                    path: "tires/manufacturers/:manufacturer_name/tire-models",
                    element: <ManufacturerModels />,
                },
                {
                    path: "tires/manufacturers/:manufacturer_name/tire-model/:tireId",
                    element: <Model />,
                },
                {
                    path: "about",
                    element: <About />,
                },
                {
                    path: "contacts",
                    element: <Contacts />,
                },
                {
                    path: "search",
                    element: <Search />,
                },
                {
                    path: "search/sizes",
                    element: 
                        <FoundTires
                            isSidebarOpen={isSidebarOpen}
                            setIsSidebarOpen={setIsSidebarOpen}
                        />
                },
                // Add other routes here
            ],
        },
    ]);

    return (
        <div className="container">
            <RouterProvider router={router} />
        </div>
    );
}
