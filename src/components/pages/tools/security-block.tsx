import React, {Fragment, useEffect, useState} from "react";
import axios from "axios";
import {IToolResponse, ResolvedFile} from "../tools";
import moment from "moment";

interface ISecurityToolParams {
    employeeIDs: Array<number>
    blockDataLeaks: boolean
    blockSystemAccounts: boolean
    blockDomainAccounts: boolean
    blockTechnicalAccounts: boolean
    blockLockedAccounts: boolean
    blockDeletedAccounts: boolean
    sendToSOI: boolean
    initiator: string
    request: string
}


interface IBaseAccount {
    full_name: string
    login: string
    is_technical: boolean
    is_active: boolean
    description: string
    created_at: Date
    updated_at: Date
    expired_at: Date
}

interface ISystemAccount extends IBaseAccount {
    system_name: string
    blocked_at: Date
}

interface IDomainAccount extends IBaseAccount {
    e_mail_address: string
}

interface IEmployeeBlockData {
    employee_id: number
    employee_full_name: string
    system_accounts: Array<ISystemAccount>
    domain_accounts: Array<IDomainAccount>
}

export interface ISecurityBlocksResult {
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
    blocked_employees: Array<IEmployeeBlockData>
}

interface ISecurityBlocksToolResponse extends IToolResponse {
    result: ISecurityBlocksResult
}

export default function SecurityBlockTool() {
    document.title = 'Блокировки ДЭБ'

    let [errors, setErrors] = useState<Array<string>>([])
    let [toolParams, setToolParams] = useState<ISecurityToolParams>({
        employeeIDs: [],
        blockDataLeaks: false,
        blockSystemAccounts: true,
        blockDomainAccounts: true,
        blockTechnicalAccounts: false,
        blockLockedAccounts: false,
        blockDeletedAccounts: false,
        sendToSOI: false,
        initiator: "",
        request: ""
    })

    let [isSave, setIsSave] = useState<boolean>(true)
    let [isOverride, setIsOverride] = useState<boolean>(false)

    let [toolResponseData, setToolResponseData] = useState<ISecurityBlocksToolResponse>()

    function addError(newError: string) {
        setErrors((prevState) => [
            ...prevState,
            newError
        ])
    }

    async function executeTool(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        evt.preventDefault()

        const formData = new FormData()

        formData.append('employee_ids', `[${toolParams.employeeIDs.join(",")}]`)

        formData.append('block_system_accounts', toolParams.blockSystemAccounts ? 'true' : 'false')
        formData.append('block_domain_accounts', toolParams.blockDomainAccounts ? 'true' : 'false')

        formData.append('block_technical_accounts', toolParams.blockTechnicalAccounts ? 'true' : 'false')
        formData.append('block_locked_accounts', toolParams.blockLockedAccounts ? 'true' : 'false')
        formData.append('block_deleted_accounts', toolParams.blockDeletedAccounts ? 'true' : 'false')

        formData.append('block_data_leaks', toolParams.blockDataLeaks ? 'true' : 'false')

        if (toolParams.sendToSOI) {
            formData.append('send_to_soi', toolParams.sendToSOI ? 'true' : 'false')
            formData.append('initiator', toolParams.initiator)
            formData.append('request', toolParams.request)
        }

        formData.append('save', isSave ? 'true' : 'false')

        if (isSave) {
            formData.append('override', isOverride ? 'true' : 'false')
        }

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/tools/bans/security", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const responseData: ISecurityBlocksToolResponse = response.data as ISecurityBlocksToolResponse
            setToolResponseData(responseData)
        }
    }

    function toolParamsController(evt: React.ChangeEvent<HTMLInputElement>) {
        console.debug(evt.target.name)

        switch (evt.target.name) {
            case 'data-leaks':
                setToolParams(prevState => ({
                    ...prevState,
                    blockDataLeaks: evt.target.checked
                }))
                break
            case 'system-accounts':
                setToolParams(prevState => ({
                    ...prevState,
                    blockSystemAccounts: evt.target.checked
                }))
                break
            case 'domain-accounts':
                setToolParams(prevState => ({
                    ...prevState,
                    blockDomainAccounts: evt.target.checked
                }))
                break
            case 'technical-accounts':
                setToolParams(prevState => ({
                    ...prevState,
                    blockTechnicalAccounts: evt.target.checked
                }))
                break
            case 'locked-accounts':
                setToolParams(prevState => ({
                    ...prevState,
                    blockLockedAccounts: evt.target.checked
                }))
                break
            case 'deleted-accounts':
                setToolParams(prevState => ({
                    ...prevState,
                    blockDeletedAccounts: evt.target.checked
                }))
                break
            case 'send-to-soi':
                if (evt.target.checked) {
                    setToolParams(prevState => ({
                        ...prevState,
                        sendToSOI: true
                    }))
                } else {
                    setToolParams(prevState => ({
                        ...prevState,
                        sendToSOI: false,
                        initiator: "",
                        request: ""
                    }))
                }
                break

        }
    }

    function textAriaController(evt: React.ChangeEvent<HTMLTextAreaElement>) {
        setErrors([])

        switch (evt.target.name) {
            case 'employee-ids':
                let string = evt.target.value
                    .replaceAll(" ", "")
                    .replaceAll("\n", ",")
                    .replaceAll(";", ",")

                if (string.length > 0) {
                    if (/[^,;\n 0-9]/g.exec(string) == null) {
                        setToolParams(prevState => ({
                            ...prevState,
                            employeeIDs: string.split(',').map(item => {
                                return parseInt(item)
                            })
                        }))
                    } else {
                        addError('Недопустимые символы в перечне ID на блокировку')
                    }
                }
                break
            case 'request': {
                setToolParams(prevState => ({
                    ...prevState,
                    request: evt.target.value
                }))
                break
            }
            case 'initiator': {
                setToolParams(prevState => ({
                    ...prevState,
                    initiator: evt.target.value
                }))
                break
            }
        }

    }


    useEffect(() => {
        setErrors([])

        if (toolParams.employeeIDs.length === 0) {
            addError('Не указаны ID на блокировку')
        }

        if (toolParams.sendToSOI) {
            if (toolParams.initiator.length === 0) {
                addError('Не указан инициатор для СОИ')
            }
        }

    }, [toolParams])


    return (
        <Fragment>
            <header>Подготовить блокировки ДЭБ</header>
            <div className="tool-panel">
                <form onReset={() => {
                    setToolParams({
                        employeeIDs: [],
                        blockDataLeaks: false,
                        blockSystemAccounts: true,
                        blockDomainAccounts: true,
                        blockTechnicalAccounts: false,
                        blockLockedAccounts: false,
                        blockDeletedAccounts: false,
                        sendToSOI: false,
                        initiator: "",
                        request: ""
                    })

                    setIsSave(true)
                    setIsOverride(false)
                }
                } className="setup-form">
                    <div className="tool-parameter-group text-area">
                        <label htmlFor={'employee-ids'}>Список ID на блокировку</label>
                        <textarea inputMode={'numeric'} onChange={(evt) => textAriaController(evt)}
                                  name={'employee-ids'}/>
                    </div>
                    <div className="tool-parameter-group">
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockSystemAccounts}
                                   onChange={(evt) => toolParamsController(evt)}
                                   name={'system-accounts'} type="checkbox"/>
                            <label htmlFor={'system-accounts'}>Блокировать системные УЗ</label>
                        </div>
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockDomainAccounts}
                                   onChange={(evt) => toolParamsController(evt)}
                                   name={'domain-accounts'} type="checkbox"/>
                            <label htmlFor={'domain-accounts'}>Блокировать доменные УЗ</label>
                        </div>
                    </div>
                    <div className="tool-parameter-group">
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockTechnicalAccounts}
                                   onChange={(evt) => toolParamsController(evt)}
                                   name={'technical-accounts'} type="checkbox"/>
                            <label htmlFor={'override'}>Блокировать технические УЗ</label>
                        </div>
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockLockedAccounts}
                                   onChange={(evt) => toolParamsController(evt)}
                                   name={'locked-accounts'} type="checkbox"/>
                            <label htmlFor={'locked-accounts'}>Блокировать ранее заблокированные УЗ</label>
                        </div>
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockDeletedAccounts}
                                   onChange={(evt) => toolParamsController(evt)}
                                   name={'deleted-accounts'} type="checkbox"/>
                            <label htmlFor={'deleted-accounts'}>Блокировать удаленные УЗ</label>
                        </div>
                    </div>
                    <div className="tool-parameter-group">
                        <div className={"tool-parameter"}>
                            <input checked={toolParams.blockDataLeaks} onChange={(evt) => toolParamsController(evt)}
                                   name={'data-leaks'} type="checkbox"/>
                            <label htmlFor={'data-leaks'}>Блокировать каналы утечки</label>
                        </div>
                    </div>
                    <div className="tool-parameter-group">
                        <div className={`tool-parameter`}>
                            <input checked={toolParams.sendToSOI} onChange={(evt) => toolParamsController(evt)}
                                   name={'send-to-soi'} type="checkbox"/>
                            <label htmlFor={'send-to-soi'}>Отметить в СОИ</label>
                        </div>
                    </div>
                    <div className={`tool-parameter-group text-area ${!toolParams.sendToSOI ? 'hidden' : null}`}>
                        <label htmlFor={'initiator'}>Инициатор блокировки</label>
                        <textarea value={toolParams.initiator} onChange={(evt) => textAriaController(evt)}
                                  name={'initiator'}/>
                    </div>
                    <div className={`tool-parameter-group text-area ${!toolParams.sendToSOI ? 'hidden' : null}`}>
                        <label htmlFor={'request'}>Идентификатор запроса</label>
                        <textarea value={toolParams.request} onChange={(evt) => textAriaController(evt)}
                                  name={'request'}/>
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
                        toolResponseData?.files ? <ul style={{margin: "0 0 30px 0"}} className="resolved-files">
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
                            <SecurityBlockResolvedStats blocked_employees={toolResponseData.result.blocked_employees}
                                                        total_system_accounts_blocked={toolResponseData.result.total_system_accounts_blocked}
                                                        total_domain_accounts_blocked={toolResponseData.result.total_domain_accounts_blocked}
                            />
                            : null
                    }
                </div>
            </div>
        </Fragment>
    )
}


export function SecurityBlockResolvedStats(props: ISecurityBlocksResult) {
    return (<div className="resolved-stats">
        <div className="text-stats">
            <h2>Результат выполнения</h2>
            <p className={'code total'}>Общее число
                блокировок: {props.total_domain_accounts_blocked + props.total_system_accounts_blocked}</p>
            <p className={'code'}>Учетные записи в
                ИС: {props.total_system_accounts_blocked}</p>
            <p className={'code'}>Учетные записи в
                AD: {props.total_domain_accounts_blocked}</p>
            <p className={'code total'}>Число сотрудников: {props.blocked_employees.length}</p>
        </div>
        <div id="graph-stats">
            {props.blocked_employees.map((item, index) => {
                return <EmployeeBlockList key={index}
                                          employee_full_name={item.employee_full_name}
                                          employee_id={item.employee_id}
                                          domain_accounts={item.domain_accounts}
                                          system_accounts={item.system_accounts}/>
            })}
        </div>
    </div>)
}


export function EmployeeBlockList(props: IEmployeeBlockData) {
    return <div className={'employee-block-list'}>
        <h2>{props.employee_full_name}</h2>
        <p>ID: {props.employee_id}</p>
        {
            props.system_accounts.length > 0 ? <Fragment>
                <h3>Учетные записи в ИС</h3>
                <table className={'system-accounts'}>
                    <thead>
                    <tr>
                        <td className={'system-name'}>Система</td>
                        <td className={'login'}>Логин</td>
                        <td className={'full-name'}>ФИО в ИС</td>
                        {/*<td className={'description'}>Описание</td>*/}
                        <td className={'is-technical'}>ТУЗ?</td>
                        <td className={'is-active'}>Активна?</td>
                        <td className={'created-at'}>Дата создания</td>
                        <td className={'expired-at'}>Срок действия</td>
                        <td className={'blocked-at'}>Дата блокирования</td>
                    </tr>
                    </thead>
                    <tbody>
                    {props.system_accounts.map((item, index) => {
                        const createdAt = moment(item.created_at)
                        const expiredAt = moment(item.expired_at)
                        const blockedAt = moment(item.blocked_at)

                        return <tr key={index}>
                            <td className={'system-name'}>{item.system_name}</td>
                            <td className={'login'}>{item.login}</td>
                            <td className={'full-name'}>{item.full_name}</td>
                            {/*<td>{item.description}</td>*/}
                            <td className={`is-technical ${item.is_technical ? 'tech' : null}`}>{item.is_technical ? `Да` : `Нет`}</td>
                            <td className={`is-active ${item.is_active ? 'active' : 'disabled'}`}>{item.is_active ? `Да` : `Нет`}</td>
                            <td className={'created-at'}>{createdAt.year() !== 1 ? createdAt.format('DD.MM.YYYY') : `━`}</td>
                            <td className={'expired-at'}>{expiredAt.year() !== 1 ? expiredAt.format('DD.MM.YYYY') : `━`}</td>
                            <td className={'blocked-at'}>{blockedAt.year() !== 1 ? blockedAt.format('DD.MM.YYYY') : `━`}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </Fragment> : null
        }
        {
            props.domain_accounts.length > 0 ? <Fragment>
                <h3>Доменные учетные записи</h3>
                <table className={'domain-accounts'}>
                    <thead>
                    <tr>
                        <td className={'login'}>Логин</td>
                        <td className={'full-name'}>ФИО в ИС</td>
                        <td className={'description'}>Описание</td>
                        <td className={'is-technical'}>ТУЗ?</td>
                        <td className={'is-active'}>Активна?</td>
                        <td className={'created-at'}>Дата создания</td>
                        <td className={'expired-at'}>Срок действия</td>
                    </tr>
                    </thead>
                    <tbody>
                    {props.domain_accounts.map((item, index) => {
                        const createdAt = moment(item.created_at)
                        const expiredAt = moment(item.expired_at)

                        return <tr key={index}>
                            <td className={'login'}>{item.login}</td>
                            <td className={'full-name'}>{item.full_name}</td>
                            <td className={'description'}>{item.description}</td>
                            <td className={`is-technical ${item.is_technical ? 'tech' : null}`}>{item.is_technical ? `Да` : `Нет`}</td>
                            <td className={`is-active ${item.is_active ? 'active' : 'disabled'}`}>{item.is_active ? `Да` : `Нет`}</td>
                            <td className={'created-at'}>{createdAt.year() !== 1 ? createdAt.format('DD.MM.YYYY') : `━`}</td>
                            <td className={'expired-at'}>{expiredAt.year() !== 1 ? expiredAt.format('DD.MM.YYYY') : `━`}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </Fragment> : null
        }
    </div>
}

interface ISystemAccountsListProps {
    accounts: Array<ISystemAccount>
}

function SystemAccountsList({accounts}: ISystemAccountsListProps) {

}

function DomainAccountsList(props: Array<IDomainAccount>) {

}
