import React, {Fragment, useEffect, useState} from "react";
import FileUpload from "../../fragments/tools/fileUpload";
import {IToolResponse, ResolvedFile} from "../tools";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import {IRegularBlockToolResponse} from "./regular-block";
import moment from "moment";

export default function WeeklyBlockTool() {
    document.title = 'Еженедельный отчет'

    let [errors, setErrors] = useState<Array<string>>([])

    const today = moment()
    let [endDate, setEndDate] = useState<string>(today.toISOString().slice(0, 10))
    let [startDate, setStartDate] = useState<string>(today.subtract(1, 'week').toISOString().slice(0, 10))

    let [isSave, setIsSave] = useState<boolean>(true)
    let [isOverride, setIsOverride] = useState<boolean>(true)

    let [toolResponseData, setToolResponseData] = useState<IRegularBlockToolResponse>()

    let [firedChartSeriesData, setFiredChartSeriesData] = useState<ApexAxisChartSeries>([])
    let [decreeChartSeriesData, setDecreeChartSeriesData] = useState<ApexAxisChartSeries>([])

    let [chartOptions, setChartOptions] = useState<ApexOptions>({
        chart: {
            type: 'treemap',
            zoom: {
                enabled: true
            },
            offsetY: -10,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            treemap: {
                enableShades: true,
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 5,
                            color: `#ffc47b`
                        },
                        {
                            from: 5,
                            to: 20,
                            color: `#ffab46`
                        },
                        {
                            from: 20,
                            to: 50,
                            color: `#f68e12`
                        },
                        {
                            from: 50,
                            color: `#ff3c31`
                        },
                    ]
                }
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: [
                    'black'
                ],
                fontSize: '20rem'
            }
        },
        // legend: {
        //     position: 'bottom',
        // },
        // colors: ['#53af0c', '#d33e3e']
    })

    async function executeTool(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        evt.preventDefault()

        const formData = new FormData()

        formData.append('save', isSave ? 'true' : 'false')

        if (isSave) {
            formData.append('override', isOverride ? 'true' : 'false')
        }

        if (startDate && endDate) {
            let _startDate = moment(startDate)
            let _endDate = moment(endDate)

            _startDate.set('hour', 0).set('minutes', 0)
            _endDate.set('hour', 23).set('minutes', 59)

            formData.append('start_date', _startDate.toISOString())
            formData.append('end_sate', _endDate.toISOString())
        }

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/tools/briefs/blocks/weekly", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            let toolResponse: IRegularBlockToolResponse = response.data

            toolResponse.firedAccountsCount = 0
            toolResponse.decreeAccountsCount = 0

            let pointsFired: Array<{ x: string, y: number }> = []
            let pointsDecree: Array<{ x: string, y: number }> = []

            if (toolResponse.result.fired_bans_by_system) {
                Object.entries(toolResponse.result.fired_bans_by_system).forEach(entry => {
                    pointsFired.push({x: entry[0], y: entry[1].count})
                    toolResponse.firedAccountsCount += entry[1].count
                })

                setFiredChartSeriesData([{
                    data: pointsFired,
                }])
            }

            if (toolResponse.result.decree_bans_by_system) {
                Object.entries(toolResponse.result.decree_bans_by_system).forEach(entry => {
                    pointsDecree.push({x: entry[0], y: entry[1].count})
                    toolResponse.decreeAccountsCount += entry[1].count
                })

                setDecreeChartSeriesData([{
                    data: pointsDecree,
                }])
            }

            setToolResponseData(toolResponse)
        }
    }

    return (
        <Fragment>
            <header>Создать отчет по блокировкам</header>
            <div className="tool-panel">
                <form onReset={() => {
                    setToolResponseData(undefined)
                    setDecreeChartSeriesData([])
                    setFiredChartSeriesData([])
                    setIsSave(true)
                    setIsOverride(true)
                }
                } className="setup-form">
                    <div className="tool-parameter-group date-range">
                        <div className={"tool-parameter"}>
                            <label htmlFor={'start-date'}>Дата начала</label>
                            <input defaultValue={startDate}
                                   onChange={(newValue) => {
                                       setStartDate(newValue.target.value)
                                   }}
                                   id={'start-date'}
                                   type={'date'}/>
                        </div>
                        <div className={"tool-parameter"}>
                            <label htmlFor={'end-date'}>Дата конца</label>
                            <input defaultValue={endDate}
                                   onChange={(newValue) => {
                                       setEndDate(newValue.target.value)
                                   }}
                                   id={'end-date'}
                                   type={'date'}/>
                        </div>
                    </div>
                    <div className="tool-parameter-group">
                        <div className={"tool-parameter"}>
                            <input checked={isSave} onChange={(evt) => {
                                if (evt.target.checked) {
                                    setIsSave(true)
                                } else {
                                    setIsSave(false)
                                    setIsOverride(false)
                                }
                            }}
                                   id={'override'} type="checkbox"/>
                            <label htmlFor={'override'}>Сохранить отчет</label>
                        </div>
                        <div className={`tool-parameter ${!isSave ? 'hidden' : null} `}>
                            <input checked={isOverride} onChange={(evt) => {
                                setIsOverride(evt.target.checked)
                            }}
                                   id={'override'} type="checkbox"/>
                            <label htmlFor={'override'}>Перезаписать</label>
                        </div>
                    </div>
                    <div className="buttons">
                        <button type={'reset'} className={'reset'}>Сбросить</button>
                        <button onClick={(evt) => executeTool(evt)} className={'execute'}
                                disabled={errors.length > 0}>Выполнить
                        </button>
                    </div>
                    <div className="status-panel">
                        <span id={'ready'}>
                            {errors.length === 0 ? `Готово к отправке 🟢` : `Не готово к отправке 🔴`}
                        </span>
                        <span id={'errors'}>{errors.join('\n')}</span>
                    </div>
                </form>
                <div className={`${toolResponseData ? 'tool-result' : 'tool-result hidden'}`}>
                    {
                        toolResponseData?.files ? <ul className="resolved-files">
                            {toolResponseData?.files.map((item, index) => {
                                return <ResolvedFile key={index}
                                                     file_name={item.file_name}
                                                     description={item.description}
                                                     public_url={item.public_url}/>
                            })}
                        </ul> : null
                    }
                    {
                        toolResponseData !== undefined ?
                            <div className="resolved-stats">
                                <div className="text-stats">
                                    <h2>Результат выполнения</h2>
                                    <p className={'code total'}>Всего
                                        блокировок: {toolResponseData.firedAccountsCount + toolResponseData.decreeAccountsCount}</p>
                                    <p className={'code'}>Декретный отпуск: {toolResponseData.decreeAccountsCount}</p>
                                    <p className={'code'}>Уволенные: {toolResponseData.firedAccountsCount}</p>
                                </div>
                                <div id="graph-stats">
                                    {
                                        firedChartSeriesData.length > 0 ? <Fragment>
                                            <p className="code">Блокировки уволенных сотрудников</p>
                                            <ReactApexChart height={'300px'} width={'100%'} type={'treemap'}
                                                            series={firedChartSeriesData}
                                                            options={chartOptions}/>
                                        </Fragment> : null
                                    }
                                    {
                                        decreeChartSeriesData.length > 0 ? <Fragment>
                                            <p className="code">Блокировки сотрудников в декрете</p>
                                            <ReactApexChart height={'300px'} width={'100%'} type={'treemap'}
                                                            series={decreeChartSeriesData}
                                                            options={chartOptions}/>
                                        </Fragment> : null
                                    }
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
        </Fragment>
    )
}