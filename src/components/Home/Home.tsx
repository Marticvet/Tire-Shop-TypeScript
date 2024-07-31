import "./styles/Home.css";
import React from "react";
// @ts-ignore
import { Banner } from "./Banner.tsx";
// @ts-ignore
import Partners from "./Partners.tsx";
// @ts-ignore
import Service from "../Service/Service.tsx";

export function Home(){

  return (
    <div className="home">
        <Banner />
        <Partners />
        <Service />
    </div>
  )
}