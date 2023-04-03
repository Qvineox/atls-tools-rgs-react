import React, {Fragment, useEffect, useState} from "react";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import {ToolFormResultViewer} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";
import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";
import {ToolFormTextField} from "../../../fragments/forms/fragments/fields/toolFormTextField";
import {ToolFormTextAreaField} from "../../../fragments/forms/fragments/fields/toolFormTextAreaField";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";
import ATLSError from "../../../../models/error";
import {TerroristReport} from "../../../../models/reports/security/terrorists";
import moment from "moment";

export function TerroristListTool() {
    const [reportData, setReportData] = useState<TerroristReport>()

    const [terroristString, setTerroristString] = useState<string>("")

    const [category, setCategory] = useState<string>("Террористы")
    const [description, setDescription] = useState<string>(`Террорист, файл ${moment().format("DD.MM.YYYY")}`)
    const [source, setSource] = useState<string>("Пеньков А.В.")

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Блокируемые ID не указаны!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isRequested, setIsRequested] = useState<boolean>(false)

    function resetForm() {
        setTerroristString("")

        setCategory("Террористы")
        setDescription(`Террорист, файл ${moment().format("DD.MM.YYYY")}`)
        setSource("Пеньков А.В.")

        setSave(true)
        setErrors(["Текстовое поле не заполнено!"])

        setIsLoaded(false)
        setIsRequested(false)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        setIsRequested(true)

        if (terroristString.length > 0) {
            TerroristReport.send(terroristString, category, description, source, save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                    setIsLoaded(true)
                }
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
            })
        }
    }

    function checkForm() {
        setErrors([])

        if (terroristString.length <= 0) {
            setErrors(prevState => {
                return [...prevState, "Текстовое поле не заполнено!"];
            })
        }
    }

    useEffect(() => {
        checkForm()
    }, [terroristString, description, source, category])

    return <Fragment>
        <ToolForm onReset={resetForm} onSubmit={(evt) => submitForm(evt)}>
            <ToolFormFieldGroup>
                <ToolFormTextAreaField name={'terrorists-string'} label={'Поле для ввода'}
                                       value={terroristString}
                                       controller={setTerroristString} mode={'text'}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormTextField name={'category'} label={'Категория'}
                                   value={category}
                                   controller={setCategory}/>
                <ToolFormTextField name={'description'} label={'Примечание'}
                                   value={description}
                                   controller={setDescription}/>
                <ToolFormTextField name={'source'} label={'Источник'}
                                   value={source}
                                   controller={setSource}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormCheckBoxField name={'save'} label={'Сохранить'} value={save} controller={setSave}/>
            </ToolFormFieldGroup>
            <ToolFormButtonGroup isDisabled={errors.length !== 0}/>
            <ToolFormErrorGroup errors={errors}/>
        </ToolForm>
        {
            isRequested ? <Fragment>
                {
                    isLoaded && reportData ?
                        <ToolFormResultViewer isLoaded={isLoaded}>
                            {reportData ? <Fragment>
                                <ToolFormResultFiles name={'Списки террористов'} files={reportData.getFiles()}/>
                                {/*<ToolFormResultDiagram diagram={reportData.Render()}/>*/}
                                <ToolFormResultTable table={reportData.renderTable()}/>
                            </Fragment> : <Fragment></Fragment>}
                        </ToolFormResultViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}