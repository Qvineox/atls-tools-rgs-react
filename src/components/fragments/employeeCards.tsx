import {IEmployeeCardPreview} from "../../models/employeeCard";
import React, {Fragment, useEffect, useState} from "react";
import '../../styles/fragments/employeeCards.scss'

interface IEmployeeCardPreviewProps {
    data: IEmployeeCardPreview,
    selectEmployee: React.Dispatch<React.SetStateAction<number | undefined>>
}

export function EmployeeCardPreview(employee: IEmployeeCardPreviewProps) {
    const [isCorrectCount, setIsCorrectCount] = useState<boolean>(true)
    const [cardData, setCardData] = useState<Array<string>>([])

    useEffect(() => {

        console.log(employee.data.display_unit)

        setCardData(employee.data.display_unit.split(";"))
        setIsCorrectCount(employee.data.active_assignments_count === employee.data.foreign_assignments_count + employee.data.non_state_assignments_count + employee.data.state_assignments_count)
    }, [employee.data.active_assignments_count, employee.data.foreign_assignments_count, employee.data.non_state_assignments_count, employee.data.state_assignments_count])


    return <Fragment>
        <div className="employee-card employee-card_preview"
             onClick={() => employee.selectEmployee(employee.data.id)}>
            <p className={'employee-card__name'}>{employee.data.full_name}</p>
            <p className={'employee-card__position'}>{cardData.length > 1 ? cardData[0] : 'неизвестно'}</p>
            <p className={'employee-card__department'}>{cardData.length > 2 ? cardData.slice(1, cardData.length - 1).join("\n") : 'неизвестно'}</p>
            <p className={'employee-card__company'}>{employee.data.company_name}</p>

            <div className="employee-card__occupations">
                {employee.data.state_assignments_count > 0 &&
                    <div className={`occupations occupations_state`}>
                        Штатный {employee.data.state_assignments_count}
                    </div>}

                {employee.data.non_state_assignments_count > 0 &&
                    <div className={`occupations occupations_non-state`}>
                        Не штатный {employee.data.non_state_assignments_count}
                    </div>}

                {employee.data.foreign_assignments_count > 0 &&
                    <div className={`occupations occupations_foreign`}>
                        Внешний {employee.data.foreign_assignments_count}
                    </div>}

                <div className={`occupations occupations_active ${isCorrectCount ? null : "invalid"}`}>
                    Всего {employee.data.active_assignments_count}
                </div>
            </div>
        </div>
    </Fragment>
}