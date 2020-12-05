
import React, { Component } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { oneLine } from "common-tags";



import UserForm  from './UserForm.js';

import 'leaflet/dist/leaflet.css';

import baseLayer from '../geojson/states.json';

import texasState from '../geojson/texas-state.json';
import alabamaStateLayer from '../geojson/alabama-state.json';
import mississippiState from '../geojson/mississippi-state.json';

import mississippiPrecinct from '../geojson/mississippi.json'


import BoxWhisker from './BoxWhisker.js';
//import PrecinctPopUp from './PrecinctPopUp.js'

let config = {};

config.params = {
  center: [37.8, -96],
  minZoom: 4,
  zoom: 4,
  scrollwheel: false,
  legends: true,
  infoControl: false,
  attributionControl: true
};

config.tileLayer = {
  url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',

};
var dissolve = require('geojson-dissolve');
var mapshaper = require('mapshaper');
var turf = require('@turf/turf');

var districtLayer="", precinctLayer="";
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      tileLayer: null,
      geojsonLayer: null,
      baseLayer: null,
      currentState: null,
      currentStateLayer:null,
      currentDistrictLayer: null,
      currentPrecinctLayer: null,
      showDistrictLayer: true,
      showPrecinctLayer: true,
      showPlot: false,
      showMap: true,
      currentJob:{},
      currentPrecinct:{},
      plotData:{},
      districtingData:{}
    };
    this._mapNode = null;
    this.handleDistrictView = this.handleDistrictView.bind(this);
    this.handlePrecinctView = this.handlePrecinctView.bind(this);
    this.showMap = this.showMap.bind(this);
    this.showPlot = this.showPlot.bind(this);
    this.handleHeatMapView = this.handleHeatMapView.bind(this);
  }
 
  componentDidMount() {
    this.setState({baseLayer});
    // create the Leaflet map 
    if (!this.state.map) this.init(this._mapNode);
    //hide plot tab so user cannot click it
    document.getElementById("2").style.display="none";
    document.getElementById('menu1').style.display="none";
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.baseLayer && this.state.map && !this.state.geojsonLayer) {
      this.addBaseLayer(this.state.baseLayer);
    }
  }

  //initalize the map node
  init(id) {
    if (this.state.map) return;
    let map = L.map(id, config.params);
    map.setMaxBounds(map.getBounds());
    const tileLayer = L.tileLayer(config.tileLayer.url, {}).addTo(map);
    this.setState({ map, tileLayer });
  }
  generatePrecinctLayer(response){
    var geojsonResponse = "{\"type\":\"FeatureCollection\", \"features\": [";
    for (var i = 0; i < response.data.precincts.length; i++) {
      var prefix = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[';
      var listOfCoords=[];
      var pairOfCoords=[];
      var currentPrecinct = response.data.precincts[i];
      var currPrecinctCoords = currentPrecinct.coordinates.split(',').map(Number);
      for (var j = 0; j < currPrecinctCoords.length; j++) {
        pairOfCoords.push(currPrecinctCoords[j])
        if(pairOfCoords.length == 2){
          listOfCoords.push(pairOfCoords);
          pairOfCoords=[];
        } 
      }
      prefix += JSON.stringify(listOfCoords) +']},"properties":{'+
        '"aianTotal":'+currentPrecinct.aianTotal+','+
        '"aianVap":'+currentPrecinct.aianVap+','+
        '"asianTotal":'+currentPrecinct.asianTotal+','+
        '"asianVap":'+currentPrecinct.asianVap+','+
        '"blackTotal":'+currentPrecinct.blackTotal+','+
        '"blackVap":'+currentPrecinct.blackVap+','+
        '"hispTotal":'+currentPrecinct.hispTotal+','+
        '"hispVap":'+currentPrecinct.hispVap+','+
        '"totPop":'+currentPrecinct.totPop+','+
        '"name":'+ '"' + currentPrecinct.name+ '"'+','+
        '"totVap":'+currentPrecinct.totVap+
        '},"id":'+i+'},';
      geojsonResponse += prefix;
    }
    geojsonResponse = geojsonResponse.slice(0,-1);
    geojsonResponse += "]}";
    

    return geojsonResponse;
  }
  generateDistrictLayer(response){
    var geojsonResponse = "{\"type\":\"FeatureCollection\", \"features\": [";
    for (var i = 0; i < response.data.districts.length; i++) {
      var prefix = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[';
      var listOfCoords=[];
      var pairOfCoords=[];
      var currentDistrict = response.data.districts[i];
      var currDistrCoords = currentDistrict.coordinates.split(',').map(Number);
      for (var j = 0; j < currDistrCoords.length; j++) {
        pairOfCoords.push(currDistrCoords[j])
        if(pairOfCoords.length == 2){
          listOfCoords.push(pairOfCoords);
          pairOfCoords=[];
        } 
      }
      prefix += JSON.stringify(listOfCoords) +']},"properties":{"districtNum":'+currentDistrict.districtNum+'},"id":'+currentDistrict.districtNum+'},';
      geojsonResponse += prefix;
    }
    geojsonResponse = geojsonResponse.slice(0,-1);
    geojsonResponse += "]}";

    return geojsonResponse;
  }
  generatePlanDistrictingLayer(state,response){
    //districtings 
    var precincts={};
    if(state=="Mississippi"){
      precincts=mississippiPrecinct;  
    }  
    for(var i = 0; i<response.length; i++){
      var geojsonResponse = "{\"type\":\"FeatureCollection\", \"features\": [";
      var districtingPrecincts=[];
      var precinctIds= response[i]['precicntIds'].split(' ');
      for(var j =0; j<precinctIds.length-1;j++){
        var correspondingPrecinct = precincts.filter(obj => obj.geoId === precinctIds[j]);
        districtingPrecincts.push(correspondingPrecinct);
      }
      for(j =0; j<districtingPrecincts.length;j++){
        var prefix = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[';
        var listOfCoords=[];
        var pairOfCoords=[];
        var currentPrecinct = districtingPrecincts[j][0];
        var currPrecinctCoords = currentPrecinct.coordinates.split(',').map(Number);
        for (var k = 0; k < currPrecinctCoords.length; k++) {
          pairOfCoords.push(currPrecinctCoords[k])
          if(pairOfCoords.length == 2){
            listOfCoords.push(pairOfCoords);
            pairOfCoords=[];
        } 
      }
      prefix += JSON.stringify(listOfCoords) +']},"properties":{}},';
      geojsonResponse += prefix;
    }
    geojsonResponse = geojsonResponse.slice(0,-1);
    geojsonResponse += "]}";
    var json = JSON.parse(geojsonResponse);
    // var dissolved =  turf.dissolve(json);
    // console.log(dissolved);
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    var geojsonLayer = L.geoJson(dissolve(json), {
      onEachFeature: function(feature, layer){  
        layer.setStyle({"color": "#" + randomColor});
      }
    });
    geojsonLayer.addTo(this.state.map)
  }
    // console.log(precinctLayer); 
  }
  handleHeatMapView(demographic){
    if(!this.state.currentState ) return;
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    var geojsonLayer={}, precinct={}, stateAverages={} ;
    precinct=JSON.parse(precinctLayer);
    var statePopulations = this.state.currentStateLayer.features[0].properties;
    stateAverages={"asian":(statePopulations.ASIANTOTAL/statePopulations.TOTPOP), 
                  "black":(statePopulations.BLKTOTAL/statePopulations.TOTPOP), 
                  "hispanic":(statePopulations.HISPTOTAL/statePopulations.TOTPOP),
                  "native":(statePopulations.AIANTOTAL/statePopulations.TOTPOP)};
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    var minorityGroup = "";
    var demographicStateAverage=stateAverages[demographic];
    if(demographic=="black"){
      minorityGroup = "blackTotal";
    }
    if(demographic=="asian"){
      minorityGroup = "asianTotal"
    }
    if(demographic=="hispanic"){
      minorityGroup = "hispTotal"
    }
    if(demographic=="native"){
      minorityGroup = "aianTotal"
    }
    this.setState({geojson: precinct});
      geojsonLayer = L.geoJson(precinct, {
        onEachFeature: function(feature, layer){  
          var demographicPopulation=feature.properties[minorityGroup];
          var totalPopulation=feature.properties.totPop;
          if((demographicPopulation/totalPopulation) > (demographicStateAverage *.95) && (demographicPopulation/totalPopulation) <= (demographicStateAverage *1.05))
            layer.setStyle({"color": "#ff9e81"});
          else if((demographicPopulation/totalPopulation) >= (demographicStateAverage *1.05) && (demographicPopulation/totalPopulation) < (demographicStateAverage *1.15))
            layer.setStyle({"color": "#ff8464"});
          else if((demographicPopulation/totalPopulation) >= (demographicStateAverage *1.15) && (demographicPopulation/totalPopulation) < (demographicStateAverage *1.30))
            layer.setStyle({"color": "#ff6846"});
          else if((demographicPopulation/totalPopulation) >= (demographicStateAverage *1.30) && (demographicPopulation/totalPopulation) < (demographicStateAverage *1.45))
            layer.setStyle({"color": "#ff4628"});
          else if((demographicPopulation/totalPopulation) >= (demographicStateAverage *1.45))
            layer.setStyle({"color": "#ff0000"});
          else if((demographicPopulation/totalPopulation) > (demographicStateAverage *.80) && (demographicPopulation/totalPopulation) <= (demographicStateAverage *.95))
            layer.setStyle({"color": "#ffb7a0"});
          else if((demographicPopulation/totalPopulation) > (demographicStateAverage *.65) && (demographicPopulation/totalPopulation) <= (demographicStateAverage *.80))
            layer.setStyle({"color": "#ffcfbf"});
          else if((demographicPopulation/totalPopulation) > (demographicStateAverage *.5) && (demographicPopulation/totalPopulation) <= (demographicStateAverage *.65))
            layer.setStyle({"color": "#ffe7de"});
          else if((demographicPopulation/totalPopulation) <= (demographicStateAverage *.5))
            layer.setStyle({"color": "white"});
          else
            layer.setStyle({"color": "green"});
      }
    });
    geojsonLayer.addTo(this.state.map);
  }

  handleStateView(stateName){
    //handles styling to make room for user form
    var mapDiv = document.getElementById('map-div');
    mapDiv.classList.add("col-8");
    var leafletMap = document.getElementById('map');
    leafletMap.style.width = "95%";
    //sets states and bounds
    var geojson = {}, northEast ={} ,southWest={},bounds={};
    this.setState({currentState: stateName});
    if(stateName=="Alabama"){
      northEast = L.latLng(35.875037325904316,-73.72722985856066);
      southWest = L.latLng(29.424411702754066, -92.06341149918566);
      bounds = L.latLngBounds(northEast, southWest);
      geojson=alabamaStateLayer; 
    }
    if(stateName=="Texas"){
      northEast = L.latLng( 37.85750715625203,  -82.77118435813476);
      southWest = L.latLng( 24.80668135385199, -105.11737576438475);
      bounds = L.latLngBounds(northEast, southWest);
      geojson=texasState; 
    }
    if(stateName=="Mississippi"){
      northEast = L.latLng(35.88014896488361, -80.87039007077917);
      southWest = L.latLng(29.430029404571762, -92.04348577390417);
      bounds = L.latLngBounds(northEast, southWest);
      geojson=mississippiState; 
    }
    this.state.map.fitBounds(bounds);
    this.state.map.setMaxBounds(bounds);
    this.setState({geojson: geojson,
    currentDistrictLayer: null,
    currentPrecinctLayer: null,
    currentStateLayer: geojson,
    currentPrecinct: null,
    showDistrictLayer: true,
    showPrecinctLayer: true,
    state: stateName});
    //adds layer to map
    this.addGeoJSONLayer(geojson);
    
    //sends post to axios
    axios.post('http://localhost:8080/state/set-state', { name: stateName }, {
    headers: {
        'Content-Type': 'application/json',
    }}).then( 
        (response) => { 
            districtLayer = this.generateDistrictLayer(response);
            precinctLayer = this.generatePrecinctLayer(response);
            //console.log("spring :" + JSON.stringify(response.data)); 
        }, 
        (error) => { 
            console.log(error); 
        } 
    ); 
  }

  handleDistrictView(){
    if(!this.state.currentState ) return;
    this.setState({ showDistrictLayer: !this.state.showDistrictLayer});
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    var geojsonLayer={}, stateDistrictsLayer={};
    stateDistrictsLayer=JSON.parse(districtLayer);
    this.setState({geojson: stateDistrictsLayer});
    geojsonLayer = L.geoJson(stateDistrictsLayer, {
      onEachFeature: function(feature, layer){  
        layer.setStyle({"color": "#E0C568FF"});
      }
    });
    if(this.state.currentPrecinctLayer)
      this.state.currentPrecinctLayer.addTo(this.state.map)
    if(this.state.showDistrictLayer){
      geojsonLayer.addTo(this.state.map);
      this.setState({ geojsonLayer });
      this.setState({currentDistrictLayer: geojsonLayer});
    }
    else{
      this.setState({currentDistrictLayer: null});
    }
    
  }

  handlePrecinctView(){
    if(!this.state.currentState ) return;
    this.setState({ showPrecinctLayer: !this.state.showPrecinctLayer});
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
          map.removeLayer(layer);
      }
    });
    var geojsonLayer ={}, statePrecinct={};
    statePrecinct=JSON.parse(precinctLayer);
    this.setState({geojson: statePrecinct});
    var prevPrecinct=null;
    geojsonLayer = L.geoJson(statePrecinct, {
      onEachFeature: (feature, layer)=>{  
        layer.setStyle({"color": "#D198C5FF"});
        layer.on('click', e=>{
          this.setState({ currentPrecinct: layer});
          if (prevPrecinct !== null) {
                prevPrecinct.setStyle({"color":"#D198C5FF"});
          }
          layer.setStyle({"color":"white"});
          prevPrecinct=layer;

        });
      }
    });
    if(this.state.currentDistrictLayer)
        this.state.currentDistrictLayer.addTo(this.state.map)
    if(this.state.showPrecinctLayer){
      geojsonLayer.addTo(this.state.map);
      this.setState({ geojsonLayer });
      this.setState({currentPrecinctLayer: geojsonLayer});
    }
    else{
      this.setState({currentPrecinctLayer: null});
    }
  }

  handleCallback = (data) =>{
    if(data[0]=="plot")
      this.setState({plotData: data[1]});
    else{
      this.setState({districtingData: data[1]});
      this.generatePlanDistrictingLayer(data[0],data[1]);
    }
  }

  addGeoJSONLayer(geojson) {
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature: function(feature, layer){  
        layer.setStyle({"color": "white"});
      }
    });
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
          map.removeLayer(layer);
      }
    });
    geojsonLayer.addTo(this.state.map);
    this.setState({ geojsonLayer });
    
  }

  addBaseLayer(geojson) {
    const geojsonLayer = L.geoJson(geojson, {
      onEachFeature:(feature, layer)=>{ 
        layer.setStyle({"color": "white"});
        layer.on({
          mouseover: () => layer.setStyle({"color": "orange"}),
          mouseout: () => layer.setStyle({"color": "white"})
        });
        layer.on('click', e=>{
          var stateName = e.target.feature.properties.name;
          this.handleStateView(stateName);  
          });
        }
    });
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
          map.removeLayer(layer);
      }
    });
    geojsonLayer.addTo(this.state.map);
    this.setState({ geojsonLayer });
  }

  showPlot(){
    this.setState({
      showPlot: true,
      showMap: false 
    });
    document.getElementById('map').style.display="none";
    document.getElementById('menu1').style.display="block";
  }

  showMap(){
    this.setState({
      showPlot: false,
      showMap: true 
    });
    document.getElementById('map').style.display="block";
    document.getElementById('menu1').style.display="none";
  }

  render() {
    return (
      <>
      {
        this.state.currentState?
        <UserForm state={this.state.currentState} parentCallBack={this.handleCallback} currentPrecinct={this.state.currentPrecinct} previousJobs={this.props.previousJobs}
        />
        :
        <div></div>
      }
      {
      <div className="" id="map-div">
        <ul class="nav nav-tabs" id = "myTab">
              <li id = '1' class="active"><a data-toggle="tab" href="#home" onClick={this.showMap}>Map</a></li>
              <li id = '2'><a data-toggle="tab" href="#menu1"  onClick={this.showPlot} >Plot</a></li>
        </ul>    
      <div class="tab-content">
        <div id="home" class="tab-pane fade in active" >
          <div ref={(node) => this._mapNode = node} id="map">
            <div id = "map-tabs" class="btn-group">
              <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Choose State
                </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onClick={()=> this.handleStateView('Alabama')}>Alabama</a>
                    <a class="dropdown-item" onClick={()=> this.handleStateView('Mississippi')}>Mississippi</a>
                    <a class="dropdown-item" onClick={()=> this.handleStateView('Texas')}>Texas</a>
                  </div>
              </div>
              <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  State Layers
                </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onClick={this.handleDistrictView}>Districts</a>
                    <a class="dropdown-item" onClick={this.handlePrecinctView}>Precincts</a>
                  </div>
              </div>
              <div class="dropdown">
                <button class="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Demographic Map
                </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" onClick={()=> this.handleHeatMapView('black')}>African American</a>
                    <a class="dropdown-item" onClick={()=> this.handleHeatMapView('asian')}>Asian American</a>
                    <a class="dropdown-item" onClick={()=> this.handleHeatMapView('hispanic')}>Hispanic</a>
                    <a class="dropdown-item" onClick={()=> this.handleHeatMapView('native')}>Native/Alaskan American</a>
                  </div>
                </div>
              </div>
            </div> 
            <div id="menu1" class="tab-pane fade">
                  <div id="plot"><BoxWhisker plotData={this.state.plotData} /></div>
            </div> 
          </div>     
        </div> 
      </div>
      }
      </>
    );
  }
  }

export default Map;