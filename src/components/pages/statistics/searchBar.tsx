import React, {useEffect} from "react";
import {toast} from "react-toastify";

export interface ISearchBarProps {
    startDate: string
    endDate: string
    endDateController: React.Dispatch<string>
    startDateController: React.Dispatch<string>
}

export default function SearchBar(props: ISearchBarProps) {
    useEffect(() => {
        if (props.startDate >= props.endDate) {
            toast.error("Неправильно выбран диапазон.")

            document.getElementById('start-date')?.classList.add('error')
            document.getElementById('end-date')?.classList.add('error')
        } else {
            document.getElementById('start-date')?.classList.remove('error')
            document.getElementById('end-date')?.classList.remove('error')
        }
    }, [props.startDate, props.endDate])

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