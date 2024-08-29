import React, { useState } from "react";
import PropTypes from "prop-types";
import Panel from "@src/components/panel/panel";
import InputField from "@src/components/forms/input-field";
import SelectField from "@src/components/forms/selectmenu-field";
import Button from "@src/components/button/Button";
import attributeValidations from "@src/validations/attributeValidations";
import dataTypes from "@src/data-objects/operator.json";

const AddAttributes = ({ addAttribute, cancel, attribute = {}, buttonProps = {} }) => {
	const [state, setState] = useState({
		error: {},
		name: attribute.name,
		type: attribute.type,
	});

	const onChangeName = e => {
		setState({ ...state, name: e.target.value });
	};

	const onChangeType = e => {
		setState({ ...state, type: e.target.value });
	};

	const handleAdd = e => {
		e.preventDefault();
		const error = attributeValidations({ name: state.name, type: state.type });

		if (Object.keys(error).length > 0) {
			setState({ ...state, error });
		} else {
			addAttribute({ name: state.name, type: state.type });
		}
	};

	const handleCancel = () => {
		cancel();
	};

	const attribute_types = Object.keys(dataTypes);

	return (
		<Panel>
			<form>
				<div className="add-attribute-wrapper">
					<div className="form-groups-inline">
						<InputField
							label="Name"
							onChange={onChangeName}
							value={attribute.name}
							error={state.error.name}
						/>
						<SelectField
							label="Type"
							options={attribute_types}
							onChange={onChangeType}
							value={attribute.type}
							error={state.error.type}
						/>
					</div>
					<div className="btn-group">
						<Button
							label={buttonProps.primaryLabel}
							onConfirm={handleAdd}
							classname="primary-btn"
							type="submit"
						/>
						<Button
							label={buttonProps.secondaryLabel}
							onConfirm={handleCancel}
							classname="cancel-btn"
						/>
					</div>
				</div>
			</form>
		</Panel>
	);
};

AddAttributes.defaultProps = {
	addAttribute: () => false,
	cancel: () => false,
};

AddAttributes.propTypes = {
	addAttribute: PropTypes.func,
	cancel: PropTypes.func,
	attribute: PropTypes.object,
	buttonProps: PropTypes.object,
};

export default AddAttributes;
