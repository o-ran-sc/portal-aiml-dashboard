// ==================================================================================

//        Copyright (c) 2022 Samsung Electronics Co., Ltd. All Rights Reserved.

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//           http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

// ==================================================================================

import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { debug_var } from './states';
import {
  CreateFeatureGroupPage,
  CreateTrainingJobPage,
  FeatureGroupListPage,
  HomePage,
  NotFoundPage,
  TrainingJobStatusPage,
  UploadPipelinePage,
} from './pages';
import NavbarComponent from './components/home/navbar/NavbarComponent';

const DEBUG = debug_var === 'true';
const logger = () => {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
};

function App() {
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/TrainingJob/CreateTrainingJob' element={<CreateTrainingJobPage logger={logger} />} />
        <Route path='/TrainingJob/TrainingJobsStatus' element={<TrainingJobStatusPage logger={logger} />} />
        <Route path='/TrainingJob/Pipeline' element={<UploadPipelinePage logger={logger} />} />
        <Route path='/TrainingJob/CreateFeatureGroup' element={<CreateFeatureGroupPage logger={logger} />} />
        <Route path='/TrainingJob/ListFeatureGroups' element={<FeatureGroupListPage logger={logger} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
