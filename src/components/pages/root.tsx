import {Fragment} from "react";
import Navbar from "../navigation/navbar";
import {Outlet} from "react-router-dom";

import './styles/root.scss'

export default function Root() {
    return <Fragment>
        <Navbar/>
        <div className="page-body">
            <Outlet/>
        </div>
    </Fragment>
}