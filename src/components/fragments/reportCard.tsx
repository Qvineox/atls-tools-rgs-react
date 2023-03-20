import '../../styles/fragments/reportCard.scss'
import moment from "moment";
import {Link} from "react-router-dom";

export enum ReportType {
    DAILY_ACCESS = 1,
    WEEKLY_ACCESS = 2,
    REGULAR_BANS = 3,
    WEEKLY_BANS = 4,
    ASD_BANS = 5,
}

export interface IReportCardProps {
    id: number
    report_type: string,
    created_at: Date
}

function clickController(event: React.MouseEvent, id: number) {
    event.preventDefault()

    console.debug(event.type)

    switch (event.type) {
        case 'click':
            break
        case 'contextmenu':
            console.debug(event.clientX, event.clientY)
            break
        default:
            console.error('Undefined event type')
    }
}

export default function ReportCard({id, report_type, created_at}: IReportCardProps) {
    let displayNameString: string

    switch (report_type) {
        case "Ежедневный отчет по доступам":
            displayNameString = `🟢 `
            break
        case "Еженедельный отчет по доступам":
            displayNameString = `🔵 `
            break
        case "Регулярные блокировки":
            displayNameString = `⭕ `
            break
        case "Отчет по блокировкам":
            displayNameString = `🔴 `
            break
        case "Блокировки ДЭБ":
            displayNameString = `🕵️‍♂️ `
            break
        default:
            displayNameString = `⚪ `
    }

    displayNameString += report_type

    return (
        <Link style={{textDecoration: 'none'}} to={`/reports/${id}`}>
            <div onContextMenu={(evt) => clickController(evt, id)} className="card">
                <p className={`created-date`}>
                    {moment(created_at).format('LTS DD.MM.YYYY').replaceAll('/', '.')}
                </p>
                <p className={'card-type'}>
                    {displayNameString} <i className={'card-id'}>id{id}</i>
                </p>
            </div>
        </Link>
    )
}