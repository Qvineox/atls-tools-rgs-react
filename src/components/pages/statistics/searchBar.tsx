import React from "react";

export interface ISearchBarProps {
    startDate: string
    endDate: string
    endDateController: React.Dispatch<string>
    startDateController: React.Dispatch<string>
}

export default function SearchBar(props: ISearchBarProps) {
    return (
        <div id={'search-bar'}>
            <div className="input-field">
                <label htmlFor={'start-date'}>От</label>
                <input value={props.startDate}
                       onChange={(newValue) => {
                           props.startDateController(newValue.target.value)
                       }}
                       id={'start-date'}
                       type={'date'}/>
            </div>
            <div className="input-field">
                <label htmlFor={'end-date'}>До</label>
                <input value={props.endDate}
                       onChange={(newValue) => {
                           props.endDateController(newValue.target.value)
                       }} id={'end-date'} type={'date'}/>
            </div>
        </div>
    )
}