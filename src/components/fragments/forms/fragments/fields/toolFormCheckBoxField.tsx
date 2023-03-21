import React, {Fragment} from "react";

import './tool-form-fields.scss'

export interface IToolFormCheckBoxProps {
    name: string // css selector name
    label: string
    value: boolean
    controller: React.Dispatch<React.SetStateAction<boolean>>
}

export function ToolFormCheckBoxField(props: IToolFormCheckBoxProps) {
    return (<Fragment>
        <div className={"tool-form-parameter tool-form-parameter_checkbox-field"}>
            <input checked={props.value}
                   onChange={(evt) => {
                       props.controller(evt.target.checked)
                   }}
                   name={props.name} type="checkbox"/>
            <label htmlFor={props.name}>{props.label}</label>
        </div>
    </Fragment>)
}