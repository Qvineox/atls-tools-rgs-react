import "../../styles/pages/history.scss";
import React, {useEffect, useState} from "react";
import Select from 'react-select'
import ReportCard, {IReportCardProps, ReportType} from "../fragments/reportCard";
import moment, {Moment} from "moment";
import 'moment/locale/ru'
import axios from "axios";

interface IReportTypeSelect {
    value: ReportType,
    label: string
}

interface IReportsQuery {
    startDate: string,
    endDate: string,
    types: IReportTypeSelect[]
}

export default function History() {
    document.title = 'История'

    moment.locale('ru')
    const today = moment()

    let [isLoaded, setLoaded] = useState(true)
    let [queryFilter, setQueryFilter] = useState<IReportsQuery>({
        endDate: today.toISOString().slice(0, 10),
        startDate: today.subtract(1, 'week').toISOString().slice(0, 10),
        types: []
    })

    let [reportsList, setReportsList] = useState<IReportCardProps[]>([])

    function searchReports(query: IReportsQuery) {
        setLoaded(false)

        let _startDate = moment(query.startDate)
        let _endDate = moment(query.endDate)

        if (_endDate < _startDate) {
            console.error('Неправильный формат даты')
            document.getElementById('start-date')?.classList.add('error')
            document.getElementById('end-date')?.classList.add('error')

            return []
        } else {
            document.getElementById('start-date')?.classList.remove('error')
            document.getElementById('end-date')?.classList.remove('error')

            const types = query.types.map(item => {
                return item.value
            })

            _startDate.set('hour', 0).set('minutes', 0)
            _endDate.set('hour', 23).set('minutes', 59)

            axios({
                method: 'GET',
                url: process.env.REACT_APP_BACKEND_URL + "/api/reports",
                params: {
                    'start_date': _startDate.toISOString(),
                    'end_date': _endDate.toISOString(),
                    'types': `[${types.join(',')}]`
                }
            }).then(response => {
                if (response.data) {
                    const reports = response.data as Array<IReportCardProps>
                    setReportsList(reports)
                } else {
                    setReportsList([])
                }
            })
        }
    }

    useEffect(() => {
        searchReports(queryFilter)
    }, [queryFilter])

    return (
        <div className={'page-content'}>
            <SearchBar queryFilter={queryFilter} setQueryFilter={setQueryFilter}/>
            {
                reportsList.length > 0 ? <ReportsList reportsList={reportsList}/> :
                    <p className={'placeholder'}>Нет результатов</p>
            }
        </div>
    )
}

interface ISearchBarProps {
    queryFilter: IReportsQuery;
    setQueryFilter: React.Dispatch<React.SetStateAction<IReportsQuery>>
}


const SearchBar = ({queryFilter, setQueryFilter}: ISearchBarProps) => {
    return (
        <div id={'search-bar'}>
            <div className="input-field">
                <label htmlFor={'start-date'}>От</label>
                <input defaultValue={queryFilter.startDate}
                       onChange={(newValue) => {
                           setQueryFilter({
                               ...queryFilter,
                               startDate: newValue.target.value
                           })
                       }}
                       id={'start-date'}
                       type={'date'}/>
            </div>
            <div className="input-field">
                <label htmlFor={'end-date'}>До</label>
                <input defaultValue={queryFilter.endDate}
                       onChange={(newValue) => {
                           setQueryFilter({
                               ...queryFilter,
                               endDate: newValue.target.value
                           })
                       }} id={'end-date'} type={'date'}/>
            </div>
            <div className="input-field" style={{borderLeft: '2px solid #dadada', width: '30%'}}>
                <label htmlFor={'report-types'}>Типы отчетов</label>
                <Select value={queryFilter.types}
                        onChange={(options) => {
                            setQueryFilter({
                                ...queryFilter,
                                types: Array.from(options)
                            })
                        }} isMulti placeholder={'Выберите...'} id={'report-types-select'}
                        options={[
                            {value: ReportType.DAILY_ACCESS, label: 'Ежедневный отчет по доступам'},
                            {value: ReportType.WEEKLY_ACCESS, label: 'Еженедельный отчет по доступам'},
                            {value: ReportType.REGULAR_BANS, label: 'Регулярные блокировки'},
                            {value: ReportType.WEEKLY_BANS, label: 'Отчет по блокировкам'},
                            {value: ReportType.ASD_BANS, label: 'Блокировки ДЭБ'}
                        ]}/>
            </div>
        </div>
    )
}

interface IReportListProps {
    reportsList: IReportCardProps[];
}


const ReportsList = ({reportsList}: IReportListProps) => {
    let result: React.ReactElement[] = [];
    let latestDate: Moment

    let keyIter = 0

    reportsList.forEach(report => {
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
                <ReportCard id={report.id} report_type={report.report_type} created_at={createdAt.toDate()}/>
            </li>)

        keyIter += 1
    })

    return (<ul className={'report-list'}>{result}</ul>)
}