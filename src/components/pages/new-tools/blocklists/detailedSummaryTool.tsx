import React, {Fragment, useEffect, useState} from "react";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import ToolFormFileUploadField from "../../../fragments/forms/fragments/fields/toolFormFileUploadField";
import {
    ToolFormResultExtendedViewer
} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";

import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";
import {BlockListsDetailedSummary} from "../../../../models/reports/blocklists/detailed-summary";
import moment from "moment";
import {ToolFormDatePeriodField} from "../../../fragments/forms/fragments/fields/toolFormDatePeriodField";
import {ToolFormDateField} from "../../../fragments/forms/fragments/fields/toolFormDateField";

export function BlockListsDetailedSummaryTool() {
    const [reportData, setReportData] = useState<BlockListsDetailedSummary>()

    const today = moment()
    const [endDate, setEndDate] = useState<string>(today.toISOString().slice(0, 10))
    const [startDate, setStartDate] = useState<string>(today.subtract(1, 'week').toISOString().slice(0, 10))

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        const today = moment()

        setEndDate(today.toISOString().slice(0, 10))
        setStartDate(today.subtract(1, 'week').toISOString().slice(0, 10))

        setSave(true)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        if (startDate && endDate) {
            let _startDate = moment(startDate)
            let _endDate = moment(endDate)

            _startDate.set('hour', 0).set('minutes', 0)
            _endDate.set('hour', 23).set('minutes', 59)

            BlockListsDetailedSummary.send(_startDate.toISOString(), _endDate.toISOString(), save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                }
            }).catch(error => {
                console.error(error)
            })
        }

        console.log(reportData)
    }

    function checkForm() {
        setErrors([])

        if (moment(startDate) > moment(endDate)) {
            setErrors(prevState => {
                return [...prevState, "Период выбран не правильно!"];
            })
        }
    }

    useEffect(() => {
        checkForm()
    }, [startDate, endDate])

    return <Fragment>
        <ToolForm onReset={resetForm} onSubmit={(evt) => submitForm(evt)}>
            <ToolFormFieldGroup>
                <ToolFormDateField name={'start_date'} label={'Начало периода'} value={startDate} controller={setStartDate}/>
                <ToolFormDateField name={'end_date'} label={'Конец периода'} value={endDate} controller={setEndDate}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormCheckBoxField name={'save'} label={'Сохранить'} value={save} controller={setSave}/>
            </ToolFormFieldGroup>
            <ToolFormButtonGroup isDisabled={errors.length != 0}/>
            <ToolFormErrorGroup errors={errors}/>
        </ToolForm>
        <ToolFormResultExtendedViewer isLoaded={isLoaded} summary={reportData?.GetSummary()}>
            {reportData ? <Fragment>
                <ToolFormResultFiles files={reportData.GetFiles()}/>
                {/*<ToolFormResultDiagram diagram={reportData.Render()}/>*/}
                <ToolFormResultTable table={reportData.Render()}/>
            </Fragment> : <Fragment></Fragment>}
        </ToolFormResultExtendedViewer>
    </Fragment>
}