import React, {Fragment} from "react";

interface IFileUploadProps {
    title: string;
    availableFileExtensions: Array<string>;
    fileSet: React.Dispatch<File>
}

export default function FileUpload(props: IFileUploadProps) {
    function fileUploadController(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.files) {
            props.fileSet(evt.target.files[0])
        }
    }

    return (
        <Fragment>
            <div className="tool-parameter-group file-upload">
                <label>{props.title}</label>
                <input onChange={(evt) => fileUploadController(evt)} type="file"
                       accept={props.availableFileExtensions.join(',')} multiple={false}/>
            </div>
        </Fragment>
    )
}