import React, {Fragment, useEffect, useState} from "react";
import {ToolForm} from "../../../fragments/forms/toolForm";
import ToolFormFieldGroup from "../../../fragments/forms/fragments/groups/toolFormFieldGroup";
import ToolFormButtonGroup from "../../../fragments/forms/fragments/groups/toolFormButtonGroup";
import {ToolFormCheckBoxField} from "../../../fragments/forms/fragments/fields/toolFormCheckBoxField";
import {ToolFormErrorGroup} from "../../../fragments/forms/fragments/groups/toolFormErrorGroup";
import ToolFormFileUploadField from "../../../fragments/forms/fragments/fields/toolFormFileUploadField";
import {
    ToolFormResultExtendedViewer, ToolFormResultViewer
} from "../../../fragments/forms/fragments/viewers/toolFormResultViewer";
import ToolFormResultTable from "../../../fragments/forms/fragments/viewers/toolFormResultTable";

import ToolFormResultFiles from "../../../fragments/forms/fragments/viewers/toolFormResultFiles";
import {BlockListsDetailedSummary} from "../../../../models/reports/blocklists/detailed-summary";
import moment from "moment";
import {ToolFormDatePeriodField} from "../../../fragments/forms/fragments/fields/toolFormDatePeriodField";
import {ToolFormDateField} from "../../../fragments/forms/fragments/fields/toolFormDateField";
import SecurityBlocklist from "../../../../models/reports/blocklists/security-blocklist";
import {ToolFormTextField} from "../../../fragments/forms/fragments/fields/toolFormTextField";
import {ToolFormTextAreaField} from "../../../fragments/forms/fragments/fields/toolFormTextAreaField";

export function SecurityBlockListTool() {
    const [reportData, setReportData] = useState<SecurityBlocklist>()

    const [blockLeaks, setBlockLeaks] = useState<boolean>(true)
    const [blockSystems, setBlockSystems] = useState<boolean>(true)
    const [blockDomain, setBlockDomain] = useState<boolean>(true)
    const [leaveComment, setLeaveComment] = useState<boolean>(false)

    const [employeeIDs, setEmployeeIDs] = useState<string>("")
    const [initiator, setInitiator] = useState<string>("")
    const [requestID, setRequestID] = useState<string>("")

    const [save, setSave] = useState<boolean>(true)

    const [errors, setErrors] = useState<Array<string>>(["Блокируемые ID не указаны!"])

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

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
    }

    function submitForm(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()

        if (blockLeaks || blockDomain || blockSystems) {
            const _ids = employeeIDs.split(',').map(item => {
                return parseInt(item)
            })

            SecurityBlocklist.send(blockLeaks, blockSystems, blockDomain, leaveComment, _ids, initiator, requestID, save).then(reportData => {
                if (reportData) {
                    setReportData(reportData)
                }
            }).catch(error => {
                console.error(error)
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
            <ToolFormButtonGroup isDisabled={errors.length != 0}/>
            <ToolFormErrorGroup errors={errors}/>
        </ToolForm>
        <ToolFormResultViewer isLoaded={isLoaded}>
            {reportData ? <Fragment>
                <ToolFormResultFiles files={reportData.GetFiles()}/>
                {/*<ToolFormResultDiagram diagram={reportData.Render()}/>*/}
                <ToolFormResultTable table={reportData.Render()}/>
            </Fragment> : <Fragment></Fragment>}
        </ToolFormResultViewer>
    </Fragment>
}