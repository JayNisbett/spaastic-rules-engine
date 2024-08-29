import React, { Component } from "react";
import Notification from "@src/components/notification/notification";
import { RULE_ERROR } from "@src/constants/messages";
import PropTypes from "prop-types";

class RuleErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError() {
		// This lifecycle gets triggered after an error has been thrown by a descendant component.
		// It receives the error that was thrown as a parameter and should return a value to update state.
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		console.log(error, info);
	}

	render() {
		return (
			<React.Fragment>
				{this.state.hasError && (
					<Notification
						heading={RULE_ERROR.heading}
						body={RULE_ERROR.body}
						type={RULE_ERROR.type}
					/>
				)}
				{this.props.children}
			</React.Fragment>
		);
	}
}

RuleErrorBoundary.defaultProps = {
	children: null,
};

RuleErrorBoundary.propTypes = {
	children: PropTypes.node,
};

export default RuleErrorBoundary;
