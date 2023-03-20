import React, {Fragment} from "react";
import '../../styles/pages/jobs.scss'
import {Outlet} from "react-router-dom";

export interface IToolResponseFile {
    file_name: string;
    public_url: string;
    description: string;
}

export interface IToolResponse {
    files: Array<IToolResponseFile>
    report_id: number;
    result: any
}

export function ResolvedFile({file_name, public_url, description}: IToolResponseFile) {

    function download() {

    }

    return (
        <li className={'resolved-file'}>
            <label>Приложенный файл</label>
            <h2>{file_name}</h2>
            <a href={process.env.REACT_APP_BACKEND_URL + public_url} download>Скачать</a>
            {
                description.substring(0, 4) === 'http' ? <a href={description}>Сервис</a> : null
            }
        </li>
    )
}

export default function Tools() {
    return (
        <Fragment>
            <div className="page-content">
                <Outlet/>
            </div>
        </Fragment>
    )
}

