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
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";
import {BlockListsRegularReport} from "../../../../models/reports/blocklists/regular-blocklist";
import ATLSError from "../../../../models/error";

export function BlockListsRegularTool() {
    const [reportData, setReportData] = useState<BlockListsRegularReport>()

    const [firedFile, setFiredFile] = useState<File>()
    const [decreeFile, setDecreeFile] = useState<File>()
    const [domainFile, setDomainFile] = useState<File>()

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Файл не загружен!"])

    const [isRequested, setIsRequested] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    function resetForm() {
        setFiredFile(undefined)
        setDecreeFile(undefined)
        setDomainFile(undefined)

        setSave(true)

        setIsLoaded(false)
        setIsRequested(false)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        setIsRequested(true)

        if (firedFile || decreeFile || domainFile) {
            BlockListsRegularReport.send(firedFile, decreeFile, domainFile, save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                    setIsLoaded(true)
                }
            }).catch(error => {
                ATLSError.fromAxios(error).toast()
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
            <ToolFormButtonGroup isDisabled={errors.length !== 0}/>
            <ToolFormErrorGroup errors={errors}/>
        </ToolForm>
        {
            isRequested ? <Fragment>
                {
                    isLoaded && reportData ?
                        <ToolFormResultExtendedViewer isLoaded={isLoaded} summary={reportData?.summary()}>
                            {reportData ? <Fragment>
                                <ToolFormResultFiles name={'Списки уволенных работников'}
                                                     files={reportData.getFilesFired()}/>
                                <ToolFormResultFiles name={'Списки работников в декрете'}
                                                     files={reportData.getFilesDecree()}/>
                                <ToolFormResultTable table={reportData.renderTable()}/>
                            </Fragment> : <Fragment></Fragment>}
                        </ToolFormResultExtendedViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}