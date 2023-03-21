import axios from "axios";
import React, {Fragment} from "react";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";

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

export class AgreementsDefaultSummary {
    private readonly allowed: number
    private readonly denied: number
    private readonly working: number
    private readonly other: number


    constructor(allowed: number, denied: number, working: number, other: number) {
        this.allowed = allowed
        this.denied = denied
        this.working = working
        this.other = other
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
        //     const toolResponse: AgreementsDefaultSummary = response.data
        //
        //     return new AgreementsDefaultSummary(toolResponse.allowed, toolResponse.denied, toolResponse.working, toolResponse.other)
        // } throw new Error(response.data)

        return new AgreementsDefaultSummary(54, 6, 2, 7)
    }

    static async load(id: number) {

    }

    public Render() {
        return (<ReactApexChart height={'400px'} width={'600px'} type={'donut'}
                                series={[this.allowed, this.denied, this.working]}
                                options={chartOptions}/>)
    }

    public Summary() {
        return `Отчет сохранен.\n
                Всего согласований: ${this.allowed + this.denied}\n
                Согласовано: ${this.allowed}
                Отклонено: ${this.denied}\nВ работе: ${this.working}
                Другой статус: ${this.other}`
    }
}