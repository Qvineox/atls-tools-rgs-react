import {Fragment, ReactNode} from "react";

interface IToolFormResultTable {
    table: ReactNode
}

export default function ToolFormResultTable(props: IToolFormResultTable) {
    return <Fragment>
        <div className="tool-form-result tool-form-result_table">
            <h2>Собранная таблица</h2>
            <div className="table-container">
                {props.table}
            </div>
        </div>
    </Fragment>
}