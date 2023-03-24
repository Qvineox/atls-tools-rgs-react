import React, {useState} from "react";
import "./statistics.scss"
import AgreementsChart from "./charts/agreementsChart";
import BlocksChart from "./charts/blocksChart";

import './statistics.scss'
import '../history/history.scss'
import SearchBar from "./searchBar";
import moment from "moment";

export default function Statistics() {
    document.title = 'Статистика'

    const today = moment()

    let [endDate, setEndDate] = useState<string>(today.toISOString().slice(0, 10))
    let [startDate, setStartDate] = useState<string>(today.subtract(1, 'month').toISOString().slice(0, 10))

    return (
        <div>
            <div className={'statistics-body'}>
                <SearchBar startDate={startDate}
                           endDate={endDate}
                           startDateController={setStartDate}
                           endDateController={setEndDate}/>
                <AgreementsChart startDate={startDate} endDate={endDate}/>
                <BlocksChart startDate={startDate} endDate={endDate}/>
            </div>
        </div>
    )
}