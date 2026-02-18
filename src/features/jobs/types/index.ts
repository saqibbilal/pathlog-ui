export type JobStatus = 'applied' | 'interviewing' | 'offered' | 'rejected';

export interface JobContact {
    name: string;
    email: string;
}

export interface JobApplication {
    id: number;
    company_name: string;
    job_title: string;
    status: JobStatus;
    applied_at: string;
    job_description_url: string | null;
    job_description_text?: string | null;
    contact: JobContact;
    created_at: string;
}

// For creating a new job (omits ID and auto-generated fields)
export interface CreateJobRequest {
    company_name: string;
    job_title: string;
    status: JobStatus;
    applied_at: string;
    job_description_url?: string;
    job_description_text?: string;
    contact_person?: string;
    contact_person_email?: string;
}

// Laravel Paginated Response wrapper
export interface JobPaginationResponse {
    data: JobApplication[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

