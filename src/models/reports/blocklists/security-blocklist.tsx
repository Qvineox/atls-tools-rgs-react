import {IDomainAccount, ISystemAccount} from "../../accounts/accounts";
import {ToolResponseFile} from "../reports";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {Domain} from "domain";

const API_ROUTE = "/api/reporting/processing/agreements/esd"

interface IBlockListByEmployee {
    employee_id: number
    employee_full_name: string
    system_accounts: Array<ISystemAccount>
    domain_accounts: Array<IDomainAccount>
}

export default class SecurityBlocklist {
    total_system_accounts_blocked: number
    total_domain_accounts_blocked: number
    request_id: string
    leaks_blocked: boolean
    systems_accounts_blocked: boolean
    domain_accounts_blocked: boolean
    blocked_employees: Array<IBlockListByEmployee>
    private readonly files: Array<ToolResponseFile>

    constructor(total_system_accounts_blocked: number, total_domain_accounts_blocked: number, request_id: string, leaks_blocked: boolean, systems_accounts_blocked: boolean, domain_accounts_blocked: boolean, blocked_employees: Array<IBlockListByEmployee>) {
        this.total_system_accounts_blocked = total_system_accounts_blocked
        this.total_domain_accounts_blocked = total_domain_accounts_blocked

        this.request_id = request_id
        this.leaks_blocked = leaks_blocked
        this.systems_accounts_blocked = systems_accounts_blocked
        this.domain_accounts_blocked = domain_accounts_blocked

        this.blocked_employees = blocked_employees

        this.files = []
    }

    static async send(blockLeaks: boolean, blockSystems: boolean, blockDomain: boolean, leaveComment: boolean, employeeIDs: Array<number>, initiator: string, requestID: string, save: boolean) {
        const formData = new FormData()

        formData.append('block_data_leaks', blockLeaks ? 'true' : 'false')
        formData.append('block_system_accounts', blockSystems ? 'true' : 'false')
        formData.append('block_domain_accounts', blockDomain ? 'true' : 'false')

        formData.append('send_to_soi', leaveComment ? 'true' : 'false')

        formData.append('employeeIDs', `[${employeeIDs.join(',')}]`)

        formData.append('initiator', initiator)
        formData.append('request', requestID)

        formData.append('save', save ? 'true' : 'false')

        // const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
        //
        // if (response.status === 200) {
        //     const toolResponse: SecurityBlocklist = response.data
        //
        //     return new SecurityBlocklist(
        //         toolResponse.total_system_accounts_blocked,
        //         toolResponse.total_domain_accounts_blocked,
        //         toolResponse.request_id,
        //         toolResponse.leaks_blocked,
        //         toolResponse.systems_accounts_blocked,
        //         toolResponse.domain_accounts_blocked,
        //         toolResponse.blocked_employees
        //     )
        // }
        // throw new Error(response.data)

        return new SecurityBlocklist(12, 12, "21412431", true, true, true, new Array<IBlockListByEmployee>({
            domain_accounts: new Array<IDomainAccount>({
                login: 'test1',
                full_name: 'Смирнов Иван Иванович',
                created_at: moment().toDate(),
                expired_at: moment().toDate(),
                description: 'test',
                e_mail_address: 'test',
                is_active: true,
                is_technical: false,
                updated_at: moment().toDate()
            }, {
                login: 'test2',
                full_name: 'Смирнов Иван Иванович',
                created_at: moment().toDate(),
                expired_at: moment().toDate(),
                description: 'test',
                e_mail_address: 'test',
                is_active: true,
                is_technical: true,
                updated_at: moment().toDate()
            }), system_accounts: new Array<ISystemAccount>({
                login: 'test1',
                full_name: 'Смирнов Иван Иванович',
                created_at: moment().toDate(),
                expired_at: moment().toDate(),
                blocked_at: moment().toDate(),
                description: 'test',
                system_name: 'Hyperion',
                is_active: true,
                is_technical: false,
                updated_at: moment().toDate()
            }, {
                login: 'test2',
                full_name: 'Смирнов Иван Иванович',
                created_at: moment().toDate(),
                expired_at: moment().toDate(),
                blocked_at: moment().toDate(),
                description: 'test',
                system_name: 'Naumen',
                is_active: true,
                is_technical: true,
                updated_at: moment().toDate()
            }), employee_full_name: "Смирнов Иван Иванович", employee_id: 13124
        }))
    }

    public Render() {
        console.log(this.blocked_employees)

        return this.blocked_employees.map((value, index) => {
            return <BlockedEmployeeCards key={index} employee_id={value.employee_id}
                                         employee_full_name={value.employee_full_name}
                                         domain_accounts={value.domain_accounts}
                                         system_accounts={value.system_accounts}/>
        })
    }

    public GetFiles() {
        return this.files
    }
}

function BlockedEmployeeCards(props: IBlockListByEmployee) {
    return <div className={'blocked-employee-card'}>
        <h3>{props.employee_full_name}</h3>
        <Link to={`${props.employee_id}`}>Ссылка на профиль №{props.employee_id}</Link>
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
                        Дата блокировки
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    props.system_accounts.map((value, index) => {
                        return <tr key={index}>
                            <td className={'system-name'}>{value.system_name}</td>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                            <td className={'is-technical'}>{value.is_technical ? 'да' : 'нет'}</td>
                            <td className={'is-active'}>{value.is_active ? 'да' : 'нет'}</td>
                            <td className={'block-date'}>{moment(value.blocked_at).format('DD/MM/YYYY')}</td>
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
                        Дата блокировки
                    </td>
                </tr>
                </thead>
                <tbody>
                {
                    props.domain_accounts.map((value, index) => {
                        return <tr key={index}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                            <td className={'email'}>{value.e_mail_address}</td>
                            <td className={'is-technical'}>{value.is_technical ? 'да' : 'нет'}</td>
                            <td className={'is-active'}>{value.is_active ? 'да' : 'нет'}</td>
                            <td className={'expire-date'}>{moment(value.expired_at).format('DD/MM/YYYY')}</td>
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

