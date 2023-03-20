import React, {ChangeEvent, Fragment, useEffect, useState} from "react";
import Navbar from "../navigation/navbar";
import '../../styles/pages/search.scss'
import {IEmployeeAssignment, IEmployeeCardFull, IEmployeeCardPreview} from "../../models/employeeCard";
import {EmployeeCardPreview} from "../fragments/employeeCards";
import axios from "axios";
import moment from "moment";

export default function Search() {
    document.title = 'Поиск'

    let [selectedEmployeeId, setSelectedEmployeeId] = useState<number>()
    let [foundEmployees, setFoundEmployees] = useState<Array<IEmployeeCardPreview>>([])

    let [isLoaded, setLoaded] = useState<boolean>(true)

    useEffect(() => {
        if (foundEmployees.length === 1) {
            if (selectedEmployeeId !== foundEmployees[0].id) {
                setSelectedEmployeeId(foundEmployees[0].id)
            }
        } else {
            setSelectedEmployeeId(undefined)
        }
    }, [foundEmployees])

    return (
        <Fragment>
            <div className="page-content">
                <header>Поиск сотрудников</header>
                <div id="search-panel">
                    <EmployeeSearchForm setLoaded={setLoaded} setFoundEmployees={setFoundEmployees}/>
                    <div className={isLoaded ? 'employee-search-result' : 'employee-search-result loading'}>
                        {foundEmployees.length !== 0 ?
                            <FoundEmployees selectEmployeeController={setSelectedEmployeeId}
                                            employees={foundEmployees}/> :
                            <p className="hint">
                                Результаты не найдены.
                            </p>}

                        {selectedEmployeeId !== undefined ?
                            <SelectedEmployeeCard employeeId={selectedEmployeeId}/> :
                            <Fragment/>}
                    </div>
                </div>
            </div>
        </Fragment>)
}

interface ISearchResultsProps {
    employees: Array<IEmployeeCardPreview>,
    selectEmployeeController: React.Dispatch<React.SetStateAction<number | undefined>>
}

function FoundEmployees({employees, selectEmployeeController}: ISearchResultsProps) {
    return (<Fragment>
        <div id={'found-employees-container'}>
            {employees.map(employee => {
                return <EmployeeCardPreview selectEmployee={selectEmployeeController} data={employee}
                                            key={employee.id}/>
            })}
        </div>
    </Fragment>)
}

interface ISelectedEmployeeCardProps {
    employeeId: number
}

function SelectedEmployeeCard({employeeId}: ISelectedEmployeeCardProps) {
    let [employeeData, setEmployeeData] = useState<IEmployeeCardFull>()

    useEffect(() => {
        getEmployeeByID(employeeId).then(data => {
            setEmployeeData(data)
        })
    }, [employeeId])

    return (<Fragment>
        <div id={'selected-employee'}>
            <h2 className={'info-title'}>Основная информация</h2>
            <div className="main-info">
                <div className='block personal-info'>
                    <h1>{employeeData?.full_name}
                        {employeeData?.previous_full_name ?
                            <span id={'previous-name'}> (ранее {employeeData.previous_full_name})</span> : null}
                    </h1>
                    <p className={'hint'}>Полное имя</p>
                    <div className="identity">
                        <div className="data-field">
                            <h2>{employeeData?.id}</h2>
                            <p className={'hint'}>Идентификатор</p>
                        </div>
                        <div className="data-field">
                            <h2>{moment(employeeData?.birth_date).format('DD.MM.YYYY')}</h2>
                            <p className={'hint'}>Дата рождения</p>
                        </div>
                        {
                            employeeData?.curator_id !== 0 ? <div className="data-field">
                                <h2>{employeeData?.curator_id}</h2>
                                <p className={'hint'}>Куратор</p>
                            </div> : null
                        }
                    </div>
                    <div className="identity">
                        <div className="data-field">
                            <h2>{moment(employeeData?.created_at).format('DD.MM.YYYY')}</h2>
                            <p className={'hint'}>Создан</p>
                        </div>
                        <div className="data-field">
                            <h2>{moment(employeeData?.updated_at).format('DD.MM.YYYY')}</h2>
                            <p className={'hint'}>Обновлен</p>
                        </div>
                    </div>
                </div>
                <div className='block tools'>
                    <a href={`https://dzb-web.rgs.ru/dib/search/data-search.php?field=${employeeData?.id}&mode=equal&type=cardid`}
                       target={`_blank-${employeeData?.id}`} rel="noopener noreferrer">Открыть в СОИ ➡️</a>
                    <a href={`#`}>Добавить к блокировкам 🚫</a>
                    <a href={`#`}>Продление УЗ ⌛</a>
                </div>
            </div>
            <h2 className={'info-title'}>Должности</h2>
            <div className='assignments-info'>
                {employeeData?.state_assignments ?
                    <ul className={'state-assignments'}>
                        {
                            employeeData?.state_assignments?.map((assignment, index) => {
                                return <EmployeeAssignmentCard key={index} cardData={assignment}/>
                            })
                        }
                    </ul> : null
                }
                {employeeData?.non_state_assignments ?
                    <ul className={'non-state-assignments'}>
                        {
                            employeeData?.non_state_assignments?.map((assignment, index) => {
                                return <EmployeeAssignmentCard key={index} cardData={assignment}/>
                            })
                        }
                    </ul> : null
                }
                {employeeData?.foreign_assignments ?
                    <ul className={'foreign-assignments'}>
                        {
                            employeeData?.foreign_assignments?.map((assignment, index) => {
                                return <EmployeeAssignmentCard key={index} cardData={assignment}/>
                            })
                        }
                    </ul> : null
                }
            </div>
            <h2 className={'info-title'}>Учетные записи</h2>
            <div className="accounts-info">
                <p className="code" style={{marginLeft: "5px", fontWeight: "bold"}}>
                    TODO: 🚧 Добавить отображение привязанных УЗ сотрудника 🚧
                </p>
            </div>
        </div>
    </Fragment>)
}

interface IEmployeeSearchFormProps {
    setFoundEmployees: React.Dispatch<React.SetStateAction<IEmployeeCardPreview[]>>
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

async function getEmployeeByID(searchID: number) {
    const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/employee", {
        params: {
            id: searchID
        }
    })

    if (response.status === 200) {
        return response.data as IEmployeeCardFull
    }
}

async function getEmployeesByFilter(event: React.MouseEvent, searchString: string, searchType: string, setFoundEmployees: React.Dispatch<React.SetStateAction<IEmployeeCardPreview[]>>, setLoaded: React.Dispatch<React.SetStateAction<boolean>>) {
    event.preventDefault()
    setLoaded(false)

    const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/employees", {
        headers: {
            "Content-Type": "application/json"
        },
        params: {
            "search_string": searchString,
            "search_type": searchType
        }
    })

    if (response.status === 200) {
        let employees: Array<IEmployeeCardPreview> = response.data
        setFoundEmployees(employees)

        setLoaded(true)
    }
}

enum SearchTypes {
    BY_ID = "by_id",
    BY_FULL_NAME = "by_full_name",
    BY_PARTIAL_NAME = "by_partial_name",
}

function EmployeeSearchForm({setFoundEmployees, setLoaded}: IEmployeeSearchFormProps) {
    let [searchString, setSearchString] = useState<string>("")
    let [searchType, setSearchType] = useState<string>(SearchTypes.BY_PARTIAL_NAME)

    function searchStringController(evt: React.ChangeEvent<HTMLInputElement>) {
        setSearchString(evt.target.value.split('  ').join(' '))
    }

    function searchTypeController(evt: React.ChangeEvent<HTMLSelectElement>) {
        setSearchType(evt.target.value)
    }

    return (
        <Fragment>
            <form id={'employee-search'}>
                <label htmlFor="search-string">Поисковая строка</label>
                <input id={'search-string'} value={searchString}
                       onChange={(evt) => searchStringController(evt)} type={'search'}
                       placeholder={'Иванов Иван Иванович'}/>
                <label htmlFor="search-type">Режим поиска</label>
                <select id={'search-type'} defaultValue={searchType} onChange={(evt) => searchTypeController(evt)}>
                    <option value={SearchTypes.BY_PARTIAL_NAME}>Частичное фио</option>
                    <option value={SearchTypes.BY_FULL_NAME}>Полное ФИО</option>
                    <option value={SearchTypes.BY_ID}>ID физ. лица</option>
                </select>
                <button
                    onClick={(event) => getEmployeesByFilter(event, searchString.trim(), searchType, setFoundEmployees, setLoaded)}>Поиск
                </button>
            </form>
        </Fragment>
    )
}

interface IEmployeeAssignmentCardProps {
    cardData: IEmployeeAssignment
}

function EmployeeAssignmentCard({cardData}: IEmployeeAssignmentCardProps) {
    let statusString: string

    const joinDate = moment(cardData.join_date)
    const todayDate = moment()
    const planLeaveDate = moment(cardData.leave_date)
    const realLeaveDate = moment(cardData.real_leave_date)

    if (realLeaveDate <= todayDate || cardData.status === 11) {
        statusString = `🔴 Уволен с ${realLeaveDate.format("DD.MM.YYYY")}`
    } else {
        if (planLeaveDate.year() !== 2099) {
            statusString = `🟠 Работает c ${joinDate.format("DD.MM.YYYY")} до ${planLeaveDate.format("DD.MM.YYYY")}`
        } else {
            if (cardData.status === 2) {
                statusString = `🟠 Декрет. Работает c ${joinDate.format("DD.MM.YYYY")}`
            } else {
                statusString = `🟢 Работает c ${joinDate.format("DD.MM.YYYY")}`
            }
        }
    }

    return <li className={'assignment'}>
        <div className="left-side">
            <p className={'status'}>{statusString}</p>
            <p className={'position'}>{cardData.position}</p>
            <p className={'company'}>{cardData.company}</p>
            <p className={'department'}>{cardData.department.replaceAll(";", '\n')}</p>
        </div>
        <div className="right-side">
            <p className={'codes'}>
                {cardData.table_code ? <span><b>ТАБ: </b>{cardData.table_code}</span> : null}
                <br/>
                {cardData.skk_code ? <span><b>СКК: </b>{cardData.skk_code}</span> : null}
                <br/>
                {cardData.kfn_code ? <span><b>КФН: </b>{cardData.kfn_code}</span> : null}
            </p>
        </div>
    </li>
}