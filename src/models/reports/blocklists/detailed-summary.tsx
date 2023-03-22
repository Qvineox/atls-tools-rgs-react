import {IToolResponseFile, ToolResponse} from "../reports";
import React from "react";
import axios from "axios";

const API_ROUTE_DETAILED = "/api/reporting/processing/blocks/detailed"
const API_ROUTE_REGULAR = "/api/reporting/processing/blocks/regular"

interface ISystemAccount {
    login: string
    full_name: string
}

interface IBlocksBySystem {
    [key: string]: { count: number, accounts: Array<ISystemAccount> };
}

interface IBlockListsDetailedSummaryResult {
    fired_accounts_blocked: number
    decree_accounts_blocked: number
    fired_blocklist_by_system: IBlocksBySystem
    decree_blocklist_by_system: IBlocksBySystem
}

export class BlockListsDetailedSummary {
    report_id: number
    result: IBlockListsDetailedSummaryResult
    files: Array<IToolResponseFile>

    constructor(report_id: number, result: IBlockListsDetailedSummaryResult, files: Array<IToolResponseFile>) {
        this.report_id = report_id
        this.result = result
        this.files = files
    }

    static async send(startDate: string, endDate: string, save: boolean) {
        const formData = new FormData()

        formData.append('start_date', startDate)
        formData.append('end_date', endDate)
        formData.append('save', save ? 'true' : 'false')

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE_DETAILED, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status < 300) {
            const toolResponse: ToolResponse = response.data

            if (toolResponse) {
                const summary: BlockListsDetailedSummary = response.data as BlockListsDetailedSummary

                if (summary) {
                    return new BlockListsDetailedSummary(summary.report_id, summary.result, summary.files)
                } else throw new Error(`JSON decoding error`)
            } else throw new Error(`Empty tool response`)
        }
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

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE_REGULAR, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const toolResponse: ToolResponse = response.data

            if (toolResponse) {
                const summary: BlockListsDetailedSummary = response.data as BlockListsDetailedSummary

                if (summary) {
                    return new BlockListsDetailedSummary(summary.report_id, summary.result, summary.files)
                } else throw new Error(`JSON decoding error`)
            } else throw new Error(`Empty tool response`)
        }
    }

    public Render() {
        let rows: Array<JSX.Element> = []
        let index: number = 0

        console.debug(this.result.fired_blocklist_by_system)

        if (this.result.fired_blocklist_by_system) {
            rows.push(<tr key={index++}>
                <td className={'separator'} colSpan={3}>Уволенные сотрудники</td>
            </tr>)
            Object.entries(this.result.fired_blocklist_by_system).forEach(entry => {
                entry[1].accounts.forEach((value, index_) => {
                    if (index_ !== 0) {
                        rows.push(<tr key={index++}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    } else {
                        rows.push(<tr key={index++}>
                            <td rowSpan={entry[1].accounts.length} className={'system-name'}>{entry[0]}<br/><p
                                className={'hint'}>(Всего: {entry[1].accounts.length})</p></td>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    }
                })
            })
        }

        if (this.result.decree_blocklist_by_system) {
            rows.push(<tr key={index++}>
                <td className={'separator'} colSpan={3}>Сотрудники в декрете</td>
            </tr>)
            Object.entries(this.result.decree_blocklist_by_system).forEach(entry => {
                entry[1].accounts.forEach((value, index_) => {
                    if (index_ !== 0) {
                        rows.push(<tr key={index++}>
                            <td className={'login'}>{value.login}</td>
                            <td className={'full-name'}>{value.full_name}</td>
                        </tr>)
                    } else {
                        rows.push(<tr key={index++}>
                            <td rowSpan={entry[1].accounts.length} className={'system-name'}>{entry[0]}<br/><p
                                className={'hint'}>(Всего: {entry[1].accounts.length})</p></td>
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
        let totalSystems: number = 0

        if (this.result.fired_blocklist_by_system) {
            totalSystems += Object.entries(this.result?.fired_blocklist_by_system).length
        }

        if (this.result.decree_blocklist_by_system) {
            totalSystems += Object.entries(this.result?.decree_blocklist_by_system).length
        }

        if (this.report_id !== 0) {
            return `Файлы обработаны.
                Отчет сохранен. ID#${this.report_id}\n
                Всего заблокированных: ${this.result.decree_accounts_blocked + this.result.fired_accounts_blocked}
                Уволенных: ${this.result.fired_accounts_blocked}
                В декрете: ${this.result.decree_accounts_blocked}\n
                Систем затронуто: ${totalSystems}`
        } else {
            return `Файлы обработаны.\n
                Всего заблокированных: ${this.result.decree_accounts_blocked + this.result.fired_accounts_blocked}
                Уволенных: ${this.result.fired_accounts_blocked}
                В декрете: ${this.result.decree_accounts_blocked}\n
                Систем затронуто: ${totalSystems}`
        }
    }

    public GetFiredFiles() {
        return this.files.filter((item) => {
            return item.file_name.includes('Декрет.')
        })
    }

    public GetDecreeFiles() {
        return this.files.filter((item) => {
            return !item.file_name.includes('Декрет.')
        })
    }
}