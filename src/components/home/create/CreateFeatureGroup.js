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
import Button from 'react-bootstrap/Button';
import CreateFeatureGroupForm from '../form/CreateFeatureGroupForm';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

class CreateFeatureGroup extends React.Component {
  constructor(props) {
    super(props);
    this.logger = this.props.logger;
  }
  popover = () => (
    <Popover id='popover-basic'>
      <Popover.Header as='h3'>Field descriptions</Popover.Header>
      <Popover.Body>
        <strong>Feature Group Name</strong>
        <br></br>
        Name of the Feature Group<br></br>
        It must be between 3 and 63 characters long <br></br>
        It can only consist of Letters and numbers and underscore
        <br></br>
        <strong>Features</strong>
        <br></br>
        The Feature have to be added as comma seperated string<br></br>
        eg: a,b<br></br>
        <strong>DataLake</strong>
        <br></br>
        Right now it is fixed to InfluxDB but in the future, we will add support<br></br>
        other datalakes too. <br></br>
        <strong>Influx db Info</strong>
        <br></br>
        Provide the InfluxDB Org, Host, Port, Bucket Name and token.<br></br>
        <strong>DME</strong>
        <br></br>
        Select DME to add the dme job info like SourceName, Measured Obj Class and dmePort.
        <br></br>
      </Popover.Body>
    </Popover>
  );
  render() {
    return (
      <>
        <OverlayTrigger trigger='click' placement='right' overlay={this.popover()}>
          <Button className='from-tooltip' placement='right' variant='secondary'>
            ?
          </Button>
        </OverlayTrigger>

        <CreateFeatureGroupForm logger={this.logger}></CreateFeatureGroupForm>
      </>
    );
  }
}

export default CreateFeatureGroup;
