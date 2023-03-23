import React, {Fragment, useEffect, useState} from "react";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import ToolFormFileUploadField from "../../../fragments/forms/fragments/fields/toolFormFileUploadField";
import ToolFormResultChart from "../../../fragments/forms/fragments/viewers/toolFormResultChart";
import {
    ToolFormResultExtendedViewer
} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";
import {AgreementsDefaultReport} from "../../../../models/reports/agreements/default-summary";

export function AgreementsDefaultSummaryTool() {
    const [reportData, setReportData] = useState<AgreementsDefaultReport>()

    const [fileUpload, setFileUpload] = useState<File>()
    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isRequested, setIsRequested] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        setFileUpload(undefined)
        setSave(true)

        setIsRequested(false)
        setIsLoaded(false)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        setIsRequested(true)

        if (fileUpload !== undefined) {
            AgreementsDefaultReport.send(fileUpload, save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                    setIsLoaded(true)
                }
            }).catch(error => {
                // console.error(error as ATLS)
            })
        }


    }

    function checkForm() {
        setErrors([])

        if (!fileUpload) {
            setErrors(prevState => {
                return [...prevState, "Файл не загружен!"];
            })
        }
    }

    useEffect(() => {
        checkForm()
    }, [fileUpload])

    return <Fragment>
        <ToolForm onReset={resetForm} onSubmit={(evt) => submitForm(evt)}>
            <ToolFormFieldGroup>
                <ToolFormFileUploadField name={'file_upload'} label={'Загрузка файла'}
                                         availableFileExtensions={['.xlsx']} controller={setFileUpload}/>
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
                        <ToolFormResultExtendedViewer isLoaded={isLoaded} summary={reportData.summary()}>
                            <Fragment>
                                <ToolFormResultChart chart={reportData.renderChart()}/>
                            </Fragment>
                        </ToolFormResultExtendedViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}