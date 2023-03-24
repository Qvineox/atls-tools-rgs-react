import "./report.scss"
import {Fragment, useEffect, useState} from "react";
import {Report} from "../../../models/reports/reports";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {AgreementsDefaultReport} from "../../../models/reports/agreements/default-summary";
import {AgreementsDetailedReport} from "../../../models/reports/agreements/detailed-summary";
import {BlockListsRegularReport} from "../../../models/reports/blocklists/regular-blocklist";
import {BlockListsDetailedReport} from "../../../models/reports/blocklists/detailed-summary";
import BlockListSecurityReport from "../../../models/reports/blocklists/security-blocklist";
import ToolFormResultTable from "../../fragments/forms/fragments/viewers/toolFormResultTable";
import ToolFormResultChart from "../../fragments/forms/fragments/viewers/toolFormResultChart";
import {ToolFormResultViewer} from "../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultLoading from "../../fragments/forms/fragments/viewers/toolFormResultLoading";
import moment from "moment";
import ATLSError from "../../../models/error";

interface IReportInfo {
    id: number
    report_type_id: number
    report_type: string
    created_at: Date
    updated_at: Date
    file_url: string
    content: string
}

export default function ReportInfo() {
    const params = useParams();
    const navigate = useNavigate();

    const [reportInfo, setReportInfo] = useState<IReportInfo>()
    const [reportData, setReportData] = useState<Report>()

    const [isLoaded, setIsLoaded] = useState<boolean>()
    const [isRequested, setIsRequested] = useState<boolean>()

    useEffect(() => {
        setIsLoaded(false)
        setIsRequested(true)

        axios({
            method: 'GET',
            url: process.env.REACT_APP_BACKEND_URL + "/api/reporting/report",
            params: {
                'id': params.reportId
            }
        }).then(response => {
            const data: IReportInfo = response.data as IReportInfo
            setReportInfo(data)

            switch (data.report_type_id) {
                case 1:
                    setReportData(new AgreementsDefaultReport(data.id, JSON.parse(data.content), []))
                    break
                case 2:
                    setReportData(new AgreementsDetailedReport(data.id, JSON.parse(data.content), [
                        {file_name: 'Файл отчета', public_url: data.file_url, description: ""}
                    ]))
                    break
                case 3:
                    setReportData(new BlockListsRegularReport(data.id, JSON.parse(data.content), []))
                    break
                case 4:
                    setReportData(new BlockListsDetailedReport(data.id, JSON.parse(data.content), [
                        {file_name: 'Файл отчета', public_url: data.file_url, description: ""}
                    ]))
                    break
                case 5:
                    setReportData(new BlockListSecurityReport(data.id, JSON.parse(data.content), []))
                    break
                default:
                    setIsLoaded(false)
                    return alert('Невозможно определить тип отчета!')
            }

            setIsLoaded(true)
        }).catch(error => {
            ATLSError.fromAxios(error).toast()
        })
    }, [params.reportId])

    return (<div className={'report-body'}>
        {
            isLoaded && reportInfo ? <div className={'report-body__info'}>
                <div className={'identity'}>
                    <h2 className={`report-type`}>{reportInfo.report_type} №{reportInfo.id}</h2>
                    <table>
                        <tr>
                            <td><p className={`report-id`}>Идентификатор отчета:</p></td>
                            <td><p>ID#{reportInfo.id}</p></td>
                        </tr>
                        <tr>
                            <td><p className={`report-id`}>Идентификатор типа отчета:</p></td>
                            <td><p>ID#{reportInfo.report_type_id}</p></td>
                        </tr>
                        <tr>
                            <td><p className={`report-id`}>Дата создания:</p></td>
                            <td><p>{moment(reportInfo.created_at).format("DD/MM/YYYY HH:MM")}</p></td>
                        </tr>
                        <tr>
                            <td><p className={`report-id`}>Дата последнего изменения:</p></td>
                            <td><p>{moment(reportInfo.updated_at).format("DD/MM/YYYY HH:MM")}</p></td>
                        </tr>
                        {
                            reportData && reportData.files.length > 0 ? <tr>
                                <td><p className={`report-files`}>Доступные файлы:</p></td>
                                <td><a
                                    href={process.env.REACT_APP_BACKEND_URL + reportData.files[0].public_url}>{reportData.files[0].file_name}</a>
                                </td>
                            </tr> : <tr/>
                        }
                    </table>
                </div>
                {
                    isLoaded && reportData ? <Fragment>
                        <div className={'summary'}>
                            {reportData?.summary()}
                        </div>
                        <div className="options">
                            <button onClick={() => {
                                if (window.confirm(`Удалить отчет №${reportData?.report_id}?`)) {
                                    reportData.delete()
                                    navigate("/history");
                                }
                            }}>Удалить отчет
                            </button>
                        </div>
                    </Fragment> : <Fragment/>
                }
            </div> : <Fragment/>
        }
        {
            isRequested ? <Fragment>
                {
                    isLoaded && reportData ? <Fragment>
                        <ToolFormResultViewer isLoaded={isLoaded}>
                            <ToolFormResultChart chart={reportData.renderChart()}/>
                            <ToolFormResultTable table={reportData.renderTable()}/>
                        </ToolFormResultViewer>
                    </Fragment> : <Fragment/>
                }
            </Fragment> : <ToolFormResultLoading/>
        }
    </div>)
}