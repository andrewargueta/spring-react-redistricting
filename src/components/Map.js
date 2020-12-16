
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

import mississippiPrecinct from '../geojson/mississippi-precinct.json'
import alabamaPrecinct from '../geojson/alabama-precinct.json'
import texasPrecinct from '../geojson/texas-precinct.json'


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

var districtLayer="", precinctLayer="", averageDistricting="", minimumDistricting="",maximumDistricting="", randomDistricting="",heatMapLayer="";
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
      showDistrictingLayer: true,
      showPlot: false,
      showMap: true,
      currentJob:{},
      currentPrecinct:{},
      plotData:{},
      districtingData:{},
      layersOnMap:[]
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
    function getColor(d) {
      return d === 'Current Districting'  ? "#E0C568FF" :
             d === 'Precincts'  ? "#D198C5FF" :
             d === 'Average Districting' ? "skyblue" :
             d === 'Min Districting' ? "palegreen" :
             d === 'Max Districting' ? "orange" :
             d === 'Random Districting' ? "darksalmon":
             d === '(45%, 100%]' ? "#ff0000":
             d === '(30%, 45%]' ? "#ff4628":
             d === '(15%, 30%]' ? "#ff6846":
             d === '(5%, 15%]' ? "#ff8464":
             d === '(-5%, 5%]' ? "#ff9e81":
             d === '(-15%, -5%]' ? "#ffb7a0":
             d === '(-30%, -15%]' ? "#ffcfbf":
             d === '(-45%, -30%]' ? "#ffe7de":
             d === '(-100%, -45%]' ? "white":
             "green";
                          
  }
    if (this.state.map) return;
    let map = L.map(id, config.params);
    map.setMaxBounds(map.getBounds());
    const tileLayer = L.tileLayer(config.tileLayer.url, {}).addTo(map);
    this.setState({ map, tileLayer });
    var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Layers Legend</strong>'];
    var categories = ['Current Districting','Precincts','Average Districting','Min Districting','Max Districting','Random Districting'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<div class="circle col" style="background:' + getColor(categories[i]) + '"></div> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);

    var demographic = L.control({position: 'bottomright'});
    demographic.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Heat Map</strong>'];
    var categories = ['(45%, 100%]','(30%, 45%]','(15%, 30%]','(5%, 15%]','(-5%, 5%]', '(-15%, -5%]', '(-30%, -15%]' ,'(-45%, -30%]', '(-100%, -45%]'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<div class="circle col" style="background:' + getColor(categories[i]) + '"></div> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    demographic.addTo(map);
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
    
    this.setState({ showDistrictingLayer: !this.state.showDistrictingLayer});
    var precincts={};
    var districtings=[];
    
    if(state=="Mississippi"){
      precincts=mississippiPrecinct; 
    }  
    if(state=="Alabama"){
      precincts=alabamaPrecinct; 
    }  
    if(state=="Texas"){
      precincts=texasPrecinct; 
    }  
    for(var i = 0; i<response.length; i++){
      var totVap=0,asianVap=0,blackVap=0,hispVap=0,aianVap=0;
      var geojsonResponse = "{\"type\":\"FeatureCollection\", \"features\": [";
      var districtingPrecincts=[];
      var precinctIds= response[i]['precicntIds'].split(' ');
      var fc=[];
      for(var j =0; j<precinctIds.length-1;j++){
        var correspondingPrecinct = precincts.filter(obj => obj.geoId === precinctIds[j]);
        districtingPrecincts.push(correspondingPrecinct);
      }
      for(j =0; j<districtingPrecincts.length;j++){
        var turfPolygon=null;
        var prefix = '{"type":"Feature","geometry":{"type":"Polygon","coordinates":[';
        var listOfCoords=[];
        var pairOfCoords=[];   
        if(districtingPrecincts[j].length===0 ||districtingPrecincts[j][0].coordinates===""){
          continue;
        }
        var currentPrecinct = districtingPrecincts[j][0];
        var currPrecinctCoords = currentPrecinct.coordinates.split(',').map(Number);
        totVap+=currentPrecinct.totVap;
        asianVap+=currentPrecinct.asianVap;
        blackVap+=currentPrecinct.blackVap;
        hispVap+=currentPrecinct.hispVap;
        aianVap+=currentPrecinct.aianVap;
        for (var k = 0; k < currPrecinctCoords.length; k++) {
          pairOfCoords.push(currPrecinctCoords[k])
          if(pairOfCoords.length === 2){
            listOfCoords.push(pairOfCoords);
            pairOfCoords=[];
        } 
      }
      if( JSON.stringify(listOfCoords[0])!==JSON.stringify(listOfCoords[listOfCoords.length-1])){
        
        listOfCoords.push(listOfCoords[0]);
      }
      prefix += JSON.stringify(listOfCoords) +']},"properties":{' +
       
      '}},';
      
      geojsonResponse += prefix;
    }
    
    geojsonResponse = geojsonResponse.slice(0,-1);
    geojsonResponse += "]}";
    
    
    
    var layer = JSON.parse(geojsonResponse);

  
    var geojsonLayer = L.geoJson((dissolve(layer)), {
      onEachFeature: function(feature, layer){  
        layer.setStyle({"color": "palegreen"});
        layer.on('click', e=>{
          layer.openPopup();
        });
      }
    });

    geojsonLayer.eachLayer(function (layer) {
      layer.bindPopup("<b>District #</b>" + (i+1)+
                      "<br /> <b>Total VAP:</b> " + totVap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+
                      "<br /> <b>Asian American VAP:</b> " + asianVap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+
                      "<br /> <b>African American VAP:</b> " + blackVap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+
                      "<br /> <b>Hispanic VAP:</b> " + hispVap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+
                      "<br /> <b>American Indian/Alaskan Native VAP:</b> " + aianVap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      ); 
      });
    districtings.push(geojsonLayer);
  }
  return districtings;


    
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
    if(demographic==="black"){
      minorityGroup = "blackTotal";
    }
    if(demographic==="asian"){
      minorityGroup = "asianTotal"
    }
    if(demographic==="hispanic"){
      minorityGroup = "hispTotal"
    }
    if(demographic==="native"){
      minorityGroup = "aianTotal"
    }
    this.setState({geojson: precinct});
      geojsonLayer = L.geoJson(precinct, {
        weight: 1, 
        onEachFeature: (feature, layer)=>{  
          layer.on('click', e=>{
            this.setState({ currentPrecinct: layer});
          })
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
            layer.setStyle({"color": "white"});
      }
    });
    heatMapLayer = geojsonLayer;
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&& document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(this.state.map);
    if(document.getElementById('districtCheckbox').checked)
      this.state.currentDistrictLayer.addTo(this.state.map);
    geojsonLayer.addTo(this.state.map);
  }

  handleStateView(stateName){
    //handles styling to make room for user form
    var mapDiv = document.getElementById('map-div');
    mapDiv.classList.add("col-8");
    var leafletMap = document.getElementById('map');
    leafletMap.style.width = "95%";
    var filters = document.getElementsByClassName("map-filter");
    for(var i=0; i<filters.length; i++) {
       filters[i].checked = false;
     }   
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
            // districtingLayer = precinctLayer;
            //console.log("spring :" + JSON.stringify(response.data)); 
        }, 
        (error) => { 
            console.log(error); 
        } 
    ); 
  }

  handleDistrictView(){
    this.setState({ showDistrictLayer: !this.state.showDistrictLayer});
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    var filters = document.getElementsByClassName("radio");
    for(var i=0; i<filters.length; i++) {
       filters[i].checked = false;
     }   
    var geojsonLayer={}, stateDistrictsLayer={};
    stateDistrictsLayer=JSON.parse(districtLayer);
    this.setState({geojson: stateDistrictsLayer});
    geojsonLayer = L.geoJson(stateDistrictsLayer, {
      onEachFeature: function(feature, layer){  
        layer.setStyle({"color": "#E0C568FF"});
      }
    });
    // districtGeojson=geojsonLayer;
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&& document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(this.state.map)
    if(document.getElementById('districtCheckbox').checked){
      geojsonLayer.addTo(this.state.map);
      this.setState({ geojsonLayer });
      this.setState({currentDistrictLayer: geojsonLayer});
    }
    else{
      this.setState({currentDistrictLayer: null});
      // districtGeojson=null;
    }
    
  }

  handlePrecinctView(){
    this.setState({ showPrecinctLayer: !this.state.showPrecinctLayer});
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
          map.removeLayer(layer);
      }
    });
    var filters = document.getElementsByClassName("radio");
    for(var i=0; i<filters.length; i++) {
       filters[i].checked = false;
     }   
    var geojsonLayer ={}, statePrecinct={};
    statePrecinct=JSON.parse(precinctLayer);
    this.setState({geojson: statePrecinct});
    var prevPrecinct=null;
    geojsonLayer = L.geoJson(statePrecinct, {
      weight: 1, 
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
    // precinctGeojson=geojsonLayer;
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&& document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(this.state.currentJob.state && this.state.currentJob.state.status === "Completed"&&document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('districtCheckbox').checked)
        this.state.currentDistrictLayer.addTo(this.state.map);
    if(document.getElementById('precinctCheckbox').checked){
      geojsonLayer.addTo(this.state.map);
      this.setState({ geojsonLayer });
      this.setState({currentPrecinctLayer: geojsonLayer});
    }
    else{
      this.setState({currentPrecinctLayer: null});
      // precinctGeojson=null;
    }
    // console.log(this.state, 'precinct');
  }
  handleAverageView=()=>{
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    if(document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('districtCheckbox').checked)
      this.state.currentDistrictLayer.addTo(map)
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(map)
    if(document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
  }
  handleMinimumView=()=>{  
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    if(document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('districtCheckbox').checked)
      this.state.currentDistrictLayer.addTo(map)
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(map)
    if(document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'});
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map);
      }  
    }
  }
  handleMaximumView=()=>{  
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    if(document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('randomCheckbox').checked){
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].setStyle({color :'darksalmon'}) 
      }  
      for(var i = 0; i<randomDistricting.length; i++){
        randomDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('districtCheckbox').checked)
      this.state.currentDistrictLayer.addTo(map)
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(map)
    if(document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'});
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map);
      }  
  }
    
  }
  handleRandomView=()=>{  
    var map = this.state.map;
    var tileLayer = this.state.tileLayer;
    map.eachLayer(function (layer) {
      if(layer !== tileLayer){
        map.removeLayer(layer);
      }
    });
    if(document.getElementById('averageCheckbox').checked){
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].setStyle({color :'skyblue'}) 
      }  
      for(var i = 0; i<averageDistricting.length; i++){
        averageDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('minimumCheckbox').checked){
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].setStyle({color :'palegreen'}) 
      }  
      for(var i = 0; i<minimumDistricting.length; i++){
        minimumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('maximumCheckbox').checked){
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].setStyle({color :'orange'}) 
      }  
      for(var i = 0; i<maximumDistricting.length; i++){
        maximumDistricting[i].addTo(map) 
      }  
    }
    if(document.getElementById('districtCheckbox').checked)
      this.state.currentDistrictLayer.addTo(map)
    if(document.getElementById('precinctCheckbox').checked)
      this.state.currentPrecinctLayer.addTo(map)
    if(document.getElementById('randomCheckbox').checked){ 
    for(var i = 0; i<randomDistricting.length; i++){
      randomDistricting[i].setStyle({color :'darksalmon'});
    }  
    for(var i = 0; i<randomDistricting.length; i++){
      randomDistricting[i].addTo(map);
    }
  }  
  }


  handleCallback = (data) =>{
    this.setState({currentJob: data[2]})
    var url = 'http://localhost:8080/job/' + data[2].state.jobNum + '/averageDistricting';
    axios.get(url).then( 
      (response) => { 
          var result = response.data; 
          averageDistricting = this.generatePlanDistrictingLayer(data[2].state.state, result)
      }, 
      (error) => { 
          console.log(error); 
      } 
    );
    url = 'http://localhost:8080/job/' + data[2].state.jobNum + '/minDistricting';
    axios.get(url).then( 
      (response) => { 
          var result = response.data; 
          minimumDistricting = this.generatePlanDistrictingLayer(data[2].state.state, result)
      }, 
      (error) => { 
          console.log(error); 
      } 
    );
    url = 'http://localhost:8080/job/' + data[2].state.jobNum + '/maxDistricting';
    axios.get(url).then( 
      (response) => { 
          var result = response.data; 
          maximumDistricting = this.generatePlanDistrictingLayer(data[2].state.state, result)
      }, 
      (error) => { 
          console.log(error); 
      } 
    );
    url = 'http://localhost:8080/job/' + data[2].state.jobNum + '/randomDistricting';
    axios.get(url).then( 
      (response) => { 
          var result = response.data; 
          randomDistricting = this.generatePlanDistrictingLayer(data[2].state.state, result)
      }, 
      (error) => { 
          console.log(error); 
      } 
    );
    this.handleStateView(data[2].state.state);
    //generating BW
      var x=[];
      var y=[];
      
      data[1].sort((a, b) => (a.median > b.median) ? 1 : -1);
      
      for(var i =0; i<data[1].length;i++){
        var distrNum=i+1;
        y = y.concat([data[1][i].min , data[1][i].median, data[1][i].max, data[1][i].q1, data[1][i].q3])
        x = x.concat(Array(5).fill((distrNum).toString()));
      }
      // console.log(x,y,data[1]);
      var trace1= {
        y: y ,/*min  ?? ?? max*/
        x: x,
        name: 'New',
        marker: {color: '#FF4136'},
        type: 'box'
    };
    var old_y=[];
    var old_x=[];
    if(data[2].props.state === "Mississippi"){
      old_x =Array.from({length: 4}, (_, i) => i + 1);
      if(data[2].props.minorityGroups === "black "){
        old_y=[149872/587761,308869/489701,184466/567779,121043/566501];
      }
      if(data[2].props.minorityGroups === "hisp "){
        old_y=[14492/587761,9023/489701,12499/567779,18963/566501];
      }

    }
    if(data[2].props.state === "Alabama"){
      old_x =Array.from({length: 7}, (_, i) => i + 1);
      if(data[2].props.minorityGroups === "black "){
        old_y=[133793/520065,149423/512785,158271/523347,24139/504109,93896/551145,67267/573179,275489/462647];
      }
      if(data[2].props.minorityGroups === "hisp "){
        old_y=[12969/520065,14635/512785,12686/523347,24450/504109,20580/551145,20522/573179,12494/462647];
      }
    }
    if(data[2].props.state === "Texas"){
      old_x =Array.from({length: 32}, (_, i) => i + 1);
      if(data[2].props.minorityGroups === "black "){
        old_y=[0.185950780347677,0.125639326098355,0.100014937356461,0.107387127943768,0.205037865369702,0.142744115513945,0.0919321252935182,
          0.470144422603844,0.113648171948918,0.0375644858579095,0.0852972148589273,0.0550888447635049,0.209720270296286,0.0244981408194742,0.042383135552768,
          0.128621994615254,0.449788892497564,0.0609077685170624,0.0553717037814124,0.0354808354757944,0.0381136133603239,0.123233932695314,
          0.0738577808313294,0.0822716590391038,0.0530589142293917,0.0550332355230852,0.520792270117405,0.112507058159232,0.129814854224303,
          0.243450209532998,0.016070360177097,0.103364937720766,0.0969058578228884];
      }
      if(data[2].props.minorityGroups === "hisp "){
        old_y=[0.08948578987,0.2175934628,0.09917471106,0.07502699835,0.1599345135,0.2003582339,0.1383633866,0.2476253252,0.1903433692,0.3028359631,0.1862328802,0.1752690449,0.7376702256,0.7598548006,0.1811420933,0.2681065281,0.3009907218,0.6501740499,0.2470047554,0.2073651224,0.6286373988,0.1540424159,0.127798491,0.4634286774,0.6906162046,0.6418709576,0.2279544091,0.1953698475,0.1526667275,0.4705297115,0.7843604164,0.523419536,0.1709547976];
      }
      
    }
    old_y = old_y.sort(function (a, b) {  return a - b;  });
    var trace2= {
      y: old_y ,/*min  ?? ?? max*/
      x: old_x,
      name: 'Current',
      marker: {color: 'green'},
      mode: 'markers',
      type: 'scatter'
  };
      this.setState({plotData: [trace1,trace2]});
    
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
       { this.state.currentJob.state?
        <div>{"Current Selected Job: "+ this.state.currentJob.state.jobNum}</div>
        :
        <div></div>}
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
              {
              this.state.currentState?
              <>
              <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   <text>Map Filters </text>
                </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter " type="checkbox" name="inlineDistricttOption" id="districtCheckbox" onClick={this.handleDistrictView} /> Districts</label>
                    </div>                  
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter" type="checkbox" name="inlinePrecinctOption" id="precinctCheckbox" onClick={this.handlePrecinctView} /> Precicnts</label>
                    </div>
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter radio" type="radio" name="inlineHeatMapOption" onClick={()=> this.handleHeatMapView('black')} /> Black</label>
                    </div>
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter radio" type="radio" name="inlineHeatMapOption" onClick={()=> this.handleHeatMapView('asian')} /> Asian</label>
                    </div>
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter radio" type="radio" name="inlineHeatMapOption" onClick={()=> this.handleHeatMapView('hispanic')} /> Hispanic</label>
                    </div>
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter radio" type="radio" name="inlineHeatMapOption" onClick={()=> this.handleHeatMapView('native')} /> Native</label>
                    </div>
                  </div>
              </div>
              </>
              :
              <div></div>
              }
              {
                      this.state.currentJob.state && this.state.currentJob.state.status ==="Completed"?
                      <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Districtings
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter filter-checkbox " type="checkbox" name="inlineDistricttOption" id="averageCheckbox" onClick={this.handleAverageView} /> Average</label>
                    </div>     
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter filter-checkbox" type="checkbox" name="inlineDistricttOption" id="minimumCheckbox" onClick={this.handleMinimumView} /> Minimum</label>
                    </div>     
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter filter-checkbox" type="checkbox" name="inlineDistricttOption" id="maximumCheckbox" onClick={this.handleMaximumView} /> Maximum</label>
                    </div>     
                    <div class="font-small d-flex align-items-center">
                      <label class="radio-inline">
                      <input class="map-filter filter-checkbox" type="checkbox" name="inlineDistricttOption" id="randomCheckbox" onClick={this.handleRandomView} /> Random</label>
                    </div>     
                        </div>
                      </div>:
                      <div></div>
              }
                
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