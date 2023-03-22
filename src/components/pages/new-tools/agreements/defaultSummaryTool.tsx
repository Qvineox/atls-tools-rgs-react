import React, {Fragment, useEffect, useState} from "react";
import {AgreementsDefaultSummary} from "../../../../models/reports/agreements/default-summary";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import ToolFormFileUploadField from "../../../fragments/forms/fragments/fields/toolFormFileUploadField";
import ToolFormResultDiagram from "../../../fragments/forms/fragments/viewers/toolFormResultDiagram";
import {
    ToolFormResultExtendedViewer
} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";

export function AgreementsDefaultSummaryTool() {
    const [reportData, setReportData] = useState<AgreementsDefaultSummary>()

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
            AgreementsDefaultSummary.send(fileUpload, save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                    setIsLoaded(true)
                }
            }).catch(error => {
                console.error(error)
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
                        <ToolFormResultExtendedViewer isLoaded={isLoaded} summary={reportData?.Summary()}>
                            <Fragment>
                                <ToolFormResultDiagram diagram={reportData?.Render()}/>
                            </Fragment>
                        </ToolFormResultExtendedViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}