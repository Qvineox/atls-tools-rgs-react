import {ApexOptions} from "apexcharts";
import React, {ReactNode} from "react";
import ReactApexChart from "react-apexcharts";
import {IToolResponseFile, Report} from "../reports";
import axios from "axios";
import ATLSError from "../../error";

interface IAgreementsDefaultContent {
    allowed: number
    denied: number
    working: number
    other: number
}

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

export class AgreementsDefaultReport extends Report {
    result: IAgreementsDefaultContent

    public renderChart(): ReactNode {
        return (<ReactApexChart height={'400px'} width={'600px'} type={'donut'}
                                series={[this.result.allowed, this.result.denied, this.result.working]}
                                options={chartOptions}/>)
    }

    public renderTable(): ReactNode {
        return undefined;
    }

    public summary(): string {
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

    public load() {
        return false
    }

    constructor(report_id: number, result: IAgreementsDefaultContent, files: Array<IToolResponseFile>) {
        super(report_id, files);
        this.result = result
    }

    public static async send(file: File, save: boolean): Promise<AgreementsDefaultReport> {
        const formData = new FormData()

        if (file === undefined) {
            alert('Файл не загружен')
            throw new Error(`File not loaded`)
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
            const summary: AgreementsDefaultReport = response.data as AgreementsDefaultReport

            if (summary) {
                return new AgreementsDefaultReport(summary.report_id, summary.result, summary.files)
            } else throw new Error(`JSON decoding error`)
        } else {
            const error: ATLSError = response.data as ATLSError
            error.alert()
            throw new Error(`Request error`)
        }
    }
}