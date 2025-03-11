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

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { convertDatalakeDBName } from '../common/CommonMethods';
import './CreateFeatureGroupForm.css';
import { Row, Col } from 'react-bootstrap';
import { instance, UCMgr_baseUrl } from '../../../states';
import { featureGroupAPI } from '../../../apis';

class CreateFeatureGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      featureGroupName: '',
      featureNames: '',
      dataLake: 'Influx DB',
      dme: false,
      host: '',
      port: '',
      dmePort: '',
      bucketName: '',
      token: '',
      sourceName: '',
      dbOrg: '',
      measuredObjClass: '',
      _measurement: '',
      UCMgr_baseUrl: UCMgr_baseUrl,
    };

    this.regName = new RegExp('\\W+');
    this.logger = this.props.logger;
    this.logger('Initial UCM URL, ', this.state.UCMgr_baseUrl);
  }

  handleCreateSubmit = event => {
    this.logger('Create Feature Group clicked: ');

    this.invokeAddFeatureGroup(event);
    event.preventDefault();
  };

  handleDmeChange = event => {
    this.setState(
      {
        dme: event.target.checked,
      },
      () => {
        this.logger('after set state, dme: ', this.state.dme);
      },
    );
  };

  handleFGNameChange = event => {
    if (this.regName.test(event.target.value)) {
      event.preventDefault();
      alert('Please use alphabet, number, and underscore to Feature Group Name.');
    } else {
      this.setState(
        {
          featureGroupName: event.target.value,
        },
        () => {
          this.logger('after set state, FeatureGroup Name: ', this.state.featureGroupName);
        },
      );
    }
  };

  handleHostChange = event => {
    this.setState(
      {
        host: event.target.value,
      },
      () => {
        this.logger('after set state, Hostname: ', this.state.host);
      },
    );
  };

  handlePortChange = event => {
    this.setState(
      {
        port: event.target.value,
      },
      () => {
        this.logger('after set state, Port: ', this.state.port);
      },
    );
  };

  handleDmePortChange = event => {
    this.setState(
      {
        dmePort: event.target.value,
      },
      () => {
        this.logger('after set state, Port: ', this.state.dmePort);
      },
    );
  };

  handleFeatureNamesChange = event => {
    this.logger('handleFeatureNamesChange', event.target.value);
    this.setState(
      {
        featureNames: event.target.value,
      },
      () => {
        this.logger('after set state, featureNames: ', this.state.featureNames);
      },
    );
  };

  handleBucketNameChange = event => {
    this.setState(
      {
        bucketName: event.target.value,
      },
      () => {
        this.logger('after set state, bucketName: ', this.state.bucketName);
      },
    );
  };
  handledbTokenChange = event => {
    this.setState(
      {
        token: event.target.value,
      },
      () => {
        this.logger('after set state, influxDBToken: ', this.state.token);
      },
    );
  };

  handleSourceNameChange = event => {
    this.setState(
      {
        sourceName: event.target.value,
      },
      () => {
        this.logger('after set state, sourceName: ', this.state.sourceName);
      },
    );
  };
  handledbOrg = event => {
    this.setState(
      {
        dbOrg: event.target.value,
      },
      () => {
        this.logger('after set state, dbOrg: ', this.state.dbOrg);
      },
    );
  };

  handleMeasuredObjClass = event => {
    this.setState(
      {
        measuredObjClass: event.target.value,
      },
      () => {
        this.logger('after set state, measuredObjClass: ', this.state.measuredObjClass);
      },
    );
  };
  handle_measurementChange = event => {
    this.setState(
      {
        _measurement: event.target.value,
      },
      () => {
        this.logger('after set state, dbOrg: ', this.state.dbOrg);
      },
    );
  };
  invokeAddFeatureGroup(event) {
    this.logger('Add New Request is posted at ' + this.state.UCMgr_baseUrl + '/featureGroup');
    let convertedDatalakeDBName = convertDatalakeDBName(this.state.dataLake);

    featureGroupAPI
      .createFeatureGroup({
        data: {
          featuregroup_name: this.state.featureGroupName,
          feature_list: this.state.featureNames,
          datalake_source: convertedDatalakeDBName,
          enable_dme: this.state.dme,
          host: this.state.host,
          port: this.state.port,
          dme_port: this.state.dmePort,
          bucket: this.state.bucketName,
          token: this.state.token,
          source_name: this.state.sourceName,
          measured_obj_class: this.state.measuredObjClass,
          measurement: this.state._measurement,
          db_org: this.state.dbOrg,
        },
      })
      .then(res => {
        this.logger('featureGroup Created', res.data);
        if (res.status === 201) {
          alert('FeatureGroup Created');
          this.resetForm();
        }
      })
      .catch(error => {
        this.logger('Error creating featureGroup', error);
        alert('Failed: ' + error.response.data.Exception);
        event.preventDefault();
      })
      .then(function () {
        // always executed
      });
  }

  resetForm = () => {
    this.setState({
      featureGroupName: '',
      featureNames: '',
      dataLake: 'Influx DB',
      dme: false,
      host: '',
      port: '',
      dmePort: '',
      bucketName: '',
      token: '',
      sourceName: '',
      measuredObjClass: '',
      _measurement: '',
      dbOrg: '',
    });
  };

  render() {
    return (
      <Form onSubmit={this.handleCreateSubmit} className='create-form'>
        <Row>
          <Col md>
            <Form.Group controlId='FGname'>
              <Form.Label>Feature Group Name* </Form.Label>
              <Form.Control
                type='text'
                value={this.state.featureGroupName}
                onChange={this.handleFGNameChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId='Features'>
              <Form.Label>Features* </Form.Label>
              <Form.Control
                type='text'
                value={this.state.featureNames}
                onChange={this.handleFeatureNamesChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md>
            <Form.Group controlId='DataLake'>
              <Form.Label>Datalake </Form.Label>
              <Form.Control type='text' placeholder={this.state.dataLake} readOnly />
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId='db_org'>
              <Form.Label>Db Org</Form.Label>
              <Form.Control type='text' value={this.state.dbOrg} onChange={this.handledbOrg} placeholder='' required />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md>
            <Form.Group controlId='host'>
              <Form.Label>Host </Form.Label>
              <Form.Control
                type='text'
                value={this.state.host}
                onChange={this.handleHostChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId='port'>
              <Form.Label>Port </Form.Label>
              <Form.Control
                type='text'
                value={this.state.port}
                onChange={this.handlePortChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md>
            <Form.Group controlId='bucketname'>
              <Form.Label>Bucket Name </Form.Label>
              <Form.Control
                type='text'
                value={this.state.bucketName}
                onChange={this.handleBucketNameChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group controlId='buckettoken'>
              <Form.Label>DB Token </Form.Label>
              <Form.Control
                type='text'
                value={this.state.token}
                onChange={this.handledbTokenChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId='_measurement'>
              <Form.Label>_measurement*</Form.Label>
              <Form.Control
                type='text'
                value={this.state._measurement}
                onChange={this.handle_measurementChange}
                placeholder=''
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId='DME'>
          <Form.Check type='checkbox' label='DME' checked={this.state.dme} onChange={this.handleDmeChange} />
        </Form.Group>
        {this.state.dme === true && (
          <div>
            <Row>
              <Col md>
                <Form.Group controlId='SourceName'>
                  <Form.Label>Source Name </Form.Label>
                  <Form.Control
                    type='text'
                    value={this.state.sourceName}
                    onChange={this.handleSourceNameChange}
                    placeholder=''
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md>
                <Form.Group controlId='measuredObjClass'>
                  <Form.Label>Measured Obj Class</Form.Label>
                  <Form.Control
                    type='text'
                    value={this.state.measuredObjClass}
                    onChange={this.handleMeasuredObjClass}
                    placeholder=''
                    required
                  />
                </Form.Group>
              </Col>
              <Col md>
                <Form.Group controlId='dmeport'>
                  <Form.Label>Dme port</Form.Label>
                  <Form.Control
                    type='text'
                    value={this.state.dmePort}
                    onChange={this.handleDmePortChange}
                    placeholder=''
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}

        <Button type='submit' class='btn btn-primary'>
          Create Feature Group
        </Button>
      </Form>
    );
  }
}
export default CreateFeatureGroup;
