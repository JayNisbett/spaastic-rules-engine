import React from "react";
import { HashRouter, Routes, Route, createHashRouter, createRoutesFromElements, RouterProvider, Outlet } from "react-router-dom";
import HomeContainer from "@src/containers/home/HomeContainer";
import RulesetContainer from "@src/containers/ruleset/RulesetContainer";
import CreateRulesetContainer from "@src/containers/ruleset/CreateRulesetContainer";
import AppearanceContainer from "@src/containers/app/AppearanceContainer.js";
import ApplicationContainer from "@src/containers/app/ApplicationContainer.js";
import NavigationPanel from "@src/components/navigation/NavigationPanel";

const router = createHashRouter([
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
]);

export default function App() {
	return <RouterProvider router={router} />;
}

function Layout() {
	return (
		<>
			<ApplicationContainer />
		</>
	);
}
