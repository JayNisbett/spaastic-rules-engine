import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import store from "@src/store";
import { Provider } from "react-redux";
import { CustomRoutes } from "@src/context/RouterContext";
import { RouterProvider } from "react-router-dom";
import Root from "./routes/Router";
import { UserProvider } from "./context/UserContext";
const FallbackElement = () => {
	return (
		<>
			<div className="fallback">
				<h1>404</h1>
				<p>Page not found</p>
			</div>
		</>
	);
};

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<UserProvider>
			<Provider store={store}>
				<Root />
			</Provider>
		</UserProvider>
	</StrictMode>
);
