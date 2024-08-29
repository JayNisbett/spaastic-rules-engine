import * as ActionTypes from "@src/constants/actionTypes";

export const add = resource => {
	const payload = { resource };
	return { type: ActionTypes.ADD_ATTRIBUTE, payload };
};

export const update = (resource, index) => {
	const payload = { resource, index };

	return { type: ActionTypes.UPDATE_ATTRIBUTE, payload };
};

export const remove = (resource, index) => {
	const payload = { resource, index };

	return { type: ActionTypes.REMOVE_ATTRIBUTE, payload };
};

export const reset = () => {
	return { type: ActionTypes.RESET_ATTRIBUTE };
};

export const handleResource = (action, resource, index) => dispatch => {
	switch (action) {
		case "ADD":
			return dispatch(add(resource));
		case "UPDATE":
			return dispatch(update(resource, index));
		case "REMOVE":
			return dispatch(remove(resource, index));
		case "RESET":
			return dispatch(reset());
	}
};
