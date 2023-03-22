import React from "react";
import moment, {Moment} from "moment/moment";
import {Link} from "react-router-dom";

export interface IReportCardProps {
    id: number
    report_type: string,
        created_at: Date
}

export interface IReportsListProps {
    reports: Array<IReportCardProps>
}

export default function ReportsList(props: IReportsListProps) {
    let result: React.ReactElement[] = [];
    let latestDate: Moment

    let keyIter = 0

    props.reports.forEach(report => {
        const createdAt = moment(report.created_at)

        if (createdAt.date() !== latestDate?.date()) {
            result.push(<li key={keyIter} className={'separator'}>
                <p>{createdAt.format('LL')}</p>
            </li>)

            latestDate = createdAt
            keyIter += 1
        }

        result.push(
            <li key={keyIter}>
                <Link style={{textDecoration: 'none'}} to={`/reports/${report.id}`}>
                    <div className="report-card">
                        <p className={`created-date`}>
                            {moment(report.created_at).format('LTS DD.MM.YYYY').replaceAll('/', '.')}
                        </p>
                        <p className={'card-type'}>
                            {report.report_type} <i className={'card-id'}>id{report.id}</i>
                        </p>
                    </div>
                </Link>
            </li>)

        keyIter += 1
    })

    return (<ul className={'report-list'}>{result}</ul>)
}