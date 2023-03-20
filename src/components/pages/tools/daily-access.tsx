import "../../../styles/pages/tools.scss"
import React, {Fragment, useEffect, useState} from "react";
import FileUpload from "../../fragments/tools/fileUpload";
import axios from "axios";
import {IToolResponse} from "../tools";
import ReactApexChart from 'react-apexcharts';
import {ApexOptions} from "apexcharts";

export interface IDailyAccessResult {
    allowed: number;
    denied: number;
    other: number;
    working: number;
}

interface IDailyAccessToolResponse extends IToolResponse {
    result: IDailyAccessResult
}

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

export default function DailyAccessTool() {
    document.title = 'Ежедневный отчет'

    let [errors, setErrors] = useState<Array<string>>([])

    let [isOverride, setIsOverride] = useState<boolean>(true)
    let [isSave, setIsSave] = useState<boolean>(true)

    let [fileUpload, setFileUpload] = useState<File>()

    let [toolResponseData, setToolResponseData] = useState<IDailyAccessToolResponse>()

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
            addError('Неверный формат файла!')
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

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/tools/briefs/access/daily", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const toolResponse: IDailyAccessToolResponse = response.data
            setToolResponseData(toolResponse)
        }
    }

    return (
        <Fragment>
            <header>Создать ежедневный отчет по согласованиям</header>
            <div className="tool-panel">
                <form onReset={() => {
                    setFileUpload(undefined)
                    setIsSave(true)
                    setIsOverride(true)
                    setToolResponseData(undefined)
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
                        toolResponseData !== undefined ?
                            <DailyReportResolvedStats
                                allowed={toolResponseData.result.allowed}
                                denied={toolResponseData.result.denied}
                                other={toolResponseData.result.other}
                                working={toolResponseData.result.working}
                            /> : null
                    }
                </div>
            </div>
        </Fragment>
    )
}

export function DailyReportResolvedStats(props: IDailyAccessResult) {
    return (
        <Fragment>
            <div className="resolved-stats">
                <div className="text-stats">
                    <h2>Результат выполнения</h2>
                    <p className={'code total'}>Общее число
                        заявок: {props.allowed + props.denied}</p>
                    <p className={'code'}>Согласовано: {props.allowed}</p>
                    <p className={'code'}>Отказано: {props.denied}</p>
                    <p className={'code'}>Другой статус: {props.other}</p>
                    <p className={'code'}>В работе: {props.working}</p>
                </div>
                <div id="graph-stats">
                    {
                        props.allowed + props.denied + props.working !== 0 ?
                            <ReactApexChart height={'600px'} width={'600px'} type={'donut'}
                                            series={[props.allowed, props.denied, props.working]}
                                            options={chartOptions}/> : null
                    }
                </div>
            </div>
        </Fragment>
    )

}

