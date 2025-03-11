import { instance } from '../states';

export const featureGroupAPI = {
  getAllFeatureGroup: async () => {
    return await instance.get('/featureGroup');
  },
  getFeatureGroup: async ({ params }) => {
    return await instance.get(`/featureGroup/${params.featureGroupName}`);
  },
  createFeatureGroup: async ({ data }) => {
    return await instance.post('/ai-ml-model-training/v1/featureGroup', { ...data });
  },
  deleteFeatureGroup: async ({ data }) => {
    return await instance.delete('/featureGroup', { ...data });
  },
};
