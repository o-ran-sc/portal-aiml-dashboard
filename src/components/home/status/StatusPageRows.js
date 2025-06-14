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

import { Checkbox, Popup, StepsState, TrainingJobInfo } from '../../../components';
import { UCMgr_baseUrl } from '../../../states';
import { trainingJobAPI } from '../../../apis';

import { invokeStartTraining, deleteTrainingjobs } from './API_STATUS';
import CreateOrEditTrainingJobForm from '../form/CreateOrEditTrainingJobForm';
import CreateTrainingJob from '../create/CreateTrainingJob';

const StatusPageRows = props => {
  const logger = props.logger;
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [versionForEditPopup, setVersionForEditPopup] = useState(null);
  const [traingingjobNameForEditPopup, setTraingingjobNameForEditPopup] = useState(null);
  const closeEditPopup = () => setEditPopup(false);
  const closeCreatePopup = () => setCreatePopup(false);
  const [stepsStatePopup, setStepsStatePopup] = useState(false);
  const [statusTrainingJobId, setStatusTrainingJobId] = useState(null);
  const closeStepsStatePopup = () => setStepsStatePopup(false);
  const [infoPopup, setInfoPopup] = useState(false);
  const [infoTrainingJobId, setInfoTrainingJobId] = useState(null);
  const closeInfoPopup = () => setInfoPopup(false);

  useEffect(() => {
    logger('useEffect');
    fetchTrainingJobs();
    const timer = setInterval(async () => {
      fetchTrainingJobs();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    toggleAllRowsSelected(false);
  }, [traingingjobNameForEditPopup]);

  const fetchTrainingJobs = async () => {
    logger('fetchTrainingJobs UCMgr_baseUrl', UCMgr_baseUrl);
    try {
      const result = await trainingJobAPI.getTrainingJobs();
      logger('fetchTrainingJobs Result', result);
      logger('Training Jobs  are --> ', result.data);
      setTrainingJobs(result.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRetrain = async event => {
    console.log('handleRetrain starts..');

    if (selectedFlatRows.length > 0) {
      let trainingjobNames = [];
      for (const row of selectedFlatRows) {
        trainingjobNames.push({
          trainingjob_name: row.original.trainingjob_name,
        });
      }
      console.log('selected trainingjobs: ', trainingjobNames);
      try {
        await invokeStartTraining(trainingjobNames);
        await fetchTrainingJobs();
      } catch (error) {
        console.log(error);
      }
      toggleAllRowsSelected(false);
    } else {
      alert('Please select atleast one trainingjob');
    }
  };

  const handleCreate = event => {
    setCreatePopup(true);
  };

  const handleEdit = event => {
    if (selectedFlatRows.length === 1) {
      logger('selected training job: ', selectedFlatRows[0].original.trainingjob_name);
      setTraingingjobNameForEditPopup(selectedFlatRows[0].original.trainingjob_name);
      setVersionForEditPopup(selectedFlatRows[0].original.version);
      setEditPopup(true);
      toggleAllRowsSelected(false);
    } else {
      alert('please select exactly one trainingjob');
    }
  };

  const handleDelete = async event => {
    console.log('handleDelete starts..');
    if (selectedFlatRows.length > 0) {
      let deleteTJList = [];
      for (const row of selectedFlatRows) {
        let trainingjobDict = {};
        trainingjobDict['id'] = row.original.id;
        deleteTJList.push(trainingjobDict);
      }
      console.log('Selected trainingjobs for deletion : ', deleteTJList);
      try {
        await deleteTrainingjobs(deleteTJList);
        await fetchTrainingJobs();
      } catch (error) {
        console.log(error);
      }
      toggleAllRowsSelected(false);
    } else {
      alert('Please select atleast one trainingjob');
    }
  };

  const handleStepStateClick = (id) => {
    setStatusTrainingJobId(id);
    setStepsStatePopup(true);
  };

  const handleInfoClick = (id) => {
    setInfoTrainingJobId(id);
    setInfoPopup(true);
  };

  const columns = useMemo(
    () => [
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
        id: 'id',
        Header: 'ID',
        accessor: 'id',
      },
      {
        id: 'trainingPipelineName',
        Header: 'Pipeline Name',
        accessor: 'training_config.trainingPipeline.training_pipeline_name',
      },
      {
        id: 'featureGroupName',
        Header: 'Feature Group Name',
        accessor: 'training_config.dataPipeline.feature_group_name',
      },
      {
        id: 'stepsState',
        Header: 'Detailed Status',
        Cell: ({ row }) => {
          return (
            <Button
              variant='primary'
              style={{ backgroundColor: '#6282f6', border: '#6282f6' }}
              onClick={() => handleStepStateClick(row.values.id)}
            >
              Detailed Status
            </Button>
          );
        },
      },
      {
        id: 'info',
        Header: 'Info',
        Cell: ({ row }) => {
          return (
            <Button variant='info' onClick={() => handleInfoClick(row.values.id)}>
              Info
            </Button>
          );
        },
      },
    ],
    [],
  );
  const data = useMemo(() => trainingJobs, [trainingJobs]);

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows, toggleAllRowsSelected } = useTable(
    {
      columns,
      data,
      autoResetSelectedRows: false,
    },
    useRowSelect,
  );

  return (
    <>
      <h1 style={{ fontWeight: 'bold', margin: '40px 0px' }}>Training Jobs</h1>

      <Button variant='primary' size='sm' onClick={e => handleCreate(e)}>
        Create
      </Button>{' '}
      <Button variant='primary' size='sm' onClick={e => handleEdit(e)}>
        Edit
      </Button>{' '}
      <Button variant='primary' size='sm' onClick={e => handleRetrain(e)}>
        Train
      </Button>{' '}
      <Button variant='primary' size='sm' onClick={e => handleDelete(e)}>
        Delete
      </Button>{' '}
      <BTable className='Status_table' responsive hover size='sm' {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <Popup show={createPopup} onHide={closeCreatePopup} title='Create Training Job' size='lg'>
        <CreateTrainingJob logger={logger} onHideCreatePopup={closeCreatePopup} fetchTrainingJobs={fetchTrainingJobs} />
      </Popup>
      <Popup show={editPopup} onHide={closeEditPopup} title='Edit usecase'>
        <CreateOrEditTrainingJobForm
          trainingjob_name={traingingjobNameForEditPopup}
          version={versionForEditPopup}
          isCreateTrainingJobForm={false}
          onHideEditPopup={closeEditPopup}
          fetchTrainingJobs={fetchTrainingJobs}
          logger={logger}
        ></CreateOrEditTrainingJobForm>
      </Popup>
      <Popup size='sm' show={stepsStatePopup} onHide={closeStepsStatePopup} title='Detailed Status'>
        <StepsState trainingJobId={statusTrainingJobId}></StepsState>
      </Popup>
      <Popup show={infoPopup} onHide={closeInfoPopup} title='Training Job Info'>
        <TrainingJobInfo trainingJobId={infoTrainingJobId} />
      </Popup>
    </>
  );
};

export default StatusPageRows;
