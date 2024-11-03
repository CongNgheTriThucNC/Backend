export interface CompanyFilterByParams {
    CompanyAddress?: string;
    CompanySize?: string;
    page?: number;
    limit?: number;
}
export interface JobsByCompanyIdFilter {
    CompanyId: string;
    page?: number;
    limit?: number;
}
