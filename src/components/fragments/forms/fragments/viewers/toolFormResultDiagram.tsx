import {Fragment, ReactNode} from "react";

interface IToolFormResultDiagram {
    diagram: ReactNode
}
export default function ToolFormResultDiagram(props: IToolFormResultDiagram) {
    return <Fragment>
        <div className="tool-form-result tool-form-result_diagram">
            <h2>Диаграмма выполнения</h2>
            <div className="diagram-container">
                {props.diagram}
            </div>
        </div>
    </Fragment>
}