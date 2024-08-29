import React, { Component } from "react";
import PropTypes from "prop-types";
import SweetAlert from "react-bootstrap-sweetalert";
import AddResources from "@src/components/resources/AddResources";
import { PanelBox } from "@src/components/panel/panel";

class ResourceDetails extends Component {
	constructor(props) {
		super(props);
		this.state = { removeAlert: false, successAlert: false };
		this.handleRemove = this.handleRemove.bind(this);
		this.remove = this.remove.bind(this);
		this.cancelAlert = this.cancelAlert.bind(this);
		this.updateResource = this.updateResource.bind(this);
	}

	handleEdit(e, val) {
		e.preventDefault();
		this.setState({ showRuleIndex: val });
	}

	handleRemove(e, attribute, index) {
		e.preventDefault();
		this.setState({ removeAlert: true, activeResource: attribute, activeResourceIndex: index });
	}

	remove() {
		const { activeResource, activeResourceIndex } = this.state;
		this.props.removeResource("REMOVE", activeResource, activeResourceIndex);
		this.setState({ successAlert: true });
	}

	cancelAlert() {
		this.setState({ removeAlert: false, successAlert: false, showRuleIndex: -1 });
	}

	updateResource(attribute) {
		this.setState({ showRuleIndex: -1 });
		this.props.updateResource("UPDATE", attribute, this.state.showRuleIndex);
	}

	removeAlert = () => {
		return (
			<SweetAlert
				warning
				showCancel
				confirmBtnText="Yes, Remove it!"
				confirmBtnBsStyle="danger"
				title="Are you sure?"
				onConfirm={this.remove}
				onCancel={this.cancelAlert}
				focusCancelBtn
			>
				You will not be able to recover the changes!
			</SweetAlert>
		);
	};

	successAlert = () => {
		return (
			<SweetAlert
				success
				title={"Resource has been removed successfully!!"}
				onConfirm={this.cancelAlert}
			></SweetAlert>
		);
	};

	render() {
		const { resources } = this.props;
		const { showRuleIndex } = this.state;

		const buttonProps = { primaryLabel: "Save Changes", secondaryLabel: "Cancel" };

		const attrList = resources.map((attr, index) => (
			<div key={attr.name}>
				<PanelBox className={attr.type}>
					<div className="index">{index + 1}</div>
					<div className="name">{attr.name}</div>
					<div className="type">
						<span className={attr.type}>{attr.type}</span>
					</div>
					<div className="menu">
						<a
							href=""
							onClick={e => this.handleEdit(e, index)}
						>
							Edit
						</a>
						<a
							href=""
							onClick={e => this.handleRemove(e, attr, index)}
						>
							Remove
						</a>
					</div>
				</PanelBox>
				{showRuleIndex === index && (
					<AddResources
						attribute={attr}
						addResource={this.updateResource}
						cancel={this.cancelAlert}
						buttonProps={buttonProps}
					/>
				)}
			</div>
		));

		return (
			<React.Fragment>
				{this.state.removeAlert && this.removeAlert()}
				{this.state.successAlert && this.successAlert()}
				{attrList}
			</React.Fragment>
		);
	}
}

ResourceDetails.defaultProps = {
	resources: [],
	updateResource: () => false,
	removeResource: () => false,
};

ResourceDetails.propTypes = {
	resources: PropTypes.array,
	updateResource: PropTypes.func,
	removeResource: PropTypes.func,
};

export default ResourceDetails;
