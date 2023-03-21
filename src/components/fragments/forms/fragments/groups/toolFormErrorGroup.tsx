import React, {Fragment} from "react";

import "./styles/tool-form-error-group.scss"

export interface IToolFormErrorGroup {
    errors: Array<string>
}

export function ToolFormErrorGroup(props: IToolFormErrorGroup) {
    return (<Fragment>
        <div className="tool-from-errors-group">
            <span id={'ready'}>
                {props.errors.length === 0 ? `Готово к отправке 🟢` : `Не готово к отправке 🔴`}
            </span>
            <span id={'errors'}>
                {props.errors.join('\n')}
            </span>
        </div>
    </Fragment>)
}