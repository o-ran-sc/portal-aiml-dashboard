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
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import CreateOrEditTrainingJobForm from '../components/home/form/CreateOrEditTrainingJobForm';

export class CreateTrainingJobPage extends React.Component {
  constructor(props) {
    super(props);
    this.fetchTrainingJobs = this.props.fetchTrainingJobs;
    this.logger = this.props.logger;
  }
  popover = () => (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>Field descriptions</Popover.Header>
      <Popover.Body>
        <strong>Training Job Name</strong>
        <br></br>
        Name of the Training Job. <br></br>
        It must be between 3 and 63 characters long. <br></br>
        It can only consist of Letters and numbers and underscore.
        <br></br>
        <strong>Model Management Service</strong>
        <br></br>
        Enable it when using the model management service
        <br></br>
        <strong>Model Name</strong>
        <br></br>
        Mention the model name when model management service is enabled
        <br></br>
        <strong>Training Function Name</strong>
        <br></br>
        Select an existing training function name corresponding to a ML model, when model management service is
        disabled.
        <br></br>
        <strong>Feature Names</strong>
        <br></br>
        Select from existing feature groups, when model management service is disabled.
        <br></br>
        <strong>Feature Filter</strong>
        <br></br>
        Filtering Clause for the Selected KPI's<br></br>
        Example --&gt; enb &gt; 10
        <br></br>
        Example --&gt; cellNum =&gt; 10 and enb == 7<br></br>
        <strong>Hyper Parameters</strong>
        <br></br>
        Comma separated, key-value pair of model tuning<br></br>
        Example --&gt; epochs:100<br></br>
        Example --&gt; epochs:150, optimizer:'adam'
        <br></br>
        <strong>Description</strong>
        <br></br>
        Description of Training-job
        <br></br>
      </Popover.Body>
    </Popover>
  );

  render() {
    return (
      <>
        <OverlayTrigger trigger='click' placement='right' overlay={this.popover()}>
          <Button className='from-tooltip' placement='right' variant='secondary'>
            ?
          </Button>
        </OverlayTrigger>

        <CreateOrEditTrainingJobForm
          isCreateTrainingJobForm={true}
          logger={this.logger}
          fetchTrainingJobs={this.fetchTrainingJobs}
        ></CreateOrEditTrainingJobForm>
      </>
    );
  }
}

export default CreateTrainingJobPage;
