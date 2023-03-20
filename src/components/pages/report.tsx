import {Link, useNavigate, useParams} from "react-router-dom";
import React, {Component, Fragment, ReactFragment, useEffect, useReducer, useRef, useState} from "react";
import axios from "axios";
import moment, {Moment} from "moment";
import {DailyReportResolvedStats, IDailyAccessResult} from "./tools/daily-access";
import {IWeeklyAccessResult, WeeklyReportDetailedView, WeeklyReportResolvedStats} from "./tools/weekly-access";
import {IRegularBlockResult, RegularBlockDetailedView, RegularBlockResolvedStats} from "./tools/regular-block";
import {EmployeeBlockList, ISecurityBlocksResult, SecurityBlockResolvedStats} from "./tools/security-block";
import '../../styles/pages/report.scss'
import '../../styles/pages/tools.scss'

interface IReportTypeState {
    id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    report_type: string;
    report_type_id: 0 | 1 | 2 | 3 | 4 | 5;
    file_url: string;
    component: JSX.Element | null;
}

type Action =
    | { type: 0; payload: IReportTypeState }
    | { type: 1; payload: IReportTypeState }
    | { type: 2; payload: IReportTypeState }
    | { type: 3; payload: IReportTypeState }
    | { type: 4; payload: IReportTypeState }
    | { type: 5; payload: IReportTypeState }

export const initialState: IReportTypeState = {
    id: 0,
    content: "",
    file_url: "",
    report_type: "",
    report_type_id: 0,
    created_at: new Date(),
    updated_at: new Date(),
    component: null
};

async function deleteReport(evt: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number): Promise<boolean> {
    evt.preventDefault()


    let isDelete = window.confirm(`Вы собираетесь удалить отчет №${id}.\nПродолжить?`)

    if (isDelete) {
        return await axios.delete(process.env.REACT_APP_BACKEND_URL + '/api/report', {
            params: {
                id: id
            }
        })
    } else {
        return false
    }
}

export default function Report() {
    const params = useParams<{ reportId?: string }>()
    const [state, dispatch] = useReducer(reportTypeReducer, initialState)

    const navigate = useNavigate()

    function reportTypeReducer(state: IReportTypeState, action: Action): IReportTypeState {
        let reportContent: any;

        if (action.payload.content.length === 0) {
            return {...initialState}
        } else {
            reportContent = JSON.parse(action.payload.content.replace(/\\"/g, '"'))
        }

        state.id = action.payload.id
        state.created_at = action.payload.created_at
        state.updated_at = action.payload.updated_at
        state.report_type_id = action.payload.report_type_id
        state.report_type = action.payload.report_type

        switch (action.type) {
            case 0:
                break
            case 1:
                const dailyAccessResult: IDailyAccessResult = reportContent as IDailyAccessResult

                state.component = <DailyReportResolvedStats
                    allowed={dailyAccessResult.allowed}
                    denied={dailyAccessResult.denied}
                    working={dailyAccessResult.working}
                    other={dailyAccessResult.other}/>

                break
            case 2:
                const weeklyAccessResult: IWeeklyAccessResult = reportContent as IWeeklyAccessResult

                state.file_url = action.payload.file_url
                state.component = <WeeklyReportDetailedView missing_table_field={weeklyAccessResult.missing_table_field}
                                                            unrecognised_services={weeklyAccessResult.unrecognised_services}
                                                            total_allowed={weeklyAccessResult.total_allowed}
                                                            total_denied={weeklyAccessResult.total_denied}
                                                            total_other={weeklyAccessResult.total_other}
                                                            services={weeklyAccessResult.services}
                />

                break
            case 3:
                const regularBlockResult: IRegularBlockResult = reportContent as IRegularBlockResult

                state.file_url = action.payload.file_url
                state.component =
                    <RegularBlockDetailedView fired_accounts_blocked={regularBlockResult.fired_accounts_blocked}
                                              decree_accounts_blocked={regularBlockResult.decree_accounts_blocked}
                                              fired_bans_by_system={regularBlockResult.fired_bans_by_system}
                                              decree_bans_by_system={regularBlockResult.decree_bans_by_system}
                    />

                break
            case 4:
                const weeklyBlockResult: IRegularBlockResult = reportContent as IRegularBlockResult

                state.file_url = action.payload.file_url
                state.component =
                    <RegularBlockDetailedView fired_accounts_blocked={weeklyBlockResult.fired_accounts_blocked}
                                              decree_accounts_blocked={weeklyBlockResult.decree_accounts_blocked}
                                              fired_bans_by_system={weeklyBlockResult.fired_bans_by_system}
                                              decree_bans_by_system={weeklyBlockResult.decree_bans_by_system}
                    />

                break
            case 5:
                const securityBlockResult: ISecurityBlocksResult = reportContent as ISecurityBlocksResult

                state.file_url = action.payload.file_url
                state.component = <SecurityBlockResolvedStats blocked_employees={securityBlockResult.blocked_employees}
                                                              total_system_accounts_blocked={securityBlockResult.total_system_accounts_blocked}
                                                              total_domain_accounts_blocked={securityBlockResult.total_domain_accounts_blocked}
                />

                break
            default:
                state.component = <Fragment/>

                console.error('Report type not defined');
        }

        return {...state}
    }

    useEffect(() => {
        document.title = `Информация об отчете №${params.reportId}`

        axios.get(process.env.REACT_APP_BACKEND_URL + "/api/report", {
            params: {
                id: params.reportId
            }
        }).then(response => {
            const responseData: IReportTypeState = response.data as IReportTypeState
            dispatch({type: responseData.report_type_id, payload: responseData})
        })
    }, [params.reportId])

    return (
        <div className={'page-content'}>
            <div className="report-data">
                {
                    state.id !== undefined ? <Fragment>
                        <div className="report-info">
                            <div className="report-meta-group">
                                <h2>{state.report_type}</h2>
                                <label htmlFor="report-id">Идентификатор отчета</label>
                                <p id={'report-id'}>ID# {state.id}</p>
                                <label htmlFor="created-at">Создан</label>
                                <p id={'created-at'}>{moment(state.created_at).format('DD.MM.YYYY HH:MM')}</p>
                                <label htmlFor="updated-at">Изменен</label>
                                <p id={'updated-at'}>{moment(state.updated_at).format('DD.MM.YYYY HH:MM')}</p>
                            </div>
                            {
                                state.file_url.length > 0 ? <div className="report-meta-group">
                                    <label htmlFor="file-url">Ссылка на репозиторий</label>
                                    <a id={'file-url'}
                                       href={process.env.REACT_APP_BACKEND_URL + state.file_url}>Адрес репозитория</a>
                                </div> : null
                            }
                            <div className="report-meta-group">
                                <label htmlFor="file-url">Содержание отчета</label>
                                <a id={'file-url'}
                                   href={process.env.REACT_APP_BACKEND_URL + '/api/report?id=' + state.id}>Отчет в
                                    формате JSON</a>
                            </div>
                            <div className="report-meta-group buttons">
                                <button onClick={async (evt) => {
                                    if (await deleteReport(evt, state.id)) {
                                        navigate(`/history`)
                                    }
                                }} className={'execute'}>Удалить отчет
                                </button>
                            </div>
                        </div>
                    </Fragment> : null
                }
                {
                    state.component !== null ? <div className="tool-result">
                        {state.component}
                    </div> : null
                }
            </div>
        </div>
    )
}