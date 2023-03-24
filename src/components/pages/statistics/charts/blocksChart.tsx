import {ApexOptions} from "apexcharts";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import axios from "axios";
import ATLSError from "../../../../models/error";
import ReactApexChart from "react-apexcharts";
import {toast} from "react-toastify";

const firedColor = '#fb7100'
const decreeColor = '#ffc026'
const securityColor = '#219EBC'

const chartOptions: ApexOptions = {
    chart: {
        type: 'area',
        zoom: {
            enabled: true
        },
        height: '20vh'
    },
    markers: {
        colors: [firedColor, decreeColor, securityColor]
    },
    legend: {
        containerMargin: {
            top: -10
        },
        position: 'bottom',
    },
    dataLabels: {
        enabled: true
    },
    stroke: {
        curve: 'smooth',
        colors: [firedColor, decreeColor, securityColor]
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

interface IRegularBlockReportData {
    created_at: Date
    fired_accounts_blocked: number
    decree_accounts_blocked: number
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
}

interface IBlocksChartProps {
    startDate: string
    endDate: string
}

export default function BlocksChart(props: IBlocksChartProps) {
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

            axios.get(process.env.REACT_APP_BACKEND_URL + `/api/statistics/blocks`, {
                params: {
                    'start_date': _startDate.toISOString(),
                    'end_date': _endDate.toISOString(),
                }
            }).then((response) => {
                let pointsFiredBlocked: Array<{ x: Date, y: number }> = []
                let pointsDecreeBlocked: Array<{ x: Date, y: number }> = []
                let pointsSecurityBlocked: Array<{ x: Date, y: number }> = []

                let stats = response.data as Array<IRegularBlockReportData>

                stats.forEach((item) => {
                    pointsFiredBlocked.push({x: item.created_at, y: item.fired_accounts_blocked})
                    pointsDecreeBlocked.push({x: item.created_at, y: item.decree_accounts_blocked})
                    pointsSecurityBlocked.push({
                        x: item.created_at,
                        y: item.total_system_accounts_blocked + item.total_domain_accounts_blocked
                    })
                })

                setChartSeriesData([{
                    type: 'area',
                    color: firedColor,
                    name: 'Увольнения',
                    data: pointsFiredBlocked
                }, {
                    type: 'area',
                    color: decreeColor,
                    name: 'Сотрудники в декрете',
                    data: pointsDecreeBlocked
                }, {
                    type: 'area',
                    color: securityColor,
                    name: 'Нарушения ДЭБ',
                    data: pointsSecurityBlocked
                }])
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
            })
        }
    }, [props])

    return (
        <div className="chart chart_agreements">
            <h2>Блокировки учетных записей</h2>
            <ReactApexChart height={'600px'} type={'line'}
                            series={chartSeriesData}
                            options={chartOptions}/>
        </div>
    )
}