import Navbar from "../../navigation/navbar";
import {Fragment, useState} from "react";
import moment from "moment";
import 'moment/locale/ru'

import './home.scss'

export default function Home() {
    document.title = 'Домашняя страница'

    moment.locale('ru')

    return (
        <Fragment>
            <div className={'page-content'}>
                <header>
                    {moment().format('LL')}
                </header>
                <div className="home-panel">
                    <div className="left-panel">

                    </div>
                    <div className="right-panel">
                        <h2>Последние активности</h2>
                        <ul className="recent-reports">
                        </ul>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}