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
import { UCMgr_baseUrl } from '../common/Constants';
import axios from 'axios';
import { Checkbox } from './Checkbox';
import Popup from './Popup';
import FeatureGroupInfo from './FeatureGroupInfo';


const ListFeatureGroup = (props) => {
    const logger = props.logger
    const [featureGroups, setFeatureGroups] = useState([])
    const [infoPopup, setInfoPopup] = useState(false);
    const closeInfoPopup = () => setInfoPopup(false);
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
        logger('fetchFeatureGroup UCMgr_baseUrl', UCMgr_baseUrl)
        try {
            const result = await axios.get(`${UCMgr_baseUrl}/trainingjobs/featureGroup`);
            logger('fetchFeatureGroup Result', result);
            logger('feature groups are --> ', result.data.featuregroups)
            setFeatureGroups(result.data.featuregroups);
        } catch (e) {
            console.error(e)
        }
    }
    const handleInfoClick = (featuregroup_name) => {
        console.log("feature group name is : ", featuregroup_name)
        setFeatureGroupName({
            featureGroupName : featuregroup_name
        });
        setInfoPopup(true);
      };

    const handleDme =(dme)=>{
        if(dme===true)return <p>Enabled</p>;
        else return <p>Disabled</p>
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
            id: 'featuregroup_name',
            Header: 'Feature Group Name',
            accessor: 'featuregroup_name'
        },
        {
            id: 'features',
            Header: 'Features',
            accessor: 'features'
        },
        {
            id: 'datalake',
            Header: 'DataLake',
            accessor: 'datalake'
        },
        {   
            id: 'dme',
            Header: 'DME',
            accessor: 'dme',
            Cell: ({row}) => {
                return (
                    <div >
                        {handleDme(row.original.dme)}
                    </div>
                );   
              }

        },
        {
            id: 'info',
            Header: 'Info',
            Cell : ({row}) => {
                return (
                    <div>
                <Button variant="info" onClick={() => handleInfoClick(row.original.featuregroup_name)}>Info</Button>
                    </div>
                );   
              }
    }
    ], []);
    const data = useMemo(() => featureGroups, [featureGroups]);
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
            autoResetSelectedRows: false
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
            <Popup show={infoPopup} onHide={closeInfoPopup} title="Feature Group Info">
                <FeatureGroupInfo featureGroupName={featureGroupName} />
            </Popup>
        </>

    );
}

export default ListFeatureGroup;