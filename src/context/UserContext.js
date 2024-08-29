import React, { createContext, useEffect } from "react";
import UserSettings from "@src/rules/index.mjs";

const userData = {
	name: "Jay",
	email: "jay.v.nisbett@gmail.com",
	password: "123456",
};

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
	const userSettings = new UserSettings(userData);

	useEffect(() => {
		userSettings.authenticateDefaultUser();
	}, []);

	return <UserContext.Provider value={userSettings}>{children}</UserContext.Provider>;
};

export const useUser = () => React.useContext(UserContext);
