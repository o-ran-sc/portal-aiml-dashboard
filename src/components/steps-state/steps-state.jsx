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
import './steps-state.css';

import { trainingJobAPI } from '../../apis';

export const StepsState = props => {
  const [boxesState, setBoxesState] = useState([]);
  const [connectionsState, setConnectionsState] = useState([]);
  const [boxes, setBoxes] = useState([]);
  useEffect(() => {
    const periodicTask = async () => {
      let res = null;
      try {
        res = await trainingJobAPI.getTrainingJobStatus({ params: { pipelineId: props.pipelineId } });
      } catch (error) {
        console.log(error);
      }
      const json_from_backend = res.data;
      const newBoxesState = [];
      const newConnectionsState = [];
      const newBoxes = ['Data extraction', 'Training', 'Trained Model'];

      newBoxesState.push(json_from_backend.DATA_EXTRACTION);
      newBoxesState.push(json_from_backend.TRAINING);
      newBoxesState.push(json_from_backend.TRAINED_MODEL);
      if (json_from_backend.hasOwnProperty('DEPLOYMENT')) {
        newBoxesState.push(json_from_backend.DEPLOYMENT);
        newBoxes.push('Deployment');
      }
      setBoxesState(newBoxesState);
      setBoxes(newBoxes);

      newConnectionsState.push(json_from_backend.DATA_EXTRACTION_AND_TRAINING);
      newConnectionsState.push(json_from_backend.TRAINING_AND_TRAINED_MODEL);
      if (json_from_backend.hasOwnProperty('TRAINED_MODEL_AND_DEPLOYMENT')) {
        newConnectionsState.push(json_from_backend.TRAINED_MODEL_AND_DEPLOYMENT);
      }
      setConnectionsState(newConnectionsState);
    };
    periodicTask();
    const timer = setInterval(async () => {
      periodicTask();
    }, 5000);
    return () => clearInterval(timer);
  }, [props.trainingjob_name_and_version]);

  return (
    <div className='step-progressbar-wrapper'>
      {boxes.map((item, index) => {
        return (
          <div key={index}>
            <div className='step-progress-bar-box'>
              <div className='state'>
                {boxesState[index] === 'NOT_STARTED'
                  ? index + 1
                  : boxesState[index] === 'FINISHED'
                    ? '✔'
                    : boxesState[index] === 'FAILED'
                      ? '❌'
                      : '⌛'}
              </div>
              <div className='step'>{item}</div>
            </div>
            {index + 1 !== boxes.length && (
              <div className='container-for-step-progress-bar-box-line-and-message'>
                <div className='step-progress-bar-box-line' />
                <div className='step-progress-bar-box-line-messsage'>
                  {connectionsState[index] === 'NOT_STARTED'
                    ? 'Not started'
                    : connectionsState[index] === 'FINISHED'
                      ? '✔ Finished'
                      : connectionsState[index] === 'FAILED'
                        ? '❌ Failed'
                        : '⌛ In progress'}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepsState;
