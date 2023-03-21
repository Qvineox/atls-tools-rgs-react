export class ToolResponse {
    ReportId: number
    Result: any
    Files: Array<ToolResponseFile>

    constructor(reportId: number, result: string, files: Array<ToolResponseFile>) {
        this.ReportId = reportId
        this.Result = result
        this.Files = files
    }
}

export class ToolResponseFile {
    readonly FileName: string
    readonly PublicURL: string
    readonly Description: string

    constructor(fileName: string, url: string, description: string) {
        this.FileName = fileName
        this.PublicURL = url
        this.Description = description
    }
}



