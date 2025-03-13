import { instance } from '../states';

export const trainingJobAPI = {
  getTrainingJobByNameAndVersion: async ({ params }) => {
    return await instance.get(`/trainingjobs/${params.trainingJobName}/${params.trainingJobVersion}`);
  },
  getTrainingJobStatus: async ({ params }) => {
    return await instance.get(`/ai-ml-model-training/v1/training-jobs/${params.trainingJobId}/status`);
  },
  getLatestTrainingJob: async () => {
    return await instance.get('/ai-ml-model-training/v1/training-jobs');
  },
  invokeTrainingJob: async ({ data }) => {
    return await instance.post('/trainingjobs/retraining', { ...data });
  },
  deleteTrainingJob: async ({ data }) => {
    return await instance.delete('/trainingjobs', { ...data });
  },
};
