import React, {Fragment} from "react";

import '../styles/tool-form-text-field.scss'

export interface IToolFormDatePeriodProps {
    name: string // css selector name
    label: string
    value: string // date as ISO string
    controller: React.ChangeEventHandler<HTMLInputElement> // single controller
}

export function ToolFormDatePeriodField(props: IToolFormDatePeriodProps) {
    return (<Fragment>
        <div className={"tool-form-parameter tool-form-parameter_date-period-field"}>
            <label htmlFor={props.name}>{props.label}</label>
            <div className="date-period-inputs-group">
                <input value={props.value}
                       onChange={props.controller}
                       name={props.name} type="date"/>
                <input value={props.value}
                       onChange={props.controller}
                       name={props.name} type="date"/>
            </div>
        </div>
    </Fragment>)
}