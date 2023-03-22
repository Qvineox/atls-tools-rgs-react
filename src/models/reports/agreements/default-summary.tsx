import axios from "axios";
import React from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {ToolResponse, ToolResponseError} from "../reports";

const API_ROUTE = "/api/reporting/processing/agreements/default"
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


interface IAgreementsDefaultSummaryResult {
    allowed: number
    denied: number
    working: number
    other: number
}

export class AgreementsDefaultSummary {
    report_id: number
    result: IAgreementsDefaultSummaryResult

    constructor(report_id: number, result: { allowed: number; denied: number; working: number; other: number; }) {
        this.report_id = report_id
        this.result = result
    }

    static async send(file: File, save: boolean) {
        const formData = new FormData()

        if (file === undefined) {
            return alert('Файл не загружен')
        } else {
            formData.append('file_upload', file)
            formData.append('save', save ? 'true' : 'false')
        }

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status < 300) {
            const toolResponse: ToolResponse = response.data

            if (toolResponse) {
                const summary: AgreementsDefaultSummary = response.data as AgreementsDefaultSummary

                if (summary) {
                    return new AgreementsDefaultSummary(summary.report_id, summary.result)
                } else throw new Error(`JSON decoding error`)
            } else throw new Error(`Empty tool response`)
        } else throw response.data as ToolResponseError
    }

    static async load(id: number) {

    }

    public Render() {
        return (<ReactApexChart height={'400px'} width={'600px'} type={'donut'}
                                series={[this.result.allowed, this.result.denied, this.result.working]}
                                options={chartOptions}/>)
    }

    public Summary() {
        if (this.report_id !== 0) {
            return `Файл обработан.
                Отчет сохранен. ID#${this.report_id}\n
                Всего согласований: ${this.result.allowed + this.result.denied}\n
                Согласовано: ${this.result.allowed}
                Отклонено: ${this.result.denied}\nВ работе: ${this.result.working}
                Другой статус: ${this.result.other}`
        } else {
            return `Файл обработан.\n
                Всего согласований: ${this.result.allowed + this.result.denied}\n
                Согласовано: ${this.result.allowed}
                Отклонено: ${this.result.denied}\nВ работе: ${this.result.working}
                Другой статус: ${this.result.other}`
        }
    }
}