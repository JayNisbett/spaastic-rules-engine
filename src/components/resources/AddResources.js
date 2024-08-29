import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Panel from "@src/components/panel/panel";
import InputField from "@src/components/forms/input-field";
import SelectField from "@src/components/forms/selectmenu-field";
import Button from "@src/components/button/Button";
import resourceValidations from "@src/validations/resourceValidations";
import { useSpaastic } from "@src/utils/useFetch";

const resourceTypes = [
	{
		name: "Custom Fields",
		type: "customFields",
	},
	{
		name: "Custom Values",
		type: "customValues",
	},
	{ name: "Location", type: "location" },
	{ name: "Company", type: "company" },
	{ name: "Snapshot", type: "snapshot" },
	{ name: "User", type: "users" },
	{ name: "Pages", type: "route" },
	{ name: "Subscriptions", type: "subscription" },
];

const AddResources = ({ resource, addResource, cancel, buttonProps }) => {
	const [name, setName] = useState(resource.name);
	const [type, setType] = useState(resource.type);
	const [error, setError] = useState({});

	// Calling the useSpaastic Hook for fetching data
	const { loading, value, error: hookError } = useSpaastic(type);

	useEffect(() => {
		if (hookError) setError(hookError);
	}, [hookError]);

	const handleAdd = e => {
		e.preventDefault();
		const errors = resourceValidations({ name, type });

		if (Object.keys(errors).length > 0) {
			setError(errors);
		} else {
			addResource({ name, type });
		}
	};

	const resourceValues = useCallback(() => {
		// values to select from for the "Resource" selection field
		let resourceValues = [];

		if (!loading && value) {
			if (["customFields", "customValues"].includes(type)) {
				resourceValues = value[type];
			} else {
				resourceValues = value;
			}
		}
	}, [loading, value, type]);

	const attribute_types = resourceTypes.map(item => item.name);

	return (
		<Panel>
			<form>
				<div className="add-resource-wrapper">
					{/* Implementation here */}
					{/* Add a new Select Field for the resource item */}
					<SelectField
						label="Resource"
						options={resourceTypes.map(item => item.name) || []}
						onChange={setType} /*You probably need a different setter for this value */
						value={type} /*You probably need a different value for this field */
						error={error.type}
					/>
					{/* Add a new Select Field for the resource value */}
					<SelectField
						label="Resource Value"
						options={resourceTypes.map(item => item.name) || []}
						onChange={setName} /*You probably need a different setter for this value */
						value={name} /*You probably need a different value for this field */
						error={error.name}
					/>
				</div>
			</form>
		</Panel>
	);
};

AddResources.propTypes = {
	addResource: PropTypes.func,
	cancel: PropTypes.func,
	resource: PropTypes.object,
	buttonProps: PropTypes.object,
};

AddResources.defaultProps = {
	addResource: () => {},
	cancel: () => {},
	resource: {},
	buttonProps: {},
};

export default AddResources;
