import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "@src/reducers/AppReducer";
import RulesetReducer from "@src/reducers/RulesetReducer";

const { combineReducers } = require("redux");

const rootReducer = combineReducers({
	app: AppReducer,
	ruleset: RulesetReducer,
});

const store = configureStore({ reducer: rootReducer });
export default store;
