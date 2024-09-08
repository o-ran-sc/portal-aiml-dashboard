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
import CreateTrainingJob from './create/CreateTrainingJob';
import StatusPageRows from './status/StatusPageRows';
import UploadPipelineForm from './pipelines/UploadPipeline';
import CreateFeatureGroup from './create/CreateFeatureGroup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as CONSTANTS from './common/Constants';
import ListFeatureGroup from './status/ListFeatureGroup';
import { NavigationBar } from '../navigation';

var DEBUG = CONSTANTS.debug_var === 'true';
var logger = function () {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
};

class HomePage extends React.Component {
  render() {
    return (
      <>
        <Router>
          <NavigationBar />
          <Routes>
            <Route path='/' exact component={Home} />
            <Route path='/TrainingJob/CreateTrainingJob' element={<CreateTrainingJob logger={logger} />} />
            <Route path='/TrainingJob/TrainingJobsStatus' element={<StatusPageRows logger={logger} />} />
            <Route path='/TrainingJob/Pipeline' element={<UploadPipelineForm logger={logger} />} />
            <Route path='/TrainingJob/CreateFeatureGroup' element={<CreateFeatureGroup logger={logger} />} />
            <Route path='/TrainingJob/ListFeatureGroups' element={<ListFeatureGroup logger={logger} />} />
          </Routes>
        </Router>
      </>
    );
  }
}

export default HomePage;

class Home extends React.Component {
  render() {
    return <></>;
  }
}
