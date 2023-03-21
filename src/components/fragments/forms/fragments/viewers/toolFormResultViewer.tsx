import {Fragment, ReactNode} from "react";

import './tool-form-result-viewer.scss'

interface IToolFormResultViewer {
    isLoaded: boolean
    children: ReactNode
}

export function ToolFormResultViewer(props: IToolFormResultViewer) {
    return (<Fragment>
        <div className={`tool-form-result-viewer ${props.isLoaded ? `hidden` : `visible`}`}>
            {props.children}
        </div>
    </Fragment>)
}

interface IToolFormResultExtendedViewer extends IToolFormResultViewer {
    summary: string | undefined
}

export function ToolFormResultExtendedViewer(props: IToolFormResultExtendedViewer) {
    return (<Fragment>
        <div className={`tool-form-result-viewer_extended ${props.isLoaded ? `hidden` : `visible`}`}>
            {props.summary ? <ToolFormResultSummary summary={props.summary}/> : <Fragment/>}
            <ToolFormResultViewer isLoaded={props.isLoaded}>
                {props.children}
            </ToolFormResultViewer>
        </div>
    </Fragment>)
}


interface IToolFormResultSummaryProps {
    summary: string // formatted string value of a report
}

function ToolFormResultSummary(props: IToolFormResultSummaryProps) {
    return <Fragment>
        <div className="tool-form-result-summary">
            <h2>Результат выполнения</h2>
            <p>{props.summary}</p>
        </div>
    </Fragment>
}