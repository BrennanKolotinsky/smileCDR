import React, { Component } from "react";
import { getPatients } from "../../services";
import "./styles.css";
import DropdownSelector from "../DropDown/index.jsx";

class Table extends Component {

	state = {
    	patients: [],
    	nameFilter: "",
    	filterDOB: "NO DOB FILTER",
    	dateOfBirthList: []
  	};

	async componentDidMount() {
		const res = await getPatients();
		const reqTime = this.formatDate(new Date());		
		const patients = this.flattenPatientObj(res);

		// undefined values will show up last!
		patients.sort((a, b) => (new Date(a.dob) < new Date(b.dob) || b.dob === undefined) ? -1 : 1);
		const dobList = this.createDOBList(patients);
		this.setState({patients : patients, unfilteredPatients: patients, reqTime : reqTime, dateOfBirthList: dobList}); // start with all patients for the filtered list!
		console.log(patients);
	}

	createDOBList(patients) {
		
		const dobList = [];
		const dobMap = {};

		patients.map((item) => {
			if (item.dob !== '' && item.dob !== undefined && !dobMap.hasOwnProperty(item.dob)) {
				dobMap[item.dob] = true;
				dobList.push(item.dob);
			}
		});

		dobList.push("NO DOB FILTER");

		return dobList;
	}

	formatDate(d) {
		return `${d.toString().substring(0,16)} at ${d.toString().substring(16,24)}`;
	}

	// copied -- move this function into App.js and pass down as props for re-usability
	flattenPatientObj = (response) => {
    	return (response.data.entry || []).map((item) => {
	      const name = item.resource.name || [];
	      let dob = this.formatDOB(item.resource.birthDate); // 2012-02-06 -- reformat obvious mistakes
	      return {
	        id: item.resource.id,
	        name: `${((name[0] || {}).given || []).join(" ")} ${
	          (name[0] || {}).family || ""
	        }`,
	        fName: name[0] && name[0].given && name[0].given[0] ? name[0].given[0] : "",
	        lName: name[0] && name[0].family ? name[0].family : "",
	        gender: item.resource.gender,
	        dob: dob,
	        photo:
	          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
	      };
    	});
  	};

  	formatDOB = (date) => {
  		return date === undefined ? "" : date.replaceAll('-', '/');
  	}

  	changeName = (event) => {
  		this.setState({nameFilter : event.target.value});
  	}

  	filterDOB = (option) => {
  		alert("SELECTED " + option.toUpperCase());
  		this.setState({filterDOB : option});
  	}

  	handleFilter = (e) => {
  		const filteredList = [];
  		alert("Filtering with: " + (this.state.nameFilter.toLowerCase() === "" ? "NO NAME FILTER" : this.state.nameFilter.toUpperCase()) + " and " + this.state.filterDOB)
  		this.state.unfilteredPatients.map((item) => {

  			let matchesDOBFilter = this.state.filterDOB === 'NO DOB FILTER' ? true : false;
  			let matchesNameFilter = this.state.nameFilter === '' ? true : false;

			if ((item.fName && this.state.nameFilter.toLowerCase() === item.fName.toLowerCase()) || (item.lName && this.state.nameFilter.toLowerCase() === item.lName.toLowerCase()))
  				matchesNameFilter = true;  			

  			if (item.dob && this.state.filterDOB === item.dob)
  				matchesDOBFilter = true;

  			if (matchesDOBFilter && matchesNameFilter)
  				filteredList.push(item);
  		});

  		this.setState({patients: filteredList});
  	}

	render() {
		const { patients, reqTime, dateOfBirthList } = this.state;
		return (
			<div>
				<h2>PATIENT TABLE (Results as of: {reqTime})</h2>

				<div className='filter'>
					<input id="email" placeholder="John" onChange={this.changeName} className="nameFilter filterOptions"></input>
					<DropdownSelector className="filterMenu filterOptions"
	                    options = {dateOfBirthList}
	                    filterDOB={(options) => this.filterDOB(options) }
	                />
	                <button onClick={this.handleFilter} className="filterBtn">
	                	Filter Table
	                </button>
                </div>
				
				<div>
					<table>
				        <thead>
				          <tr>
				            <th>Profile Image</th>
				            <th>Full Name</th>
				            <th>Gender</th>
				            <th>Date of Birth</th>
				          </tr>
				        </thead>
				        <tbody>
				          {patients.map((patients) => (
				            <tr key={patients.id}>
				              <td>
				                <img
				                  src={patients.photo}
				                  alt="Avatar"
				                  style={{ height: 50, width: 50, borderRadius: "50%" }}
				                />
				              </td>
				              <td>{patients.name}</td>
				              <td>{patients.gender}</td>
				              <td>{patients.dob}</td>
				            </tr>
				          ))}
				        </tbody>
				    </table>
				</div>
		    </div>
		);
	}
}

export default Table;