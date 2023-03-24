import {ApexOptions} from "apexcharts";
import React, {Fragment, useEffect, useState} from "react";
import moment from "moment/moment";
import axios from "axios";
import ATLSError from "../../../../models/error";
import ReactApexChart from "react-apexcharts";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";

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

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isRequested, setIsRequested] = useState<boolean>(false)

    useEffect(() => {
        setIsRequested(true)
        setIsLoaded(false)

        let _startDate = moment(props.startDate)
        let _endDate = moment(props.endDate)

        if (_endDate >= _startDate) {
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

                if (stats && stats.length > 0) {
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
                }

                setIsLoaded(true)
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
            })
        }
    }, [props])

    return (
        <Fragment>
            {
                isRequested ? <Fragment>
                    {
                        isLoaded && chartSeriesData ? <Fragment>
                            <div className="chart chart_agreements">
                                <h2>Согласования</h2>
                                <ReactApexChart height={'600px'} type={'line'}
                                                series={chartSeriesData}
                                                options={chartOptions}/>
                            </div>
                        </Fragment> : <ToolFormResultLoading/>
                    }
                </Fragment> : <Fragment/>
            }
        </Fragment>
    )
}