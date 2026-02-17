import api from '@/api/axios';
import type { CreateJobRequest, JobPaginationResponse, JobApplication } from '@/features/jobs/types';

export const jobApi  = {
    // Get all jobs with pagination
    getJobs: async (page = 1): Promise<JobPaginationResponse> => {
        const response = await api.get(`/jobs?page=${page}`);
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
    }

}
