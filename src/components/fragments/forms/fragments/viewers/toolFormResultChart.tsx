import {Fragment, ReactNode} from "react";
import './tool-form-result-viewer.scss'

interface IToolFormResultDiagram {
    chart: ReactNode
}

export default function ToolFormResultChart(props: IToolFormResultDiagram) {
    return <Fragment>
        {
            props.chart ? <div className="tool-form-result tool-form-result_diagram">
                <h2>Диаграмма выполнения</h2>
                <div className="diagram-container">
                    {props.chart}
                </div>
            </div> : <Fragment/>
        }
    </Fragment>
}