import {IToolResponseFile, Report} from "../reports";
import React from "react";
import axios from "axios";
import moment from "moment";

const API_ROUTE = "/api/reporting/processing/security/terrorists"

interface ITerroristRecord {
    first_name: string
    middle_name: string
    last_name: string
    birth_date: Date
}

interface ITerroristsContent {
    category: string
    description: string
    source: string
    terrorist_list: Array<ITerroristRecord>
}

export class TerroristReport extends Report {
    result: ITerroristsContent

    constructor(report_id: number, result: ITerroristsContent, files: Array<IToolResponseFile>) {
        super(report_id, files)
        this.result = result
    }

    static async send(terroristsString: string, category: string, description: string, source: string, save: boolean) {
        const formData = new FormData()

        formData.append('terrorists_string', terroristsString)
        formData.append('category', category)
        formData.append('description', description)
        formData.append('source', source)
        formData.append('save', save ? 'true' : 'false')

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status < 300) {
            const summary: TerroristReport = response.data as TerroristReport

            if (summary) {
                return new TerroristReport(summary.report_id, summary.result, summary.files)
            } else throw new Error(`JSON decoding error`)
        }
    }

    public renderTable() {
        let rows: Array<JSX.Element> = []
        let index: number = 0

        if (this.result.terrorist_list) {
            this.result.terrorist_list.forEach(entry => {
                rows.push(<tr key={index++}>
                    <td className={'index'}>{index+1}</td>
                    <td className={'last-name'}>{entry.last_name}</td>
                    <td className={'first-name'}>{entry.first_name}</td>
                    <td className={'middle-name'}>{entry.middle_name}</td>
                    <td className={'birth-date'}>{moment(entry.birth_date).format('DD.MM.YYYY')}</td>
                </tr>)
            })
        }

        return (<table className={'terrorists'}>
            <thead>
            <tr>
                <td className={'index'}>#</td>
                <td className={'last-name'}>
                    Фамилия
                </td>
                <td className={'first-name'}>
                    Имя
                </td>
                <td className={'middle-name'}>
                    Отчество
                </td>
                <td className={'birth-date'}>
                    Дата рождения
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

            </tr>
            </tfoot>
        </table>)
    }

    public summary() {
        if (this.report_id !== 0) {
            return `Файл обработан.
                Отчет сохранен. ID#${this.report_id}\n
                Всего террористов: ${this.result.terrorist_list?.length}`
        } else {
            return `Файл обработан.\n
                Всего террористов: ${this.result.terrorist_list?.length}`
        }
    }

    load(): void {
    }

    renderChart(): React.ReactNode {
        return undefined;
    }
}