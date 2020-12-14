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
            minorityGroups: this.props.minorityGroups,
            compactness: this.props.compactness,
            populationVariation: this.props.populationVariation,
            jobNum: this.props.jobNum,
            status: this.props.status
          };
      this.deleteJob = this.deleteJob.bind(this);
      this.clickJob = this.clickJob.bind(this);
      this.cancelJob = this.cancelJob.bind(this);
      }
    
    sendingData = (data) => {
        this.props.sendingData(data);
        //event.preventDefault();
    }
    
  requestDistrcting(plan){
      var jobID = this.props.jobNum;
      var url ="";
      if(plan =="Average"){   
        url = 'http://localhost:8080/job/' + jobID + '/averageDistricting';;
      }
      else if(plan =="Minimum"){
        url = 'http://localhost:8080/job/' + jobID + '/minDistricting';;
      }
      else if(plan =="Maximum"){
        url = 'http://localhost:8080/job/' + jobID + '/maxDistricting';;
      }
      else{
        url = 'http://localhost:8080/job/' + jobID + '/randomDistricting';;
      }
      axios.get(url).then( 
        (response) => { 
            var result = response.data; 
            // console.log(response)
            this.sendingData([this.state.state,response.data]);
            // console.log("Average Districting was clicked:" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
    }

    clickJob(e){
      if(! e.target.classList.contains("collapsed")){
        //document.getElementById("card"+this.props.jobNum).classList.remove('highlighted');
        return;
      }
      document.getElementById("2").style.display="block";
      // this.sendingData(e);
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID;
      axios.get(url).then( 
        (response) => { 
            var result = response.data; 
            this.sendingData(["plot",response.data]);
            // console.log("Clicked JobID :" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
    }
    deleteJob(e){
      // e.preventDefault();
      // e.stopPropagation();
      //document.getElementById("job-btn").classList.add('disabled');
      document.getElementById("2").style.display="none";
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID + '/delete';
      axios.delete(url).then( 
        (response) => { 
            var result = response.data; 
            // console.log("Successfully deleted JobID :" + result);
        }, 
        (error) => { 
            console.log(error); 
        } 
      );
      this.props.deleteJob(this);
    }
    cancelJob(e){
      // e.preventDefault();
      // e.stopPropagation();
      // document.getElementById("job-btn").classList.add('disabled');
      document.getElementById("2").style.display="none";
      var jobID = this.props.jobNum;
      const url = 'http://localhost:8080/job/' + jobID + '/cancel';
      axios.delete(url).then( 
        (response) => { 
            var result = response.data; 
            // console.log("Successfully cancelled JobID :" + result);
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
                <div className="card" id={"card"+this.props.jobNum} onClick={this.clickJob}>
                    <div class="header" id={"#heading"+this.props.jobNum}>
                        <button class="btn job-tab collapsed" type="button" data-toggle="collapse" data-target={"#collapse"+this.props.jobNum} aria-expanded="true" 
                        aria-controls={"collapse"+this.props.jobNum}>
                            Job Id: {this.props.jobNum} State: {this.props.state} Plans: {this.props.numOfPlans} Status:  {this.props.status}
                            {
                              this.props.status!=="Completed"?
                              <>
                              <button className="" id="del-btn" data-toggle="modal" data-target={"#modal"+this.props.jobNum} >Cancel</button>
                              <div class="modal fade"  data-backdrop="false" id={"modal"+this.props.jobNum} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>This action cannot be undone. <br></br>Click confirm to cancel Job {this.props.jobNum}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" onClick={this.cancelJob} >Cancel Job</button>
      </div>
    </div>
  </div>
</div>
</>
                              :
                              <>
                              <button className=" glyphicon glyphicon-trash" id="del-btn"  data-toggle="modal" data-target={"#modal"+this.props.jobNum}></button>
                            

<div class="modal fade" id={"modal"+this.props.jobNum} data-backdrop="false" tabindex="-1" role="dialog"  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <p>This action cannot be undone. <br></br>Click confirm to cancel Job {this.props.jobNum}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-danger" onClick={this.deleteJob}>Delete Job</button>
      </div>
    </div>
  </div>
</div>
</>
                            }
                            

                            
                            
                        </button>
                    </div>

                    <div id={"collapse"+this.props.jobNum} class="collapse" aria-labelledby={"#heading"+this.props.jobNum} data-parent="#accordionExample">
                    <div class="card-body row">
                      <div class="col">
                      <div>Compactness:  {this.props.compactness}</div>
                      <div>Minority Groups:  {this.props.minorityGroups}</div>
                      <div>Population Variation:  {this.props.populationVariation}</div>
                      <div>Server:  {this.props.server}</div>
                      <div>Status:  {this.props.status}</div>
                      </div>
                      {
                      this.props.status==="Completed"?
                      <div class="dropdown col">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Districtings
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <a class="dropdown-item" onClick={()=> this.requestDistrcting('Average')}>Average</a>
                          <a class="dropdown-item" onClick={()=> this.requestDistrcting('Minimum')}>Minimum</a>
                          <a class="dropdown-item" onClick={()=> this.requestDistrcting('Maximum')}>Maximum</a>
                          <a class="dropdown-item" onClick={()=> this.requestDistrcting('Random')}>Random</a>
                        </div>
                      </div>:
                      <div></div>
                      }

                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Job;