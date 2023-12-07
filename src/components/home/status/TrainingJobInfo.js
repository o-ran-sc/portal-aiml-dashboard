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
import {convertToCommaSeparatedString, getDatalakeNameWithoutConversion} from '../common/CommonMethods';

const TrainingJobInfo = (props) => {
    const [trainingJobName, setTrainingJobName] = useState("");
    const [isMme, setIsMme] = useState(false);
    const [modelName, setModelName]= useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    const [featureNames, setFeatureNames] = useState("");
    const [pipeLineName, setPipelineName] = useState("");
    const [experimentName, setExperimentName] = useState("");
    const [featureFilter, setFeatureFilter] = useState("");
    const [hyperParameters, setHyperParameters] = useState("");
    const [metrics, setMetrics] = useState("");
    const [enableVersioning, setEnableVersioning] = useState(false);
    const [pipelineVersion, setPipelineVersion] = useState("");
    const [datalakeSource, setDatalakeSource] = useState("");
    const [modelUrl, setModelUrl] = useState("");
    const [_measurement, set_measurement] = useState("");
    const [bucket, setBucket] = useState("");
    const [modelInfo, setModelInfo] = useState("");

    useEffect(()=>{
        try{
            axios.get(`${UCMgr_baseUrl}/trainingjobs/${props.trainingjob_name_and_version.trainingjob_name}/${props.trainingjob_name_and_version.version}`)
            .then(response => {
                console.log(`response for ${UCMgr_baseUrl}/trainingjobs/${props.trainingjob_name_and_version.trainingjob_name}/${props.trainingjob_name_and_version.version}`, response);
                console.log(response.data);
                setTrainingJobName(response.data.trainingjob.trainingjob_name);
                setIsMme(response.data.trainingjob.is_mme);
                setModelName(response.data.trainingjob.model_name);
                setVersion(response.data.trainingjob.version);
                setDescription(response.data.trainingjob.description);
                setFeatureNames(response.data.trainingjob.feature_list);
                setPipelineName(response.data.trainingjob.pipeline_name);
                setExperimentName(response.data.trainingjob.experiment_name);
                setFeatureFilter(response.data.trainingjob.query_filter);
                setHyperParameters(convertToCommaSeparatedString(response.data.trainingjob.arguments));
                setMetrics(response.data.trainingjob.accuracy);
                setEnableVersioning(response.data.trainingjob.enable_versioning);
                setPipelineVersion(response.data.trainingjob.pipeline_version === response.data.trainingjob.pipeline_name ? "1" : response.data.trainingjob.pipeline_version);
                setDatalakeSource(getDatalakeNameWithoutConversion(response.data.trainingjob.datalake_source));
                setModelUrl(response.data.trainingjob.model_url);
                set_measurement(response.data.trainingjob._measurement);
                setBucket(response.data.trainingjob.bucket);
                setModelInfo(response.data.trainingjob.model_info);
            })
            .catch(error => {
                console.log(error);
            });
        }
        catch(error){
            console.log(error);
        }
    },[props.trainingjob_name_and_version]);


    return (
        <>
            <Form>
                <Form.Group controlId="ucName">
                    <Form.Label>Training Job Name</Form.Label>
                    <Form.Control type="text" value={trainingJobName} readOnly/>
                </Form.Group>
                <Form.Group controlId="isMme">
                <Form.Check type="checkbox" label="Enable MME"
                    checked={isMme} readOnly/>
                </Form.Group>
                {   isMme == true
                    && 
                    <div>
                    <Form.Group controlId="modelName">
                        <Form.Label>model name</Form.Label>
                        <Form.Control type="text" value={modelName} readOnly />
                    </Form.Group>

                    <Form.Group controlId="modelInfo">
                    <Form.Label>Model Info</Form.Label>
                        <Form.Control type="text" value={modelInfo} readOnly />
                    </Form.Group>
                    </div>

                }
                <Form.Group controlId="version">
                    <Form.Label>Version</Form.Label>
                    <Form.Control type="text" value={version} readOnly />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" value={description} readOnly />
                </Form.Group>
                <Form.Group controlId="featureNames">
                    <Form.Label>Feature Names</Form.Label>
                    <Form.Control type="text" value={featureNames} readOnly />
                </Form.Group>
                <Form.Group controlId="pipelineName">
                    <Form.Label>Training Function Name</Form.Label>
                    <Form.Control type="text" value={pipeLineName} readOnly />
                </Form.Group>
                <Form.Group controlId="experimentName">
                    <Form.Label>Experiment Name</Form.Label>
                    <Form.Control type="text" value={experimentName} readOnly />
                </Form.Group>
                <Form.Group controlId="featureFilter">
                    <Form.Label>Feature Filter</Form.Label>
                    <Form.Control type="text" value={featureFilter} readOnly />
                </Form.Group>
                <Form.Group controlId="hyperParameters">
                    <Form.Label>Hyper Parameters</Form.Label>
                    <Form.Control type="text" value={hyperParameters} readOnly />
                </Form.Group>
                <Form.Group controlId="metrics">
                    <Form.Label>Metrics</Form.Label>
                    <Form.Control type="text" value={metrics} readOnly />
                </Form.Group>
                <Form.Group id="enableVersioning">
                    <Form.Check type="checkbox" label="Enable versioning"
                    checked={enableVersioning} readOnly/>
                </Form.Group>
                <Form.Group controlId="pipelineVersion">
                    <Form.Label>Training Function Version</Form.Label>
                    <Form.Control type="text" value={pipelineVersion} readOnly />
                </Form.Group>
                <Form.Group controlId="datalakeSource">
                    <Form.Label>Datalake Source</Form.Label>
                    <Form.Control type="text" value={datalakeSource} readOnly />
                </Form.Group>
                {
                    datalakeSource === "Influx DB" &&
                        <>
                            <Form.Group controlId="_measurement">
                                <Form.Label>_measurement</Form.Label>
                                <Form.Control type="text" value={_measurement} readOnly />
                            </Form.Group>
                            <Form.Group controlId="bucket">
                                <Form.Label>bucket</Form.Label>
                                <Form.Control type="text" value={bucket} readOnly />
                            </Form.Group>
                        </>
                }
                <Form.Group controlId="modelUrl">
                    <Form.Label>Model URL</Form.Label>
                    <Form.Control type="text" value={modelUrl} readOnly />
                </Form.Group>
            </Form>
        </>
    );
}

export default TrainingJobInfo;