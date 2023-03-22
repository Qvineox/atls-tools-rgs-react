import React from "react";
import {ToolResponse, ToolResponseError, IToolResponseFile} from "../reports";
import axios from "axios";

const API_ROUTE = "/api/reporting/processing/agreements/detailed"

interface IStatsByService {
    [key: string]: { allowed: number, denied: number };
}

interface IAgreementsDetailedSummaryResult {
    total_allowed: number
    total_denied: number
    total_other: number
    unrecognised_services: number
    missing_table_field: number
    services: IStatsByService
}

export class AgreementsDetailedSummary {
    report_id: number
    result: IAgreementsDetailedSummaryResult
    files: Array<IToolResponseFile>

    constructor(report_id: number, result: IAgreementsDetailedSummaryResult, files: Array<IToolResponseFile>) {
        this.report_id = report_id
        this.result = result
        this.files = files
    }

    static async send(file: File, save: boolean, saveFile: boolean) {
        const formData = new FormData()

        if (file === undefined) {
            return alert('Файл не загружен')
        } else {
            formData.append('file_upload', file)
            formData.append('file', file ? 'true' : 'false')
            formData.append('save', saveFile ? 'true' : 'false')
        }

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status < 300) {
            const toolResponse: ToolResponse = response.data

            if (toolResponse) {
                const summary: AgreementsDetailedSummary = response.data as AgreementsDetailedSummary

                if (summary) {
                    return new AgreementsDetailedSummary(summary.report_id, summary.result, summary.files)
                } else throw new Error(`JSON decoding error`)
            } else throw new Error(`Empty tool response`)
        } else throw response.data as ToolResponseError
    }

    private async load(id: number) {

    }

    public Render() {
        let rows: Array<JSX.Element> = []
        let index: number = 0

        Object.entries(this.result.services).forEach(entry => {
            rows.push(<tr key={index}>
                <td>{entry[0]}</td>
                <td>{entry[1].allowed}</td>
                <td>{entry[1].denied}</td>
                <td>{entry[1].allowed + entry[1].denied}</td>
            </tr>)

            index += 1
        })

        return (<table className={'detailed-agreements'}>
            <thead>
            <tr>
                <td className={'service-name'}>
                    Система
                </td>
                <td className={'allowed'}>
                    Согласовано
                </td>
                <td className={'denied'}>
                    Отклонено
                </td>
                <td className={'summary'}>
                    Всего
                </td>
            </tr>
            </thead>
            <tbody>
            {
                rows
            }
            </tbody>
            <tfoot>
            <tr>
                <td className={'service-name'}>Всего</td>
                <td className={'allowed'}>{this.result.total_allowed}</td>
                <td className={'denied'}>{this.result.total_denied}</td>
                <td className={'summary'}>{this.result.total_allowed + this.result.total_denied}</td>
            </tr>
            </tfoot>
        </table>)
    }

    public GetSummary() {
        if (this.report_id !== 0) {
            return `Файл обработан.
                Отчет сохранен. ID#${this.report_id}\n
                Всего согласований: ${this.result.total_allowed + this.result.total_denied}
                Всего систем: ${Object.entries(this.result.services).length}\n
                Согласовано: ${this.result.total_allowed}
                Отклонено: ${this.result.total_denied}
                Другой статус: ${this.result.total_other}`
        } else {
            return `Файл обработан.\n
                Всего согласований: ${this.result.total_allowed + this.result.total_denied}
                Всего систем: ${Object.entries(this.result.services).length}\n
                Согласовано: ${this.result.total_allowed}
                Отклонено: ${this.result.total_denied}
                Другой статус: ${this.result.total_other}`
        }
    }

    public GetFiles() {
        return this.files
    }
}