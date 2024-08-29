import { UPDATE_NAV_STATE, LOG_IN } from "@src/constants/actionTypes";

const initialState = {
	app: {
		navState: "open",
		loggedIn: true,
	},
};

const AppReducer = (state = initialState, action) => {
	const type = action.type;
	switch (type) {
		case UPDATE_NAV_STATE: {
			const { navState } = action.payload;
			return { ...state, navState };
		}
		case LOG_IN:
			return { ...state, loggedIn: true };
		default:
			return state;
	}
};

export default AppReducer;
