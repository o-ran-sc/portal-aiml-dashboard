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