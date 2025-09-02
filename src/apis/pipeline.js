import { instance } from '../states';

export const pipelineAPI = {
  getPipelines: async () => {
    return await instance.get('/pipelines');
  },
  getPipelineVersions: async ({ params }) => {
    return await instance.get(`/pipelines/${params.pipelineName}/versions`);
  },
  uploadPipeline: async ({ params }) => {
    return await instance.post(`/pipelines/${params.pipelineName}/upload`, params.data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
