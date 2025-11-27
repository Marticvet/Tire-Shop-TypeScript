import React from "react";
import { useContext, useEffect, useState } from "react";
// @ts-ignore
import AuthContext, {AuthContextType} from "../../providers/authentication.ts";
// @ts-ignore
import { UsersService } from "../../services/users.service.ts";
import { Link } from "react-router-dom";
import "./styles/Shopping-Cart.css";

export default function ShoppingCart() {
    const authCtx = useContext(AuthContext) as AuthContextType;
    const { userId } = authCtx;
    const [models, setModels] = useState<any[]>([]);
    const [modelQuantity, setModelQuantity] = useState<any[]>([]);

    useEffect(() => {
        const userService = new UsersService();

        (async () => {
            await userService.getUserCartItems(userId).then((data) => {
                if (data.length === 0) {
                    setModels([]);
                    return;
                }
                setModels(data);
            });
        })();
    }, [userId]);

    function changeQuantityHandler(id) {
        return async (event) => {
            const quantity = event.target.value;
            const userService = new UsersService();

            await userService
                .editItemQuantity(id, { quantity })
                .then(({ message, updatedItems }) => {
                    if (message && message.includes("successfully")) {
                        const updatedModels = models.map((model) =>
                            model.id === updatedItems[0].id
                                ? updatedItems[0]
                                : model
                        );

                        setModels(updatedModels);
                        return;
                    }
                });
        };
    }

    function deleteItemHandler(id) {
        return async () => {
            const userService = new UsersService();
            const confirmation = window.confirm(
                "Are you sure you want to delete?"
            );

            if (confirmation) {
                await userService
                    .deleteItemInShoppingCart(id)
                    .then((response) => {
                        if (response && response.status === 200) {
                            const deletedModel = models.filter(
                                (model) => model.id !== id
                            );
                            setModels(deletedModel);
                            return;
                        }
                    });
            }
        };
    }

    useEffect(() => {
        const res = models.map((model) => {
            return { id: model.id, quantity: model.quantity };
        });

        setModelQuantity(res);
    }, [models]);

    const totalPrice = models.reduce((prev, current) => {
        return prev + Number(current.tirePrice * current.quantity);
    }, 0);

    const totalQuantity = models.reduce((prev, current) => {
        return prev + Number(current.quantity);
    }, 0);

    return (
        <div className="shoppingCart">
            <div className="shoppingCart__header">
                <h3 className="shoppingCart__header--heading">SHOPPING CART</h3>
                <p className="shoppingCart__header--paragraph">
                    Confirm your items, delivery & installation method, total
                    cost, then proceed.
                </p>
            </div>

            <div className={models.length > 0 ? "content" : ""}>
                {models.length > 0 && (
                    <div className="sideBar">
                        <span className="sidebar__subtotal">
                            Subtotal ({totalQuantity} items):{" "}
                            <b>${totalPrice.toFixed(2)}</b>
                        </span>

                        <button
                            onClick={() => {
                                window.alert(
                                    "Our developers're working on this functionality. Please Try later!"
                                );

                                return;
                            }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}

                <div
                    className={models.length > 0 ? "manufacturer" : "nomodels"}
                >
                    {models.length > 0 ? (
                        [...models].reverse().map((model) => {
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
                                    key={index}
                                >
                                    <div className="image__container">
                                        <Link
                                            to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${model.tireId}`}
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
                                            to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${model.tireId}`}
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
                                            <span>Car Type:</span>{" "}
                                            {model.carType}
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
                                            {model.tireQuantity > 0
                                                ? "In stock"
                                                : "Out of Stock"}
                                        </p>
                                        <button
                                            className="price__info--btn"
                                            onClick={deleteItemHandler(
                                                model.id
                                            )}
                                        >
                                            Delete Item
                                        </button>

                                        <select
                                            className="price__info--quantity"
                                            defaultValue={model.quantity}
                                            onChange={changeQuantityHandler(
                                                model.id
                                            )}
                                        >
                                            <option value="1">Qty: 1</option>
                                            <option value="2">Qty: 2</option>
                                            <option value="3">Qty: 3</option>
                                            <option value="4">Qty: 4</option>
                                        </select>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <h1>Your shopping cart is empty!</h1>
                    )}
                </div>
            </div>
        </div>
    );
}
