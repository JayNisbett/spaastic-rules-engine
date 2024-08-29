/* eslint-disable no-undef */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PageTitle from "@src/components/title/page-title";
import Tabs from "@src/components/tabs/tabs";
import Attributes from "@src/components/attributes/Attributes.js";
import Decisions from "@src/components/decisions/Decision.js";
import ValidateRules from "@src/components/validate/ValidateRules";
import { handleAttribute } from "@src/reducers/actions/attributes";
import { handleDecision } from "@src/reducers/actions/decisions";
import Banner from "@src/components/panel/banner";
import * as Message from "@src/constants/messages";
import { groupBy } from "lodash/collection";
import RuleErrorBoundary from "@src/components/error/ruleset-error";
import SweetAlert from "react-bootstrap-sweetalert";
import saveRule from "@src/rules/index.mjs";
import { useUser } from "@src/context/UserContext";
import Resources from "@src/components/resources/Resources.js";

const tabs = [{ name: "Resources" }, { name: "Facts" }, { name: "Decisions" }, { name: "Validate" }, { name: "Generate" }];

function RulesetContainer({ ruleset, handleAttribute, handleDecisions, updatedFlag }) {
	const [activeTab, setActiveTab] = useState("Facts");
	const [generateFlag, setGenerateFlag] = useState(false);
	const user = useUser();

	const handleTab = tabName => {
		setActiveTab(tabName);
	};

	const cancelAlert = () => {
		setGenerateFlag(false);
	};

	const successAlert = () => {
		const { name } = ruleset;
		return (
			<SweetAlert
				success
				title={"File generated!"}
				onConfirm={cancelAlert}
			>
				{" "}
				{`${name} rule is succefully generated at your default download location`}
			</SweetAlert>
		);
	};

	function generateFile() {
		const { name, attributes, decisions, id } = ruleset;
		const rule = { name, attributes, decisions };
		user.saveRule({ id, rule });
		setGenerateFlag(true);
	}

	const { attributes, decisions, name } = ruleset;

	const indexedDecisions = decisions && decisions.length > 0 ? decisions.map((decision, index) => ({ ...decision, index })) : [];

	let outcomes;
	if (indexedDecisions.length > 0) {
		outcomes = groupBy(indexedDecisions, data => data.event.type);
	}

	const message = updatedFlag ? Message.MODIFIED_MSG : Message.NO_CHANGES_MSG;

	return (
		<div
			style={{
				marginLeft: "320px",
				paddingLeft: "20px",
		}}>
			<RuleErrorBoundary>
				<PageTitle name={name} />
				<Tabs
					tabs={tabs}
					onConfirm={handleTab}
					activeTab={activeTab}
				/>

				<div className="tab-page-container">
					{activeTab === "Resources" && (
						<Resources
							attributes={attributes}
							decisions={decisions}
						/>
					)}
					{activeTab === "Facts" && (
						<Attributes
							attributes={attributes}
							handleAttribute={handleAttribute}
						/>
					)}
					{activeTab === "Decisions" && (
						<Decisions
							decisions={indexedDecisions}
							attributes={attributes}
							handleDecisions={handleDecisions}
							outcomes={outcomes}
						/>
					)}
					{activeTab === "Validate" && (
						<ValidateRules
							attributes={attributes}
							decisions={decisions}
						/>
					)}
					{activeTab === "Generate" && (
						<Banner
							message={message}
							ruleset={ruleset}
							onConfirm={generateFile}
						/>
					)}
					{generateFlag && successAlert()}
				</div>
			</RuleErrorBoundary>
		</div>
	);
}

RulesetContainer.propTypes = {
	ruleset: PropTypes.object,
	handleAttribute: PropTypes.func,
	handleDecisions: PropTypes.func,
	updatedFlag: PropTypes.bool,
};

RulesetContainer.defaultProps = {
	ruleset: {},
	handleAttribute: () => {},
	handleDecisions: () => {},
	updatedFlag: false,
};

const mapStateToProps = state => ({
	ruleset: state.ruleset.rulesets[state.ruleset.activeRuleset],
	updatedFlag: state.ruleset.updatedFlag,
});

const mapDispatchToProps = dispatch => ({
	handleAttribute: (operation, attribute, index) => dispatch(handleAttribute(operation, attribute, index)),
	handleDecisions: (operation, decision) => dispatch(handleDecision(operation, decision)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RulesetContainer);
