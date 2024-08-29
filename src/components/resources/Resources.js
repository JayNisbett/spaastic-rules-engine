import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import AddResources from "@src/components/resources/AddResources";
import ResourceDetails from "@src/components/resources/ResourceDetails";
import ToolBar from "@src/components/toolbar/ToolBar";
import Banner from "@src/components/panel/banner";
import * as Message from "@src/constants/messages";
import { isContains } from "@src/utils/stringutils";

const Resources = ({ handleResource, resources }) => {
	const [showAddAttr, setShowAddAttr] = useState(false);
	const [message, setMessage] = useState(Message.NO_ATTRIBUTE_MSG); /* eslint-disable-line */
	const [searchCriteria, setSearchCriteria] = useState("");
	const [bannerflag, setBannerFlag] = useState(false);

	const handleAdd = useCallback(() => {
		setShowAddAttr(true);
		setBannerFlag(true);
	}, []);

	const addResource = useCallback(
		attribute => {
			setShowAddAttr(false);
			handleResource("ADD", attribute);
		},
		[handleResource]
	);

	const handleReset = useCallback(() => {
		handleResource("RESET");
	}, [handleResource]);

	const cancelAddResource = useCallback(() => {
		setShowAddAttr(false);
		setBannerFlag(false);
	}, []);

	const filterResource = useCallback(() => {
		const filteredResources = resources.filter(att => isContains(att.name, searchCriteria) || isContains(att.type, searchCriteria));
		return filteredResources;
	}, [resources, searchCriteria]);

	const handleSearch = useCallback(value => {
		setSearchCriteria(value);
	}, []);

	const buttonProps = { primaryLabel: "Add Facts", secondaryLabel: "Cancel" };

	const filteredResources = searchCriteria ? filterResource() : resources;

	return (
		<div className="resources-container">
			<ToolBar
				handleAdd={handleAdd}
				reset={handleReset}
				searchTxt={handleSearch}
			/>
			{showAddAttr && (
				<AddResources
					addResource={addResource}
					cancel={cancelAddResource}
					buttonProps={buttonProps}
				/>
			)}
			<ResourceDetails
				resources={filteredResources}
				updateResource={handleResource}
				removeResource={handleResource}
			/>
			{!bannerflag && resources.length < 1 && (
				<Banner
					message={message}
					onConfirm={handleAdd}
				/>
			)}
		</div>
	);
};

Resources.defaultProps = {
	handleResource: () => false,
	resources: [],
};

Resources.propTypes = {
	handleResource: PropTypes.func,
	resources: PropTypes.array,
};

export default Resources;
