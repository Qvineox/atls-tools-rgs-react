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
import {AgreementsDetailedSummary} from "../../../../models/reports/agreements/detailed-summary";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";

import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";

export function AgreementsDetailedSummaryTool() {
    const [reportData, setReportData] = useState<AgreementsDetailedSummary>()

    const [fileUpload, setFileUpload] = useState<File>()
    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        setFileUpload(undefined)
        setSave(true)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        if (fileUpload !== undefined) {
            AgreementsDetailedSummary.send(fileUpload, save).then(reportData => {
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