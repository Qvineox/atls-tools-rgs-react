import {Fragment} from "react";
import {IToolResponseFile} from "../../../../../models/reports/reports";
import {Link} from "react-router-dom";

interface IToolFormResultFilesProps {
    name: string
    files: Array<IToolResponseFile>
}

export default function ToolFormResultFiles(props: IToolFormResultFilesProps) {
    console.log(props)

    return <Fragment>
        {
            props.files?.length > 0 ? <div className="tool-form-result tool-form-result_files">
                <h2>{props.name}</h2>
                <div className={`files-container`}>
                    {props.files.map((file, index) => {
                        return <ResultFile key={index} file_name={file.file_name} public_url={file.public_url}
                                           description={file.description}/>
                    })}
                </div>
            </div> : <Fragment/>
        }
    </Fragment>
}

function ResultFile(props: IToolResponseFile) {
    return (<div className={`file-info`}>
        <h2>{props.file_name}</h2>
        <a href={process.env.REACT_APP_BACKEND_URL + props.public_url}>Скачивание файла</a>
        {
            props.description?.includes("http") ? <a href={props.description}>Доп. ссылка</a> :
                <p>{props.description}</p>
        }

    </div>)
}