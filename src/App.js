import React, { Component } from "react";
import { getPatients } from "./services";
import Table from './components/Table/index.jsx';
import Questionnaire from './components/Questionnaire/index.jsx';
import Practitioner from './components/Practitioner.js';

class App extends Component {
  componentDidMount() {
    getPatients().then((res) => {
      console.log(res);
    });
  }
  render() {
    return (
    	<div>
        <Questionnaire />
        <Table />
    	</div>
    );
  }
}

export default App;
