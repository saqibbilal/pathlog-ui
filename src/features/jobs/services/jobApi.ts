import api from '@/api/axios';
import type { CreateJobRequest, JobPaginationResponse, JobApplication } from '@/features/jobs/types';

export interface JobFilters {
    search?: string;
    status?: string;
    date_applied?: string;
}

export const jobApi = {
    // Get all jobs with pagination and optional filters
    getJobs: async (page = 1, perPage = 10, filters?: JobFilters, signal?: AbortSignal): Promise<JobPaginationResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString()
        });

        if (filters?.search) params.append('search', filters.search);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.date_applied) params.append('date_applied', filters.date_applied);

        const response = await api.get(`/jobs?${params.toString()}`, { signal });
        return response.data;
    },

    // Create a new job
    createJob: async (data: CreateJobRequest): Promise<JobApplication> => {
        const response = await api.post('/jobs', data);
        return response.data.data; // Laravel Resource wraps single objects in 'data' too
    },

    getJobById: async (id: number): Promise<JobApplication> => {
        const response = await api.get(`/jobs/${id}`);
        return response.data.data;
    },

    updateJob: async (id: number, data: Partial<CreateJobRequest>): Promise<JobApplication> => {
        const response = await api.put(`/jobs/${id}`, data);
        return response.data.data;
    },

    deleteJob: async (id: number): Promise<void> => {
        await api.delete(`/jobs/${id}`);
    },

    // Add to your jobApi object in jobApi.ts
    bulkDeleteJobs: async (ids: number[]): Promise<void> => {
        await api.post('/jobs/bulk-delete', { ids }); // Or use delete with a body if your backend is configured for it
    },

}
