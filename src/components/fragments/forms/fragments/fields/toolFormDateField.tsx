import React, {Fragment} from "react";

import './tool-form-fields.scss'

export interface IToolFormDateProps {
    name: string // css selector name
    label: string
    value: string // date as ISO string
    controller: React.Dispatch<React.SetStateAction<string>>
}

export function ToolFormDateField(props: IToolFormDateProps) {
    return (<Fragment>
        <div className={"tool-form-parameter tool-form-parameter_date-field"}>
            <label htmlFor={props.name}>{props.label}</label>
            <input value={props.value}
                   onChange={(event) => props.controller(event.target.value)}
                   name={props.name} type="date"/>
        </div>
    </Fragment>)
}