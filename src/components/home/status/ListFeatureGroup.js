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

import React, { useMemo, useState, useEffect } from 'react';
import BTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useTable, useRowSelect } from 'react-table';
import { Checkbox } from './Checkbox';
import Popup from './Popup';
import FeatureGroupInfo from './FeatureGroupInfo';
import CreateFeatureGroup from '../create/CreateFeatureGroup';
import { deleteFeatureGroups } from './API_STATUS';
import { UCMgr_baseUrl } from '../../../states';
import { featureGroupAPI } from '../../../apis/feature-group';

const ListFeatureGroup = props => {
  const logger = props.logger;
  const [featureGroups, setFeatureGroups] = useState([]);
  const [infoPopup, setInfoPopup] = useState(false);
  const [createPopup, setCreatePopup] = useState(false);
  const closeInfoPopup = () => setInfoPopup(false);
  const closeCreatePopup = () => setCreatePopup(false);
  const [featureGroupName, setFeatureGroupName] = useState(null);

  useEffect(() => {
    logger('useEffect');
    fetchFeatureGroups();
    const timer = setInterval(async () => {
      fetchFeatureGroups();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchFeatureGroups = async () => {
    logger('fetchFeatureGroup UCMgr_baseUrl', UCMgr_baseUrl);
    try {
      const result = await featureGroupAPI.getAllFeatureGroup();
      logger('fetchFeatureGroup Result', result);
      logger('feature groups are --> ', result.data.featuregroups);
      setFeatureGroups(result.data.featuregroups);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateClick = () => {
    setCreatePopup(true);
  };

  const handleInfoClick = featuregroup_name => {
    console.log('feature group name is : ', featuregroup_name);
    setFeatureGroupName({
      featureGroupName: featuregroup_name,
    });
    setInfoPopup(true);
  };

  const handleDelete = async event => {
    console.log('handle delete starts..');

    if (selectedFlatRows.length > 0) {
      let featureGroup_names = [];
      for (const row of selectedFlatRows) {
        featureGroup_names.push({
          featureGroup_name: row.original.featuregroup_name,
        });
      }
      console.log('selected featureGroups are :', featureGroup_names);
      try {
        await deleteFeatureGroups(featureGroup_names);
        await fetchFeatureGroups();
      } catch (error) {
        console.log(error);
      }
      toggleAllRowsSelected(false);
    } else {
      alert('Please select more than one row');
    }
  };

  const handleDme = dme => {
    if (dme === true) return <p>Enabled</p>;
    else return <p>Disabled</p>;
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
        id: 'featuregroup_name',
        Header: 'Feature Group Name',
        accessor: 'featuregroup_name',
      },
      {
        id: 'features',
        Header: 'Features',
        accessor: 'features',
      },
      {
        id: 'datalake',
        Header: 'DataLake',
        accessor: 'datalake',
      },
      {
        id: 'dme',
        Header: 'DME',
        accessor: 'dme',
        Cell: ({ row }) => {
          return <div>{handleDme(row.original.dme)}</div>;
        },
      },
      {
        id: 'info',
        Header: 'Info',
        Cell: ({ row }) => {
          return (
            <div>
              <Button variant='info' onClick={() => handleInfoClick(row.original.featuregroup_name)}>
                Info
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );
  const data = useMemo(() => featureGroups, [featureGroups]);
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
      <h1 style={{ fontWeight: 'bold', margin: '40px 0px' }}>Feature Groups</h1>

      <Button variant='primary' size='sm' onClick={handleCreateClick}>
        Create
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
      <Popup show={createPopup} onHide={closeCreatePopup} title='Create Feature Group' size='lg'>
        <CreateFeatureGroup logger={logger} />
      </Popup>
      <Popup show={infoPopup} onHide={closeInfoPopup} title='Feature Group Info'>
        <FeatureGroupInfo featureGroupName={featureGroupName} />
      </Popup>
    </>
  );
};

export default ListFeatureGroup;
