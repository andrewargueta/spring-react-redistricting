import React from 'react';
import axios from 'axios';
import JobList from './JobList.js';
import Job from './Job.js';
import PrecinctPopUp from './PrecinctPopUp.js'

import { isIfStatement } from '@babel/types';


class UserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          numOfPlans: 0,
          server: "",
          minorityGroup: {},
          compactnesss: "",
          populationVariation: 0,
          showCreateJob: true,
          jobs:[],
          childData:{}
        };
        this.handleChange = this.handleChange.bind(this);
        this.addJob = this.addJob.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
      }
      componentDidMount(){
        document.getElementById("global-summary").style.display="none";
      }
      componentDidUpdate(){
        //fix the bug when switching from plot to map
         
      }
      checkInput(plans, server, minority, compactness, population_variation) {
        console.log(typeof(plans), server, minority, compactness, population_variation);
        if (Number.isInteger(Number(plans)) && plans > 0) {
          if (server.length != 0) {
            if (minority.length != 0) {
              return true;
            }
          }
        }
        return false;
      }

      // const compactness = {
      //   COMPACT : ""
      // }

    handleChange(e) {
        const target = e.target;
        const value = target.type === 'select-multiple' ? Array.from(target.selectedOptions, option => option.value) : target.value;
        const name = target.name;
        if(name == "populationVariation"){
            document.getElementById('valueSpan2').innerHTML=value; 
        }
        this.setState({
            [name]: value
        });
        this.refs["error-msg"].innerHTML = "";
        this.refs["success-msg"].innerHTML = "";
    }

    handleSubmit(e){
        //add job input to job list
        if(this.checkInput(this.state.numOfPlans, this.state.server, this.state.minorityGroup,this.state.compactnesss, this.state.populationVariation)){
            const userInputs = { 
                'state' : this.props.state,
                'numOfPlans': this.state.numOfPlans,
                'server': this.state.server,
                'minorityGroups': this.state.minorityGroup,
                'compactness': this.state.compactness,
                'populationVariation': this.state.populationVariation,
            };
            axios.post("http://localhost:8080/job/runJob", userInputs, {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
            ).then( 
                (response) => { 
                    console.log(response);
                    var result = response.data; 
                    this.addJob(result);
                    this.refs["error-msg"].innerHTML = "";
                    this.refs["success-msg"].innerHTML = "Job "+result.jobId +" successfully being created";
                    console.log("spring :" + result.jobId); 
                }, 
                (error) => { 
                    console.log(error); 
                } 
            ); 
        }
        else{
          this.refs["error-msg"].innerHTML = "Make sure all inputs are valid";
          this.refs["success-msg"].innerHTML = "";
        }

    }
    handleCallback = (childData) =>{
        this.setState({childData: childData});
    }
    sendingData = (data) => {
        this.props.parentCallBack(data);  
    }

   
    deleteJob(job){
      //console.log(id);
      this.setState({
        jobs: this.state.jobs.filter(function(el) { 
          if(el.props != job.props)
            return el; 
        }),
      
      });
    }
    addJob(job){
        this.setState({
          jobs: [...this.state.jobs, <Job
            status="Waiting"
            state={this.props.state}
            deleteJob={this.deleteJob}
            jobNum={job.jobId}
            numOfPlans={this.state.numOfPlans}
            server= {this.state.server}
            minorityGroup= {this.state.minorityGroup}
            compactnesss= {this.state.compactness}
            populationVariation= {this.state.populationVariation}
            sendingData = {this.sendingData}
            />]
        });
      }    
   
  render() {
    return (
      <>
      {
        
        <div className="col-4"  id="job-div">
          <ul className="nav nav-tabs" id = "jobTabs">
            <li id = '3' className="active"><a data-toggle="tab" href="#home" >Create Job</a></li>
            <li id = '4'> <a data-toggle="tab" href="#global-summary" >Global History</a></li>
          </ul>
          <div className="tab-content">
            <div id="home" className="tab-pane fade in active">
              <ul className="nav flex-column" id="boxed-form">
                <h4 id = "job-hdr"> Create Job</h4>
                  <form id="job-form">
                    <div className = "form-group">
                      <div className = "form-row">
                        <div className = "form-group col-md-6 mb-2">
                          <label htmlFor = "plans">Number of Plans</label>
                          <input type="number" name="numOfPlans" className="form-control" id="numPlans" placeholder="Enter Num. of Plans" min="1"  onChange={this.handleChange} required />
                        </div>
                        <div className = "form-group col-md-6 mb-2">
                          <label htmlFor = "server">Server</label>
                          <select id="selectServer" name="server" className="form-control" onChange={this.handleChange} required>
                            <option disabled selected value = "">Select Server</option>
                            <option>Local</option>
                            <option>SeaWulf</option>
                          </select>
                        </div>
                      </div>  
                      <label htmlFor = "minority_group">Minority Group</label> <br />
                      <select id="input-min" name="minorityGroup" className="selectpicker" onChange={this.handleChange}  multiple required>
                        <option disabled selected value = "">Select Minority Group(s)</option>
                        <option value = "African Americans">African-Americans</option>
                        <option value = "Asian Americans">Asian Americans</option>
                        <option value = "Hispanics">Hispanics</option>
                        <option value = "Native Americans">Native Americans</option>
                      </select>
                      <br />
    
                      <label htmlFor="compactness">Compactness Limit</label> 
                      <select id="inputCompact" name="compactness" className="form-control"   onChange={this.handleChange}  required>
                        <option disabled selected value = "">Select Compactness</option>
                        <option>Somewhat Compact </option>
                        <option>Compact</option>
                        <option>Very Compact</option>
                      </select>
                      <br />
    
                      <label htmlFor = "population_variation">Population Variation</label>
                      <div className="d-flex justify-content-center my-4">
                        <span className="font-weight-bold indigo-text mr-2 mt-1">0</span>
                        <input 
                        type="range" name="populationVariation" className="form-control" id="inputPop" min = {0} max = {1} step ={0.01} onChange={this.handleChange}  required />
                        <span className="font-weight-bold indigo-text ml-2 mt-1">1</span>
                        <span className="font-weight-bold text-primary ml-2" id="valueSpan2">0</span>
                      </div>
                      <div ref="error-msg" id="error-msg"></div>
                      <div ref="success-msg" id="success-msg"></div>
                      <div id="submit-btn">
                        <button type = "button" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button>
                      </div>
                    </div>
                  </form>
                </ul>
                <PrecinctPopUp currentPrecinct={this.props.currentPrecinct}/>
            </div>
            <div id="global-summary">
              <JobList jobs={this.state.jobs} />
            </div>
            </div>
            </div>        
      }
          </>
    );
  }
}

export default UserForm;