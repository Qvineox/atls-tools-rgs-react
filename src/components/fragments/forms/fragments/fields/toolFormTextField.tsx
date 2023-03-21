import React, {Fragment} from "react";

import './tool-form-fields.scss'

export interface IToolFormTextProps {
    name: string // css selector name
    label: string
    value: string
    controller: React.Dispatch<React.SetStateAction<string>>
}

export function ToolFormTextField(props: IToolFormTextProps) {
    return (<Fragment>
        <div className={"tool-form-parameter tool-form-parameter_text-field"}>
            <label htmlFor={props.name}>{props.label}</label>
            <input value={props.value}
                   onChange={(event) => props.controller(event.target.value)}
                   name={props.name} type="text"/>
        </div>
    </Fragment>)
}