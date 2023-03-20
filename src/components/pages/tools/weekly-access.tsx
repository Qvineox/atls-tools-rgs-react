import React, {Fragment, useEffect, useState} from "react";
import FileUpload from "../../fragments/tools/fileUpload";
import {IToolResponse, ResolvedFile} from "../tools";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";

interface IWeeklyAccessResultService {
    allowed: number
    denied: number
}

export interface IWeeklyAccessResult {
    total_allowed: number;
    total_denied: number;
    total_other: number;
    unrecognised_services: number;
    missing_table_field: number;
    services: {
        [key: string]: IWeeklyAccessResultService
    }
}

interface IWeeklyAccessToolResponse extends IToolResponse {
    result: IWeeklyAccessResult
}

export default function WeeklyAccessTool() {
    document.title = 'Еженедельный отчет'

    let [errors, setErrors] = useState<Array<string>>([])

    let [isSave, setIsSave] = useState<boolean>(true)
    let [isOverride, setIsOverride] = useState<boolean>(true)

    let [fileUpload, setFileUpload] = useState<File>()

    let [toolResponseData, setToolResponseData] = useState<IWeeklyAccessToolResponse>()

    function addError(newError: string) {
        setErrors((prevState) => [
            ...prevState,
            newError
        ])
    }

    useEffect(() => {
        setErrors([])

        if (fileUpload === undefined) {
            addError('Файл не загружен!')
        } else if (fileUpload.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            addError('Превышен формат файла!')
        } else if (fileUpload.size >= 52428800) {
            addError('Превышен допустимый размер файла!')
        }

    }, [fileUpload])

    async function executeTool(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        evt.preventDefault()

        const formData = new FormData()

        if (fileUpload === undefined) {
            return alert('Файл не загружен')
        }

        formData.append('file_upload', fileUpload)
        formData.append('save', isSave ? 'true' : 'false')

        if (isSave) {
            formData.append('override', isOverride ? 'true' : 'false')
        }

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/tools/briefs/access/weekly", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const toolResponse: IWeeklyAccessToolResponse = response.data
            setToolResponseData(toolResponse)
        }
    }

    return (
        <Fragment>
            <header>Создать еженедельный отчет по согласованиям</header>
            <div className="tool-panel">
                <form onReset={() => {
                    setFileUpload(undefined)
                    setToolResponseData(undefined)
                    setIsSave(true)
                    setIsOverride(true)
                }
                } className="setup-form">
                    <FileUpload fileSet={setFileUpload} availableFileExtensions={['.xlsx']} title={'Файл заявок'}/>
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
                            <WeeklyReportResolvedStats missing_table_field={toolResponseData.result.missing_table_field}
                                                       unrecognised_services={toolResponseData.result.unrecognised_services}
                                                       total_allowed={toolResponseData.result.total_allowed}
                                                       total_denied={toolResponseData.result.total_denied}
                                                       total_other={toolResponseData.result.total_other}
                                                       services={toolResponseData.result.services}
                            />
                            : null
                    }
                </div>
            </div>
        </Fragment>
    )
}

export function WeeklyReportResolvedStats(props: IWeeklyAccessResult) {
    let [chartSeriesData, setChartSeriesData] = useState<ApexAxisChartSeries>([])
    let [chartOptions, setChartOptions] = useState<ApexOptions>({
        chart: {
            type: 'bar',
            zoom: {
                enabled: true
            },
            height: '20vh',
            stacked: true
        },
        legend: {
            position: 'bottom',
        },
        colors: ['#53af0c', '#d33e3e']
    })

    useEffect(() => {
        let pointsAllowed: Array<{ x: string, y: number }> = []
        let pointsDenied: Array<{ x: string, y: number }> = []
        let systemNames: Array<string> = []

        const threshold = (props.total_allowed + props.total_denied) / 30 // > 30%

        Object.keys(props.services).forEach(function (key, index) {
            if (props.services[key].allowed + props.services[key].denied > threshold) {
                pointsAllowed.push({x: key, y: props.services[key].allowed})
                pointsDenied.push({x: key, y: props.services[key].denied})
                systemNames.push(key)
            }
        });

        setChartSeriesData([{
            name: 'Согласовано',
            data: pointsAllowed.slice(0, 10),
            type: 'bar'
        }, {
            name: 'Отклонено',
            data: pointsDenied.slice(0, 10),
            type: 'bar'
        }])

        setChartOptions(prevState => ({
            ...prevState,
            xaxis: {
                type: 'category',
                categories: systemNames.slice(0, 10),
                position: 'top',
                labels: {
                    rotate: -90,
                    style: {
                        fontSize: '1rem',
                        fontFamily: 'Courier New'
                    }
                }
            },
        }))
    }, [])

    return (
        <div className="resolved-stats">
            <div className="text-stats">
                <h2>Результат выполнения</h2>
                <p className={'code total'}>Общее число
                    заявок: {props.total_allowed + props.total_denied}</p>
                <p className={'code'}>Согласовано: {props.total_allowed}</p>
                <p className={'code'}>Отказано: {props.total_denied}</p>
                <p className={'code'}>Другой статус: {props.total_other}</p>
                {
                    props.unrecognised_services > 0 ?
                        <p className={'code error'}>Сервис не
                            распознан: {props.unrecognised_services}</p> : null
                }
                {
                    props.missing_table_field > 0 ?
                        <p className={'code error'}>Нет в
                            таблице: {props.missing_table_field}</p> : null
                }
            </div>
            <div id="graph-stats">
                {
                    chartSeriesData.length > 0 ? <ReactApexChart height={'600px'} type={'bar'}
                                                                 series={chartSeriesData}
                                                                 options={chartOptions}/> : null
                }
            </div>
        </div>
    )
}

export function WeeklyReportDetailedView(props: IWeeklyAccessResult) {
    const tableData = Object.entries(props.services).sort((a, b) => {
        return b[1].allowed + b[1].denied - a[1].allowed + a[1].denied
    })

    return (<div className="resolved-stats">
        <div className="text-stats">
            <h2>Результат выполнения</h2>
            <p className={'code total'}>Общее число
                заявок: {props.total_allowed + props.total_denied}</p>
            <p className={'code'}>Согласовано: {props.total_allowed}</p>
            <p className={'code'}>Отказано: {props.total_denied}</p>
            <p className={'code'}>Другой статус: {props.total_other}</p>
            {
                props.unrecognised_services > 0 ?
                    <p className={'code error'}>Сервис не
                        распознан: {props.unrecognised_services}</p> : null
            }
            {
                props.missing_table_field > 0 ?
                    <p className={'code error'}>Нет в
                        таблице: {props.missing_table_field}</p> : null
            }
        </div>
        <div id="graph-stats">
            <table className={'weekly-report'}>
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
                    tableData.map((service, index) => {
                        return (
                            <tr key={index}>
                                <td>{service[0]}</td>
                                <td>{service[1].allowed}</td>
                                <td>{service[1].denied}</td>
                                <td>{service[1].allowed + service[1].denied}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
                <tfoot>
                <tr>
                    <td className={'service-name'}>Всего</td>
                    <td className={'allowed'}>{props.total_allowed}</td>
                    <td className={'denied'}>{props.total_denied}</td>
                    <td className={'summary'}>{props.total_allowed + props.total_denied}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>)
}