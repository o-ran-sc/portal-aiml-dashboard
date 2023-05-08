import axios from 'axios';
import * as CONSTANTS from '../common/Constants'

export const invokeStartTraining = async (trainingjobNames) => {
  console.log('Retraining called ', trainingjobNames);
  try{
    let res = await axios.post(`${CONSTANTS.UCMgr_baseUrl}/trainingjobs/retraining`,
      {
        "trainingjobs_list": trainingjobNames
      }
    );
    console.log('Retraining response', res);
    let result = 'Retraining initiated for selected trainingjob(s),Result'
        + '\n' + JSON.stringify(res.data)
    alert(result);
  }
  catch(error){
    console.log(error);
  }    
};

export const deleteTrainingjobs = async (deleteTJList) =>{
  console.log('Delete API called ', deleteTJList);
  try{
    let res = await axios.delete(CONSTANTS.UCMgr_baseUrl + '/trainingjobs',
    {
      data : {
        "list" : deleteTJList      
      }      
    }
    );
    console.log('Delete API response', res)
    let result = 'trainingjob deletion initiated for selected trainingjob(s),Result'
        + '\n' + JSON.stringify(res.data);
    alert(result);
  }
  catch(error){
    console.log(error);
  }
};

export const deleteFeatureGroups = async (featureGroup_names) => {
  console.log('deleting feature groups', featureGroup_names);
  try {
    let res = await axios.delete(`${CONSTANTS.UCMgr_baseUrl}/featureGroup`,
      {
        data: {
          "featuregroups_list": featureGroup_names
        }

      }
    );
    console.log('Deletion response', res);
    let result = 'FeatureGroup deletion initiated for selected featureGroups ,Result'
      + '\n' + JSON.stringify(res.data);
    alert(result);

  } catch (error) {
    console.log("error is : ", error);
  }
};