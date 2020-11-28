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
                      <div>Name:  {this.state.currentPrecinct.feature.properties.name}</div>
                      <div>Total Population:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.totPop)}</div>
                      <div>Total VAP:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.totVap)}</div>
                      <div>Total Asian American Population:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.asianTotal)}</div>
                      <div>Total Asian American VAP:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.asianVap)}</div>
                      <div>Total Black Population:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.blackTotal)}</div>
                      <div>Total Black VAP:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.blackVap)}</div>
                      <div>Total Hispanic Population:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.hispTotal)}</div>
                      <div>Total Hispanic VAP:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.hispVap)}</div>
                      <div>Total American Indian/ Alaskan Native Population:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.aianTotal)}</div>
                      <div>Total American Indian/ Alaskan Native VAP:  {commaSeperatedNum(this.state.currentPrecinct.feature.properties.aianVap)}</div>
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