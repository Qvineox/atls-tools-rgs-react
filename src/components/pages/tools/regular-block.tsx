import React, {Fragment, useEffect, useState} from "react";
import FileUpload from "../../fragments/tools/fileUpload";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import {IToolResponse, ResolvedFile} from "../tools";
import {ApexOptions} from "apexcharts";
import moment from "moment/moment";


interface IAccountBlock {
    login: string;
    full_name: string;
}

interface IAccountBlocksBySystem {
    [key: string]: {
        count: number;
        accounts: Array<IAccountBlock>;
    }
}

export interface IRegularBlockResult {
    fired_accounts_blocked: number;
    decree_accounts_blocked: number;
    fired_bans_by_system: IAccountBlocksBySystem;
    decree_bans_by_system: IAccountBlocksBySystem;
}

export interface IRegularBlockToolResponse extends IToolResponse {
    result: IRegularBlockResult;
    firedAccountsCount: number;
    decreeAccountsCount: number;
}

export default function RegularBlockTool() {
    document.title = 'Регулярные блокировки'



    let [fileUploadFired, setFileUploadFired] = useState<File>()
    let [fileUploadDecree, setFileUploadDecree] = useState<File>()
    let [fileUploadDomain, setFileUploadDomain] = useState<File>()

    let [isSave, setIsSave] = useState<boolean>(true)
    let [isOverride, setIsOverride] = useState<boolean>(true)

    let [errors, setErrors] = useState<Array<string>>([])

    let [toolResponseData, setToolResponseData] = useState<IRegularBlockToolResponse>()

    function addError(newError: string) {
        setErrors((prevState) => [
            ...prevState,
            newError
        ])
    }

    useEffect(() => {
        setErrors([])

        if (fileUploadFired === undefined && fileUploadDecree === undefined && fileUploadDomain === undefined) {
            addError('Ни один файл не загружен!')
            return
        }

        if (fileUploadFired !== undefined) {
            if (fileUploadFired.type !== 'application/vnd.ms-excel') {
                addError('Уволенные: Неверный формат файла!')
            } else if (fileUploadFired.size >= 52428800) {
                addError('Уволенные: Превышен допустимый размер файла!')
            }
        }

        if (fileUploadDecree !== undefined) {
            if (fileUploadDecree.type !== 'application/vnd.ms-excel') {
                addError('Декрет: Неверный формат файла!')
            } else if (fileUploadDecree.size >= 52428800) {
                addError('Декрет: Превышен допустимый размер файла!')
            }
        }

        if (fileUploadDomain !== undefined) {
            if (fileUploadDomain.type !== 'application/vnd.ms-excel') {
                addError('Доменные: Неверный формат файла!')
            } else if (fileUploadDomain.size >= 52428800) {
                addError('Доменные: Превышен допустимый размер файла!')
            }
        }

    }, [fileUploadFired, fileUploadDecree, fileUploadDomain])

    async function executeTool(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        evt.preventDefault()

        const formData = new FormData()

        if (fileUploadFired === undefined && fileUploadDecree === undefined && fileUploadDomain === undefined) {
            return alert('Файлы не загружены')
        } else {
            if (fileUploadFired !== undefined) {
                formData.append('file_upload_fired', fileUploadFired)
            }
            if (fileUploadDecree !== undefined) {
                formData.append('file_upload_decree', fileUploadDecree)
            }
            if (fileUploadDomain !== undefined) {
                formData.append('file_upload_domain', fileUploadDomain)
            }
        }

        formData.append('save', isSave ? 'true' : 'false')

        if (isSave) {
            formData.append('override', isOverride ? 'true' : 'false')
        }

        axios.post(process.env.REACT_APP_BACKEND_URL + "/api/tools/bans/regular", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then(response => {
            if (response.status === 200) {
                let toolResponse: IRegularBlockToolResponse = response.data
                setToolResponseData(toolResponse)
            }
        })


    }

    return (
        <Fragment>
            <header>Подготовить регулярные блокировки</header>
            <div className="tool-panel">
                <form onReset={() => {
                    setFileUploadFired(undefined)
                    setFileUploadDecree(undefined)
                    setFileUploadDomain(undefined)
                    setIsSave(true)
                    setIsOverride(true)
                }
                } className="setup-form">
                    <FileUpload fileSet={setFileUploadFired} availableFileExtensions={['.csv']}
                                title={'Файл уволенных сотрудников'}/>
                    <FileUpload fileSet={setFileUploadDecree} availableFileExtensions={['.csv']}
                                title={'Файл сотрудников в декрете'}/>
                    <FileUpload fileSet={setFileUploadDomain} availableFileExtensions={['.csv']}
                                title={'Файл доменных УЗ'}/>
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
                            <RegularBlockResolvedStats
                                decree_accounts_blocked={toolResponseData.result.decree_accounts_blocked}
                                fired_accounts_blocked={toolResponseData.result.fired_accounts_blocked}
                                fired_bans_by_system={toolResponseData.result.fired_bans_by_system}
                                decree_bans_by_system={toolResponseData.result.decree_bans_by_system}/>
                            : null
                    }
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
                </div>
            </div>
        </Fragment>
    )
}

export function RegularBlockResolvedStats(props: IRegularBlockResult) {
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
        }
    })

    useEffect(() => {
        let pointsFired: Array<{ x: string, y: number }> = []
        let pointsDecree: Array<{ x: string, y: number }> = []

        if (props.fired_bans_by_system) {
            Object.entries(props.fired_bans_by_system).forEach(entry => {
                pointsFired.push({x: entry[0], y: entry[1].count})
            })

            setFiredChartSeriesData([{
                data: pointsFired,
            }])
        }

        if (props.decree_bans_by_system) {
            Object.entries(props.decree_bans_by_system).forEach(entry => {
                pointsDecree.push({x: entry[0], y: entry[1].count})
            })

            setDecreeChartSeriesData([{
                data: pointsDecree,
            }])
        }
    }, [props.decree_bans_by_system, props.fired_bans_by_system])

    return (
        <div className="resolved-stats">
            <div className="text-stats">
                <h2>Результат выполнения</h2>
                <p className={'code total'}>Общее число
                    блокировок: {props.fired_accounts_blocked + props.decree_accounts_blocked}</p>
                <p className={'code'}>Декретный отпуск: {props.decree_accounts_blocked}</p>
                <p className={'code'}>Уволенные: {props.fired_accounts_blocked}</p>
                {/*<p style={{marginTop: '20px'}} className={'code total'}>По системам:</p>*/}
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
    )
}

export function RegularBlockDetailedView(props: IRegularBlockResult) {
    let tableDataFired: [string, { count: number, accounts: IAccountBlock[] }][] = []
    let tableDataDecree: [string, { count: number, accounts: IAccountBlock[] }][] = []

    if (props.fired_bans_by_system) {
        // SORTING
        // tableDataFired = Object.entries(props.fired_bans_by_system).sort((a, b) => {
        //     return b[1].count - a[1].count
        // })

        tableDataFired = Object.entries(props.fired_bans_by_system).map((value) => {
            return value
        })
    }

    if (props.decree_bans_by_system) {
        // SORTING
        // tableDataDecree = Object.entries(props.decree_bans_by_system).sort((a, b) => {
        //     return b[1].count - a[1].count
        // })

        tableDataDecree = Object.entries(props.decree_bans_by_system).map((value) => {
            return value
        })
    }

    return (
        <div className="resolved-stats">
            <div className="text-stats">
                <h2>Результат выполнения</h2>
                <p className={'code total'}>Общее число
                    блокировок: {props.fired_accounts_blocked + props.decree_accounts_blocked}</p>
                <p className={'code'}>Декретный отпуск: {props.decree_accounts_blocked}</p>
                <p className={'code'}>Уволенные: {props.fired_accounts_blocked}</p>
            </div>
            <div id="graph-stats">
                {
                    tableDataFired.length > 0 ? <Fragment>
                            <h2 className={'regular-blocks-header'}>Уволенные сотрудники</h2>
                            <table className={'regular-blocks'}>
                                <thead>
                                <tr>
                                    <td className={'service-name'}>
                                        Сервис
                                    </td>
                                    <td className={'account-index'}>
                                        №
                                    </td>
                                    <td className={'account-full-name'}>
                                        ФИО сотрудника
                                    </td>
                                    <td className={'account-login'}>
                                        Логин в ИС
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    tableDataFired.length > 0 ? tableDataFired.map((accountsByService) => {
                                        return accountsByService[1].accounts.map((account, index) => {
                                            if (index === 0) {
                                                return (
                                                    <tr key={index}>
                                                        <td rowSpan={accountsByService[1].accounts.length}>{accountsByService[0]}
                                                            {
                                                                accountsByService[1].accounts.length > 1 ?
                                                                    <p className={'hint'}>Всего: {accountsByService[1].accounts.length}</p> : null
                                                            }
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>{account.full_name}</td>
                                                        <td>{account.login}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{account.full_name}</td>
                                                        <td>{account.login}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    }) : <tr>
                                        <td colSpan={3}>Пусто</td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                        </Fragment> :
                        null
                }
                {
                    tableDataDecree.length > 0 ? <Fragment>
                        <h2 className={'regular-blocks-header'}>Сотрудники в декрете</h2>
                        <table className={'regular-blocks'}>
                            <thead>
                            <tr>
                                <td className={'service-name'}>
                                    Сервис
                                </td>
                                <td className={'account-index'}>
                                    №
                                </td>
                                <td className={'account-full-name'}>
                                    ФИО сотрудника
                                </td>
                                <td className={'account-login'}>
                                    Логин в ИС
                                </td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableDataDecree.length > 0 ? tableDataDecree.map((accountsByService) => {
                                    return accountsByService[1].accounts.map((account, index) => {
                                        if (index === 0) {
                                            return (
                                                <tr key={index}>
                                                    <td rowSpan={accountsByService[1].accounts.length}>{accountsByService[0]}<br/>{accountsByService[1].accounts.length}
                                                    </td>
                                                    <td>{index + 1}</td>
                                                    <td>{account.full_name}</td>
                                                    <td>{account.login}</td>
                                                </tr>
                                            )
                                        } else {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{account.full_name}</td>
                                                    <td>{account.login}</td>
                                                </tr>
                                            )
                                        }
                                    })
                                }) : <tr>
                                    <td colSpan={3}>Пусто</td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </Fragment> : null
                }
            </div>
        </div>
    )
}