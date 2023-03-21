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

export function BlockListsRegularTool() {
    const [reportData, setReportData] = useState<BlockListsDetailedSummary>()

    const [firedFile, setFiredFile] = useState<File>()
    const [decreeFile, setDecreeFile] = useState<File>()
    const [domainFile, setDomainFile] = useState<File>()

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        setFiredFile(undefined)
        setDecreeFile(undefined)
        setDomainFile(undefined)

        setSave(true)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        if (firedFile || decreeFile || domainFile) {
            BlockListsDetailedSummary.sendBlocklist(firedFile, decreeFile, domainFile, save).then(reportData => {
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

        if (!(firedFile || decreeFile || domainFile)) {
            setErrors(prevState => {
                return [...prevState, "Необходимо загрузить хотя бы 1 файл!"];
            })
        }
    }

    useEffect(() => {
        checkForm()
    }, [firedFile, decreeFile, domainFile])

    return <Fragment>
        <ToolForm onReset={resetForm} onSubmit={(evt) => submitForm(evt)}>
            <ToolFormFieldGroup>
                <ToolFormFileUploadField name={'fired_file_upload'} label={'Файл уволенных сотрудников'}
                                         availableFileExtensions={['.csv']} controller={setFiredFile}/>
                <ToolFormFileUploadField name={'decree_file_upload'} label={'Файл сотрудников в декрете'}
                                         availableFileExtensions={['.csv']} controller={setDecreeFile}/>
                <ToolFormFileUploadField name={'domain_file_upload'}
                                         label={'Доменные учетные записи уволенных сотрудников'}
                                         availableFileExtensions={['.csv']} controller={setDomainFile}/>
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