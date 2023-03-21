interface IAccount {
    full_name: string
    login: string
    is_technical: boolean
    is_active: boolean
    description: string
    created_at: Date
    updated_at: Date
    expired_at: Date
}

export interface ISystemAccount extends IAccount {
    system_name: string
    blocked_at: Date
}

export interface IDomainAccount extends IAccount {
    e_mail_address: string
}