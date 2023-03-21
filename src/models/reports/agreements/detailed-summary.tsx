import React, {Fragment, ReactNode} from "react";
import {ApexOptions} from "apexcharts";
import {ToolResponseFile} from "../reports";

const API_ROUTE = "/api/reporting/processing/agreements/detailed"
const chartOptions: ApexOptions = {
    chart: {
        zoom: {
            enabled: true
        },
        height: '20vh',
    },
    colors: [
        '#53af0c', '#d33e3e', '#ffa631'
    ],
    labels: [
        'Согласовано', 'Отказано', 'В работе'
    ],
    stroke: {
        show: false
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: [
                'whitesmoke'
            ],
            fontSize: '1rem'
        }
    },
    legend: {
        position: 'bottom'
    }
}

export class AgreementsDetailedSummary {
    private readonly total_allowed: number
    private readonly total_denied: number
    private readonly total_other: number
    private readonly unrecognised_services: number
    private readonly missing_table_field: number
    private readonly services: Map<string, { allowed: number, denied: number }>
    private files: Array<ToolResponseFile>

    constructor(total_allowed: number, total_denied: number, total_other: number, unrecognised_services: number, missing_table_field: number, services: Map<string, { allowed: number, denied: number }>) {
        this.total_allowed = total_allowed
        this.total_denied = total_denied
        this.total_other = total_other
        this.unrecognised_services = unrecognised_services
        this.missing_table_field = missing_table_field
        this.services = services

        this.files = []
    }

    private addFiles(files: Array<ToolResponseFile>) {
        this.files = this.files.concat(files)
    }

    static async send(file: File, save: boolean) {
        const formData = new FormData()

        if (file === undefined) {
            return alert('Файл не загружен')
        } else {
            formData.append('file_upload', file)
            formData.append('save', save ? 'true' : 'false')
        }

        // const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
        //
        // if (response.status === 200) {
        //     const toolResponse: AgreementsDetailedSummary = response.data
        //
        //     return new AgreementsDetailedSummary(toolResponse.total_allowed,
        //         toolResponse.total_denied,
        //         toolResponse.total_other,
        //         toolResponse.unrecognised_services,
        //         toolResponse.missing_table_field,
        //         toolResponse.services
        //     )
        // }
        // throw new Error(response.data)

        let summary = new AgreementsDetailedSummary(54, 6, 2, 2, 1, new Map<string, { allowed: number; denied: number }>(
            [["сервис1", {allowed: 10, denied: 4}], ["сервис2", {allowed: 21, denied: 33}]]
        ))

        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест1",
            Description: "https://yandex.ru",
            PublicURL: "https://yandex.ru"
        }))
        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест2",
            Description: "Описание 2",
            PublicURL: "https://yandex.ru"
        }))

        console.log(summary)

        return summary
    }

    private async load(id: number) {

    }

    public Render() {
        let rows: Array<JSX.Element> = []
        let index: number = 0

        this.services.forEach((value, key) => {
            rows.push(<tr key={index}>
                <td>{key}</td>
                <td>{value.allowed}</td>
                <td>{value.denied}</td>
                <td>{value.allowed + value.denied}</td>
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
                <td className={'allowed'}>{this.total_allowed}</td>
                <td className={'denied'}>{this.total_denied}</td>
                <td className={'summary'}>{this.total_allowed + this.total_denied}</td>
            </tr>
            </tfoot>
        </table>)
    }

    public GetSummary() {
        return `Отчет сохранен.\n
                Всего согласований: ${this.total_allowed + this.total_denied}
                Всего систем: ${this.services.size}\n
                Согласовано: ${this.total_allowed}
                Отклонено: ${this.total_denied}
                Другой статус: ${this.total_other}`
    }

    public GetFiles() {
        return this.files
    }
}