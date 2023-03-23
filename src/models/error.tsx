export default class ATLSError {
    private readonly error_code: number
    private readonly error_message: string

    constructor(error_code: number, error_message: string) {
        this.error_code = error_code
        this.error_message = error_message
    }

    public alert() {
        alert(`Ошибка выполнения!\nКод ошибки: ${this.error_code}\nСообщение: ${this.error_message}`)
    }
}