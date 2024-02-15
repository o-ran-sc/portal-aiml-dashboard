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
import axios from 'axios';
import { UCMgr_baseUrl } from '../common/Constants';

const FeatureGroupInfo = (props) => {
    const [featureGroupName, setFeatureGroupName] = useState("");
    const [features, setfeatures] = useState("");
    const [datalake, setdatalake] = useState("");
    const [dme, setDme] = useState(false);
    const [host, setHost] = useState("")
    const [port, setPort] = useState("")
    const [dmePort, setDmePort] = useState("")
    const [sourceName, setSourceName] = useState("")
    const [dbOrg, setDbOrg] = useState("")
    const [bucketName, setBucketName] = useState("")
    const [dbToken, setDbToken] = useState("")
    const [measurement, setMeasurement] = useState("")
    const [measuredObjClass, setMeasureObjectClass] = useState("")

    useEffect(() => {
        try {
            axios.get(`${UCMgr_baseUrl}/featureGroup/${props.featureGroupName.featureGroupName}`)
                .then(response => {
                    console.log(`response for ${UCMgr_baseUrl}/trainingjobs/featureGroup/${props.featureGroupName.featureGroupName}`, response)
                    setFeatureGroupName(response.data.featuregroup[0].featuregroup_name)
                    setfeatures(response.data.featuregroup[0].features)
                    setDme(response.data.featuregroup[0].dme)
                    setdatalake(response.data.featuregroup[0].datalake)
                    setHost(response.data.featuregroup[0].host)
                    setPort(response.data.featuregroup[0].port)
                    setDbToken(response.data.featuregroup[0].token)
                    setDbOrg(response.data.featuregroup[0].db_org)
                    setSourceName(response.data.featuregroup[0].source_name)
                    setBucketName(response.data.featuregroup[0].bucket)
                    setDmePort(response.data.featuregroup[0].dme_port)
                    setMeasurement(response.data.featuregroup[0].measurement)
                    setMeasureObjectClass(response.data.featuregroup[0].measured_obj_class)

                })
                .catch(error => {
                    console.log(error);
                });
        }
        catch (error) {
            console.log(error);
        }
    }, [props.featureGroupName]);


    return (
        <>
            <Form>
                <Form.Group controlId="FeatureGroupName">
                    <Form.Label>Feature Group Name</Form.Label>
                    <Form.Control type="text" value={featureGroupName} readOnly />
                </Form.Group>
                <Form.Group controlId="features">
                    <Form.Label>Features</Form.Label>
                    <Form.Control type="text" value={features} readOnly />
                </Form.Group>
                <Form.Group controlId="datalake">
                    <Form.Label>Datalake</Form.Label>
                    <Form.Control type="text" value={datalake} readOnly />
                </Form.Group>
                <Form.Group controlId="host">
                    <Form.Label>Host </Form.Label>
                    <Form.Control type="text" value={host} readOnly />
                </Form.Group>

                <Form.Group controlId="port">
                    <Form.Label>Port </Form.Label>
                    <Form.Control type="text" value={port} readOnly />
                </Form.Group>

                <Form.Group controlId="bucketname">
                    <Form.Label>Bucket Name </Form.Label>
                    <Form.Control type="text" value={bucketName} readOnly />
                </Form.Group>

                <Form.Group controlId="buckettoken">
                    <Form.Label>DB Token </Form.Label>
                    <Form.Control type="text" value={dbToken} readOnly />
                </Form.Group>
                <Form.Group controlId="db_org">
                    <Form.Label>Db Org</Form.Label>
                    <Form.Control type="text" value={dbOrg} readOnly />
                </Form.Group>
                <Form.Group controlId="measurement">
                    <Form.Label>Measurement</Form.Label>
                    <Form.Control type="text" value={measurement} readOnly />
                </Form.Group>
                {dme === true &&
                    <div>
                        <Form.Group controlId="SourceName">
                            <Form.Label>Source Name </Form.Label>
                            <Form.Control type="text" value={sourceName} readOnly />
                        </Form.Group>

                        <Form.Group controlId="dmePort">
                            <Form.Label>Dme Port </Form.Label>
                            <Form.Control type="text" value={dmePort} readOnly />
                        </Form.Group>
                        <Form.Group controlId="measured_obj_class">
                            <Form.Label>Measured Object Class</Form.Label>
                            <Form.Control type="text" value={measuredObjClass} readOnly />
                        </Form.Group>
                    </div>
                }

            </Form>
        </>
    );
}

export default FeatureGroupInfo;