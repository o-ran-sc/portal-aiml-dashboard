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

import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import * as CONSTANTS from '../common/Constants' 

class UploadPipelineForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: '',
      plName: '',
      UCMgr_baseUrl: CONSTANTS.UCMgr_baseUrl
    }
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    console.log(event)
    this.setState({
      fileName: event.target.files[0]
    })
    console.log('handleInputChange',this.fileName)
  }

  handlePlNameChange = (event) => {
    this.setState({
      plName: event.target.value
    })
  }



  resetFrom = (event)=> {
    this.setState({   
      fileName: '',
      plName: '',     
    })
    console.log(this.state)
    event.target.value = null;
  }

  handleSubmit = event => {
    const data = new FormData()
    data.append('file', this.state.fileName)
    
    let url =  this.state.UCMgr_baseUrl + "/pipelines/" + this.state.plName + "/upload";

    //Option-3
    axios.post(url,data
      ).then(res => {
        console.log('Pipeline  responsed ', res)
        console.log('Status  responsed ', res.status)
        if(res.status === 200) {
          console.log('Pipeline uploaded ', res.status)
          alert(res.data.result)
          this.resetFrom(event)
          
        } else {
          console.log('Upload pipeline error:' , res)
        }
      })
      .catch(error => {
        console.log('Error in uploading pipeline',error.response)
        alert("Pipeline upload failed: " + error.response.data.result)
      })
      .then(function () {
        // always executed
      })

      console.log('something')
      event.preventDefault();
  }

  handleCreatePipeline  = event => {
    console.log('handleCreatePipeline clicked..', event)
    window.open(CONSTANTS.notebook_url + '/tree', "_blank")
  }

  render() {
    return (
    <>
    <div className="upload-pl-form" >

    <Button variant="success" size="sm"  onClick={e => this.handleCreatePipeline(e)} >
        Create Pipeline
    </Button>{' '}

      <Form  onSubmit={this.handleSubmit}>
        <Form.Group controlId="plName">
          <Form.Label>Pipeline Name*</Form.Label>
          <Form.Control type="input"
            value={this.state.plName}
            onChange={this.handlePlNameChange}
            placeholder="" 
            required/>
        </Form.Group>

      <input type="file" className="form-control"
            name="upload_file" onChange={this.handleInputChange} />

      <Button type="submit" > Upload </Button>

      </Form>
      </div>
    </>

    );
  }
}

export default UploadPipelineForm;