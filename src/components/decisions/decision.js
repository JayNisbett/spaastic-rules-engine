import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import ToolBar from "@src/components/toolbar/ToolBar";
import AddDecision from "@src/components/decisions/AddDecision";
import DecisionDetails from "@src/components/decisions/DecisionDetails";
import Banner from "@src/components/panel/banner";
import * as Message from "@src/constants/messages";
import { transformRuleToTree } from "@src/utils/transform";
import { isContains } from "@src/utils/stringutils";

function Decision({ decisions, attributes, outcomes, handleDecisions, submit, reset }) {
	const [state, setState] = useState({
		showAddRuleCase: false,
		searchCriteria: "",
		editCaseFlag: false,
		editCondition: [],
		message: Message.NO_DECISION_MSG,
		decisions: decisions || [],
		bannerflag: false,
		editDecisionIndex: null,
		editOutcome: null,
	});

	const handleSearch = value => {
		setState({ searchCriteria: value });
	};

	const handleAdd = () => {
		setState({ showAddRuleCase: true, bannerflag: true });
	};

	const cancelAddAttribute = () => {
		setState({ showAddRuleCase: false, editCaseFlag: false, bannerflag: false });
	};

	const editCondition = decisionIndex => {
		const decision = decisions[decisionIndex];
		const editCondition = transformRuleToTree(decision);
		let outputParams = [];
		if (decision.event.params && Object.keys(decision.event.params).length > 0) {
			outputParams = Object.keys(decision.event.params).map(key => ({ pkey: key, pvalue: decision.event.params[key] }));
		}

		setState({
			editCaseFlag: true,
			editCondition,
			editDecisionIndex: decisionIndex,
			editOutcome: { value: decision.event.type, params: outputParams },
		});
	};

	const addCondition = condition => {
		handleDecisions("ADD", { condition });
		setState({ showAddRuleCase: false });
	};

	const updateCondition = condition => {
		handleDecisions("UPDATE", { condition, decisionIndex: state.editDecisionIndex });
		setState({ editCaseFlag: false });
	};

	const removeCase = decisionIndex => {
		handleDecisions("REMOVECONDITION", { decisionIndex });
	};

	const removeDecisions = outcome => {
		handleDecisions("REMOVEDECISIONS", { outcome });
	};

	const handleReset = () => {
		handleDecisions("RESET");
	};

	const filterOutcomes = () => {
		const { searchCriteria } = state;
		let filteredOutcomes = {};
		Object.keys(outcomes).forEach(key => {
			if (isContains(key, searchCriteria)) {
				filteredOutcomes[key] = outcomes[key];
			}
		});
		return filteredOutcomes;
	};

	const { searchCriteria, bannerflag } = state;
	const buttonProps = { primaryLabel: "Add Rulecase", secondaryLabel: "Cancel" };
	const editButtonProps = { primaryLabel: "Edit Rulecase", secondaryLabel: "Cancel" };
	const filteredOutcomes = searchCriteria ? filterOutcomes() : outcomes;

	return (
		<div className="rulecases-container">
			{
				<ToolBar
					handleAdd={handleAdd}
					reset={handleReset}
					searchTxt={handleSearch}
				/>
			}

			{state.showAddRuleCase && (
				<AddDecision
					attributes={attributes}
					addCondition={addCondition}
					cancel={cancelAddAttribute}
					buttonProps={buttonProps}
				/>
			)}

			{state.editCaseFlag && (
				<AddDecision
					attributes={attributes}
					editCondition={state.editCondition}
					outcome={state.editOutcome}
					editDecision
					addCondition={updateCondition}
					cancel={cancelAddAttribute}
					buttonProps={editButtonProps}
				/>
			)}

			<DecisionDetails
				outcomes={filteredOutcomes}
				editCondition={editCondition}
				removeCase={removeCase}
				removeDecisions={removeDecisions}
			/>

			{!bannerflag && Object.keys(outcomes).length < 1 && (
				<Banner
					message={state.message}
					onConfirm={handleAdd}
				/>
			)}
		</div>
	);
}

Decision.defaultProps = {
	handleDecisions: () => false,
	submit: () => false,
	reset: () => false,
	decisions: [],
	attributes: [],
	outcomes: {},
};

Decision.propTypes = {
	handleDecisions: PropTypes.func,
	submit: PropTypes.func,
	reset: PropTypes.func,
	decisions: PropTypes.array,
	attributes: PropTypes.array,
	outcomes: PropTypes.object,
};

export default Decision;
