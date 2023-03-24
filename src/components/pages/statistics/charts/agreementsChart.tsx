import {ApexOptions} from "apexcharts";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import axios from "axios";
import ATLSError from "../../../../models/error";
import ReactApexChart from "react-apexcharts";
import {toast} from "react-toastify";

const allowedColor = '#3a8300'
const deniedColor = '#ff3c31'

const chartOptions: ApexOptions = {
    chart: {
        type: 'area',
        zoom: {
            enabled: true
        },
        height: '20vh',
    },
    markers: {
        colors: [allowedColor, deniedColor]
    },
    legend: {
        containerMargin: {
            top: -20
        },
        position: 'bottom',
    },
    dataLabels: {
        enabled: true
    },
    stroke: {
        curve: 'straight',
        colors: [allowedColor, deniedColor]
    },
    xaxis: {
        type: 'datetime',
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 0.55,
            opacityFrom: 0.25,
            opacityTo: 0.45,
            stops: [0, 45, 90]
        }
    }
}

interface IAgreementsReportData {
    created_at: Date
    allowed: number
    denied: number
}

interface IAgreementsChartProps {
    startDate: string
    endDate: string
}

export default function AgreementsChart(props: IAgreementsChartProps) {
    let [chartSeriesData, setChartSeriesData] = useState<ApexAxisChartSeries>([])

    useEffect(() => {
        let _startDate = moment(props.startDate)
        let _endDate = moment(props.endDate)

        if (_endDate < _startDate) {
            toast.error("Неправильно выбран диапазон.")

            document.getElementById('start-date')?.classList.add('error')
            document.getElementById('end-date')?.classList.add('error')
            return
        } else {
            document.getElementById('start-date')?.classList.remove('error')
            document.getElementById('end-date')?.classList.remove('error')

            _startDate.set('hour', 0).set('minutes', 0)
            _endDate.set('hour', 23).set('minutes', 59)

            axios.get(process.env.REACT_APP_BACKEND_URL + `/api/statistics/agreements`, {
                params: {
                    'start_date': _startDate.toISOString(),
                    'end_date': _endDate.toISOString(),
                }
            }).then((response) => {
                let pointsAllowed: Array<{ x: Date, y: number }> = []
                let pointsDenied: Array<{ x: Date, y: number }> = []

                let stats = response.data as Array<IAgreementsReportData>

                stats.forEach((item) => {
                    pointsAllowed.push({x: item.created_at, y: item.allowed})
                    pointsDenied.push({x: item.created_at, y: item.denied})
                })

                setChartSeriesData([{
                    type: 'area',
                    color: allowedColor,
                    name: 'Согласовано',
                    data: pointsAllowed
                }, {
                    type: 'area',
                    color: deniedColor,
                    name: 'Отклонено',
                    data: pointsDenied
                }])
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
            })
        }


    }, [props])

    return (
        <div className="chart chart_agreements">
            <h2>Согласования</h2>
            <ReactApexChart height={'600px'} type={'line'}
                            series={chartSeriesData}
                            options={chartOptions}/>
        </div>
    )
}