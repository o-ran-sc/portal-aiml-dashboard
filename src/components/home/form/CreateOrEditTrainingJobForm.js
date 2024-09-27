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
import { pipelineAPI } from '../../../apis/pipeline';

class CreateTrainingJob extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ucName: '',
      plName: '',
      isMme: false,
      modelName: '',
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
    instance
      .get(`/pipelines/${pipeline_name}/versions`)
      .then(res => {
        this.logger('Server reponded pipeline versions list', res.data.versions_list);
        this.setState(
          {
            plVerList: res.data.versions_list,
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
    instance
      .get('/featureGroup')
      .then(res => {
        this.logger('Server reponded FG', res.data.featuregroups);
        this.setState(
          {
            featureGroupList: res.data.featuregroups,
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
      this.state.ucName,
      this.state.plName,
      this.state.isMme,
      this.state.modelName,
      this.state.expName,
      this.state.featureGroupName,
      this.state.featureFilters,
      this.state.hyparams,
      this.state.targetName,
      this.state.ucDescription,
      this.state.plVerName,
      this.state.datalakeSourceName,
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
    let hyperParamsDict = this.buildHyperparamsDict(this.state.hyparams);
    let convertedDatalakeDBName = convertDatalakeDBName(this.state.datalakeSourceName);
    this.logger('Add New Request is posted at ' + this.state.UCMgr_baseUrl + '/trainingjobs/' + this.state.ucName);
    instance
      .post('/trainingjobs/' + this.state.ucName, {
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
      })
      .then(res => {
        this.logger('UC created ', res.data);
        this.invokeStartTrainingForCreate();
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

  invokeStartTrainingForCreate(event) {
    this.logger('Training called ');
    instance
      .post('/trainingjobs/' + this.state.ucName + '/training', {
        trainingjobs: this.state.ucName,
      })
      .then(res => {
        this.logger('Training  responsed ', res);
        if (res.status === 200) {
          alert('Training Job created and training initiated');
          this.resetFrom();
          this.props.onHideCreatePopup();
          this.props.fetchTrainingJobs();
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
      return {
        trainingjob_name: this.state.ucName,
      };
    }

    let paramList = String(hyperArgs).split(',');
    let paramDict = {};
    for (const param of paramList) {
      let token = param.split(':');
      let key = token[0].trim();
      let value = token[1].trim();

      paramDict[key] = value;
    }
    paramDict['trainingjob_name'] = this.state.ucName;

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

  handleUCNameChange = event => {
    if (this.regName.test(event.target.value)) {
      event.preventDefault();
      alert('Please use alphabet, number, and underscore to Training Job Name.');
    } else {
      this.setState(
        {
          ucName: event.target.value,
        },
        () => {
          this.logger('after set state, ucName: ', this.state.ucName);
        },
      );
    }
  };

  handlePLNameChange = event => {
    this.setState(
      {
        plName: event.target.value,
      },
      () => {
        this.logger('after set state, plName: ', this.state.plName);
        this.fetchPipelineVersions(this.state.plName, true);
      },
    );
  };

  handleExpNameChange = event => {
    this.setState(
      {
        expName: event.target.value,
      },
      () => {
        this.logger('after set state, expName: ', this.state.expName);
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

  handleFeatFiltersChange = event => {
    this.setState(
      {
        featureFilters: event.target.value,
      },
      () => {
        this.logger('after set state, featureFilters: ', this.state.featureFilters);
      },
    );
  };

  handleHyparamsChange = event => {
    this.setState(
      {
        hyparams: event.target.value,
      },
      () => {
        this.logger('after set state, hyparams: ', this.state.hyparams);
      },
    );
  };

  handleVersioningChange = event => {
    this.setState(
      {
        versioning: event.target.checked,
      },
      () => {
        this.logger('after set state, versioning: ', this.state.versioning);
      },
    );
  };

  handleTargetChange = event => {
    this.setState(
      {
        targetName: event.target.value,
      },
      () => {
        this.logger('after set state, targetName: ', this.state.targetName);
      },
    );
  };

  handleDatalakeSourceChange = event => {
    this.setState(
      {
        datalakeSourceName: event.target.value,
      },
      () => {
        this.logger('after set state, datalakeSourceName: ', this.state.datalakeSourceName);
      },
    );
  };

  handleUCDescriptionChange = event => {
    this.setState(
      {
        ucDescription: event.target.value,
      },
      () => {
        this.logger('after set state, ucDescription: ', this.state.ucDescription);
      },
    );
  };

  handlePipelineVersionChange = event => {
    this.setState(
      {
        plVerName: event.target.value,
      },
      () => {
        this.logger('after set state, plVerName: ', this.state.plVerName);
      },
    );
  };

  handleIsMme = event => {
    this.setState(
      {
        isMme: event.target.checked,
      },
      () => {
        this.logger('after set state, isMme: ', this.state.isMme);
      },
    );
  };

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

  resetFrom = () => {
    this.setState({
      ucName: '',
      plName: '',
      expName: '',
      isMme: false,
      modelName: '',
      featureGroupName: '',
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
    });
  };

  render() {
    return (
      <>
        <Form
          className={this.props.isCreateTrainingJobForm ? 'create-form' : 'edit-form'}
          onSubmit={this.props.isCreateTrainingJobForm ? this.handleCreateSubmit : this.handleEditSubmit}
        >
          <Form.Group controlId='ucName'>
            <Form.Label>Training Job Name*</Form.Label>
            {this.props.isCreateTrainingJobForm ? (
              <Form.Control
                type='input'
                value={this.state.ucName}
                onChange={this.handleUCNameChange}
                placeholder=''
                required
              />
            ) : (
              <Form.Control type='text' placeholder={this.state.ucName} readOnly />
            )}
          </Form.Group>

          <Form.Group controlId='isMme'>
            <Form.Check
              type='checkbox'
              label='Model Management Service'
              checked={this.state.isMme}
              onChange={this.handleIsMme}
            />
          </Form.Group>

          {(() => {
            if (this.state.isMme == false) {
              return (
                <div>
                  <Form.Group controlId='plName'>
                    <Form.Label>Training Function*</Form.Label>
                    <Form.Control as='select' required value={this.state.plName} onChange={this.handlePLNameChange}>
                      <option key='' value='' disabled>
                        {' '}
                        --- Select Training Function ---{' '}
                      </option>
                      {this.state.plList.map(data => (
                        <option key={data.display_name} value={data.display_name}>
                          {data.display_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId='fGName'>
                    <Form.Label>FeatureGroup Name*</Form.Label>
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
                </div>
              );
            } else if (this.state.isMme == true) {
              if (this.props.isCreateTrainingJobForm) {
                return (
                  <Form.Group controlId='modelName'>
                    <Form.Label>Model Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={this.state.modelName}
                      onChange={this.handleModelNameChange}
                      placeholder=''
                      required
                    />
                  </Form.Group>
                );
              } else {
                return <Form.Control type='text' placeholder={this.state.modelName} readOnly />;
              }
            }

            return null;
          })()}

          {this.state.plName !== '' && (
            <div>
              <Form.Group controlId='plVesName'>
                <Form.Label>Training Function Version Name*</Form.Label>
                <Form.Control
                  as='select'
                  required
                  value={this.state.plVerName}
                  onChange={this.handlePipelineVersionChange}
                >
                  <option key='' value='' disabled>
                    {' '}
                    --- Select Training Function Version---{' '}
                  </option>
                  {this.state.plVerList.map(data => {
                    if (data === this.state.plName) {
                      return (
                        <option key={data} value={data}>
                          1
                        </option>
                      );
                    } else {
                      return (
                        <option key={data} value={data}>
                          {data}
                        </option>
                      );
                    }
                  })}
                </Form.Control>
              </Form.Group>
              {/*<Form.Group controlId="plVerDescription">
              <Form.Label>Pipeline Version Description</Form.Label>
              <Form.Control as="textarea" name="plVerDescription" rows={3} value={this.state.plVerDescription} readOnly/>
            </Form.Group>*/}
            </div>
          )}

          {/* <Form.Group controlId="expName">
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
        </Form.Group> */}

          <Form.Group controlId='datalakeSource'>
            <Form.Label>Datalake Source*</Form.Label>

            <Form.Control
              as='select'
              required
              value={this.state.datalakeSourceName}
              onChange={this.handleDatalakeSourceChange}
            >
              <option key='' value='' disabled>
                {' '}
                --- Select Datalake Source ---{' '}
              </option>
              {this.state.datalakeSourceList.map(data => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='ftFilter'>
            <Form.Label>Feature Filter</Form.Label>
            <Form.Control
              type='text'
              value={this.state.featureFilters}
              onChange={this.handleFeatFiltersChange}
              placeholder=''
            />
          </Form.Group>

          <Form.Group controlId='hyparams'>
            <Form.Label>Hyper Parameters</Form.Label>
            <Form.Control type='text' value={this.state.hyparams} onChange={this.handleHyparamsChange} placeholder='' />
          </Form.Group>

          {/* currently don't know difference between id and controlId in Form.group*/}
          <Form.Group id='EnableVersioning'>
            <Form.Check
              type='checkbox'
              label='Enable versioning'
              checked={this.state.versioning}
              onChange={this.handleVersioningChange}
            />
          </Form.Group>

          <Form.Group controlId='ucDescription'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              value={this.state.ucDescription}
              onChange={this.handleUCDescriptionChange}
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
