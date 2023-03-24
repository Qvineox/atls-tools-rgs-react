import React, {useEffect, useState} from "react";
import {ApexOptions} from "apexcharts";
import moment from "moment";
import ReactApexChart from "react-apexcharts";
import "./statistics.scss"
import axios from "axios";
import ATLSError from "../../../models/error";


interface IAgreementReportData {
    created_at: Date
    allowed: number
    denied: number
}

interface IRegularBlockReportData {
    created_at: Date
    fired_accounts_blocked: number
    decree_accounts_blocked: number
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
}

interface ISecurityBlockReportData {
    created_at: Date
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
}


interface IStatisticsData {
    agreement_reports: Array<IAgreementReportData>
    block_reports: Array<IRegularBlockReportData>
}

const allowedColor = '#3a8300'
const deniedColor = '#ff3c31'

const firedColor = '#fb7100'
const decreeColor = '#ffc026'
const securityColor = '#219EBC'

export default function Statistics() {
    document.title = 'Статистика'

    const [statisticsData, setStatisticsData] = useState<IStatisticsData>({
        agreement_reports: [],
        block_reports: [],
    })

    useEffect(() => {
        const now = moment()

        axios.get(process.env.REACT_APP_BACKEND_URL + `/api/statistics/agreements`, {
            params: {
                'end_date': now.toISOString(),
                'start_date': now.subtract(30, 'days').toISOString(),
            }
        }).then((response) => {
            if (response.data) {
                setStatisticsData(prevState => ({
                    ...prevState,
                    agreement_reports: response.data as Array<IAgreementReportData>
                }))
            }
        }).catch(error => {
            ATLSError.fromAxios(error).toast()
        })
    }, [])

    return (
        <div>
            <div className={'page-content'}>
                <header>
                    Статистика
                </header>
                <div className="statistics-panel">
                    {
                        statisticsData.agreement_reports.length > 0 ?
                            <AgreementChart agreementsByDate={statisticsData.agreement_reports}/> : null
                    }
                    {
                        statisticsData.agreement_reports.length > 0 ?
                            <BlockChart agreementsByDate={statisticsData.agreement_reports}/> : null
                    }
                </div>

            </div>
        </div>
    )
}

interface IAgreementChartProps {
    agreementsByDate: Array<IAgreementReportData>
}

export function AgreementChart({agreementsByDate}: IAgreementChartProps) {
    let [chartSeriesData, setChartSeriesData] = useState<ApexAxisChartSeries>([])
    let [chartOptions, setChartOptions] = useState<ApexOptions>({
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
                top: -10
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
    })

    useEffect(() => {
        let pointsAllowed: Array<{ x: Date, y: number }> = []
        let pointsDenied: Array<{ x: Date, y: number }> = []
        let dates: Array<Date> = []

        const now = moment()

        axios.get(process.env.REACT_APP_BACKEND_URL + `/api/statistics/agreements`, {
            params: {
                'end_date': now.toISOString(),
                'start_date': now.subtract(30, 'days').toISOString(),
            }
        }).then((response) => {
            let stats = response.data as Array<IAgreementReportData>

            stats.forEach((item) => {
                pointsAllowed.push({x: item.created_at, y: item.allowed})
                pointsDenied.push({x: item.created_at, y: item.denied})

                dates.push(item.created_at)
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

            setChartOptions(prevState => ({
                ...prevState,
                xaxis: {
                    type: 'datetime',
                    categories: dates,
                    position: 'bottom',
                    labels: {
                        style: {
                            fontSize: '1rem',
                            fontFamily: 'Courier New'
                        }
                    }
                },
            }))
        }).catch(error => {
            ATLSError.fromAxios(error).toast()
        })
    }, [agreementsByDate])

    return (
        <div className="statistics_agreements">
            <h2>Согласования</h2>
            <ReactApexChart height={'600px'} type={'line'}
                            series={chartSeriesData}
                            options={chartOptions}/>
        </div>
    )
}

export function BlockChart({agreementsByDate}: IAgreementChartProps) {
    let [chartSeriesData, setChartSeriesData] = useState<ApexAxisChartSeries>([])
    let [chartOptions, setChartOptions] = useState<ApexOptions>({
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
    })

    useEffect(() => {
        let pointsFiredBlocked: Array<{ x: Date, y: number }> = []
        let pointsDecreeBlocked: Array<{ x: Date, y: number }> = []
        let pointsSecurityBlocked: Array<{ x: Date, y: number }> = []
        let dates: Array<Date> = []

        const now = moment()

        axios.get(process.env.REACT_APP_BACKEND_URL + `/api/statistics/blocks`, {
            params: {
                'end_date': now.toISOString(),
                'start_date': now.subtract(30, 'days').toISOString(),
            }
        }).then((response) => {
            let stats = response.data as Array<IRegularBlockReportData>

            stats.forEach((item) => {
                pointsFiredBlocked.push({x: item.created_at, y: item.fired_accounts_blocked})
                pointsDecreeBlocked.push({x: item.created_at, y: item.decree_accounts_blocked})
                pointsSecurityBlocked.push({
                    x: item.created_at,
                    y: item.total_system_accounts_blocked + item.total_domain_accounts_blocked
                })

                dates.push(item.created_at)
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

            setChartOptions(prevState => ({
                ...prevState,
                xaxis: {
                    type: 'datetime',
                    categories: dates,
                    position: 'bottom',
                    labels: {
                        style: {
                            fontSize: '1rem',
                            fontFamily: 'Courier New'
                        }
                    }
                },
            }))
        }).catch(error => {
            ATLSError.fromAxios(error).toast()
        })
    }, [agreementsByDate])

    return (
        <div className="statistics_agreements">
            <h2>Блокировки учетных записей</h2>
            <ReactApexChart height={'600px'} type={'line'}
                            series={chartSeriesData}
                            options={chartOptions}/>
        </div>
    )
}