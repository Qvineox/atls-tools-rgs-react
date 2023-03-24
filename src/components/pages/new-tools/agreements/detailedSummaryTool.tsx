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
import {AgreementsDetailedReport} from "../../../../models/reports/agreements/detailed-summary";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";

import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";
import ATLSError from "../../../../models/error";

export function AgreementsDetailedSummaryTool() {
    const [reportData, setReportData] = useState<AgreementsDetailedReport>()

    const [fileUpload, setFileUpload] = useState<File>()
    const [save, setSave] = useState<boolean>(true)
    const [saveFile, setSaveFile] = useState<boolean>(false)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isRequested, setIsRequested] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        setFileUpload(undefined)
        setSave(true)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        setIsRequested(true)

        if (fileUpload !== undefined) {
            AgreementsDetailedReport.send(fileUpload, save, saveFile).then(reportData => {
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
                <ToolFormCheckBoxField name={'save-file'} label={'Сохранить в файл'} value={saveFile}
                                       controller={setSaveFile}/>
            </ToolFormFieldGroup>
            <ToolFormButtonGroup isDisabled={errors.length !== 0}/>
            <ToolFormErrorGroup errors={errors}/>
        </ToolForm>
        {
            isRequested ? <Fragment>
                {
                    isLoaded && reportData ?
                        <ToolFormResultExtendedViewer isLoaded={isLoaded} summary={reportData.GetSummary()}>
                            {reportData ? <Fragment>
                                <ToolFormResultFiles name={'Файл отчета'} files={reportData.getFiles()}/>
                                {/*<ToolFormResultDiagram diagram={reportData.Render()}/>*/}
                                <ToolFormResultTable table={reportData.renderTable()}/>
                            </Fragment> : <Fragment></Fragment>}
                        </ToolFormResultExtendedViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}