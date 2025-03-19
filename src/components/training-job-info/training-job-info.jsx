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

import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

import { trainingJobAPI } from '../../apis';

export const TrainingJobInfo = props => {
  const [trainingJobId, setTrainingJobId] = useState('');
  const [modelName, setModelName] = useState('');
  const [modelVersion, setModelVersion] = useState('');
  const [description, setDescription] = useState('');
  const [pipelineName, setPipelineName] = useState('');
  const [pipelineVersion, setPipelineVersion] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [modelLocation, setModelLocation] = useState('');

  useEffect(() => {
    try {
      trainingJobAPI
        .getTrainingJob({ params: { trainingJobId: props.trainingJobId } })
        .then(response => {
          console.log(response.data);
          setTrainingJobId(response.data.id);
          setModelName(response.data.modelId.modelname);
          setModelVersion(response.data.modelId.modelversion);
          setDescription(response.data.training_config.description);
          setPipelineName(response.data.training_config.trainingPipeline.training_pipeline_name);
          setPipelineVersion(response.data.training_config.trainingPipeline.training_pipeline_version);
          setModelUrl(response.data.model_url);
          setModelLocation(response.data.model_location);
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [props.trainingjob_name_and_version]);

  return (
    <>
      <Form>
        <Form.Group controlId='trainingJobId'>
          <Form.Label>Training Job ID</Form.Label>
          <Form.Control type='text' value={trainingJobId} readOnly />
        </Form.Group>
        <Form.Group controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control type='text' value={description} readOnly />
        </Form.Group>
        <Form.Group controlId='pipelineName'>
          <Form.Label>Training Pipeline Name</Form.Label>
          <Form.Control type='text' value={pipelineName} readOnly />
        </Form.Group>
        <Form.Group controlId='pipelineVersion'>
          <Form.Label>Training Pipeline Version</Form.Label>
          <Form.Control type='text' value={pipelineVersion} readOnly />
        </Form.Group>
        <Form.Group controlId='modelName'>
          <Form.Label>Model Name</Form.Label>
          <Form.Control type='text' value={modelName} readOnly />
        </Form.Group>
        <Form.Group controlId='modelVersion'>
          <Form.Label>Model Version</Form.Label>
          <Form.Control type='text' value={modelVersion} readOnly />
        </Form.Group>
        <Form.Group controlId='modelLocation'>
          <Form.Label>Model Location</Form.Label>
          <Form.Control type='text' value={modelLocation} readOnly />
        </Form.Group>
        { modelUrl !== "" &&
          <Form.Group controlId='modelUrl'>
            <Form.Label>
              Model URL
            </Form.Label>
            <br/>
            <Form.Label>
              <span className='px-1'> {modelUrl} </span>
              <span className='mx-2'>
                <a href={modelUrl} download>
                  <i className='bi bi-arrow-down-square' style={{ color: 'blue'}}></i>
                </a>
              </span>
            </Form.Label>
          </Form.Group>
        }
      </Form>
    </>
  );
};

export default TrainingJobInfo;
