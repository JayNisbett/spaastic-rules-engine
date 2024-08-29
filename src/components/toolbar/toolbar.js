import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";
import Search from "../search/search";
import ApperanceContext from "../../context/apperance-context";

const ToolBar = ({ handleAdd, reset, searchTxt }) => {
	const [state, setState] = useState({ submitAlert: false, resetAlert: false, successAlert: false, successMsg: "" });
	const { background } = useContext(ApperanceContext);

	const handleReset = () => {
		setState(prevState => ({ ...prevState, resetAlert: true }));
	};

	const handleSearch = value => {
		searchTxt(value);
	};

	const cancelAlert = () => {
		setState({ submitAlert: false, resetAlert: false, successAlert: false, successMsg: "" });
	};

	const resetState = () => {
		reset();
		setState({ resetAlert: false, successAlert: true, successMsg: "Your changes are reset" });
	};

	const alert = () => {
		return (
			<div>
				{state.resetAlert && resetAlert()}
				{state.successAlert && successAlert()}
			</div>
		);
	};

	const successAlert = () => {
		return (
			<SweetAlert
				success
				title={state.successMsg}
				onConfirm={cancelAlert}
			></SweetAlert>
		);
	};

	const resetAlert = () => {
		return (
			<SweetAlert
				warning
				showCancel
				confirmBtnText="Yes, Reset it!"
				confirmBtnBsStyle="danger"
				title="Are you sure?"
				onConfirm={resetState}
				onCancel={cancelAlert}
				focusCancelBtn
			>
				You will not be able to recover the changes!
			</SweetAlert>
		);
	};

	return (
		<div className={`attributes-header ${background}`}>
			{alert()}
			<div
				className="attr-link"
				onClick={handleAdd}
			>
				<span className="plus-icon" />
				<span className="text">Add</span>
			</div>
			<div
				className="attr-link"
				onClick={handleReset}
			>
				<span className="reset-icon" />
				<span className="text">Reset</span>
			</div>
			<div>
				<Search
					onConfirm={handleSearch}
					onChange={handleSearch}
				/>
			</div>
		</div>
	);
};

ToolBar.defaultProps = {
	handleAdd: () => false,
	reset: () => false,
	searchTxt: () => false,
};

ToolBar.propTypes = {
	handleAdd: PropTypes.func,
	reset: PropTypes.func,
	searchTxt: PropTypes.func,
};

export default ToolBar;
