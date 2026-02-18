import api from '@/api/axios';
import type { CreateJobRequest, JobPaginationResponse, JobApplication } from '@/features/jobs/types';

export const jobApi  = {
    // Get all jobs with pagination
    getJobs: async (page = 1, perPage = 10): Promise<JobPaginationResponse> => {
        const response = await api.get(`/jobs?page=${page}&per_page=${perPage}`);
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
