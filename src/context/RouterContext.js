/**
 * RouterContext
 * @description RouterContext is a context that provides the router object to the components
 * @example
 */

import React, { useState, useContext, createContext } from "react";
import { HashRouter, Routes, Route, createHashRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import PropTypes from "prop-types";
import HomeContainer from "@src/containers/home/HomeContainer";
import RulesetContainer from "@src/containers/ruleset/RulesetContainer";
import AppearanceContainer from "@src/containers/app/AppearanceContainer";
import CreateRulesetContainer from "@src/containers/ruleset/CreateRulesetContainer";
import { useStore } from "react-redux";
import { default as initialStore } from "@src/store";
import ApplicationContainer from "@src/containers/app/ApplicationContainer";

const routeArray = [
	{
		path: "/",
		element: <ApplicationContainer />,
		children: [
			{
				path: "/home",
				exact: true,
				element: <HomeContainer />,
			},
			{
				path: "/ruleset",
				exact: true,
				children: [
					{
						path: "/ruleset/:id",
						element: <RulesetContainer />,
					},
				],
			},
			{
				path: "/create-ruleset",
				exact: true,
				element: <CreateRulesetContainer />,
			},
			{
				path: "/appearance",
				exact: true,
				element: <AppearanceContainer />,
			},
		],
	},
	{},
];
const router = createHashRouter(routeArray);

const RouterContext = createContext();

const CustomRoutes = ({ children, outlet }) => {
	const [appctx, setAppctx] = useState({ background: "light" });
	const store = useStore(initialStore);

	return (
		<RouterProvider router={router}>
			<RouterContext.Provider value={{ store, appctx }}>
				{children}
				{outlet}
			</RouterContext.Provider>
		</RouterProvider>
	);
};

const useCustomRoutes = () => {
	const context = useContext(RouterContext);
	if (!context) {
		return { store: initialStore, appctx: { background: "light" } };
	}
	return context;
};

CustomRoutes.defaultProps = {
	children: null,
	outlet: null,
};

CustomRoutes.propTypes = {
	children: PropTypes.node,
	outlet: PropTypes.node,
};

export { CustomRoutes, useCustomRoutes, router };
