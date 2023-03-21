import React, {Fragment} from "react";

interface IToolFormFileUploadProps {
    name: string;
    label: string;
    availableFileExtensions: Array<string>;
    controller: React.Dispatch<File>
}

export default function ToolFormFileUploadField(props: IToolFormFileUploadProps) {
    function fileUploadController(evt: React.ChangeEvent<HTMLInputElement>) {
        if (evt.target.files) {
            props.controller(evt.target.files[0])
        }
    }

    return (
        <Fragment>
            <div className={"tool-form-parameter tool-form-parameter_file-upload-field"}>
                <label htmlFor={props.name}>{props.label}</label>
                <input name={props.name} onChange={(evt) => fileUploadController(evt)} type="file"
                       accept={props.availableFileExtensions.join(',')} multiple={false}/>
            </div>
        </Fragment>
    )
}