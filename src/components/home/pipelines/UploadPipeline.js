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

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { notebook_url, UCMgr_baseUrl } from '../../../states';
import { pipelineAPI } from '../../../apis/pipeline';
import { toast } from '../../../utils/toast-bus';

class UploadPipelineForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: null,
      plName: '',
      UCMgr_baseUrl: UCMgr_baseUrl,
      pipelines: [],
      loading: false,
    };
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  popover = () => (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>Field descriptions</Popover.Header>
      <Popover.Body>
        <strong> Training Function Name</strong>
        <br></br>
        Name of the Training Function. <br></br>
        should only contain lower or upper case alphanumerical characters and underscore <br></br>
        <br></br>
      </Popover.Body>
    </Popover>
  );

  handleFileChange = (event) => {
    console.log(event);
    this.setState({
      fileName: event.target.files[0],
    }, () => {
      console.log('handleFileChange', this.state.fileName);
    });
  };

  handlePlNameChange = event => {
    this.setState({
      plName: event.target.value,
    });
  };

  resetFrom = event => {
    this.setState({
      fileName: null,
      plName: '',
    });
    console.log(this.state);
    event.target.value = null;
  };

  handleSubmit = event => {
    const data = new FormData();
    data.append('file', this.state.fileName);

    pipelineAPI
      .uploadPipeline({ params: { pipelineName: this.state.plName, data: data } })
      .then(res => {
        console.log('Pipeline  responsed ', res);
        console.log('Status  responsed ', res.status);
        if (res.status === 200) {
          console.log('Pipeline uploaded ', res.status);
          toast.success(res.data.result, 'Pipeline');
          this.resetFrom(event);
          this.handleGetPipelines();
        } else {
          console.log('Upload pipeline error:', res);
        }
      })
      .catch(error => {
        console.log('Error in uploading pipeline', error.response);
        toast.error('Pipeline upload failed: ' + error.response.data.result, 'Pipeline');
      })
      .then(function () {
        // always executed
      });
    event.preventDefault();
  };

  handleCreatePipeline = event => {
    console.log('handleCreatePipeline clicked..', event);
    window.open(notebook_url + '/tree', '_blank');
  };

  componentDidMount() {
    this.handleGetPipelines();
    this.handleGetPipelinesVersion();
  }

  handleGetPipelines = async () => {
    try {
      this.setState({ loading: true });
      const response = await pipelineAPI.getPipelines();
      console.log('Pipelines response', response);
      this.setState({ 
        pipelines: response.data.pipelines || [],
        loading: false 
      });
    } catch (error) {
      console.error('Error in getting pipelines', error);
      this.setState({ loading: false });
      toast.error('Failed to load pipelines', 'Pipeline List');
    }
  };

  handleGetPipelinesVersion = async () => {
    try {
      const response = await pipelineAPI.getPipelineVersions({ params: { pipelineName: this.state.plName } });
      console.log('Pipelines version response', response);
    } catch (err) {
      console.error('Error in getting pipelines version', err);
    }
  };

  render() {
    const { pipelines, loading } = this.state;

    return (
      <>
        <h1 style={{ fontWeight: 'bold', margin: '40px 0px' }}>Training Function</h1>

        <div className='upload-pipeline'>
          <OverlayTrigger trigger='click' placement='right' overlay={this.popover()}>
            <Button className='from-tooltip' placement='right' variant='secondary'>
              ?
            </Button>
          </OverlayTrigger>
          <div className='upload-pl-form'>
            <Button variant='primary' size='sm' onClick={e => this.handleCreatePipeline(e)}>
              Create Training Function
            </Button>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId='plName'>
                <Form.Label>Training Function Name*</Form.Label>
                <Form.Control
                  type='input'
                  value={this.state.plName}
                  onChange={this.handlePlNameChange}
                  placeholder=''
                  required
                />
              </Form.Group>

              <input type='file' className='form-control' name='upload_file' onChange={this.handleFileChange} />

              <Button style={{ backgroundColor: '#6282f6' }} type='submit'> Upload </Button>
            </Form>
          </div>
        </div>

        <div style={{ margin: '40px 0px' }}>
          <h3>Pipeline List</h3>
          {loading ? (
            <div>Loading pipelines...</div>
          ) : (
            <Table hover responsive size='sm'>
              <thead>
                <tr>
                  <th>Pipeline ID</th>
                  <th>Display Name</th>
                  <th>Description</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#666' }}>
                      No pipelines found
                    </td>
                  </tr>
                ) : (
                  pipelines.map(pipeline => (
                    <tr key={pipeline.pipeline_id}>
                      <td>{pipeline.pipeline_id}</td>
                      <td>{pipeline.display_name}</td>
                      <td>{pipeline.description || '-'}</td>
                      <td>{new Date(pipeline.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </>
    );
  }
}

export default UploadPipelineForm;
