export class ToolResponse {
    report_id: number
    result: string
    files: Array<IToolResponseFile>

    constructor(reportId: number, result: string, files: Array<IToolResponseFile>) {
        this.report_id = reportId
        this.result = result
        this.files = files
    }
}

export class ToolResponseError {
    message: string
    description: number

    constructor(message: string, description: number) {
        this.message = message
        this.description = description
    }
}

export interface IToolResponseFile {
    readonly file_name: string
    readonly public_url: string
    readonly description: string
}




