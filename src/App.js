import React, { Component } from 'react';
import Map from './components/Map';
import MapNavbar from './components/MapNavbar';
import UserForm from './components/UserForm';
import BoxWhisker from './components/BoxWhisker';
import { BrowserRouter, Route } from 'react-router-dom';


// App component
class App extends Component {
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