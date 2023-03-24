import moment, {Moment} from "moment";

export interface IEmployeeCardPreview {
    id: number;
    full_name: string;
    display_unit: string;
    company_name: string;
    active_assignments_count: number;
    state_assignments_count: number;
    non_state_assignments_count: number;
    foreign_assignments_count: number;
}

interface IEmployeeOccupation {
    company: string;
    position: string;
    department: string;
    startDate: Moment | null;
    endDate: Moment | null;
}

interface IEmployeeOccupationExternal {
    company: string;
    contract: string | null;
}

interface IEmployeeAccount {
    systemName: string;
    login: string;
    createdAt: Moment | null;
    validUntil: Moment | null;
    blockedAt: Moment | null;
    isBlocked: boolean;
    isTechnical: boolean;
}

export interface IEmployeeCardFull {
    id: number;
    full_name: string;
    previous_full_name: string;
    first_name: string;
    second_name: string;
    last_name: string;
    birth_date: Date | null;
    comment: string
    created_at: Date | null
    updated_at: Date | null
    curator_id: number
    state_assignments: Array<IEmployeeAssignment>;
    non_state_assignments: Array<IEmployeeAssignment>;
    foreign_assignments: Array<IEmployeeAssignment>;
}

export interface IEmployeeAssignment {
    skk_code: number;
    table_code: number;
    kfn_code: string;
    company: string;
    position: string;
    department: string;
    location: string;
    status: number;
    work_type: string;
    join_date: Date;
    leave_date: Date | null;
    real_leave_date: Date | null;
}