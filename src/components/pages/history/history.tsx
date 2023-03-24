import React, {Fragment, useEffect, useState} from "react";

import './history.scss'
import SearchBar, {IReportsQuery} from "./searchBar";
import moment from "moment/moment";
import ReportsList, {IReportCardProps} from "./reportsList";
import axios from "axios";
import loading from "./Pulse-0.9s-800px.gif";
import ATLSError from "../../../models/error";
import {toast} from "react-toastify";

export default function History() {
    const today = moment()
    const [queryFilter, setQueryFilter] = useState<IReportsQuery>({
        endDate: today.toISOString().slice(0, 10),
        startDate: today.subtract(1, 'week').toISOString().slice(0, 10),
        types: []
    })

    const [reportsList, setReportsList] = useState<Array<IReportCardProps>>([])

    const [isLoaded, setIsLoaded] = useState(false)
    const [isRequested, setIsRequested] = useState(false)

    useEffect(() => {
        setIsLoaded(false)
        setIsRequested(true)

        let _startDate = moment(queryFilter.startDate)
        let _endDate = moment(queryFilter.endDate)

        if (_endDate < _startDate) {
            toast.error("Неправильно выбран диапазон.")

            document.getElementById('start-date')?.classList.add('error')
            document.getElementById('end-date')?.classList.add('error')
        } else {
            document.getElementById('start-date')?.classList.remove('error')
            document.getElementById('end-date')?.classList.remove('error')

            const types = queryFilter.types.map(item => {
                return item.value
            })

            _startDate.set('hour', 0).set('minutes', 0)
            _endDate.set('hour', 23).set('minutes', 59)

            axios({
                method: 'GET',
                url: process.env.REACT_APP_BACKEND_URL + "/api/reporting/reports",
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
                setIsLoaded(true)
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
            })
        }
    }, [queryFilter])

    return (<Fragment>
        <div className="history-body">
            <SearchBar queryFilter={queryFilter} setQueryFilter={setQueryFilter}/>
            {
                isRequested ? <Fragment>
                    {
                        isLoaded && reportsList ? <ReportsList reports={reportsList}/> :
                            <div className={'report-list-loading'}>
                                <img alt={'loading...'} src={loading} className={'loading-svg'}/>
                            </div>
                    }
                </Fragment> : <Fragment/>
            }
        </div>
    </Fragment>)
}

