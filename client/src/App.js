import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import VotingManager from './containers/VotingApp';

import "./App.css";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <VotingManager />
        </BrowserRouter>
    );
  }
}

export default App;
