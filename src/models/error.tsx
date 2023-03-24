import {AxiosError} from "axios";
import {toast} from "react-toastify";

export default class ATLSError {
    private error_code: number
    private error_message: string

    constructor(error_code: number, error_message: string) {
        this.error_code = error_code
        this.error_message = error_message
    }

    public alert() {
        alert(`Ошибка выполнения!\nКод ошибки: ${this.error_code}\nСообщение: ${this.error_message}`)
    }

    public static fromAxios(error: any) {
        console.error(error)

        const axiosError: AxiosError = error as AxiosError
        if (axiosError) {
            let error: ATLSError = new ATLSError(9999, "Неизвестная ошибка.")

            if (axiosError.response) {
                switch (axiosError.response.status) {
                    case 400: {
                        const errorData: ATLSError = axiosError.response.data as ATLSError
                        error.error_code = 4000 + errorData.error_code

                        switch (errorData.error_code) {
                            case 0: {
                                error.error_message = 'Необходимые параметры отсутствуют.'
                                break
                            }
                            case 1: {
                                error.error_message = 'Отсутствует тело запроса.'
                                break
                            }
                            case 2: {
                                error.error_message = 'Ошибка десериализации запроса.'
                                break
                            }
                            case 3: {
                                error.error_message = 'Ошибка загрузки файла.'
                                break
                            }
                            case 7: {
                                error.error_message = 'Ошибка обработки таблицы.'
                                break
                            }
                            default: {
                                error.error_message = 'Неизвестная ошибка клиента.'
                                error.error_code = axiosError.response.status
                                return error
                            }
                        }
                        break
                    }
                    case 404: {
                        return new ATLSError(404, "Метод не найден.")
                    }
                    case 500: {
                        const errorData: ATLSError = axiosError.response.data as ATLSError
                        error.error_code = 5000 + errorData.error_code

                        switch (errorData.error_code) {
                            case 5: {
                                error.error_message = 'Ошибка сериализации ответа.'
                                break
                            }
                            case 6: {
                                error.error_message = 'Ошибка запроса к СУБД.'
                                break
                            }
                            case 8: {
                                error.error_message = 'Ошибка загрузки конфигурации.'
                                break
                            }
                            case 9: {
                                error.error_message = 'Ошибка файловой системы.'
                                break
                            }
                            default: {
                                error.error_message = 'Неизвестная серверная ошибка.'
                                error.error_code = axiosError.response.status
                                return error
                            }
                        }
                        break
                    }
                    case 501: {
                        return new ATLSError(501, "Метод не доступен.")
                    }
                }
            } else if (axiosError.code === 'ERR_NETWORK') {
                return new ATLSError(9001, "Сеть не доступна.")
            }

            return error
        } else {
            return new ATLSError(9998, "Неизвестная ошибка.")
        }

    }

    public toast() {
        toast.error(`${this.error_message} (${this.error_code})`)
    }
}