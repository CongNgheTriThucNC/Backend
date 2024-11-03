export interface JobFilterByParams {
    Industry?: string;
    JobType?: string;
    Location?: string;
    Experience?: string;
    Salary?: string;
    Education?: string;
    CareerLevel?: string;
    page?: number;
    limit?: number;
}
export interface JobFilterByQuery {
    query?: string;
    page?: number;
    limit?: number;
}
