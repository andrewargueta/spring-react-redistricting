import React from 'react';
import logo from '../images/logo.png';


class MapNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    function refreshPage() {
      window.location.reload();
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" id = "navigation">
      <a className="navbar-brand"><img src={logo} id = "logo-img" onClick={refreshPage}/> </a>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav navbar-right" id="nav-tabs">
          <li className="nav-item">
            <a className="nav-link" onClick={refreshPage} >Home </a>
          </li>
      </ul>
      </div>
    </nav>
    );
  }
}

export default MapNavbar;