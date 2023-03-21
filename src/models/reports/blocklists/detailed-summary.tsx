import {ToolResponseFile} from "../reports";
import React from "react";

const API_ROUTE = "/api/reporting/processing/agreements/detailed"

interface ISystemAccount {
    login: string
    full_name: string
}

interface IBlocksBySystem {
    count: number
    accounts: Array<ISystemAccount>
}

export class BlockListsDetailedSummary {
    fired_accounts_blocked: number
    decree_accounts_blocked: number
    fired_blocklist_by_system: Map<string, IBlocksBySystem>
    decree_blocklist_by_system: Map<string, IBlocksBySystem>
    private files: Array<ToolResponseFile>

    constructor(fired_accounts_blocked: number, decree_accounts_blocked: number, fired_blocklist_by_system: Map<string, IBlocksBySystem>, decree_blocklist_by_system: Map<string, IBlocksBySystem>) {
        this.fired_accounts_blocked = fired_accounts_blocked
        this.decree_accounts_blocked = decree_accounts_blocked
        this.fired_blocklist_by_system = fired_blocklist_by_system
        this.decree_blocklist_by_system = decree_blocklist_by_system

        this.files = []
    }

    protected addFiles(files: Array<ToolResponseFile>) {
        this.files = this.files.concat(files)
    }

    static async send(startDate: string, endDate: string, save: boolean) {
        const formData = new FormData()

        formData.append('start_date', startDate)
        formData.append('end_date', endDate)
        formData.append('save', save ? 'true' : 'false')

        // const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
        //
        // if (response.status === 200) {
        //     const toolResponse: AgreementsDetailedSummary = response.data
        //
        //     return new AgreementsDetailedSummary(toolResponse.total_allowed,
        //         toolResponse.total_denied,
        //         toolResponse.total_other,
        //         toolResponse.unrecognised_services,
        //         toolResponse.missing_table_field,
        //         toolResponse.services
        //     )
        // }
        // throw new Error(response.data)

        let summary = new BlockListsDetailedSummary(54, 6, new Map<string, IBlocksBySystem>([['ИС1', {
            accounts: [{login: 'test1', full_name: "test test test"}],
            count: 12
        }], ['ИС2', {
            accounts: [{login: 'test1', full_name: "test test test"}, {login: 'test2', full_name: "test test test"}],
            count: 22
        }]]), new Map<string, IBlocksBySystem>([['ИС1', {
            accounts: [{login: 'test3', full_name: "test test test"}],
            count: 12
        }]]))

        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест1",
            Description: "https://yandex.ru",
            PublicURL: "https://yandex.ru"
        }))
        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест2",
            Description: "Описание 2",
            PublicURL: "https://yandex.ru"
        }))

        console.log(summary)

        return summary
    }

    static async sendBlocklist(firedFile: File | undefined, decreeFile: File | undefined, domainFile: File | undefined, save: boolean) {
        const formData = new FormData()

        if (firedFile !== undefined) {
            formData.append('file_upload_fired', firedFile)
        }
        if (decreeFile !== undefined) {
            formData.append('file_upload_decree', decreeFile)
        }
        if (domainFile !== undefined) {
            formData.append('file_upload_domain', domainFile)
        }

        formData.append('save', save ? 'true' : 'false')

        // const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
        //
        // if (response.status === 200) {
        //     const toolResponse: AgreementsDetailedSummary = response.data
        //
        //     return new AgreementsDetailedSummary(toolResponse.total_allowed,
        //         toolResponse.total_denied,
        //         toolResponse.total_other,
        //         toolResponse.unrecognised_services,
        //         toolResponse.missing_table_field,
        //         toolResponse.services
        //     )
        // }
        // throw new Error(response.data)

        let summary = new BlockListsDetailedSummary(54, 6, new Map<string, IBlocksBySystem>([['ИС1', {
            accounts: [{login: 'test1', full_name: "test test test"}],
            count: 12
        }], ['ИС2', {
            accounts: [{login: 'test1', full_name: "test test test"}, {login: 'test2', full_name: "test test test"}],
            count: 22
        }]]), new Map<string, IBlocksBySystem>([['ИС1', {
            accounts: [{login: 'test3', full_name: "test test test"}],
            count: 12
        }]]))

        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест1",
            Description: "https://yandex.ru",
            PublicURL: "https://yandex.ru"
        }))
        summary.addFiles(new Array<ToolResponseFile>({
            FileName: "Тест2",
            Description: "Описание 2",
            PublicURL: "https://yandex.ru"
        }))

        console.log(summary)

        return summary
    }

    public Render() {
        let rows: Array<JSX.Element> = []

        if (this.fired_blocklist_by_system.size > 0) {
            rows.push(<tr>
                <td className={'separator'} colSpan={3}>Уволенные сотрудники</td>
            </tr>)
            this.fired_blocklist_by_system.forEach((blocksBySystem, systemName) => {
                blocksBySystem.accounts.forEach((value, index) => {
                    if (index != 0) {
                        rows.push(<tr key={index}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    } else {
                        rows.push(<tr key={index}>
                            <td rowSpan={blocksBySystem.accounts.length} className={'system-name'}>{systemName}<br/><p
                                className={'hint'}>(Всего: {blocksBySystem.accounts.length})</p></td>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    }
                })
            })
        }

        if (this.decree_blocklist_by_system.size > 0) {
            rows.push(<tr>
                <td className={'separator'} colSpan={3}>Сотрудники в декрете</td>
            </tr>)
            this.decree_blocklist_by_system.forEach((blocksBySystem, systemName) => {
                blocksBySystem.accounts.forEach((value, index) => {
                    if (index != 0) {
                        rows.push(<tr key={index}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    } else {
                        rows.push(<tr key={index}>
                            <td rowSpan={blocksBySystem.accounts.length} className={'system-name'}>{systemName}<br/><p
                                className={'hint'}>(Всего: {blocksBySystem.accounts.length})</p></td>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    }
                })
            })
        }


        return (<table className={'detailed-blocks'}>
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
            </tr>
            </thead>
            <tbody>
            {
                rows
            }
            </tbody>
            <tfoot>
            <tr>

            </tr>
            </tfoot>
        </table>)
    }

    public GetSummary() {
        return `Отчет сохранен.\n
                Всего заблокированных: ${this.decree_accounts_blocked + this.fired_accounts_blocked}
                Уволенных: ${this.fired_accounts_blocked}
                В декрете: ${this.decree_accounts_blocked}\n
                Систем затронуто: ${this.fired_blocklist_by_system.size + this.decree_blocklist_by_system.size}`
    }

    public GetFiles() {
        return this.files
    }
}