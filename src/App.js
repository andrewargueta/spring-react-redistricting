import React, { Component } from 'react';
import axios from 'axios';
import Map from './components/Map';
import MapNavbar from './components/MapNavbar';
import UserForm from './components/UserForm';
import BoxWhisker from './components/BoxWhisker';
import { BrowserRouter, Route } from 'react-router-dom';


// App component
class App extends Component {
  componentDidMount(){
     axios.get("http://localhost:8080/job/previousJobs", {
                  headers: {
                      'Content-Type': 'application/json',
                  }
              }
            ).then( 
                (response) => { 
                    console.log(response);
                    var result = response.data; 
                    console.log("spring :" + result); 
                }, 
                (error) => { 
                    console.log(error); 
                } 
            ); 
    }

  render() {
    return(
      <>
    <MapNavbar />
    <div class="container-fluid">
      <div class="row">
    <BrowserRouter>
      <Route path="/">
           <Map /> 
      </Route>
    </BrowserRouter>  
    </div>
    </div>
    </>
    )
    
  }
}

export default App