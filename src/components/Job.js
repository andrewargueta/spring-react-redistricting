import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

class Job extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            state:this.props.state,
            numOfPlans: this.props.numOfPlans,
            server: this.props.server,
            minorityGroup: this.props.minorityGroup,
            compactness: this.props.compactness,
            populationVariation: this.props.populationVariation,
            jobNum: this.props.jobNum,
            status: this.props.status
          };
      this.deleteJob = this.deleteJob.bind(this);
      this.clickJob = this.clickJob.bind(this);
      this.cancelJob = this.cancelJob.bind(this);
      }
    
    sendingData = (event) => {
        this.props.sendingData(this);
        event.preventDefault();
    }

    clickJob(e){
      if(! e.target.classList.contains("collapsed")){return;}
      document.getElementById("job-btn").classList.remove('disabled');
      document.getElementById("2").style.display="block";
      this.sendingData(e);
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID;
      axios.get(url).then( 
        (response) => { 
            var result = response.data; 
            console.log("Clicked JobID :" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
    }
    deleteJob(e){
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("job-btn").classList.add('disabled');
      document.getElementById("job-tab").classList.add('disabled');
      document.getElementById("2").style.display="none";
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID + '/delete';
      axios.delete(url).then( 
        (response) => { 
            var result = response.data; 
            console.log("Successfully deleted JobID :" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
      this.props.deleteJob(this);
    }
    cancelJob(e){
      e.preventDefault();
      e.stopPropagation();
      document.getElementById("job-btn").classList.add('disabled');
      document.getElementById("2").style.display="none";
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID + '/cancel';
      axios.delete(url).then( 
        (response) => { 
            var result = response.data; 
            console.log("Successfully cancelled JobID :" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
      this.props.deleteJob(this);
    }
    render() {
        return (
            <div class="accordion" id="accordionExample">
                <div class="card" onClick={this.clickJob}>
                    <div class="header" id={"#heading"+this.props.jobNum}>
                        <button class="btn job-tab collapsed" type="button" data-toggle="collapse" data-target={"#collapse"+this.props.jobNum} aria-expanded="true" 
                        aria-controls={"collapse"+this.props.jobNum}>
                            Job Id: {this.props.jobNum} State: {this.props.state} Plans: {this.props.numOfPlans} Status:  {this.props.status}
                            {
                              this.props.status!="Completed"?
                              <button className="" id="del-btn" onClick={this.cancelJob}>Cancel</button>
                              :
                              <button className="glyphicon glyphicon-trash" id="del-btn" onClick={this.deleteJob}></button>
                            }
                            
                            
                        </button>
                    </div>

                    <div id={"collapse"+this.props.jobNum} class="collapse" aria-labelledby={"#heading"+this.props.jobNum} data-parent="#accordionExample">
                    <div class="card-body">
                      <div>Compactness:  {this.props.compactness}</div>
                      <div>Minority Groups:  {this.props.minorityGroup}</div>
                      <div>Population Variation:  {this.props.populationVariation}</div>
                      <div>Server:  {this.props.server}</div>
                      <div>Status:  {this.props.status}</div>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Job;