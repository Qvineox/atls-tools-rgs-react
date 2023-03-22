import {Fragment} from "react";
import {Outlet} from "react-router-dom";

import './tools-root.scss'

export default function ToolsRoot() {
    return (<Fragment>
        <div className="tool-body">
            <Outlet/>
        </div>
    </Fragment>)
}