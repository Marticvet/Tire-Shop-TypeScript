import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import AuthContext from "../../../providers/authentication.ts";
// @ts-ignore
import { UsersService } from "../../../services/users.service.ts";

export default function AccountDetails({
    setOpenNavbar,
    setCurrentProfileBtn,
}) {
    const { firstName, lastName, username, isLoggedIn } = useContext(AuthContext) as AuthContext;
    const auth = useContext(AuthContext) as AuthContext;
    const navigate = useNavigate();

    function logoutHandler(event) {
        event.preventDefault();
        const userService = new UsersService();

        (async () => {
            await userService.logoutUser().then((response) => {
                if (response.status === 200) {
                    localStorage.clear();
                    auth.setAuthState({
                        user: null,
                        firstName: null,
                        lastName: null,
                        username: null,
                        isLoggedIn: false,
                    });
                    navigate("/");
                }
            });
        })();
    }

    return (
        <div className="accountDetails">
            {isLoggedIn && (
                <div className="accountDetails__info">
                    <h4 className="accountDetails__info--heading-4">
                        {firstName + " " + lastName}
                    </h4>
                    <h5 className="accountDetails__info--heading-5">
                        {username}
                    </h5>
                </div>
            )}

            <div className="list">
                <Link
                    className="list__button list__button--loginInfo"
                    to="/loginInformation"
                    onClick={() => {
                        setOpenNavbar(false);
                        setCurrentProfileBtn("orders");
                    }}
                >
                    Order History & Tracking
                </Link>{" "}
                <Link
                    className="list__button list__button--loginInfo"
                    to="/loginInformation"
                    onClick={() => {
                        setOpenNavbar(false);
                        setCurrentProfileBtn("settings");
                    }}
                >
                    Account Settings
                </Link>{" "}
                <Link
                    className="list__button list__button--loginInfo"
                    to={"/loginInformation"}
                    onClick={() => {
                        setOpenNavbar(false);
                        setCurrentProfileBtn("loginInfo");
                    }}
                >
                    Login Information
                </Link>
                <Link
                    className="list__button list__button--logout"
                    to={"/"}
                    onClick={logoutHandler}
                >
                    Logout <span>&#x2B9E;</span>
                </Link>
            </div>
        </div>
    );
}