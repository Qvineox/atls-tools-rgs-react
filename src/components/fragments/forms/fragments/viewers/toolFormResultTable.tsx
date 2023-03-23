import {Fragment, ReactNode} from "react";
import './tool-form-result-viewer.scss'

interface IToolFormResultTable {
    table: ReactNode
}

export default function ToolFormResultTable(props: IToolFormResultTable) {
    return <Fragment>
        {
            props.table ? <div className="tool-form-result tool-form-result_table">
                <h2>Собранная таблица</h2>
                <div className="table-container">
                    {props.table}
                </div>
            </div> : <Fragment/>
        }
    </Fragment>
}