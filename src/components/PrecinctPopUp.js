import React from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import Job from './Job.js';


class PrecinctPopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPrecinct:{
              feature:{
                properties:{
                
                }
              }
            }

        };
      }
    componentDidMount(){
        if(this.props.currentPrecinct){
          this.setState({          
              currentPrecinct: this.props.currentPrecinct
          });
        }
      }
    componentDidUpdate(prevProps){
      if(prevProps.currentPrecinct !== this.props.currentPrecinct){
        this.setState({          
            currentPrecinct: this.props.currentPrecinct
        });
      }
    }
    
    render() {
      function commaSeperatedNum(number) {
        if (number)
          return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
          return 0
      } 
      console.log( this.state.currentPrecinct);
        return (
            <>
            {
                this.state.currentPrecinct?
                    <div className="">
                    <ul class="nav flex-column" id="generated-box">
                        <h4 id="job-hdr">Current Precinct</h4>
                          <div class="accordion" id="accordionExample">
                          <div class="card">
                              <div class="header" id={"#headingPrecinct"}>
                                  <button class="btn job-tab btn-collapsed" type="button" data-toggle="collapse" data-target={"#collapsePrecinct"} aria-expanded="true" aria-controls={"collapsePrecinct"}>
                                      <div> Show Info</div>
                                  </button>
                              </div>

                    <div id={"collapsePrecinct"} class="collapse" aria-labelledby={"#headingPrecinct"} data-parent="#accordionExample">
                    <div class="card-body">
                      <div>Name:  {this.state.currentPrecinct.feature?this.state.currentPrecinct.feature.properties.name:"" }</div>
                      <div>Total Population:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.totPop):0}</div>
                      <div>Total VAP:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.totVap):0}</div>
                      <div>Total Asian American Population:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.asianTotal):0}</div>
                      <div>Total Asian American VAP:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.asianVap):0}</div>
                      <div>Total Black Population:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.blackTotal):0}</div>
                      <div>Total Black VAP:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.blackVap):0}</div>
                      <div>Total Hispanic Population:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.hispTotal):0}</div>
                      <div>Total Hispanic VAP:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.hispVap):0}</div>
                      <div>Total American Indian/ Alaskan Native Population:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.aianTotal):0}</div>
                      <div>Total American Indian/ Alaskan Native VAP:  {this.state.currentPrecinct.feature?commaSeperatedNum(this.state.currentPrecinct.feature.properties.aianVap):0}</div>
                    </div>
                    </div>
                </div>
            </div>
                    </ul>
                    </div>
                :
                <div></div>
            }
            </>
        );

    }
}

export default PrecinctPopUp;