import React, { useState } from "react";
import { TitlePanel } from "@src/components/panel/panel";
import InputField from "@src/components/forms/input-field";
import Button from "@src/components/button/Button";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { includes } from "lodash/collection";
import { createHashHistory } from "history";
import { addRuleset, uploadRuleset, fetchAndSetRule } from "@src/reducers/actions/ruleset";
import Notification from "@src/components/notification/notification";
import { RULE_AVAILABLE_CREATE } from "@src/constants/messages";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@src/context/UserContext";

function CreateRulesetContainer({ rulesetnames }) {
	const [name, setName] = useState("");
	const [error, setError] = useState({});
	const [fileExist, setFileExist] = useState(false);
	const [message, setMessage] = useState({});
	const user = useUser();
	const dispatch = useDispatch();

	const onChangeName = e => {
		setName(e.target.value);
	};

	const handleAdd = async e => {
		e.preventDefault();
		const history = createHashHistory();
		if (!name || !name.trim()) {
			setError({ name: "Please specify value" });
		} else if (includes(rulesetnames, name)) {
			setFileExist(true);
			setMessage(RULE_AVAILABLE_CREATE);
		} else {

			const response = dispatch(addRuleset(name, user));

			console.log(response);

			// dispatch(fetchAndSetRule(response.id, user));

			/* if (response) {
				history.push("/ruleset/" + response.id);
			} */
			/* history.push("./ruleset"); */
		}
	};

	return (
		<div className="single-panel-container">
			{fileExist && (
				<Notification
					body={message.body}
					heading={message.heading}
					type={message.type}
				/>
			)}
			<TitlePanel title="Create Rules">
				<form>
					<div className="upload-panel">
						<InputField
							label="Name"
							onChange={onChangeName}
							value={name}
							error={error.name}
						/>
						<Button
							label={"Create"}
							onConfirm={handleAdd}
							classname="primary-btn"
							type="submit"
						/>
					</div>
				</form>
			</TitlePanel>
		</div>
	);
}

const mapStateToProps = state => ({
	rulesetnames: state.ruleset.rulesets.map(r => r.name),
});

const mapDispatchToProps = dispatch => ({
	addRuleset: (name, user) => dispatch(addRuleset(name, user)),
});

CreateRulesetContainer.defaultProps = {
	addRuleset: () => false,
	rulesetnames: [],
};

CreateRulesetContainer.propTypes = {
	rulesetnames: PropTypes.array,
	addRuleset: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRulesetContainer);
