import React, {Fragment, useEffect, useState} from "react";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import {ToolFormResultViewer} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";
import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";
import BlockListSecurityReport from "../../../../models/reports/blocklists/security-blocklist";
import {ToolFormTextField} from "../../../fragments/forms/fragments/fields/toolFormTextField";
import {ToolFormTextAreaField} from "../../../fragments/forms/fragments/fields/toolFormTextAreaField";
import ToolFormResultLoading from "../../../fragments/forms/fragments/viewers/toolFormResultLoading";
import ATLSError from "../../../../models/error";

export function SecurityBlockListTool() {
    const [reportData, setReportData] = useState<BlockListSecurityReport>()

    const [employeeIDs, setEmployeeIDs] = useState<string>("")

    const [blockLeaks, setBlockLeaks] = useState<boolean>(true)
    const [blockSystems, setBlockSystems] = useState<boolean>(true)
    const [blockDomain, setBlockDomain] = useState<boolean>(true)

    const [blockTechnical, setBlockTechnical] = useState<boolean>(false)
    const [blockLocked, setBlockLocked] = useState<boolean>(false)
    const [blockDeleted, setBlockDeleted] = useState<boolean>(false)

    const [leaveComment, setLeaveComment] = useState<boolean>(false)
    const [initiator, setInitiator] = useState<string>("")
    const [requestID, setRequestID] = useState<string>("")

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Блокируемые ID не указаны!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    const [isRequested, setIsRequested] = useState<boolean>(false)

    function resetForm() {
        setBlockLeaks(true)
        setBlockSystems(true)
        setBlockDomain(true)

        setEmployeeIDs("")

        setLeaveComment(false)
        setInitiator("")
        setRequestID("")

        setSave(true)
        setErrors(["Блокируемые ID не указаны!"])

        setIsLoaded(false)
        setIsRequested(false)
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        setIsRequested(true)

        if (blockLeaks || blockDomain || blockSystems) {
            const _ids = employeeIDs.split(',').map(item => {
                return parseInt(item)
            })

            BlockListSecurityReport.send(blockLeaks, blockSystems, blockDomain, blockTechnical, blockLocked, blockDeleted, leaveComment, _ids, initiator, requestID, save).then(reportData => {
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

        if (!(blockLeaks || blockDomain || blockSystems)) {
            setErrors(prevState => {
                return [...prevState, "Не выбран тип блокировки!"];
            })
        }

        if (employeeIDs === "") {
            setErrors(prevState => {
                return [...prevState, "Блокируемые ID не указаны!"];
            })
        } else {
            let matchedIDs = employeeIDs
                .replaceAll(" ", "")
                .replaceAll("\n", ",")
                .replaceAll(";", ",")

            if (matchedIDs.length > 0) {
                if (/[^,;\n 0-9]/g.exec(matchedIDs) == null) {
                    setEmployeeIDs(matchedIDs)
                } else {
                    setErrors(prevState => {
                        return [...prevState, "Недопустимые символы в перечне ID на блокировку"];
                    })
                }
            }
        }

        if (!leaveComment) {
            setInitiator("")
            setRequestID("")
        }
    }

    useEffect(() => {
        checkForm()
    }, [employeeIDs, blockLeaks, blockSystems, blockDomain, leaveComment])

    return <Fragment>
        <ToolForm onReset={resetForm} onSubmit={(evt) => submitForm(evt)}>
            <ToolFormFieldGroup>
                <ToolFormTextAreaField name={'employee-ids'} label={'Идентификаторы сотрудников для блокировки'}
                                       value={employeeIDs}
                                       controller={setEmployeeIDs} mode={'text'}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormCheckBoxField name={'block-leaks'} label={'Блокировать каналы утечки'} value={blockLeaks}
                                       controller={setBlockLeaks}/>
                <ToolFormCheckBoxField name={'block-systems'} label={'Блокировать учетные записи систем'}
                                       value={blockSystems} controller={setBlockSystems}/>
                <ToolFormCheckBoxField name={'block-domain'} label={'Блокировать доменные учетные записи'}
                                       value={blockDomain} controller={setBlockDomain}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormCheckBoxField name={'block-technical'} label={'Блокировать технические учетные записи'}
                                       value={blockTechnical}
                                       controller={setBlockTechnical}/>
                <ToolFormCheckBoxField name={'block-locked'} label={'Блокировать ранее заблокированные учетные записи'}
                                       value={blockLocked} controller={setBlockLocked}/>
                <ToolFormCheckBoxField name={'block-deleted'} label={'Блокировать удаленные учетные записи'}
                                       value={blockDeleted} controller={setBlockDeleted}/>
            </ToolFormFieldGroup>
            <ToolFormFieldGroup>
                <ToolFormCheckBoxField name={'comment'} label={'Оставить комментарий'} value={leaveComment}
                                       controller={setLeaveComment}/>
                {
                    leaveComment ? <Fragment>
                        <ToolFormTextField name={'initiator'} label={'Инициатор запроса'} value={initiator}
                                           controller={setInitiator}/>
                        <ToolFormTextField name={'request-id'} label={'Идентификатор запроса'} value={requestID}
                                           controller={setRequestID}/>
                    </Fragment> : <Fragment/>
                }
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
                                <ToolFormResultFiles name={'Списки на блокировку'} files={reportData.getFiles()}/>
                                {/*<ToolFormResultDiagram diagram={reportData.Render()}/>*/}
                                <ToolFormResultTable table={reportData.renderTable()}/>
                            </Fragment> : <Fragment></Fragment>}
                        </ToolFormResultViewer> : <ToolFormResultLoading/>
                }
            </Fragment> : <Fragment/>
        }
    </Fragment>
}