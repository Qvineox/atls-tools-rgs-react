import {IDomainAccount, ISystemAccount} from "../../accounts/accounts";
import {IToolResponseFile, Report} from "../reports";
import React, {Fragment} from "react";
import moment from "moment";
import axios from "axios";

const API_ROUTE = "/api/reporting/processing/blocks/esd"

interface IBlockListByEmployee {
    employee_id: number
    employee_full_name: string
    system_accounts: Array<ISystemAccount>
    domain_accounts: Array<IDomainAccount>
}

interface ISecurityBlocklistResult {
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
    request_id: string
    leaks_blocked: boolean
    systems_accounts_blocked: boolean
    domain_accounts_blocked: boolean
    blocked_employees: Array<IBlockListByEmployee>
}

export default class BlockListSecurityReport extends Report {
    result: ISecurityBlocklistResult

    constructor(report_id: number, result: ISecurityBlocklistResult, files: Array<IToolResponseFile>) {
        super(report_id, files)
        this.result = result
    }

    static async send(blockLeaks: boolean, blockSystems: boolean, blockDomain: boolean, blockTechnical: boolean, blockLocked: boolean, blockDeleted: boolean, leaveComment: boolean, employeeIDs: Array<number>, initiator: string, requestID: string, save: boolean) {
        const formData = new FormData()

        formData.append('block_data_leaks', blockLeaks ? 'true' : 'false')
        formData.append('block_system_accounts', blockSystems ? 'true' : 'false')
        formData.append('block_domain_accounts', blockDomain ? 'true' : 'false')

        formData.append('block_technical_accounts', blockTechnical ? 'true' : 'false')
        formData.append('block_locked_accounts', blockLocked ? 'true' : 'false')
        formData.append('block_deleted_accounts', blockDeleted ? 'true' : 'false')

        formData.append('send_to_soi', leaveComment ? 'true' : 'false')

        formData.append('employee_ids', `[${employeeIDs.join(',')}]`)

        formData.append('initiator', initiator)
        formData.append('request', requestID)

        formData.append('save', save ? 'true' : 'false')

        console.debug(`[${employeeIDs.join(',')}]`)

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const summary: BlockListSecurityReport = response.data as BlockListSecurityReport

            if (summary) {
                return new BlockListSecurityReport(summary.report_id, summary.result, summary.files)
            } else throw new Error(`JSON decoding error`)
        }
    }

    load(): void {

    }

    renderChart(): React.ReactNode {
        return undefined;
    }

    renderTable(): React.ReactNode {
        return Object.entries(this.result.blocked_employees).map((value, index) => {
            return <BlockedEmployeeCards key={index} employee_id={value[1].employee_id}
                                         employee_full_name={value[1].employee_full_name}
                                         domain_accounts={value[1].domain_accounts}
                                         system_accounts={value[1].system_accounts}/>
        })
    }

    summary(): string {
        if (this.report_id !== 0) {
            return `Файл обработан.
                Отчет сохранен. ID#${this.report_id}\n
                Заблокировано пользователей: ${this.result.blocked_employees.length}\n
                Заблокировано УЗ в ИС: ${this.result.total_system_accounts_blocked}
                Заблокировано УЗ в домене: ${this.result.total_domain_accounts_blocked}`
        } else {
            return `Файл обработан.\n
                Заблокировано пользователей: ${this.result.blocked_employees.length}\n
                Заблокировано УЗ в ИС: ${this.result.total_system_accounts_blocked}
                Заблокировано УЗ в домене: ${this.result.total_domain_accounts_blocked}`
        }
    }
}

function BlockedEmployeeCards(props: IBlockListByEmployee) {
    return <div className={'blocked-employee-card'}>
        <h3>{props.employee_full_name}</h3>
        <a href={`https://dzb-web.rgs.ru/dib/search/data-search.php?mode=equal&type=cardid&field=${props.employee_id}`}>Ссылка
            на профиль №{props.employee_id}</a>
        {
            props.system_accounts.length > 0 ? <table className={'system-accounts'}>
                <thead>
                <tr>
                    <td className={'system-name'}>
                        Система
                    </td>
                    <td className={'login'}>
                        Логин
                    </td>
                    <td className={'full-name'}>
                        Полное имя
                    </td>
                    <td className={'is-technical'}>
                        ТУЗ?
                    </td>
                    <td className={'is-active'}>
                        Активен?
                    </td>
                    <td className={'block-date'}>
                        Срок действия
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    props.system_accounts.map((value, index) => {
                        const expiration_ = moment(value.expired_at).format('DD/MM/YYYY')

                        return <tr key={index}>
                            <td className={'system-name'}>{value.system_name}</td>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                            <td className={`is-technical ${value.is_technical ? 'highlighted' : null}`}>{value.is_technical ? 'да' : 'нет'}</td>
                            <td className={`is-active ${value.is_active ? null : 'danger'}`}>{value.is_active ? 'да' : 'нет'}</td>
                            <td className={`block-date ${expiration_ === '01/01/0001' ? 'hidden' : null}`}>{expiration_}</td>
                        </tr>
                    })
                }
                </tbody>
                <tfoot>
                <tr>

                </tr>
                </tfoot>
            </table> : <Fragment/>
        }
        {
            props.domain_accounts.length > 0 ? <table className={'domain-accounts'}>
                <thead>
                <tr>
                    <td className={'login'}>
                        Логин
                    </td>
                    <td className={'full-name'}>
                        Полное имя
                    </td>
                    <td className={'email'}>
                        Почтовый адрес
                    </td>
                    <td className={'is-technical'}>
                        ТУЗ?
                    </td>
                    <td className={'is-active'}>
                        Активен?
                    </td>
                    <td className={'expire-date'}>
                        Срок действия
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    props.domain_accounts.map((value, index) => {
                        const expiration_ = moment(value.expired_at).format('DD/MM/YYYY')

                        return <tr key={index}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                            <td className={'email'}>{value.e_mail_address}</td>
                            <td className={`is-technical ${value.is_technical ? 'highlighted' : null}`}>{value.is_technical ? 'да' : 'нет'}</td>
                            <td className={`is-active ${value.is_active ? null : 'danger'}`}>{value.is_active ? 'да' : 'нет'}</td>
                            <td className={`expire-date ${expiration_ === '01/01/0001' ? 'hidden' : null}`}>{expiration_}</td>
                        </tr>
                    })
                }
                </tbody>
                <tfoot>
                <tr>

                </tr>
                </tfoot>
            </table> : <Fragment/>
        }
    </div>
}

