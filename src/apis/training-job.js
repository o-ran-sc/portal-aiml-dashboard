import { instance } from '../states';

export const trainingJobAPI = {
  getTrainingJobByNameAndVersion: async ({ params }) => {
    return await instance.get(`/trainingjobs/${params.trainingJobName}/${params.trainingJobVersion}`);
  },
  getTrainingJobStepsState: async ({ params }) => {
    return await instance.get(`/trainingjobs/${params.trainingJobName}/${params.trainingJobVersion}/steps_state`);
  },
  getLatestTrainingJob: async () => {
    return await instance.get('/trainingjobs/latest');
  },
  invokeTrainingJob: async ({ data }) => {
    return await instance.post('/trainingjobs/retraining', { ...data });
  },
  deleteTrainingJob: async ({ data }) => {
    return await instance.delete('/trainingjobs', { ...data });
  },
};
