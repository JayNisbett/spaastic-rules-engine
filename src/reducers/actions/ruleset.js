import * as ActionTypes from "@src/constants/actionTypes";
import { updateState } from "@src/reducers/actions/app";

export const fetchAndSetRule = (id, user) => async dispatch => {
	try {
		const data = await user.fetchRule(id);

		dispatch({
			type: ActionTypes.SET_FETCHED_RULE,
			payload: { ...data },
		});
	} catch (error) {
		console.error("Error fetching rule:", error);
		// handle the error according to your requirements
	}
};

export const uploadRuleset = ruleset => dispatch => {
	dispatch(updateState("open"));
	return dispatch({
		type: ActionTypes.UPLOAD_RULESET,
		payload: { ruleset },
	});
};

export const addRuleset = (name, user) => async dispatch => {
	// add the ruleset to the db and then dispatch the action
	try {
		const data = await user.saveRule({ name, 'decisions': [], 'attributes': [] });

		return dispatch({
			type: ActionTypes.ADD_RULESET,
			payload: { ...data },
		});
	} catch (error) {
		console.error("Error adding rule:", error);
		// handle the error according to your requirements
	}
};

export const updateRulesetIndex = name => {
	return {
		type: ActionTypes.UPDATE_RULESET_INDEX,
		payload: { name },
	};
};
