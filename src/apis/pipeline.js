import { instance } from '../states';

export const pipelineAPI = {
  getPipelines: async () => {
    return await instance.get('/pipelines');
  },
  getPipelineVersions: async ({ params }) => {
    return await instance.get(`/pipelines/${params.pipelineName ?? '/'}versions`);
  },
  uploadPipeline: async ({ params, data }) => {
    return await instance.post(`/pipelines/${params.pipelineName ?? '/'}upload`, { ...data });
  },
};
