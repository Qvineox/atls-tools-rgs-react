import {IToolResponseFile, Report} from "../reports";
import React from "react";
import axios from "axios";

const API_ROUTE = "/api/reporting/processing/blocks/regular"

interface ISystemAccount {
    login: string
    full_name: string
}

interface IBlocksBySystem {
    [key: string]: { count: number, accounts: Array<ISystemAccount> };
}

interface IBlockListsDetailedContent {
    fired_accounts_blocked: number
    decree_accounts_blocked: number
    fired_blocklist_by_system: IBlocksBySystem
    decree_blocklist_by_system: IBlocksBySystem
}

export class BlockListsRegularReport extends Report {
    result: IBlockListsDetailedContent

    constructor(report_id: number, result: IBlockListsDetailedContent, files: Array<IToolResponseFile>) {
        super(report_id, files)
        this.result = result
    }

    static async send(firedFile: File | undefined, decreeFile: File | undefined, domainFile: File | undefined, save: boolean) {
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

        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + API_ROUTE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        if (response.status === 200) {
            const summary: BlockListsRegularReport = response.data as BlockListsRegularReport

            if (summary) {
                return new BlockListsRegularReport(summary.report_id, summary.result, summary.files)
            } else throw new Error(`JSON decoding error`)
        }
    }

    public renderTable() {
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

    public summary() {
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

    public getFilesFired() {
        return this.files.filter((item) => {
            return !item.file_name.includes('Декрет.')
        })
    }

    public getFilesDecree() {
        return this.files.filter((item) => {
            return item.file_name.includes('Декрет.')
        })
    }

    load(): void {
    }

    renderChart(): React.ReactNode {
        return undefined;
    }
}