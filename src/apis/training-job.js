import { instance } from '../states';

export const trainingJobAPI = {
  getTrainingJobs: async () => {
    return await instance.get('/ai-ml-model-training/v1/training-jobs');
  },
  getTrainingJob: async ({ params }) => {
    return await instance.get(`/ai-ml-model-training/v1/training-jobs/${params.trainingJobId}`);
  },
  getTrainingJobStatus: async ({ params }) => {
    return await instance.get(`/ai-ml-model-training/v1/training-jobs/${params.trainingJobId}/status`);
  },
  invokeTrainingJob: async ({ data }) => {
    return await instance.post('/ai-ml-model-training/v1/training-jobs', { ...data });
  },
  deleteTrainingJob: async ({ params }) => {
    return await instance.delete(`/ai-ml-model-training/v1/training-jobs/${params.trainingJobId}`);
  },
};
