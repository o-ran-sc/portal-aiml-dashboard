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

import React, { useMemo, useState, useEffect } from 'react';
import BTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useTable, useRowSelect } from 'react-table';
import {UCMgr_baseUrl} from '../common/Constants'; 
import axios from 'axios';
import { Checkbox } from './Checkbox';
import Popup from './Popup';
import TrainingJobInfo from './TrainingJobInfo';
import StepsState from './StepsState';

const StatusPageRows = () => {

  const [trainingJobs, setTrainingJobs] = useState([])

  const [stepsStatePopup, setStepsStatePopup] = useState(false);
  const [stepsStateTrainingJobAndVersion, setStepsStateTrainingJobNameAndVersion] = useState(null);
  const closeStepsStatePopup = () => setStepsStatePopup(false);

  const [infoPopup, setInfoPopup] = useState(false);
  const [infoTrainingJobAndVersion, setInfoTrainingJobNameAndVersion] = useState(null);
  const closeInfoPopup = () => setInfoPopup(false);

  useEffect(() => {
    console.log('useEffect');
    fetchTrainingJobs();
    const timer = setInterval(async ()=>{
      fetchTrainingJobs();
    }, 5000);
    return ()=>clearInterval(timer);
  }, []);



  const fetchTrainingJobs = async () => {
    console.log('fetchTrainingJobs UCMgr_baseUrl', UCMgr_baseUrl)
    try {    
      const result = await axios.get(`${UCMgr_baseUrl}/trainingjobs/latest`);
      console.log('fetchTrainingJobs Result', result);
      console.log('Training Jobs  are --> ', result.data.trainingjobs)
      setTrainingJobs(result.data.trainingjobs);
      
    } catch (e) {
      console.error(e)
    }
  }
   

  const handleStepStateClick = (trainingjob_name, version) => {
    setStepsStateTrainingJobNameAndVersion({
      trainingjob_name : trainingjob_name,
      version : version
    });
    setStepsStatePopup(true);
  };
  
  const handleInfoClick = (trainingjob_name, version) => {
    setInfoTrainingJobNameAndVersion({
      trainingjob_name : trainingjob_name,
      version : version
    });
    setInfoPopup(true);
  };

  const columns = useMemo(() => [
    {
      id: 'selection',
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <Checkbox {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      Cell: ({ row }) => (
        <div>
          <Checkbox {...row.getToggleRowSelectedProps()} />
        </div>
      ),
    },
    {
      id : 'trainingjob_name',
      Header : 'Training Job Name',
      accessor : 'trainingjob_name'
    },
    {
      id : 'version',
      Header : 'Version',
      accessor : 'version'
    },
    {
      id : 'overall_status',
      Header : 'Overall Status',
      accessor : row => row.overall_status === 'IN_PROGRESS' ? 'IN PROGRESS' : row.overall_status
    },
    {
      id : 'stepsState',
      Header : 'Detailed Status',
      Cell : ({row}) => {
        return (
          <Button variant="info" onClick={() => handleStepStateClick(row.original.trainingjob_name, row.original.version)}>Detailed Status</Button>
        );   
      }
    },
    {
      id : 'info',
      Header : 'Info',
      Cell : ({row}) => {
        return (
          <Button variant="info" onClick={() => handleInfoClick(row.original.trainingjob_name, row.original.version)}>Info</Button>
        );   
      }
    }
  ], []);
  const data =  useMemo(() => trainingJobs, [trainingJobs]);

  const {
    getTableProps,
    headerGroups, 
    rows, 
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected
  } = useTable(
        {
          columns,
          data,
          autoResetSelectedRows : false
        },
        useRowSelect
      )
 
  return (  
    <>


      <BTable className="Status_table" responsive striped bordered hover size="sm"  {...getTableProps()}>

        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <th {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </BTable>
      <Popup size="sm" show={stepsStatePopup} onHide={closeStepsStatePopup} title="Detailed Status">
          <StepsState trainingjob_name_and_version={stepsStateTrainingJobAndVersion}></StepsState>
      </Popup>
      <Popup show={infoPopup} onHide={closeInfoPopup} title="Training Job Info">
        <TrainingJobInfo trainingjob_name_and_version={infoTrainingJobAndVersion}/>
      </Popup>
    </>
  );
}

export default StatusPageRows;
