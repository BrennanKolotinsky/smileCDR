import React, { Component } from "react";
import questionnaire from "../../assets/questionnaire.json";

class Questionnaire extends Component {

	state = {
		questionnaire: null
	}

	componentDidMount() {
		this.addGroupBoolean(questionnaire);
		this.setState({questionnaire: questionnaire});
		console.log(questionnaire);
	}

	addGroupBoolean(questionnaire) {
		questionnaire.item.map((question, i) => {
			question.grouped = question.type === 'group';
		});
	}

	render() {
		const { questionnaire } = this.state;
		return (
			<div style={{ marginBottom: "120px" }}>
				<h2>QUESTIONNAIRE</h2>
				{questionnaire && questionnaire.item.map((question, i) => (
					question.grouped ?
						(
			            	question.item.map((singleQ, j) => (
			            		j === 0 ? (
									<div>
										<div>
											<h3>{question.text}</h3>
						            	</div>
					            		<label for={j + ":" + singleQ.linkId}>{singleQ.text}</label>
					            		<input type={singleQ.type === "boolean" ? "checkbox" : "string"} id={j + ":" + singleQ.linkId} name={j + ":" + singleQ.linkId}></input>
					            	</div>
					            ) : (
					            	<div>
					            		<label for={j + ":" + singleQ.linkId}>{singleQ.text}</label>
					            		<input type={singleQ.type === "boolean" ? "checkbox" : "string"} id={j + ":" + singleQ.linkId} name={j + ":" + singleQ.linkId}></input>
					            	</div>
					            )
			            	))
			            ) 
			            :
			            (
			            	<div>
			            		<h3>Single Question</h3>
			            		<label for={i + ":" + question.linkId}>{question.text}</label>
			            		<input type={question.type === "boolean" ? "checkbox" : "string"} id={i + ":" + question.linkId} name={i + ":" + question.linkId}></input>
			            	</div>
			            )
		        ))}
			</div>
		);
	}
}

export default Questionnaire;