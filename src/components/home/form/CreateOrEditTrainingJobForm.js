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
import './CreateOrEditTrainingJobForm.css'
import {convertDatalakeDBName} from '../common/CommonMethods'

class CreateTrainingJob extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
        ucName: '',
        plName: '',
        expName: '',
        featureNames: '',
        featureFilters: '',
        hyparams: '',    
        versioning: false,
        ucDescription: '',
        plList: [],
        expList: [],
        UCMgr_baseUrl: CONSTANTS.UCMgr_baseUrl,
        plVerList: [],
        plVerName: '',
        plVerDescription: '',
        datalakeSourceList: ["Influx DB"],
        datalakeSourceName: '',
        _measurement: '',
        bucket: ''
    };
    
    
	 
    console.log('Initial UCM URL, ' , this.state.UCMgr_baseUrl)
    console.log('All env', process.env)
    console.log('ucm host port',process.env.REACT_APP_UCM_HOST ,process.env.REACT_APP_UCM_PORT);
    
  }
  
  componentDidMount() {
    console.log("componentDidMount...");

    const task = () => {
      this.fetchPipelines();
      this.fetchExperiments();

      if(this.state.plName !== ""){
        this.fetchPipelineVersions(this.state.plName, false);
      }



     

      let shouldChangeDatalakeSourceName = true;
      for(const data of this.state.datalakeSourceList){
        if(data === this.state.datalakeSourceName){
          shouldChangeDatalakeSourceName = false;
          break;
        }
      }
      if(shouldChangeDatalakeSourceName){
        this.setState({datalakeSourceName : ''},()=>console.log("current selected datalakeSourceName: ",this.state.datalakeSourceName));
      }
      else{
        console.log("current selected datalakeSourceName: ",this.state.datalakeSourceName);
      }

    };

    task();



  }

  
  fetchPipelines() {
    
    axios.get( this.state.UCMgr_baseUrl + '/pipelines')
      .then(res => {
        console.log('Server reponded pl', res.data.pipeline_names)
        //setState because this is async response from axios, so re-render
        this.setState(
          {
            plList: res.data.pipeline_names
          },
          () => {
            let shouldChangePlName = true;
            for(const data of this.state.plList){
              if(data === this.state.plName){
                shouldChangePlName = false;
                break;
              }
            }
            if(shouldChangePlName){
              this.setState({plName : ''},()=>console.log("current selected plName: ",this.state.plName));
            }
            else{
              console.log("current selected plName: ",this.state.plName);
            }
          }
        );
               
      })
      .catch(function (error) {
        console.log('Got some error' + error);
      })
      .then(function () {
      })
  }

  getLatestVersion(whom){
    if(whom === "plVerList"){
      let latest = "";
      for(let version of this.state.plVerList){
        if(isNaN(parseInt(version))){
          if(latest === ""){
            latest = version;
          }
        }
        else{
          if(latest === "" || isNaN(parseInt(latest))){
              latest = version;
          }
          else{
            if(parseInt(latest)<parseInt(version)){
              latest=version;
            }
          }
        }
      }
      return latest;
    }
    else{
      let latest = "";
      for(let version of this.state.superModelVersionsList){
        if(latest === ""){
          latest = version;
        }
        else{
          if(parseInt(latest)<parseInt(version)){
            latest=version;
          }
        }
      }
      return latest;
    }
  }

  makingCorrectPlVerIfWrong(){
    let shouldChangePlVerName = true;
    for(const data of this.state.plVerList){
      if(data === this.state.plVerName){
        shouldChangePlVerName = false;
        break;
      }
    }
    if(shouldChangePlVerName){
      this.setState({plVerName : ''},()=>console.log("current selected plVerName: ",this.state.plVerName));
    }
    else{
      console.log("current selected plVerName: ",this.state.plVerName);
    }
  }


  fetchPipelineVersions(pipeline_name, shouldGetLatestVersion) {
    
    axios.get( `${this.state.UCMgr_baseUrl}/pipelines/${pipeline_name}/versions`)
      .then(res => {
        console.log('Server reponded pipeline versions list', res.data.versions_list)
        //setState because this is async response from axios, so re-render
        this.setState(
          {
            plVerList: res.data.versions_list
          },
          () => {
  
            if(shouldGetLatestVersion){
              this.setState({ plVerName: this.getLatestVersion("plVerList")},() => {  
                this.makingCorrectPlVerIfWrong();
              })
            }
            else{
              this.makingCorrectPlVerIfWrong();
            }
          }
        );
               
      })
      .catch(function (error) {
        // handle error
        console.log('Got some error' + error);
      })
      .then(function () {
        // always executed
      })
  }



  fetchExperiments() {
    axios.get(this.state.UCMgr_baseUrl + '/experiments')
      .then(res => {
        console.log('Server reponded exp', res.data.experiment_names);
        //setState because this is async response from axios, so re-render
        this.setState(
          {
            expList: res.data.experiment_names
          },
          () => {
            let shouldChangeExpName = true;
            for(const data of this.state.expList){
              if(data === this.state.expName){
                shouldChangeExpName = false;
                break;
              }
            }
            if(shouldChangeExpName){
              this.setState({expName : ''},()=>console.log("current selected expName: ",this.state.expName));
            }
            else{
              console.log("current selected expName: ",this.state.expName);
            }
          }
        );
      })
      .catch(function (error) {
        // handle error
        console.log('Got some error' + error);
      })
      .then(function () {
        // always executed
      })

  }

    handleCreateSubmit = event => {
        console.log('Create TrainingJob clicked: ',
        this.state.ucName,
        this.state.plName,
        this.state.expName,
        this.state.featureNames,
        this.state.featureFilters,
        this.state.hyparams,
        this.state.targetName,
        this.state.ucDescription,
        this.state.plVerName,
        this.state.datalakeSourceName,
        this.state._measurement,
        this.state.bucket
        );
        
        this.invokeAddTrainingJob(event)
        event.preventDefault();
    }

invokeAddTrainingJob(event){
  let hyperParamsDict = this.buildHyperparamsDict(this.state.hyparams);
  let convertedDatalakeDBName = convertDatalakeDBName(this.state.datalakeSourceName)
  console.log('Add New Request is posted at ' + this.state.UCMgr_baseUrl + '/trainingjobs/' + this.state.ucName)
  axios.post(this.state.UCMgr_baseUrl + '/trainingjobs/' + this.state.ucName,{
    "trainingjob_name" : this.state.ucName,
    "pipeline_name" : this.state.plName,
    "experiment_name" : this.state.expName,
    "feature_list": this.state.featureNames,
    "query_filter": this.state.featureFilters,
    "arguments" : hyperParamsDict,   
    "enable_versioning" : this.state.versioning,
    "description" : this.state.ucDescription,
    "pipeline_version": this.state.plVerName,
    "datalake_source": convertedDatalakeDBName,
    "_measurement": this.state._measurement,
    "bucket": this.state.bucket
  }).then(res => {
      console.log('UC created ', res.data)
      this.invokeStartTrainingForCreate();
    })
    .catch(function (error) {
    
      console.log('Error creating Training Job', error);
      alert("Failed: " + error.response.data.Exception)
      event.preventDefault();
    })
    .then(function () {
      
    })

}

  

  invokeStartTrainingForCreate(event){
    console.log('Training called ')
    axios.post(this.state.UCMgr_baseUrl 
      + '/trainingjobs/' + this.state.ucName + '/training',
      {
       "trainingjob_name" : this.state.ucName,
      }
      ).then(res => {
        console.log('Training  responsed ', res)
        if(res.status === 200) {
          alert("Training Job created and training initiated")
          this.resetFrom()
          
        } else {
          console.log('Training issue: ' , res)
        }
        
      })
      .catch(error => {
        console.log('Error in training api,response',error.response.data)
        alert("Training failed: " + error.response.data.Exception)
      })
      .then(function () {
        // always executed
      })
  }


  


  buildFeatureNameList(f_names) {

    console.log("before changing in buildFeatureNameList: ",f_names);
    console.log("after changing in buildFeatureNameList: ",String(f_names).split(","))
    return String(f_names).split(",");
    //return ["Time", "DL PRB UTILIZATION %"];
  }

  buildFeatureFilterDict(filters){

    console.log("before changing in buildFeatureFilterDict: ",filters)

    if(filters === ""){
      return {};
    }

    let fil_list = String(filters).split(",");
    let filtDict = {}
    for ( const filter of fil_list) {
      let token = filter.split(":");
      let key = token[0].trim();
      let value = this.getIntOrStringValue(token[1].trim());

      filtDict[key] = value;
    }
        
    console.log('after changing in buildFeatureFilterDict: ',filtDict);
    return filtDict;

  }

  //Fix : Code dumplication merge in common function
  buildHyperparamsDict(hyperArgs){

    console.log("before changing in buildHyperparamsDict: ",hyperArgs);

    if(hyperArgs === ""){
      return {
        'trainingjob_name' : this.state.ucName
      };
    }

    let paramList = String(hyperArgs).split(",");
    let paramDict = {}
    for ( const param of paramList) {
      let token = param.split(":");
      let key = token[0].trim();
      let value = token[1].trim();

      paramDict[key] = value;
    }
    paramDict["trainingjob_name"] = this.state.ucName;


    console.log("after changing in buildHyperparamsDict: ",paramDict);
    return paramDict;
    
  }

  getIntOrStringValue(inputValue) {
    //BUG: value 12.5 coverted to 12

    console.log('Before changing in getIntOrStringValue: ',inputValue)
    var value = parseInt(inputValue)
    if(isNaN(value)) {
      value = inputValue
    } 
    console.log('After changing in getIntOrStringValue: ',value)
    return value;
  }

  handleUCNameChange = (event) => {
    this.setState({
      ucName: event.target.value
    },() => {
      console.log("after set state, ucName: ", this.state.ucName);
    })
  }

  handlePLNameChange = (event) => {
    
    this.setState({
      plName: event.target.value
    },() => {
      console.log("after set state, plName: ", this.state.plName);
      this.fetchPipelineVersions(this.state.plName, true);
    })
  }

  handleExpNameChange = (event) => {
    
    this.setState({
      expName: event.target.value
    },() => {
      console.log("after set state, expName: ", this.state.expName);
    })
  }

  handleFeatureNamesChange = (event) => {
    console.log('handleFeatureNamesChange', event.target.value)
    this.setState({
      featureNames: event.target.value
    },() => {
      console.log("after set state, featureNames: ", this.state.featureNames);
    })
  }

  handleFeatFiltersChange = (event) => {
    this.setState({
      featureFilters: event.target.value
    },() => {
      console.log("after set state, featureFilters: ", this.state.featureFilters);
    })
  }

  handleHyparamsChange = (event) => {
    this.setState({
      hyparams: event.target.value
    },() => {
      console.log("after set state, hyparams: ", this.state.hyparams);
    })
  }

  handleVersioningChange = (event) => {
    this.setState({
      versioning: event.target.checked
    },() => {
      console.log("after set state, versioning: ", this.state.versioning);
    })
  }
  
  handleTargetChange = (event) => {
    this.setState({
      targetName: event.target.value
    },() => {
      console.log("after set state, targetName: ", this.state.targetName);
    })
  }

  handleDatalakeSourceChange = (event) => {
    this.setState({
      datalakeSourceName: event.target.value
    },() => {
      console.log("after set state, datalakeSourceName: ", this.state.datalakeSourceName);
    })
  }

  handleUCDescriptionChange = (event) => {
    this.setState({
      ucDescription: event.target.value
    },() => {
      console.log("after set state, ucDescription: ", this.state.ucDescription);
    })
  }

  handlePipelineVersionChange = (event) => {
    this.setState({
      plVerName: event.target.value
    },() => {
      console.log("after set state, plVerName: ", this.state.plVerName);
    })
  }

 





  handle_measurementChange = (event) => {
    this.setState({
      _measurement: event.target.value
    },()=>{
      console.log("after set state, _measurement: ", this.state._measurement);
    });
  }

  handleBucketChange = (event) => {
    this.setState({
      bucket : event.target.value
    },()=>{
      console.log("after set state, bucket: ", this.state.bucket);
    });
  }


  resetFrom = ()=> {

    this.setState({
      ucName: '',
      plName: '',
      expName: '',
      featureNames: '',
      featureFilters: '',
      hyparams: '',
      versioning: false,
      ucDescription: '',
      targetName: '',
      plVerName: '',
      plVerList: [],
      plVerDescription: '',
      datalakeSourceName: '',
      superModel: '',
      superModelVersion: '',
      superModelVersionsList: [],
      _measurement: '',
      bucket: ''
    })
  }

  

  render() {


    return (
      <>

      <Form 
      className={this.props.isCreateTrainingJobForm?"create-form":"edit-form"}
      onSubmit={this.handleCreateSubmit}>

      
        <Form.Group controlId="ucName">
            <Form.Label>Training Job Name*</Form.Label>
            {
                this.props.isCreateTrainingJobForm
                ?
                    (
                        <Form.Control type="input"
                        value={this.state.ucName}
                        onChange={this.handleUCNameChange}
                        placeholder="" 
                        required/>
                    ) 
                :
                    (
                        <Form.Control type="text" placeholder={this.state.ucName} readOnly />
                    )
            }     
        </Form.Group>

        <Form.Group controlId="plName">
          <Form.Label>Pipeline Name*</Form.Label>
          <Form.Control as="select"
            required
            value={this.state.plName}
            onChange={this.handlePLNameChange}>
          
            <option key="" value="" disabled> --- Select Pipeline --- </option>
            {
                this.state.plList.map(data => <option key={data} value={data}>{data}</option>)
            }
          </Form.Control>
        </Form.Group>

        {
          this.state.plName !== '' 
          && 
          <div>
            <Form.Group controlId="plVesName">
              <Form.Label>Pipeline Version Name*</Form.Label>
              <Form.Control as="select"
                required
                value={this.state.plVerName}
                onChange={this.handlePipelineVersionChange}>
            
                <option key="" value="" disabled> --- Select Pipeline Version--- </option>
                {
                    this.state.plVerList.map(data => {
                      if(data === this.state.plName){
                        return <option key={data} value={data}>1</option>
                      }
                      else{
                        return <option key={data} value={data}>{data}</option>
                      }
                    })
                }
              </Form.Control>
            </Form.Group>
            {/*<Form.Group controlId="plVerDescription">
              <Form.Label>Pipeline Version Description</Form.Label>
              <Form.Control as="textarea" name="plVerDescription" rows={3} value={this.state.plVerDescription} readOnly/>
            </Form.Group>*/}
          </div>
          
        }

        <Form.Group controlId="expName">
          <Form.Label>Experiment Name*</Form.Label>
          <Form.Control as="select"
            required
            value={this.state.expName}
            onChange={this.handleExpNameChange}>

            <option key="" value="" disabled> --- Select Experiment --- </option>
            {
              this.state.expList.map(data => <option key={data} value={data}>{data}</option>)
            }
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="datalakeSource">
          <Form.Label>Datalake Source*</Form.Label>
         
          <Form.Control as="select"
            required
            value={this.state.datalakeSourceName}
            onChange={this.handleDatalakeSourceChange}>

            <option key="" value="" disabled> --- Select Datalake Source --- </option>
            {
              this.state.datalakeSourceList.map(data => <option key={data} value={data}>{data}</option>)
            }
          
          </Form.Control>
        </Form.Group>

        {
          this.state.datalakeSourceName === "Influx DB" &&
          <div>
            <Form.Group controlId="_measurement">
              <Form.Label>_measurement*</Form.Label>
              <Form.Control type="text"
                value={this.state._measurement}
                onChange={this.handle_measurementChange}
                placeholder="" 
                required/>
            </Form.Group>
            <Form.Group controlId="bucket">
              <Form.Label>bucket*</Form.Label>
              <Form.Control type="text" 
                value={this.state.bucket}
                onChange={this.handleBucketChange}
                placeholder=""
                required/>
            </Form.Group>
          </div>
          
        }

        <Form.Group controlId="ftName">
          <Form.Label>Feature Name*</Form.Label>
          <Form.Control type="text"
            value={this.state.featureNames}
            onChange={this.handleFeatureNamesChange}
            placeholder="" 
            required/>
        </Form.Group>

        <Form.Group controlId="ftFilter">
          <Form.Label>Feature Filter</Form.Label>
          <Form.Control type="text"
            value={this.state.featureFilters}
            onChange={this.handleFeatFiltersChange}
            placeholder="" />
        </Form.Group>

        <Form.Group controlId="hyparams">
          <Form.Label>Hyper Parameters</Form.Label>
          <Form.Control type="text"
            value={this.state.hyparams}
            onChange={this.handleHyparamsChange}
            placeholder="" />
        </Form.Group>

        {/* currently don't know difference between id and controlId in Form.group*/}
        <Form.Group id="EnableVersioning">
            <Form.Check type="checkbox" label="Enable versioning"
             checked={this.state.versioning} onChange={this.handleVersioningChange} />
        </Form.Group>

       

        <Form.Group controlId="ucDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text"
            value={this.state.ucDescription}
            onChange={this.handleUCDescriptionChange}
            placeholder="" />
        </Form.Group>

        <Button type="submit"> Create Training Job </Button>
      </Form>
      </>
    );
  }
}

export default CreateTrainingJob;
