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

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './CreateOrEditTrainingJobForm.css';
import {
  getDatalakeNameWithoutConversion,
  convertDatalakeDBName,
  convertToCommaSeparatedString,
} from '../common/CommonMethods';
import { instance, UCMgr_baseUrl } from '../../../states';
import { featureGroupAPI, pipelineAPI, trainingJobAPI } from '../../../apis';

class CreateTrainingJob extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ucName: '',
      plName: '',
      isMme: false,
      modelName: '',
      modelVersion: '',
      modelLocation: '',
      trainingConfigDescription: '',
      queryFilter: '',
      arguments: '',
      trainingPipelineName: '',
      trainingPipelineVersion: '',
      retrainingPipelineName: '',
      retrainingPipelineVersion: '',
      trainingDataset: '',
      validationDataset: '',
      notificationUrl: '',
      consumerRappId: '',
      producerRappId: '',
      expName: '',
      featureGroupName: '',
      featureFilters: '',
      hyparams: '',
      versioning: false,
      ucDescription: '',
      plList: [],
      expList: [],
      featureGroupList: [],
      UCMgr_baseUrl: UCMgr_baseUrl,
      plVerList: [],
      plVerName: '',
      plVerDescription: '',
      datalakeSourceList: ['Influx DB'],
      datalakeSourceName: '',
    };

    this.regName = new RegExp('\\W+');
    this.logger = this.props.logger;

    this.logger('Initial UCM URL, ', this.state.UCMgr_baseUrl);
    this.logger('All env', process.env);
    this.logger('ucm host port', process.env.REACT_APP_UCM_HOST, process.env.REACT_APP_UCM_PORT);
  }

  componentDidMount() {
    this.logger('componentDidMount...');
    // this.logger(this.props.isCreateTrainingJobForm) this is true
    const task = () => {
      this.logger('called the task');
      this.fetchPipelines();
      // this.fetchExperiments();
      this.fetchFeatureGroups();

      if (this.state.plName !== '') {
        this.fetchPipelineVersions(this.state.plName, false);
      }

      let shouldChangeDatalakeSourceName = true;
      for (const data of this.state.datalakeSourceList) {
        if (data === this.state.datalakeSourceName) {
          shouldChangeDatalakeSourceName = false;
          break;
        }
      }
      if (shouldChangeDatalakeSourceName) {
        this.setState({ datalakeSourceName: '' }, () =>
          this.logger('current selected datalakeSourceName: ', this.state.datalakeSourceName),
        );
      } else {
        this.logger('current selected datalakeSourceName: ', this.state.datalakeSourceName);
      }
    };
    if (!this.props.isCreateTrainingJobForm) {
      instance
        .get(`/trainingjobs/${this.props.trainingjob_name}/${this.props.version}`)
        .then(result => {
          console.log('from result is: ', result.data.trainingjob);
          this.setState(
            {
              ucName: result.data.trainingjob.trainingjob_name,
              plName: result.data.trainingjob.pipeline_name,
              isMme: result.data.trainingjob.is_mme,
              modelName: result.data.trainingjob.model_name,
              expName: result.data.trainingjob.experiment_name,
              featureGroupName: result.data.trainingjob.feature_list,
              featureFilters: result.data.trainingjob.query_filter,
              hyparams: convertToCommaSeparatedString(result.data.trainingjob.arguments),
              versioning: result.data.trainingjob.enable_versioning,
              ucDescription: result.data.trainingjob.description,
              plList: [],
              expList: [],
              featureGroupList: [],
              UCMgr_baseUrl: UCMgr_baseUrl,
              plVerList: [],
              plVerName: result.data.trainingjob.pipeline_version,
              plVerDescription: '',
              datalakeSourceList: ['Influx DB'],
              datalakeSourceName: getDatalakeNameWithoutConversion(result.data.trainingjob.datalake_source),
            },
            () => {
              task();
            },
          );
        })
        .catch(error => {
          this.logger(error);
        });
    } else {
      task();
    }
  }

  fetchPipelines() {
    pipelineAPI
      .getPipelines()
      .then(res => {
        this.logger('Server reponded pl', res.data);
        this.setState(
          {
            plList: res.data.pipelines,
          },
          () => {
            let shouldChangePlName = true;
            for (const data of this.state.plList) {
              if (data === this.state.plName) {
                shouldChangePlName = false;
                break;
              }
            }
            if (shouldChangePlName) {
              this.setState({ plName: '' }, () => this.logger('current selected plName: ', this.state.plName));
            } else {
              this.logger('current selected plName: ', this.state.plName);
            }
          },
        );
      })
      .catch(error => {
        this.logger('Got some error' + error);
      })
      .then(function () {});
  }

  getLatestVersion(whom) {
    if (whom === 'plVerList') {
      let latest = '';
      for (let version of this.state.plVerList) {
        if (isNaN(parseInt(version))) {
          if (latest === '') {
            latest = version;
          }
        } else {
          if (latest === '' || isNaN(parseInt(latest))) {
            latest = version;
          } else {
            if (parseInt(latest) < parseInt(version)) {
              latest = version;
            }
          }
        }
      }
      return latest;
    } else {
      let latest = '';
      for (let version of this.state.superModelVersionsList) {
        if (latest === '') {
          latest = version;
        } else {
          if (parseInt(latest) < parseInt(version)) {
            latest = version;
          }
        }
      }
      return latest;
    }
  }

  makingCorrectPlVerIfWrong() {
    let shouldChangePlVerName = true;
    for (const data of this.state.plVerList) {
      if (data === this.state.plVerName) {
        shouldChangePlVerName = false;
        break;
      }
    }
    if (shouldChangePlVerName) {
      this.setState({ plVerName: '' }, () => this.logger('current selected plVerName: ', this.state.plVerName));
    } else {
      this.logger('current selected plVerName: ', this.state.plVerName);
    }
  }

  fetchPipelineVersions(pipeline_name, shouldGetLatestVersion) {
    pipelineAPI.getPipelineVersions({ params: { pipelineName: pipeline_name } })
      .then(res => {
        this.logger('Server reponded pipeline versions list', res.data);
        this.setState(
          {
            plVerList: res.data,
          },
          () => {
            if (shouldGetLatestVersion) {
              this.setState({ plVerName: this.getLatestVersion('plVerList') }, () => {
                this.makingCorrectPlVerIfWrong();
              });
            } else {
              this.makingCorrectPlVerIfWrong();
            }
          },
        );
      })
      .catch(error => {
        // handle error
        this.logger('Got some error' + error);
      })
      .then(function () {
        // always executed
      });
  }

  fetchExperiments() {
    instance
      .get('/experiments')
      .then(res => {
        this.logger('Server reponded exp', res.data.experiment_names);
        this.setState(
          {
            expList: res.data.experiment_names,
          },
          () => {
            let shouldChangeExpName = true;
            for (const data of this.state.expList) {
              if (data === this.state.expName) {
                shouldChangeExpName = false;
                break;
              }
            }
            if (shouldChangeExpName) {
              this.setState({ expName: '' }, () => this.logger('current selected expName: ', this.state.expName));
            } else {
              this.logger('current selected expName: ', this.state.expName);
            }
          },
        );
      })
      .catch(error => {
        // handle error
        this.logger('Got some error' + error);
      })
      .then(function () {
        // always executed
      });
  }

  fetchFeatureGroups() {
    featureGroupAPI.getAllFeatureGroup()
      .then(res => {
        this.logger('Server reponded FG', res.data.FeatureGroups);
        this.setState(
          {
            featureGroupList: res.data.FeatureGroups,
          },
          () => {
            let shouldChangeFGname = true;
            for (const data of this.state.featureGroupList) {
              if (data.featuregroup_name === this.state.featureGroupName) {
                shouldChangeFGname = false;
                break;
              }
            }
            if (shouldChangeFGname) {
              this.setState({ featureGroupName: '' }, () =>
                this.logger('current selected fGName: ', this.state.featureGroupName),
              );
            } else {
              this.logger('current selected fGName: ', this.state.featureGroupName);
            }
          },
        );
      })
      .catch(error => {
        // handle error
        this.logger('Got some error' + error);
      })
      .then(function () {
        // always executed
      });
  }

  handleCreateSubmit = event => {
    this.logger(
      'Create TrainingJob clicked: ',
      this.state.modelName,
      this.state.modelVersion,
      this.state.modelLocation,
      this.state.trainingConfigDescription,
      this.state.featureGroupName,
      this.state.queryFilter,
      this.state.arguments,
      this.state.trainingPipelineName,
      this.state.trainingPipelineVersion,
      this.state.retrainingPipelineName,
      this.state.retrainingPipelineVersion,
      this.state.trainingDataset,
      this.state.validationDataset,
      this.state.notificationUrl,
      this.state.consumerRappId,
      this.state.producerRappId,
    );

    this.invokeAddTrainingJob(event);
    event.preventDefault();
  };

  handleEditSubmit = event => {
    this.logger(
      'Edit usecase clicked: ',
      this.state.ucName,
      this.state.plName,
      this.state.isMme,
      this.state.modelName,
      this.state.expName,
      this.state.featureGroupName,
      this.state.featureFilters,
      this.state.hyparams,
      this.state.versioning,
      this.state.targetName,
      this.state.ucDescription,
      this.state.plVerName,
      this.state.datalakeSourceName,
    );

    this.invokePutTrainingJob(event);
    event.preventDefault();
  };

  invokeAddTrainingJob(event) {
    let argumentsDict = this.buildHyperparamsDict(this.state.arguments);
    trainingJobAPI.invokeTrainingJob({
      data: {
        modelId: {
          modelname: this.state.modelName,
          modelversion: this.state.modelVersion,
        },
        model_location: this.state.modelLocation,
        training_config: {
          description: this.state.trainingConfigDescription,
          dataPipeline: {
            feature_group_name: this.state.featureGroupName,
            query_filter: this.state.queryFilter,
            arguments: argumentsDict,
          },
          trainingPipeline: {
            training_pipeline_name: this.state.trainingPipelineName,
            training_pipeline_version: this.state.trainingPipelineVersion,
            retraining_pipeline_name: this.state.retrainingPipelineName,
            retraining_pipeline_version: this.state.retrainingPipelineVersion,
          },
        },
        training_dataset: this.state.trainingDataset,
        validation_dataset: this.state.validationDataset,
        notification_url: this.state.notificationUrl,
        consumer_rapp_id: this.state.consumerRappId,
        producer_rapp_id: this.state.producerRappId,
      }
    })
    .then(res => {
      this.logger('Training  responsed ', res);
      if (res.status === 201) {
        alert('Training Job created and training initiated');
        this.resetFrom();
        this.props.onHideCreatePopup();
        this.props.fetchTrainingJobs();
      }
    })
    .catch(error => {
      this.logger('Error creating Training Job', error);
      alert('Failed: ' + error.response.data.Exception);
      event.preventDefault();
    });
  }

  invokePutTrainingJob = event => {
    let hyperParamsDict = this.buildHyperparamsDict(this.state.hyparams);
    let convertedDatalakeDBName = convertDatalakeDBName(this.state.datalakeSourceName);
    this.logger('Add New Request is posted at ' + this.state.UCMgr_baseUrl + '/trainingjobs/' + this.state.ucName);
    instance
      .put('/trainingjobs/' + this.state.ucName, {
        trainingjob_name: this.state.ucName,
        is_mme: this.state.isMme,
        model_name: this.state.modelName,
        pipeline_name: this.state.plName,
        // "experiment_name" : this.state.expName,
        experiment_name: 'Default',
        featureGroup_name: this.state.featureGroupName,
        query_filter: this.state.featureFilters,
        arguments: hyperParamsDict,
        enable_versioning: this.state.versioning,
        description: this.state.ucDescription,
        pipeline_version: this.state.plVerName,
        datalake_source: convertedDatalakeDBName,
        //"enable_versioning" : true
      })
      .then(res => {
        this.logger('UC created ', res.data);
        this.invokeStartTrainingForEdit();
      })
      .catch(error => {
        // handle error
        this.logger('Error creating Use case', error);
        alert('Failed: ' + error.response.data.Exception);
        event.preventDefault();
      })
      .then(function () {
        // always executed
      });
  };

    invokeStartTrainingForEdit(event) {
    this.logger('Training called ');
    instance
      .post('/trainingjobs/' + this.state.ucName + '/training', {
        trainingjobs: this.state.ucName,
      })
      .then(res => {
        this.logger('Training  responsed ', res);
        if (res.status === 200) {
          alert('Training Job edited and training initiated');
          this.props.onHideEditPopup();
          this.props.fetchTrainingJobs();
        } else {
          this.logger('Training issue: ', res);
        }
      })
      .catch(error => {
        this.logger('Error in training api,response', error.response.data);
        alert('Training failed: ' + error.response.data.Exception);
      })
      .then(function () {
        // always executed
      });
  }

  buildFeatureNameList(f_names) {
    this.logger('before changing in buildFeatureNameList: ', f_names);
    this.logger('after changing in buildFeatureNameList: ', String(f_names).split(','));
    return String(f_names).split(',');
    //return ["Time", "DL PRB UTILIZATION %"];
  }

  buildFeatureFilterDict(filters) {
    this.logger('before changing in buildFeatureFilterDict: ', filters);

    if (filters === '') {
      return {};
    }

    let fil_list = String(filters).split(',');
    let filtDict = {};
    for (const filter of fil_list) {
      let token = filter.split(':');
      let key = token[0].trim();
      let value = this.getIntOrStringValue(token[1].trim());

      filtDict[key] = value;
    }

    this.logger('after changing in buildFeatureFilterDict: ', filtDict);
    return filtDict;
  }

  //Fix : Code dumplication merge in common function
  buildHyperparamsDict(hyperArgs) {
    this.logger('before changing in buildHyperparamsDict: ', hyperArgs);

    if (hyperArgs === '') {
      return {};
    }

    let paramList = String(hyperArgs).split(',');
    let paramDict = {};
    for (const param of paramList) {
      let token = param.split(':');
      let key = token[0].trim();
      let value = token[1].trim();

      paramDict[key] = value;
    }

    this.logger('after changing in buildHyperparamsDict: ', paramDict);
    return paramDict;
  }

  getIntOrStringValue(inputValue) {
    //BUG: value 12.5 coverted to 12

    this.logger('Before changing in getIntOrStringValue: ', inputValue);
    var value = parseInt(inputValue);
    if (isNaN(value)) {
      value = inputValue;
    }
    this.logger('After changing in getIntOrStringValue: ', value);
    return value;
  }

  handleModelNameChange = event => {
    this.setState(
      {
        modelName: event.target.value,
      },
      () => {
        this.logger('after set state, modelName: ', this.state.modelName);
      },
    );
  };

  handleModelVersionChange = event => {
    this.setState(
      {
        modelVersion: event.target.value,
      },
      () => {
        this.logger('after set state, modelVersion: ', this.state.modelVersion);
      },
    );
  };

  handleTrainingConfigDescriptionChange = event => {
    this.setState(
      {
        trainingConfigDescription: event.target.value,
      },
      () => {
        this.logger('after set state, trainingConfigDescription: ', this.state.trainingConfigDescription);
      },
    );
  };

  handleFeatureGroupNamesChange = event => {
    this.setState(
      {
        featureGroupName: event.target.value,
      },
      () => {
        this.logger('after set state, FeatureGroup Name: ', this.state.featureGroupName);
      },
    );
  };

  handleQueryFilterChange = event => {
    this.setState(
      {
        queryFilter: event.target.value,
      },
      () => {
        this.logger('after set state, queryFilter: ', this.state.queryFilter);
      },
    );
  };

  handleArgumentsChange = event => {
    this.setState(
      {
        arguments: event.target.value,
      },
      () => {
        this.logger('after set state, arguments: ', this.state.arguments);
      },
    );
  };

  handleTrainingPipelineNameChange = event => {
    this.setState(
      {
        trainingPipelineName: event.target.value,
      },
      () => {
        this.logger('after set state, trainingPipelineName: ', this.state.trainingPipelineName);
      },
    );
  };

  handleTrainingPipelineVersionChange = event => {
    this.setState(
      {
        trainingPipelineVersion: event.target.value,
      },
      () => {
        this.logger('after set state, trainingPipelineVersion: ', this.state.trainingPipelineVersion);
      },
    );
  };

  handleRetrainingPipelineNameChange = event => {
    this.setState(
      {
        retrainingPipelineName: event.target.value,
      },
      () => {
        this.logger('after set state, retrainingPipelineName: ', this.state.retrainingPipelineName);
      },
    );
  };

  handleRetrainingPipelineVersionChange = event => {
    this.setState(
      {
        retrainingPipelineVersion: event.target.value,
      },
      () => {
        this.logger('after set state, retrainingPipelineVersion: ', this.state.retrainingPipelineVersion);
      },
    );
  };

  handleTrainingDatasetChange = event => {
    this.setState(
      {
        trainingDataset: event.target.value,
      },
      () => {
        this.logger('after set state, trainingDataset: ', this.state.trainingDataset);
      },
    );
  };

  handleValidationDatasetChange = event => {
    this.setState(
      {
        validationDataset: event.target.value,
      },
      () => {
        this.logger('after set state, validationDataset: ', this.state.validationDataset);
      },
    );
  };

  handleNotificationUrlChange = event => {
    this.setState(
      {
        notificationUrl: event.target.value,
      },
      () => {
        this.logger('after set state, notificationUrl: ', this.state.notificationUrl);
      },
    );
  };

  handleConsumerRappIdChange = event => {
    this.setState(
      {
        consumerRappId: event.target.value,
      },
      () => {
        this.logger('after set state, consumerRappId: ', this.state.consumerRappId);
      },
    );
  };

  handleProducerRappIdChange = event => {
    this.setState(
      {
        producerRappId: event.target.value,
      },
      () => {
        this.logger('after set state, producerRappId: ', this.state.producerRappId);
      },
    );
  };



  resetFrom = () => {
    this.setState({
      modelName: '',
      modelVersion: '',
      modelLocation: '',
      trainingConfigDescription: '',
      queryFilter: '',
      arguments: '',
      trainingPipelineName: '',
      trainingPipelineVersion: '',
      retrainingPipelineName: '',
      retrainingPipelineVersion: '',
      trainingDataset: '',
      validationDataset: '',
      notificationUrl: '',
      consumerRappId: '',
      producerRappId: '',
      featureGroupName: '',
      featureFilters: '',
      superModel: '',
      superModelVersion: '',
      superModelVersionsList: [],
    });
  };

  render() {
    return (
      <>
        <Form
          className={this.props.isCreateTrainingJobForm ? 'create-form' : 'edit-form'}
          onSubmit={this.props.isCreateTrainingJobForm ? this.handleCreateSubmit : this.handleEditSubmit}
        >
          <Form.Group controlId='modelName'>
            <Form.Label>Model Name*</Form.Label>
            <Form.Control
              type='text'
              value={this.state.modelName}
              onChange={this.handleModelNameChange}
              placeholder=''
              required
            />
          </Form.Group>
          <Form.Group controlId='modelVersion'>
            <Form.Label>Model Version*</Form.Label>
            <Form.Control
              type='text'
              value={this.state.modelVersion}
              onChange={this.handleModelVersionChange}
              placeholder=''
              required
            />
          </Form.Group>

          <Form.Group controlId='trainingConfigDescription'>
            <Form.Label>Training Description</Form.Label>
            <Form.Control
              type='text'
              value={this.state.trainingConfigDescription}
              onChange={this.handleTrainingConfigDescriptionChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='featureGroupName'>
            <Form.Label>Data Pipeline FeatureGroup Name*</Form.Label>
            <Form.Control
              as='select'
              required
              value={this.state.featureGroupName}
              onChange={this.handleFeatureGroupNamesChange}
            >
              <option key='' value='' disabled>
                {' '}
                --- Select FeatureGroup Name ---{' '}
              </option>
              {this.state.featureGroupList.map(data => (
                <option key={data.featuregroup_name} value={data.featuregroup_name}>
                  {data.featuregroup_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='queryFilter'>
            <Form.Label>Data Pipeline Query Filter</Form.Label>
            <Form.Control
              type='text'
              value={this.state.queryFilter}
              onChange={this.handleQueryFilterChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='arguments'>
            <Form.Label>Data Pipeline Arguments</Form.Label>
            <Form.Control type='text' value={this.state.arguments} onChange={this.handleArgumentsChange} placeholder='' />
          </Form.Group>

          <Form.Group controlId='trainingPipelineName'>
            <Form.Label>Training Pipeline Name</Form.Label>
            <Form.Control
              type='text'
              value={this.state.trainingPipelineName}
              onChange={this.handleTrainingPipelineNameChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='trainingPipelineVersion'>
            <Form.Label>Training Pipeline Version</Form.Label>
            <Form.Control
              type='text'
              value={this.state.trainingPipelineVersion}
              onChange={this.handleTrainingPipelineVersionChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='retrainingPipelineName'>
            <Form.Label>Retraining Pipeline Name</Form.Label>
            <Form.Control
              type='text'
              value={this.state.retrainingPipelineName}
              onChange={this.handleRetrainingPipelineNameChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='retrainingPipelineVersion'>
            <Form.Label>Retraining Pipeline Version</Form.Label>
            <Form.Control
              type='text'
              value={this.state.retrainingPipelineVersion}
              onChange={this.handleRetrainingPipelineVersionChange}
              placeholder=''
            />
          </Form.Group>

          <Form.Group controlId='trainingDataset'>
            <Form.Label>Training Dataset</Form.Label>
            <Form.Control
              type='text'
              value={this.state.trainingDataset}
              onChange={this.handleTrainingDatasetChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='validationDataset'>
            <Form.Label>Validation Dataset</Form.Label>
            <Form.Control
              type='text'
              value={this.state.validationDataset}
              onChange={this.handleValidationDatasetChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='notificationUrl'>
            <Form.Label>Notification URL</Form.Label>
            <Form.Control
              type='text'
              value={this.state.notificationUrl}
              onChange={this.handleNotificationUrlChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='consumerRappId'>
            <Form.Label>Consumer rApp ID</Form.Label>
            <Form.Control
              type='text'
              value={this.state.consumerRappId}
              onChange={this.handleConsumerRappIdChange}
              placeholder=''
            />
          </Form.Group>
          <Form.Group controlId='producerRappId'>
            <Form.Label>Producer rApp ID</Form.Label>
            <Form.Control
              type='text'
              value={this.state.producerRappId}
              onChange={this.handleProducerRappIdChange}
              placeholder=''
            />
          </Form.Group>

          <Button type='submit'> Create Training Job </Button>
        </Form>
      </>
    );
  }
}

export default CreateTrainingJob;