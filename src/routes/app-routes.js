import React from "react";
import { HashRouter, Routes, Route, createHashRouter, createRoutesFromElements } from "react-router-dom";
import HomeContainer from "@src/containers/home/HomeContainer";
import RulesetContainer from "@src/containers/ruleset/RulesetContainer";
import CreateRulesetContainer from "@src/containers/ruleset/CreateRulesetContainer";
import AppearanceContainer from "@src/containers/app/AppearanceContainer.js";
import PropTypes from "prop-types";
import ApplicationContainer from "@src/containers/app/ApplicationContainer.js";

const AppRoutes = ({ closedState, appctx }) => {
	const { background } = appctx;

	const router = createHashRouter(
		createRoutesFromElements(
			<Routes>
				<Route
					path="/"
					element={<ApplicationContainer />}
				>
					<Route
						path="/home"
						element={<HomeContainer />}
					/>
					<Route
						path="/ruleset"
						element={<RulesetContainer />}
					/>
					<Route
						path="/create-ruleset"
						element={<CreateRulesetContainer />}
					/>
					<Route
						path="/appearance"
						element={<AppearanceContainer />}
					/>
				</Route>
			</Routes>
		)
	);
	return (
		<div className={`main-container ${closedState ? "closed" : "open"} ${background}`}>
			<HashRouter basename="/">
				<Routes>
					<Route
						path="/home"
						element={<HomeContainer />}
					/>
					<Route
						path="/ruleset"
						element={<RulesetContainer />}
					/>
					<Route
						path="/create-ruleset"
						element={<CreateRulesetContainer />}
					/>
					<Route
						path="/appearance"
						element={<AppearanceContainer />}
					/>
				</Routes>
			</HashRouter>
		</div>
	);
};

AppRoutes.defaultProps = {
	closedState: false,
	appctx: {},
};

AppRoutes.propTypes = {
	closedState: PropTypes.bool,
	appctx: PropTypes.object,
};

export default AppRoutes;
