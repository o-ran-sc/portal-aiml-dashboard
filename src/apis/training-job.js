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
    return await instance.post('/trainingjobs/retraining', { ...data });
  },
  deleteTrainingJob: async ({ data }) => {
    return await instance.delete('/trainingjobs', { ...data });
  },
};
