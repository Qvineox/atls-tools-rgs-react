import {FormEventHandler, Fragment, ReactNode} from "react";

import './tool-form.scss'

export interface IToolFormProps {
    onReset: () => void
    onSubmit: FormEventHandler<HTMLFormElement>
    children: Array<ReactNode>
}


export function ToolForm(props: IToolFormProps) {
    return (
        <Fragment>
            <form className="tool-form" onReset={props.onReset} onSubmit={props.onSubmit}>
                {props.children}
            </form>
        </Fragment>
    )
}