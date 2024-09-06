import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// @ts-ignore
import AuthContext from "../../providers/authentication.ts";
// @ts-ignore
import { UsersService } from "../../services/users.service.ts";
import "./styles/Manufacturer-Models.css";
import "./styles/Models.css";

interface Item {
    userId: number;
    quantity: number;
    tireId: number;
}

export default function Models({
    models,
    dropDownCriteria,
    speedIndexCriteria,
    loadIndexCriteria,
    seasonCriteria,
    carTypeCriteria,
    priceCriteria,
    messageAlert,
    setOpenNavbar,
    modelQuantity,
    setModelQuantity,
}) {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext) as AuthContext;
    const { userId, username, isLoggedIn } = authCtx;
    const [addedToCart, setAddedToCart] = useState(false);
    const copiedModels = models.map((model) => {
        return { ...model };
    });

    useEffect(() => {
        if (addedToCart && isLoggedIn) {
            const userService = new UsersService();

            const item: Item = JSON.parse(
                sessionStorage.getItem("item") || "''"
            );
            item.userId = userId;

            (async () => {
                await userService
                    .addItemInShoppingCart(item)
                    .then(({ statusCodeValue }) => {
                        if (statusCodeValue === 200) {
                            navigate("/shopping_cart");
                            sessionStorage.clear();
                        }
                    });
            })();

            return;
        }
    }, [addedToCart, navigate, isLoggedIn, username]);

    function sortingSystem(a, b) {
        if (dropDownCriteria === "category") {
            return a.tire_model_id - b.tire_model_id;
        } else if (dropDownCriteria === "asc") {
            return a.tirePrice - b.tirePrice;
        } else if (dropDownCriteria === "desc") {
            return b.tirePrice - a.tirePrice;
        } else if (dropDownCriteria === "aphabeticaly") {
            return a.model_name.localeCompare(b.model_name);
        } else if (dropDownCriteria === "reverseAlphabeticaly") {
            return b.model_name.localeCompare(a.model_name);
        }
    }

    function addItemHandler(id) {
        (async () => {
            const userService = new UsersService();

            const index = modelQuantity.findIndex((m) => {
                if (m.id === id) {
                    return m;
                }

                return null;
            });

            if (index === -1) {
                return null;
            }

            const item: Item = {
                quantity: modelQuantity[index].quantity,
                tireId: id,
                userId: 0,
            };

            if (isLoggedIn) {
                item.userId = userId;
                
                await userService
                    .addItemInShoppingCart(item)
                    .then(({ statusCodeValue }) => {
                        if (statusCodeValue === 200) {
                            navigate("/shopping_cart");
                            sessionStorage.clear();
                        }
                    });

            }else{
                setOpenNavbar(true);
                setAddedToCart(true);
                sessionStorage.setItem("item", JSON.stringify(item));
            }
        })();
    }

    const availableSpeedIndex: any = [];

    models.forEach((model) => {
        if (!availableSpeedIndex.includes(model.tireSpeedRating)) {
            availableSpeedIndex.push(model.tireSpeedRating);
        }
    });

    function updateQuantity(id, currQuantity) {
        const newState = modelQuantity.map((model) => {
            if (model.id === id) {
                return { ...model, quantity: currQuantity };
            }

            return model;
        });

        setModelQuantity(newState);
    }

    return (
        <div className={copiedModels.length > 0 ? "manufacturer" : "nomodels"}>
            {copiedModels.length > 0 ? (
                copiedModels
                    .sort(sortingSystem)
                    .filter(
                        ({ tireSpeedRating }) =>
                            speedIndexCriteria[tireSpeedRating] ||
                            !Object.values(speedIndexCriteria).includes(true)
                    )
                    .filter(
                        ({ tireLoadIndex }) =>
                            loadIndexCriteria[tireLoadIndex] ||
                            !Object.values(loadIndexCriteria).includes(true)
                    )
                    .filter(
                        ({ tireSeason }) =>
                            seasonCriteria[tireSeason] ||
                            !Object.values(seasonCriteria).includes(true)
                    )
                    .filter(
                        ({ carType }) =>
                            carTypeCriteria[carType] ||
                            !Object.values(carTypeCriteria).includes(true)
                    )
                    .filter(
                        ({ tirePrice }) =>
                            priceCriteria.minPrice <= tirePrice &&
                            tirePrice <= priceCriteria.maxPrice
                    )
                    .map((model) => {
                        const index = modelQuantity.findIndex((m) => {
                            if (model.id === m.id) {
                                return m;
                            }

                            return null;
                        });

                        if (index === -1) {
                            return null;
                        }

                        return (
                            <div
                                className="manufacturer__models"
                                key={model.id}
                            >
                                <div className="image__container">
                                    <Link
                                        to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${model.id}`}
                                    >
                                        <img
                                            src={model.modelImageUrl}
                                            alt={model.modelName}
                                            className="image__container--img"
                                        />
                                    </Link>
                                </div>

                                <div className="model__info">
                                    <Link
                                        to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${model.id}`}
                                        className="font-size model__info--link"
                                    >
                                        {model.manufacturerName} <br />{" "}
                                        {model.modelName}
                                    </Link>
                                    <p className="model__info--size font-size">
                                        <span>Size:</span>{" "}
                                        {model.dimensionWidth +
                                            " " +
                                            model.dimensionHeight +
                                            " " +
                                            model.dimensionDiameter}
                                    </p>
                                    <p className="model__info--season font-size">
                                        <span>Season:</span>
                                        {model.tireSeason}
                                    </p>
                                    <p className="model__info--loadIndex font-size">
                                        <span>Load Index:</span>{" "}
                                        {model.tireLoadIndex}
                                    </p>
                                    <p className="model__info--speadRating font-size">
                                        <span>Speed Index:</span>{" "}
                                        {model.tireSpeedRating}
                                    </p>
                                    <p className="model__info--loudness font-size">
                                        <span>Loudness Level:</span>{" "}
                                        {model.tireLoudnessLevel} db
                                    </p>{" "}
                                    <p className="model__info--carType font-size">
                                        <span>Car Type:</span> {model.carType}
                                    </p>
                                </div>

                                <div className="price__info">
                                    <span>Total Price:</span>
                                    <h2 className="price__info--totalPrice">
                                        $
                                        {(
                                            model.tirePrice *
                                            modelQuantity[index].quantity
                                        ).toFixed(2)}
                                    </h2>

                                    <span>Per Tire:</span>
                                    <h2 className="price__info--price">
                                        ${model.tirePrice}
                                    </h2>
                                    <p className="price__info--availability">
                                        Availability:{" "}
                                        <b>
                                            {" "}
                                            {model.tireQuantity > 0
                                                ? "In stock"
                                                : "Out of Stock"}
                                        </b>
                                    </p>
                                    {model.tireQuantity > 0 && (
                                        <button
                                            className="price__info--btn"
                                            onClick={() =>
                                                addItemHandler(model.id)
                                            }
                                        >
                                            &#128722; Add to Cart
                                        </button>
                                    )}
                                    {model.tireQuantity > 0 && (
                                        <select
                                            className="price__info--quantity"
                                            defaultValue={4}
                                            onChange={(event) => {
                                                const currQuantity = Number(
                                                    event.target.value
                                                );

                                                updateQuantity(
                                                    model.id,
                                                    currQuantity
                                                );
                                            }}
                                        >
                                            <option value="1">Qty: 1</option>
                                            <option value="2">Qty: 2</option>
                                            <option value="3">Qty: 3</option>
                                            <option value="4">Qty: 4</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                        );
                    })
            ) : (
                <h1>{messageAlert !== undefined && messageAlert}</h1>
            )}
        </div>
    );
}
