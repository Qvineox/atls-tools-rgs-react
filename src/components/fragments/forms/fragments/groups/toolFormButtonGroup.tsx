import React, {Fragment} from "react";

import './styles/tool-form-button-group.scss'

interface IToolFormButtonGroup {
    isDisabled: boolean
}

export default function ToolFormFieldGroup(props: IToolFormButtonGroup) {
    return (<Fragment>
        <div className="tool-form-button-group">
            <button type={'reset'} className={'reset'}>Сбросить</button>
            <button type={'submit'} className={'execute'}
                    disabled={props.isDisabled}>Выполнить
            </button>
        </div>
    </Fragment>)
}