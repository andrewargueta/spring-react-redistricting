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
          minorityGroups: {},
          compactness: "",
          populationVariation: 0,
          showCreateJob: true,
          jobs:[],
          childData:{},
          showJobs: false,
          showForm:true
        };
        this.handleChange = this.handleChange.bind(this);
        this.addJob = this.addJob.bind(this);
        this.deleteJob = this.deleteJob.bind(this);
      }
      componentDidMount(){
        document.getElementById('home').classList.add('active');
        document.getElementById('home').classList.add('show');
        document.getElementById("global-summary").style.display="none";
        axios.get("http://localhost:8080/job/previous-jobs", {
                      headers: {
                          'Content-Type': 'application/json',
                      }
                  }
                ).then( 
                    (response) => { 
                        // console.log(response);
                        var prevJobs = [];
                        for(var i=0; i<response.data.length; i++){
                          prevJobs.push( <Job
                            status="Waiting"
                            state={response.data[i].stateName}
                            deleteJob={this.deleteJob}
                            jobNum={response.data[i].jobId}
                            numOfPlans={response.data[i].numberOfPlans}
                            server= {response.data[i].runLocation}
                            minorityGroups= {response.data[i].minorityGroups}
                            compactness= {response.data[i].compactness}
                            populationVariation= {response.data[i].populationThreshold}
                            status= {response.data[i].status}
                            sendingData = {this.sendingData}
                            />)
                        }
                        this.setState({jobs: prevJobs});
                    }, 
                    (error) => { 
                        console.log(error); 
                    } 
                ); 
      }
      componentDidUpdate(prevProps, prevState){
        //fix the bug when switching from plot to map
        if(this.state.showJobs){
          document.getElementById('home').classList.remove('active');
          document.getElementById('home').classList.remove('show');
          document.getElementById('global-summary').classList.add('active');
          document.getElementById('global-summary').classList.add('show');
        }
         
      }
      checkInput(plans, minority, compactness, population_variation) {
        if (Number.isInteger(Number(plans)) && plans > 0) {
            if (minority.length != 0) {
              return true;
            }
        }
        return false;
      }


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
        if(this.checkInput(this.state.numOfPlans, this.state.minorityGroups,this.state.compactness, this.state.populationVariation)){
            const userInputs = { 
                'state' : this.props.state,
                'numOfPlans': this.state.numOfPlans,
                'minorityGroups': this.state.minorityGroups,
                'compactness': this.state.compactness,
                'populationVariation': this.state.populationVariation,
            };
            this.refs["error-msg"].innerHTML = "";
            // console.log(this.state.jobs);
            this.refs["success-msg"].innerHTML = "Job "+(this.state.jobs.length?parseInt(this.state.jobs.slice(-1)[0].props.jobNum) + 1:1) +" successfully being created";
            axios.post("http://localhost:8080/job/run-job", userInputs, {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
            ).then( 
                (response) => { 
                    console.log(response);
                    
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
            server= {job.runLocation}
            minorityGroups= {this.state.minorityGroups}
            compactness= {this.state.compactness}
            populationVariation= {this.state.populationVariation}
            sendingData = {this.sendingData}
            />]
        });
      }    
    showJobs= () => {
      this.setState({
        showJobs: true,
        showForm: false 
      });
      axios.get("http://localhost:8080/job/allJobs", {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
            ).then( 
                (response) => { 
                    // console.log(response);
                    // var result = response.data; 
                    // console.log(response);
                    var result = response.data; 
                    var jobs = [];
                    for(var i=0; i<result.length; i++){
                         jobs.push(<Job
                          status={result[i].status}
                          state={result[i].stateName}
                          deleteJob={this.deleteJob}
                          jobNum={result[i].jobId}
                          numOfPlans={result[i].numberOfPlans}
                          server= {result[i].runLocation}
                          minorityGroups= {result[i].minorityGroups}
                          compactness= {result[i].compactness}
                          populationVariation= {result[i].populationThreshold}
                          sendingData = {this.sendingData}
                          />
                          )
                        }    
                    this.setState({jobs: jobs});
                    
                   
                }, 
                (error) => { 
                    console.log(error); 
                } 
            ); 
    }
  
    showForm= () => {
      this.setState({
        showJobs: false,
        showForm: true 
      });
    }
  render() {
    return (
      <>
      {
        
        <div className="col-4"  id="job-div">
          <ul className="nav nav-tabs" id = "jobTabs">
            <li id = '3' className=""><a data-toggle="tab" href="#home" onClick={this.showForm} >Create Job</a></li>
            <li id = '4'> <a data-toggle="tab" href="#global-summary" onClick={this.showJobs} >Global History</a></li>
          </ul>
          <div className="tab-content">
            <div id="home" className="tab-pane fade in">
              <ul className="nav flex-column" id="boxed-form">
                <h4 id = "job-hdr"> Create Job</h4>
                  <form id="job-form">
                    <div className = "form-group">
                      <div className = "form-row">
                        <div className = "form-group col-md-6 mb-2">
                          <label htmlFor = "plans">Number of Plans</label>
                          <input type="number" name="numOfPlans" className="form-control" id="num-plans" placeholder="Enter Num. of Plans" min="1"  onChange={this.handleChange} required />
                        </div>
                        <div className = "form-group col-md-6 mb-2">
                        <label htmlFor="compactness">Compactness Limit</label> 
                          <select id="input-compact" name="compactness" className="form-control"   onChange={this.handleChange}  required>
                            <option disabled selected value = "">Select Compactness</option>
                            <option>Somewhat Compact </option>
                            <option>Compact</option>
                            <option>Very Compact</option>
                          </select>
                      <br />
                        </div>
                      </div>  
                      <label htmlFor = "minorityGroups">Minority Group</label> <br />
                      <select id="input-min" name="minorityGroups" className="select-picker" onChange={this.handleChange}  multiple required>
                        <option disabled selected value = "">Select Minority Group(s)</option>
                        <option value = "black">African-Americans</option>
                        <option value = "asian">Asian Americans</option>
                        <option value = "hisp">Hispanics</option>
                        <option value = "aian">Native Americans </option>
                      </select>
                      <br />
                      <label htmlFor = "populationVariation">Population Variation</label>
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
                <>
                
                {
                  this.props.currentPrecinct?
                  
                  <PrecinctPopUp currentPrecinct={this.props.currentPrecinct}/>
                  :
                  <div></div>
                }
                        
                </>
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