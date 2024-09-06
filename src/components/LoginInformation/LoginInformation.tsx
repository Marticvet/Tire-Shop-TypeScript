import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import AuthContext, {
    // @ts-ignore
    AuthContextType,
    createSession,
} from "../../providers/authentication.ts";
// @ts-ignore
import {UsersService} from "../../services/users.service.ts"
import "./styles/LoginInformation.css";
// @ts-ignore
import SuccessfulPopup from "../Popup/SuccessfulPopup.tsx";
// @ts-ignore
import Service from "../Service/Service.tsx";

export default function LoginInformation({
    currentProfileBtn,
    setCurrentProfileBtn,
}) {
    const authCtx = useContext(AuthContext) as AuthContextType;
    const { userId } = authCtx;
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<{
        username: string;
        name: string;
        password: string;
        confirmPassword: string;
    }>({
        username: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    function updateHandler(event) {
        event.preventDefault();
        const userService = new UsersService();
        const { username, name, password, confirmPassword } = userInfo;

        if (password !== confirmPassword) {
            window.alert(
                `Passwords must be same! Please fill again the fields!`
            );

            setUserInfo({ ...userInfo, password: "", confirmPassword: "" });
            return;
        }

        const index = name.indexOf(" ");
        const firstName = name.slice(0, index);
        const lastName = name.slice(index + 1);

        (async () => {
            await userService
                .updateUser({ username, firstName, lastName, password }, userId)
                .then(({ message, token, user }) => {
                    if (!token) {
                        window.alert(`Please fill again the fields!`);

                        setUserInfo({
                            ...userInfo,
                            password: "",
                            confirmPassword: "",
                        });
                        return;
                    }
                    const isSessionCreated = createSession(
                        token,
                        userId,
                        firstName,
                        lastName,
                        token
                    );

                    if (isSessionCreated) {
                        setShowPopup(true);
                        setUserInfo({
                            ...userInfo,
                            username: "",
                            name: "",
                            password: "",
                            confirmPassword: "",
                        });
                    }
                });
        })();
    }

    // useEffect(() => {
    //     if (userId === undefined || userId === null || userId === "") {
    //         (async () => {
    //             const userService = new UsersService();

    //             await userService.logoutUser().then((response) => {
    //                 if (response && response.status === 200) {
    //                     localStorage.clear();
    //                     authCtx.setAuthState({
    //                         userId: null,
    //                         firstName: null,
    //                         lastName: null,
    //                         token: null,
    //                         authCtx: null,
    //                         isLoggedIn: false,
    //                     });

    //                     navigate("/");
    //                 }
    //             });
    //         })();
    //     }
    // }, [authCtx, navigate, userId]);

    function logoutHandler(event) {
        event.preventDefault();
        const userService = new UsersService();

        (async () => {
            await userService.logoutUser().then((response) => {
                if (response && response.status === 200) {
                    localStorage.clear();
                    authCtx.setAuthState({
                        userId: null,
                        firstName: null,
                        lastName: null,
                        token: null,
                        authCtx: null,
                        isLoggedIn: false,
                    });

                    navigate("/");
                }
            });
        })();
    }

    return (
        <div className="loginInformation">
            <h1 className="loginInformation__heading">My Account</h1>
            <div className="loginInformation__details">
                <div className="sideBar">
                    <Link
                        className={
                            currentProfileBtn.includes("orders")
                                ? "sideBar__button active"
                                : "sideBar__button"
                        }
                        to="/loginInformation"
                        onClick={() => {
                            setCurrentProfileBtn("orders");
                        }}
                    >
                        Order History & Tracking
                    </Link>{" "}
                    <Link
                        className={
                            currentProfileBtn.includes("settings")
                                ? "sideBar__button active"
                                : "sideBar__button"
                        }
                        to="/loginInformation"
                        onClick={() => {
                            setCurrentProfileBtn("settings");
                        }}
                    >
                        Account Settings
                    </Link>{" "}
                    <Link
                        className={
                            currentProfileBtn.includes("loginInfo")
                                ? "sideBar__button active"
                                : "sideBar__button"
                        }
                        to="/loginInformation"
                        onClick={() => {
                            setCurrentProfileBtn("loginInfo");
                        }}
                    >
                        Login Information
                    </Link>{" "}
                    <Link
                        className="sideBar__button"
                        to={"/"}
                        onClick={logoutHandler}
                    >
                        Logout
                    </Link>
                </div>

                {currentProfileBtn.includes("settings") ||
                currentProfileBtn.includes("orders") ? (
                    <div className="functionallity">
                        <h1>Our developers're working on this functionality</h1>
                        <h1>Please try later!</h1>
                    </div>
                ) : null}

                {currentProfileBtn.includes("loginInfo") && (
                    <div className="update">
                        <form className="update__form" onSubmit={updateHandler}>
                            <label
                                className="update__form--label"
                                htmlFor="name"
                            >
                                Name:{" "}
                            </label>
                            <input
                                className="update__form--input"
                                type="text"
                                required
                                placeholder="First name and last name"
                                onChange={(event) => {
                                    setUserInfo({
                                        ...userInfo,
                                        name: event.target.value,
                                    });
                                }}
                                value={userInfo.name}
                            />

                            <label
                                className="update__form--label"
                                htmlFor="email"
                            >
                                Email Adress:{" "}
                            </label>
                            <input
                                className="update__form--input"
                                type="email"
                                required
                                placeholder="Email Adress"
                                value={userInfo.username}
                                onChange={(event) => {
                                    setUserInfo({
                                        ...userInfo,
                                        username: event.target.value.trim(),
                                    });
                                }}
                            />

                            <label
                                className="update__form--label"
                                htmlFor="new password"
                            >
                                New Password:{" "}
                            </label>
                            <input
                                className="update__form--input"
                                type="password"
                                required
                                placeholder="Password"
                                value={userInfo.password}
                                onChange={(event) => {
                                    setUserInfo({
                                        ...userInfo,
                                        password: event.target.value.trim(),
                                    });
                                }}
                            />

                            <label
                                className="update__form--label"
                                htmlFor="confirm password"
                            >
                                Confirm Password:{" "}
                            </label>
                            <input
                                className="update__form--input"
                                type="password"
                                required
                                placeholder="Confirm assword"
                                value={userInfo.confirmPassword}
                                onChange={(event) => {
                                    setUserInfo({
                                        ...userInfo,
                                        confirmPassword:
                                            event.target.value.trim(),
                                    });
                                }}
                            />

                            <button className="update__form--updateBtn">
                                Update
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <SuccessfulPopup
                trigger={showPopup}
                setTrigger={setShowPopup}
                message={"Your data has been successfully changed."}
            />
            <Service />
        </div>
    );
}
