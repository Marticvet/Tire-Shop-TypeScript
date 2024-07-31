import React from "react";
import "./styles/Manufacturer-Models.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// @ts-ignore
import Sidebar from "../Sidebar/Sidebar.tsx";
// @ts-ignore
import { ManufacturerService } from "../../services/tires.service.ts";
// @ts-ignore
import DropDownFilterCategories from "../DropDownFilterCategories/DropDownFilterCategories.tsx";
// @ts-ignore
import Models from "../Models/Models.tsx";

type MyParams = {
    manufacturer_name: string;
}

export default function ManufacturerModels({setOpenNavbar, isSidebarOpen, setIsSidebarOpen}) {
    const { manufacturer_name } = useParams<MyParams>();
    const [models, setModels] = useState<any[]>([]);
    const [messageAlert, setMessageAlert] =  useState<string>("");
    const [isActiveDropdown, setIsActiveDropdown] = useState(false);
    const [dropDownCategory, setDropDownCategory] = useState("");
    const [dropDownCriteria, setDropDownCriteria] = useState("category");
    const [priceCriteria, setPriceCriteria] = useState({
        minPrice: 0,
        maxPrice: 383.99,
});
    const [speedIndexCriteria, setSpeedIndexCriteria] = useState({
        L: false,
        M: false,
        N: false,
        P: false,
        Q: false,
        R: false,
        S: false,
        T: false,
        U: false,
        H: false,
        V: false,
        W: false,
        Y: false,
    });

    const [loadIndexCriteria, setLoadIndexCriteria] = useState({
        80: false,
        81: false,
        82: false,
        83: false,
        84: false,
        85: false,
        86: false,
        87: false,
        88: false,
        89: false,
        90: false,
        91: false,
        92: false,
        93: false,
        94: false,
        95: false,
        96: false,
        97: false,
        98: false,
        99: false,
        100: false,
        101: false,
        102: false,
        103: false,
        104: false,
        105: false,
        106: false,
        107: false,
        108: false,
        109: false,
        110: false,
        111: false,
        112: false,
        113: false,
        114: false,
        115: false,
        116: false,
        117: false,
        118: false,
        119: false,
        120: false,
        121: false,
        122: false,
        123: false,
        124: false,
        125: false,
    });

    const [seasonCriteria, setSeasonCriteria] = useState({
        Summer: false,
        Winter: false,
        "All - Season": false,
    });

    const [carTypeCriteria, setCarTypeCriteria] = useState({
        Car: false,
        SUV: false,
    });

    const [modelQuantity, setModelQuantity] = useState<any[]>([]);

    useEffect(() => {
        const manifacturerService = new ManufacturerService();
        manifacturerService
            .getModelsByManufacturerByName(manufacturer_name)
            .then((data) =>
            data.length === 0 ? setMessageAlert("No models found") : setModels(data)
            );
    }, [manufacturer_name]);

    useEffect(() => {
        const res = models.map((model) => {
            return { id: model.id, quantity: 4 };
        });

        setModelQuantity(res);
    }, [models, manufacturer_name]);

    return (
        <div
            className="manufacturerModels"
            tabIndex={1}
            onFocus={() => {
                setIsActiveDropdown(false);
            }}
        >
            <DropDownFilterCategories
                isActiveDropdown={isActiveDropdown}
                setIsActiveDropdown={setIsActiveDropdown}
                dropDownCategory={dropDownCategory}
                setDropDownCategory={setDropDownCategory}
                setDropDownCriteria={setDropDownCriteria}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="content">
               <Sidebar
                    priceCriteria={priceCriteria}
                    setPriceCriteria={setPriceCriteria}
                    models={models}
                    speedIndexCriteria={speedIndexCriteria}
                    setSpeedIndexCriteria={setSpeedIndexCriteria}
                    loadIndexCriteria={loadIndexCriteria}
                    setLoadIndexCriteria={setLoadIndexCriteria}
                    seasonCriteria={seasonCriteria}
                    setSeasonCriteria={setSeasonCriteria}
                    carTypeCriteria={carTypeCriteria}
                    setCarTypeCriteria={setCarTypeCriteria}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                /> 
                <Models
                    models={models}
                    dropDownCriteria={dropDownCriteria}
                    speedIndexCriteria={speedIndexCriteria}
                    loadIndexCriteria={loadIndexCriteria}
                    seasonCriteria={seasonCriteria}
                    carTypeCriteria={carTypeCriteria}
                    priceCriteria={priceCriteria}
                    messageAlert={messageAlert}
                    setOpenNavbar={setOpenNavbar}
                    modelQuantity={modelQuantity}
                    setModelQuantity={setModelQuantity}
                />
            </div>
        </div>
    );
}
