import {Fragment} from "react";
import {ToolResponseFile} from "../../../../../models/reports/reports";
import {Link} from "react-router-dom";

interface IToolFormResultFilesProps {
    files: Array<ToolResponseFile>
}

export default function ToolFormResultFiles(props: IToolFormResultFilesProps) {
    console.log(props)

    return <Fragment>
        {
            props.files.length > 0 ? <div className="tool-form-result tool-form-result_files">
                <h2>Собранные файлы</h2>
                <div className={`files-container`}>
                    {props.files.map((file, index) => {
                        return <ResultFile key={index} FileName={file.FileName} PublicURL={file.PublicURL}
                                           Description={file.Description}/>
                    })}
                </div>
            </div> : <Fragment/>
        }
    </Fragment>
}

function ResultFile(props: ToolResponseFile) {
    return (<div className={`file-info`}>
        <h2>{props.FileName}</h2>
        <Link to={props.PublicURL}>Скачивание файла</Link>
        {
            props.Description.includes("http") ? <Link to={props.Description}>Доп. ссылка</Link> :
                <p>{props.Description}</p>
        }

    </div>)
}