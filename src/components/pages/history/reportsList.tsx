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

        result.push(<ReportCard id={report.id}
                                report_type={report.report_type}
                                created_at={report.created_at}
                                key={keyIter}/>)

        keyIter += 1
    })

    return (<ul className={'report-list'}>{result}</ul>)
}

function ReportCard(props: IReportCardProps) {
    let typeClass: string

    switch (props.report_type) {
        case 'Регулярные блокировки':
            typeClass = `blocks-regular`
            break
        case 'Ежедневный отчет по доступам': {
            typeClass = `agreements-default`
            break
        }
        case 'Еженедельный отчет по доступам': {
            typeClass = `agreements-detailed`
            break
        }
        case 'Отчет по блокировкам': {
            typeClass = `blocks-detailed`
            break
        }
        case 'Блокировки ДЭБ': {
            typeClass = `blocks-esd`
            break
        }
        default:
            typeClass = `none`
    }

    return (<li>
        <Link to={`/reports/${props.id}`}>
            <div className={`report-card report-card_${typeClass}`}>
                <p className={`created-date `}>
                    {moment(props.created_at).format('LTS DD.MM.YYYY').replaceAll('/', '.')}
                </p>
                <p className={'card-type'}>
                    {props.report_type} <i className={'card-id'}>id{props.id}</i>
                </p>
            </div>
        </Link>
    </li>)
}