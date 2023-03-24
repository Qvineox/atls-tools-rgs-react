import {ReactNode} from "react";
import axios from "axios";
import ATLSError from "../error";
import {toast} from "react-toastify";

export class ToolResponse {
    report_id: number
    result: string
    files: Array<IToolResponseFile>

    constructor(reportId: number, result: string, files: Array<IToolResponseFile>) {
        this.report_id = reportId
        this.result = result
        this.files = files
    }
}

export class ToolResponseError {
    message: string
    description: number

    constructor(message: string, description: number) {
        this.message = message
        this.description = description
    }
}

export interface IToolResponseFile {
    readonly file_name: string
    readonly public_url: string
    readonly description: string
}

export abstract class Report {
    report_id: number
    result: any // main body of a report
    files: Array<IToolResponseFile>

    abstract renderTable(): ReactNode

    abstract renderChart(): ReactNode

    protected constructor(report_id: number, files: Array<IToolResponseFile>) {
        this.report_id = report_id
        this.files = files
    }

    abstract summary(): string

    abstract load(): void

    getFiles(): Array<IToolResponseFile> {
        return this.files
    }

    delete(): void {
        axios({
            method: 'DELETE',
            url: process.env.REACT_APP_BACKEND_URL + "/api/reporting/report",
            params: {
                'id': this.report_id
            }
        }).then(() => {
            toast.success(`Отчет №${this.report_id} удален.`)
        }).catch(error => {
            ATLSError.fromAxios(error).toast()
        })
    }
}



