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
import { Container, Row, Col } from 'react-bootstrap';
import CreateTrainingJob from './create/CreateTrainingJob';
import StatusPageRows from './status/StatusPageRows';
import UploadPipelineForm from './pipelines/UploadPipeline';
import CreateFeatureGroup from './create/CreateFeatureGroup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListFeatureGroup from './status/ListFeatureGroup';
import { NavigationBar } from '../navigation';
import { Sidebar } from '../sidebar';
import { debug_var } from '../../states';

var DEBUG = debug_var === 'true';
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
          <Container fluid>
            <Row>
              <Col md={2}>
                <Sidebar />
              </Col>
              <Col md={10} className='content'>
                <Routes>
                  <Route path='/' exact element={Home} />
                  <Route path='/TrainingJob/CreateTrainingJob' element={<CreateTrainingJob logger={logger} />} />
                  <Route path='/TrainingJob/TrainingJobsStatus' element={<StatusPageRows logger={logger} />} />
                  <Route path='/TrainingJob/Pipeline' element={<UploadPipelineForm logger={logger} />} />
                  <Route path='/TrainingJob/CreateFeatureGroup' element={<CreateFeatureGroup logger={logger} />} />
                  <Route path='/TrainingJob/ListFeatureGroups' element={<ListFeatureGroup logger={logger} />} />
                </Routes>
              </Col>
            </Row>
          </Container>
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
