import '../fields/toolFormFileUploadField'
import React, {Fragment, ReactNode} from "react";
import {Outlet} from "react-router-dom";

import './styles/tool-from-field-group.scss'

interface IToolFormFieldGroup {
    children: ReactNode
}

export default function ToolFormFieldGroup(props: IToolFormFieldGroup) {
    return (<Fragment>
        <div className="tool-form-field-group">
            {props.children}
        </div>
    </Fragment>)
}