import React, {Fragment, useEffect, useState} from "react";
import moment, {Moment} from "moment";
import '../../../styles/pages/tools.scss'
import axios from "axios";

interface IForeignCompany {
    company_name: string
}

interface IForeignEmployeeCard {
    id: number | undefined;
    full_name: string
    company_name: string
    contract: string | undefined
    curator_id: number | undefined
    leave_date: string
}

export default function AddForeignEmployeesTool() {
    let [selectedEmployeeData, setSelectedEmployeeData] = useState<IForeignEmployeeCard>({
        id: undefined,
        full_name: "",
        company_name: "",
        contract: undefined,
        curator_id: undefined,
        leave_date: moment().add(2, "years").toISOString().slice(0, 10),
    })

    let [employeeList, setEmployeeList] = useState<Array<IForeignEmployeeCard>>([])
    let [foreignCompanyList, setForeignCompanyList] = useState<Array<IForeignCompany>>([])
    let [errors, setErrors] = useState<Array<string>>([])

    function addError(newError: string) {
        setErrors((prevState) => [
            ...prevState,
            newError
        ])
    }

    function syncDatabase(evt: React.MouseEvent) {
        evt.preventDefault()

        let payload = employeeList.map(item => {
            item.leave_date = `${item.leave_date}T00:00:00-00:00`
            return item
        })

        axios.put(process.env.REACT_APP_BACKEND_URL + '/api/employees', {
            employees: payload
        }).then((response) => {
            if (response.status === 200) {
                const responseData: Array<IForeignEmployeeCard> = response.data as Array<IForeignEmployeeCard>

                console.log(response.data)

                setEmployeeList(responseData)
            }
        })
    }

    useEffect(() => {
        setErrors([])

        if (selectedEmployeeData.full_name.split(" ").length < 2) {
            addError('Требуется указать полное ФИО.')
        }

        if (selectedEmployeeData.company_name.length === 0) {
            addError('Требуется указать полное название компании.')
        }
    }, [selectedEmployeeData])

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/api/employees/foreign-companies').then((response) => {
            if (response.status === 200) {
                const responseData: Array<IForeignCompany> = response.data as Array<IForeignCompany>
                setForeignCompanyList(responseData)
            }
        })
    }, [])

    return <Fragment>
        <header>Завести карточки сторонней организации</header>
        <div className="tool-panel">
            <form onReset={() => {
                setSelectedEmployeeData({
                    id: undefined,
                    full_name: "",
                    company_name: "",
                    contract: undefined,
                    curator_id: undefined,
                    leave_date: moment().add(2, "years").toISOString().slice(0, 10),
                })
            }} action="" className="setup-form">
                <div className="tool-parameter-group text-area">
                    <label htmlFor="full-name">Полное ФИО</label>
                    <input value={selectedEmployeeData.full_name} onChange={(evt) => {
                        setSelectedEmployeeData(prevState => ({
                            ...prevState,
                            full_name: evt.target.value
                        }))
                    }} type={'text'} id={"full-name"}/>
                </div>
                <div className="tool-parameter-group text-area">
                    <label htmlFor="company-name">Название организации</label>
                    <input value={selectedEmployeeData.company_name} onChange={(evt) => {
                        setSelectedEmployeeData(prevState => ({
                            ...prevState,
                            company_name: evt.target.value
                        }))
                    }
                    } list="company-name" name="company-name"/>
                    <datalist id={"company-name"}>
                        {
                            foreignCompanyList.map((item, index) => {
                                return <option key={index} value={item.company_name}></option>
                            })
                        }
                    </datalist>
                </div>
                <div className="tool-parameter-group text-area">
                    <label htmlFor="contract">Договор</label>
                    <textarea value={selectedEmployeeData.contract} onChange={(evt) => {
                        setSelectedEmployeeData(prevState => ({
                            ...prevState,
                            contract: evt.target.value
                        }))
                    }} id={"contract"}/>
                </div>
                <div className="tool-parameter-group text-area">
                    <label htmlFor="leave_date">Дата отключения УЗ</label>
                    <input value={selectedEmployeeData.leave_date} onChange={(evt) => {
                        setSelectedEmployeeData(prevState => ({
                            ...prevState,
                            leave_date: evt.target.value
                        }))
                    }} type={'date'} id={"leave_date"}/>
                </div>
                <div className="tool-parameter-group text-area">
                    <label htmlFor="curator-id">ID куратора</label>
                    <input value={selectedEmployeeData.curator_id ? String(selectedEmployeeData.curator_id) : ""}
                           onChange={(evt) => {
                               setSelectedEmployeeData(prevState => ({
                                   ...prevState,
                                   curator_id: parseInt(evt.target.value)
                               }))
                           }} type={'number'} id={"curator-id"}/>
                </div>
                <div className="buttons">
                    <button type={'reset'} className={'reset'}>Сбросить</button>
                    <button onClick={(evt) => {
                        evt.preventDefault()
                        setEmployeeList(prevState => ([...prevState, selectedEmployeeData]))
                        setSelectedEmployeeData(prevState => ({
                            ...prevState,
                            full_name: "",
                        }))
                    }} className={'execute'}
                            disabled={errors.length !== 0}>Добавить к списку
                    </button>
                </div>
                <div className="status-panel">
                        <span id={'ready'}>
                            {errors.length === 0 ? `Готово к отправке 🟢` : `Не готово к отправке 🔴`}
                        </span>
                    <span id={'errors'}>{errors.join('\n')}</span>
                </div>
            </form>
            <div className={`${employeeList?.length > 0 ? 'tool-result' : 'tool-result hidden'}`}>
                <ForeignEmployeesToAddList employees={employeeList}/>
                <button onClick={evt => syncDatabase(evt)}
                        disabled={employeeList.filter((element) => element.id == undefined).length === 0}
                        id={'sync-database'}>Синхронизировать с СОИ
                </button>
            </div>
        </div>
    </Fragment>
}

interface IForeignEmployeesToAddList {
    employees: Array<IForeignEmployeeCard>
}

function ForeignEmployeesToAddList({employees}: IForeignEmployeesToAddList) {
    return (
        <ul className={'foreign-employee-cards'}>
            {employees.map((item, index) => {
                return (<li key={index}
                            className={item.id ? 'foreign-employee-card saved' : 'foreign-employee-card not-saved'}>
                    <h2>{item.full_name}</h2>
                    <h3>{item.company_name}</h3>
                    {
                        item.curator_id ? <p>ID куратора: {item.curator_id}</p> : null
                    }
                    {
                        item.leave_date ? <p>Срок действия УЗ: {moment(item.leave_date).format('DD.MM.YYYY')}</p> : null
                    }
                    {
                        item.contract ? <p>Контракт: {item.contract}</p> : null
                    }
                    {
                        item.id ? <p style={{fontWeight: 'bold'}}>Присвоенный CARD ID: {item.id}</p> : null
                    }
                </li>)
            })}
        </ul>
    )
}