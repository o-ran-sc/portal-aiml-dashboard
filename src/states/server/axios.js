import axios from 'axios';

export const UCMgr_baseUrl = 'http://' + process.env.REACT_APP_UCM_HOST + ':' + process.env.REACT_APP_UCM_PORT;
export const mme_baseUrl = 'http://' + process.env.REACT_APP_MME_HOST + ':' + process.env.REACT_APP_MME_PORT;
export const notebook_url = 'http://' + process.env.REACT_APP_NOTEBOOK_HOST + ':' + process.env.REACT_APP_NOTEBOOK_PORT;
export const ServiceMgr_baseUrl =
  'http://' + process.env.REACT_APP_ServiceMgr_HOST + ':' + process.env.REACT_APP_ServiceMgr_PORT;
export const debug_var = process.env.REACT_APP_DEBUG;
// export const UCMgr_baseUrl = 'http://localhost:32002';
// export const mme_baseUrl = 'http://localhost:32006';
// export const notebook_url = 'http://localhost:32088';
// export const ServiceMgr_baseUrl = 'http://localhost:30180';

export const BaseInstanceConfig = {
  baseURL: UCMgr_baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
};

export const instance = axios.create(BaseInstanceConfig);
