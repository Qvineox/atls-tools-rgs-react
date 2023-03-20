import {Fragment} from "react";
import Navbar from "../navigation/navbar";
import {Outlet} from "react-router-dom";

export default function Root() {
    return <Fragment>
        <Navbar/>
        <Outlet/>
    </Fragment>
}