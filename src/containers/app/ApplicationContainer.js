import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateRulesetIndex, fetchAndSetRule } from "@src/reducers/actions/ruleset.js";
import { updateState } from "@src/reducers/actions/app.js";
import PropTypes from "prop-types";
import Title from "@src/components/title/title.js";
import NavigationPanel from "@src/components/navigation/NavigationPanel.js";
import AppearanceContext from "@src/context/apperance-context.js";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUser } from "@src/context/UserContext";

const ApplicationContainer = ({ rulenames, setActiveRulesetIndex, navState, loggedIn, updateState, activeIndex, children }) => {
	const [theme, setTheme] = useState({ background: "light" });
	const dispatch = useDispatch();
	const user = useUser();

	const toggleBackground = value => {
		const newTheme = { ...theme, background: value };
		document.body.className = value;
		setTheme(newTheme);
	};

	useEffect(() => {
		user.authenticateDefaultUser();

		const rules = ["0f3821cc-6a91-4e0a-a9ef-cb412cc68e23"];
		rules.forEach(rule => {
			dispatch(fetchAndSetRule(rule, user));
		});

		document.body.className = theme.background;

		return () => (document.body.className = ""); // Cleanup on unmount
	}, []);

	const closednav = navState !== "open";

	return (
		<>
			<AppearanceContext.Provider value={theme}>
				{/* 				<div className={`nav-container ${closednav ? "closed" : "open"} ${theme.background}`}>
				 */}{" "}
				<Title title="Json Rule Editor" />
				<NavigationPanel
					closedState={closednav}
					updateState={updateState}
					activeIndex={activeIndex}
					rulenames={rulenames}
					setActiveRulesetIndex={setActiveRulesetIndex}
					loggedIn={loggedIn}
				/>
				<Outlet />
				{/* 				</div>
				 */}{" "}
			</AppearanceContext.Provider>
		</>
	);
};

ApplicationContainer.defaultProps = {
	rulenames: [],
	setActiveRulesetIndex: () => false,
	navState: "open",
	activeIndex: 0,
	loggedIn: false,
	updateState: () => false,
};

ApplicationContainer.propTypes = {
	rulenames: PropTypes.array,
	setActiveRulesetIndex: PropTypes.func,
	navState: PropTypes.string,
	loggedIn: PropTypes.bool,
	updateState: PropTypes.func,
	activeIndex: PropTypes.number,
};

const mapStateToProps = state => ({
	navState: state.app.navState,
	rulenames: state.ruleset.rulesets,
	loggedIn: state.app.loggedIn,
	activeIndex: state.ruleset.activeRuleset,
});

const mapDispatchToProps = {
	setActiveRulesetIndex: updateRulesetIndex,
	updateState,
	fetchAndSetRule: fetchAndSetRule,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationContainer);
