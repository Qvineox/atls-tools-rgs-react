import React, {Fragment} from "react";

import './tool-form-fields.scss'

export interface IToolFormTextAreaProps {
    name: string // css selector name
    label: string
    value: string
    mode: "none" | "search" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | undefined
    controller: React.Dispatch<React.SetStateAction<string>>
}

export function ToolFormTextAreaField(props: IToolFormTextAreaProps) {
    return (<Fragment>
        <div className={"tool-form-parameter tool-form-parameter_textarea-field"}>
            <label htmlFor={props.name}>{props.label}</label>
            <textarea onChange={(event) => props.controller(event.target.value)}
                      value={props.value} name={props.name} inputMode={props.mode}/>
        </div>
    </Fragment>)
}