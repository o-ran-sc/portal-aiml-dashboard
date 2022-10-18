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

export function getDatalakeNameWithoutConversion(datalakeNameWhichIsConverted){
  if(datalakeNameWhichIsConverted === 'InfluxSource'){
    return  'Influx DB';
  }
  else if(datalakeNameWhichIsConverted === 'CassandraSource'){
    return  'Cassandra DB';
  }
  return null;
}

export function convertDatalakeDBName(datalakeNameWithoutConversion){
  if(datalakeNameWithoutConversion === 'Influx DB'){
    return 'InfluxSource';
  }
  else if(datalakeNameWithoutConversion === 'Cassandra DB'){
    return 'CassandraSource';
  }
  return null;
}

export function convertToCommaSeparatedString(obj){
  console.log("before changing in convertToCommaSeparatedString: ", obj);
  let cs_string = "";
  let counter = 0;
  // Object.entries(obj).map(([key, value]) => {
  for(const [key,value] of Object.entries(obj)){
      if(key !== "usecase"){
        if (counter > 0){
          cs_string += ","
      }
      cs_string += key.toString() + ":" + value.toString();
      counter += 1;
      }  
  };
  console.log("after changing in convertToCommaSeparatedString: ", cs_string);
  return cs_string;
}
