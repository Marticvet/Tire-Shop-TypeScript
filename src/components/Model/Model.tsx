import React from "react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
// @ts-ignore
import AuthContext from "../../providers/authentication.ts";
// @ts-ignore
import { SizesService } from "../../services/sizes.service.ts";
// @ts-ignore
import { ManufacturerService } from "../../services/tires.service.ts";
// @ts-ignore
import { UsersService } from "../../services/users.service.ts";
import "./styles/Model.css";

const images = {
    michelin: require("../../img/michelin1-logo-vector.jpg"),
    bridgestone: require("../../img/bridgestone-logo1.jpg"),
    continental: require("../../img/continental-logo.png"),
    cooper: require("../../img/cooper-logo.png"),
    firestone: require("../../img/firestone-logo.png"),
    general: require("../../img/general-logo.jpg"),
    goodyear: require("../../img/goodyear_logo.png"),
    hankook: require("../../img/Hankook_logo.png"),
    pirelli: require("../../img/Logo_Pirelli.svg.png"),
    yokohama: require("../../img/Yokohama_logo.jpg"),
};

interface Model {
    id: number,
    tireModelId: number,
    tireLoudnessLevel: number,
    tirePrice: number,
    tireQuantity: number,
    tireLoadIndex: number,
    tireSpeedRating: string,
    tireSeason: string,
    modelName: string,
    modelImageUrl: string,
    modelDescription: string,
    manufacturerName: string,
    dimensionWidth: number,
    dimensionHeight: number,
    dimensionDiameter: number,
    fuelEfficiency: string,
    gripRating: string,
    carType: string,
    manufacturerImageUrl: string
  }

export default function Model({ setOpenNavbar }) {
    const navigate = useNavigate();
    const { manufacturer_name, tireId } = useParams();
    const [model, setModel] = useState<Partial<Model>>({});
    const [availableSizes, setAvailableSizes] = useState<any[]>([]);
    const [availableDiameters, setAvailableDiameters] = useState<any[]>([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(4);
    const authCtx = useContext(AuthContext) as AuthContext;
    const { firstName, lastName, userId, username, isLoggedIn } = authCtx;
    const [addedToCart, setAddedToCart] = useState(false);
    const [isActive, setIsActive] = useState({
        description: true,
        sizes: false,
    });
    
    useEffect(() => {
        if (addedToCart && isLoggedIn) {
            const userService = new UsersService();

            const item = JSON.parse(sessionStorage.getItem("item") || "''");
            item.user_id = userId;

            (async () => {
                await userService
                    .addItemInShoppingCart(item)
                    .then(({statusCodeValue}) => {
                        if (statusCodeValue === 200) {
                            navigate("/shopping_cart");
                            sessionStorage.clear();
                        }
                    });
            })();

            return;
        }
    }, [addedToCart, navigate, isLoggedIn, {firstName, lastName, username, userId}]);

    useEffect(() => {
        const manifacturerService = new ManufacturerService();
        const sizesService = new SizesService();

        Promise.all([
            manifacturerService.getManufacturerModelById(
                manufacturer_name,
                tireId
            ),
            sizesService.getSizesByModelId(model.tireModelId),
        ])
            .then(([result1, result2]) => {
                setModel(result1[0]);
                setAvailableSizes(result2);
            })
            .catch((error) => console.log("error", error));
    }, [manufacturer_name, tireId, model.tireModelId]);

    useEffect(() => {
        setSelectedSize(
            `${model.dimensionWidth}/${model.dimensionHeight}R${model.dimensionDiameter} ${model.tireLoadIndex}${model.tireSpeedRating}`
        );

        availableSizes.forEach((s) => {
            if (!availableDiameters.includes(s.dimensionDiameter)) {
                setAvailableDiameters([
                    ...availableDiameters,
                    s.dimensionDiameter,
                ]);
            }
        });
    }, [model, availableSizes, availableDiameters]);

    if (Object.keys(model).length === 0) {
        return <></>;
    }

    const manufactrerName = model.manufacturerName?.toLowerCase().trim();

    async function addItemHandler() {
        const userService = new UsersService();

        const item = {
            userId: userId,
            quantity,
            tireId: model.id,
        };

        if (isLoggedIn) {
            item.userId = userId;

            await userService
                .addItemInShoppingCart(item)
                .then(({statusCodeValue}) => {
                    if (statusCodeValue === 200) {
                        navigate("/shopping_cart");
                        sessionStorage.clear();
                    }
                });

            return;
        }

        setOpenNavbar(true);
        setAddedToCart(true);
        sessionStorage.setItem("item", JSON.stringify(item));
    }

    return (
        <div className="model">
            <div className="product">
                <div className="product__img">
                    <img src={model.modelImageUrl} alt={model.modelName} />
                </div>

                <div className="product__details">
                    <img
                        className="product__details--img"
                        src={images[(manufactrerName ?? "")]}
                        alt={model.modelName}
                    />
                    <h4 className="product__details--heading-4">
                        {`${model.modelName} - Size: `}
                        {`${model.dimensionHeight}R${model.dimensionDiameter}` !==
                        selectedSize
                            ? selectedSize
                            : `${model.dimensionHeight}R${model.dimensionDiameter}`}
                    </h4>

                    <div className="details">
                        <div className="details__sizes">
                            <ul className="details__sizes--ul">
                                <li>
                                    Size:{" "}
                                    <span>{`${model.dimensionWidth}/${model.dimensionHeight}R${model.dimensionDiameter}`}</span>
                                </li>
                                <li>
                                    Season: <span>{model.tireSeason}</span>
                                </li>
                                <li>
                                    Load Index:{" "}
                                    <span>{model.tireLoadIndex}</span>
                                </li>
                                <li>
                                    Speed Index:{" "}
                                    <span>{model.tireSpeedRating}</span>
                                </li>{" "}
                                <li>
                                    Loudness Level:{" "}
                                    <span>{model.tireLoudnessLevel} db</span>
                                </li>
                                <li>
                                    Car Type: <span>{model.carType}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="details__price">
                            <span>Total Price:</span>
                            <h2 className="details__price--totalPrice">
                                ${(model.tirePrice ?? 0) * quantity}
                            </h2>

                            <span>Per Tire:</span>
                            <h2 className="details__price--price">
                                ${model.tirePrice}
                            </h2>

                            <p className="details__price--availability">
                                Availability:{" "}
                                <span>
                                    {" "}
                                    {(model.tireQuantity ?? 0) > 0
                                        ? "In stock"
                                        : "Out of Stock"}
                                </span>
                            </p>
                            {(model.tireQuantity ?? 0) > 0 && (
                                <button
                                    className="details__price--btn"
                                    onClick={addItemHandler}
                                >
                                    &#128722; Add to Cart
                                </button>
                            )}
                            {(model.tireQuantity ?? 0) > 0 && (
                                <select
                                    className="details__price--quantity"
                                    defaultValue={4}
                                    onChange={(event) => {
                                        const currQuantity = Number(
                                            event.target.value
                                        );
                                        setQuantity(currQuantity);
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
                </div>
            </div>

            <div className="information">
                <div className="information__choose">
                    <ul className="information__choose--buttons">
                        <li
                            onClick={() =>
                                isActive.description === true
                                    ? setIsActive({
                                          ...isActive,
                                          sizes: false,
                                      })
                                    : setIsActive({
                                          ...isActive,
                                          description: true,
                                          sizes: false,
                                      })
                            }
                            className={isActive.description ? "active" : ""}
                        >
                            Description
                        </li>
                        <li
                            onClick={() =>
                                isActive.sizes === true
                                    ? setIsActive({
                                          ...isActive,
                                          description: false,
                                      })
                                    : setIsActive({
                                          ...isActive,
                                          description: false,
                                          sizes: true,
                                      })
                            }
                            className={isActive.sizes ? "active" : ""}
                        >
                            Sizes
                        </li>
                    </ul>
                </div>

                <div className="information__content">
                    <div
                        className={
                            isActive.description
                                ? "information__content--description"
                                : "hidden"
                        }
                    >
                        {(model.modelDescription ?? "")
                            .split(/(?<=\.|!|\?)\s(?=[A-Z])/g)
                            .map((p, i) => {
                                if (p === "") {
                                    return null;
                                }

                                return (
                                    <p
                                        className="paragraph paragraph__description"
                                        key={i}
                                    >
                                        {p.trim()}
                                    </p>
                                );
                            })}
                    </div>
                    <div
                        className={
                            isActive.sizes
                                ? "information__content--sizes"
                                : "hidden"
                        }
                    >
                        <h1 className="information__content--sizes-heading">
                            Selected Size
                        </h1>
                        <p className="information__content--sizes-paragraph">
                            {selectedSize}
                        </p>
                        <h1 className="information__content--sizes-heading">
                            All Sizes
                        </h1>

                        {availableDiameters.sort().map((diameter, index) => {
                            return (
                                <div className="sizes" key={index}>
                                    <div className="sizes__wrapper">
                                        <h1>{diameter}</h1>
                                        <ul className="sizes__ul">
                                            {availableSizes.map((s, index) => {
                                                if (
                                                    diameter ===
                                                        s.dimensionDiameter &&
                                                    index % 2 === 0
                                                ) {
                                                    return (
                                                        <Link
                                                            to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${s.id}`}
                                                            key={index}
                                                            className={
                                                                selectedSize ===
                                                                `${s.dimensionWidth}/${s.dimensionHeight}R${s.dimensionDiameter} ${s.loadIndex}${s.speedRating}`
                                                                    ? "sizes__ul--link-selected color-grey"
                                                                    : "sizes__ul--link color-grey"
                                                            }
                                                        >
                                                            <li>
                                                                {`${s.dimensionWidth}/${s.dimensionHeight}R${s.dimensionDiameter}`}{" "}
                                                                <span>
                                                                    {
                                                                        s.loadIndex
                                                                    }
                                                                    {
                                                                        s.speedRating
                                                                    }
                                                                </span>
                                                            </li>
                                                        </Link>
                                                    );
                                                } else if (
                                                    diameter ===
                                                    s.dimensionDiameter
                                                ) {
                                                    return (
                                                        <Link
                                                            to={`/tires/manufacturers/${model.manufacturerName}/tire-model/${s.id}`}
                                                            key={index}
                                                            className={
                                                                selectedSize ===
                                                                `${s.dimensionWidth}/${s.dimensionHeight}R${s.dimensionDiameter} ${s.loadIndex}${s.speedRating}`
                                                                    ? "sizes__ul--link-selected"
                                                                    : "sizes__ul--link"
                                                            }
                                                        >
                                                            <li>
                                                                {`${s.dimensionWidth}/${s.dimensionHeight}R${s.dimensionDiameter}`}{" "}
                                                                <span>
                                                                    {
                                                                        s.loadIndex
                                                                    }
                                                                    {
                                                                        s.speedRating
                                                                    }
                                                                </span>
                                                            </li>
                                                        </Link>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}