// ==================================================================================

//        Copyright (c) 2023 Samsung Electronics Co., Ltd. All Rights Reserved.

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

import { featureGroupAPI } from '../../../apis/feature-group';
import { trainingJobAPI } from '../../../apis/training-job';

export const invokeStartTraining = async trainingjobNames => {
  console.log('Retraining called ', trainingjobNames);
  try {
    let res = await trainingJobAPI.invokeTrainingJob({ data: { trainingjobs_list: trainingjobNames } });
    console.log('Retraining response', res);
    let result = 'Retraining initiated for selected trainingjob(s),Result' + '\n' + JSON.stringify(res.data);
    alert(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteTrainingjobs = async deleteTJList => {
  console.log('Delete API called ', deleteTJList);
  try {
    const res = await trainingJobAPI.deleteTrainingJob({ data: { list: deleteTJList } });
    console.log('Delete API response', res);
    let result = 'trainingjob deletion initiated for selected trainingjob(s),Result' + '\n' + JSON.stringify(res.data);
    alert(result);
  } catch (error) {
    console.log(error);
  }
};

export const deleteFeatureGroups = async featureGroup_names => {
  console.log('deleting feature groups', featureGroup_names);
  try {
    let res = await featureGroupAPI.deleteFeatureGroup({ data: { featuregroups_list: featureGroup_names } });
    console.log('Deletion response', res);
    let result = 'FeatureGroup deletion initiated for selected featureGroups ,Result' + '\n' + JSON.stringify(res.data);
    alert(result);
  } catch (error) {
    console.log('error is : ', error);
  }
};
