import { instance } from '../states';

export const featureGroupAPI = {
  getAllFeatureGroup: async () => {
    return await instance.get('/ai-ml-model-training/v1/featureGroup');
  },
  getFeatureGroup: async ({ params }) => {
    return await instance.get(`/featureGroup/${params.featureGroupName}`);
  },
  createFeatureGroup: async ({ data }) => {
    return await instance.post('/featureGroup', { ...data });
  },
  deleteFeatureGroup: async ({ data }) => {
    return await instance.delete('/featureGroup', { ...data });
  },
};
