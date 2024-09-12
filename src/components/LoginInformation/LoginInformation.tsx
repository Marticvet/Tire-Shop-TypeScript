import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import AuthContext, {
    // @ts-ignore
    AuthContextType,
    createSession,
} from "../../providers/authentication.ts";
// @ts-ignore
import { UsersService } from "../../services/users.service.ts";
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
        newPassword: string;
        confirmPassword: string;
    }>({
        username: "",
        name: "",
        password: "",
        newPassword: "",
        confirmPassword: "",
    });

    function updateHandler(event) {
        event.preventDefault();
        const userService = new UsersService();
        const { username, name, password, newPassword, confirmPassword } =
            userInfo;

        if (newPassword !== confirmPassword) {
            window.alert(
                `Passwords must be same! Please fill again the fields!`
            );

            setUserInfo({ ...userInfo, newPassword: "", confirmPassword: "" });
            return;
        }

        const index = name.indexOf(" ");
        const firstName = name.slice(0, index);
        const lastName = name.slice(index + 1);

        (async () => {
            await userService
                .updateUser(
                    { username, firstName, lastName, password, newPassword },
                    userId
                )
                .then((response) => {
                    if (response) {
                        const token = response.token;

                        const isSessionCreated = createSession(
                            userId,
                            firstName,
                            lastName,
                            token,
                            authCtx
                        );

                        if (isSessionCreated) {
                            setShowPopup(true);
                            setUserInfo({
                                ...userInfo,
                                username: "",
                                name: "",
                                password: "",
                                newPassword: "",
                                confirmPassword: "",
                            });
                        }

                        window.alert("Your profile has been successfully updated!");

                    } else {
                        
                        setUserInfo({
                            ...userInfo,
                            password: "",
                            newPassword: "",
                            confirmPassword: "",
                        });

                        window.alert("Old password is incorrect and fill again the fields!");
                    }
                });
        })();
    }

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
                                htmlFor="new newPassword"
                            >
                                Old newPassword:{" "}
                            </label>

                            <input
                                className="update__form--input"
                                type="password"
                                required
                                placeholder="newPassword"
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
                                htmlFor="new newPassword"
                            >
                                New newPassword:{" "}
                            </label>
                            <input
                                className="update__form--input"
                                type="password"
                                required
                                placeholder="newPassword"
                                value={userInfo.newPassword}
                                onChange={(event) => {
                                    setUserInfo({
                                        ...userInfo,
                                        newPassword: event.target.value.trim(),
                                    });
                                }}
                            />

                            <label
                                className="update__form--label"
                                htmlFor="confirm newPassword"
                            >
                                Confirm newPassword:{" "}
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
