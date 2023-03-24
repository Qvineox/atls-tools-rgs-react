import React from "react";
import Select from "react-select";

enum ReportType {
    DAILY_ACCESS = 1,
    WEEKLY_ACCESS = 2,
    REGULAR_BANS = 3,
    WEEKLY_BANS = 4,
    ASD_BANS = 5,
}
interface IReportTypeSelect {
    value: ReportType,
    label: string
}
export interface IReportsQuery {
    startDate: string,
    endDate: string,
    types: IReportTypeSelect[]
}
export interface ISearchBarProps {
    queryFilter: IReportsQuery;
    setQueryFilter: React.Dispatch<React.SetStateAction<IReportsQuery>>
}
export default function SearchBar(props: ISearchBarProps) {
    return (
        <div id={'search-bar'}>
            <div className="input-field">
                <label htmlFor={'start-date'}>От</label>
                <input defaultValue={props.queryFilter.startDate}
                       onChange={(newValue) => {
                           props.setQueryFilter({
                               ...props.queryFilter,
                               startDate: newValue.target.value
                           })
                       }}
                       id={'start-date'}
                       type={'date'}/>
            </div>
            <div className="input-field">
                <label htmlFor={'end-date'}>До</label>
                <input defaultValue={props.queryFilter.endDate}
                       onChange={(newValue) => {
                           props.setQueryFilter({
                               ...props.queryFilter,
                               endDate: newValue.target.value
                           })
                       }} id={'end-date'} type={'date'}/>
            </div>
            <div className="input-field" style={{borderLeft: '2px solid #dadada', width: '30%'}}>
                <label htmlFor={'report-types'}>Типы отчетов</label>
                <Select value={props.queryFilter.types}
                        onChange={(options) => {
                            props.setQueryFilter({
                                ...props.queryFilter,
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