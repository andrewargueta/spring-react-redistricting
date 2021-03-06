import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Job from './Job.js';


class JobList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs:this.props.jobs!=undefined?this.props.jobs:[]
        };
      }

      
  componentDidUpdate(prevProps){
    // console.log(prevProps.jobs, this.props.jobs);
    if(prevProps.jobs !== this.props.jobs){
      this.setState({          
          jobs: this.props.jobs
      });
    }
  }
    
  render() {
    var jobs =this.state.jobs;
      return (
          <div>
            <ul class="nav flex-column" id="generated-box">
              <h4 id="job-hdr">Generated Jobs</h4>
              <ul class="list-group" id="job-list"></ul>
              {
                jobs!==undefined?jobs.map ( (job) => {
                    return (job);
                }): null
              }
            </ul>
          </div>
        );
    }
}

export default JobList;