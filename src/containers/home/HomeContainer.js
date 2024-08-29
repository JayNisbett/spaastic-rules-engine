import React, { useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "@src/reducers/actions/app";
import { uploadRuleset } from "@src/reducers/actions/ruleset";
import { TitlePanel } from "@src/components/panel/panel";
import Button from "@src/components/button/Button";
import { createHashHistory } from "history";
import FooterLinks from "@src/components/footer/footer";
import footerLinks from "@src/data-objects/footer-links.json";
import { includes } from "lodash/collection";
import Notification from "@src/components/notification/notification";
import { RULE_AVAILABLE_UPLOAD, RULE_UPLOAD_ERROR } from "@src/constants/messages";
import ApperanceContext from "@src/context/apperance-context";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function readFile(file, cb) {
	// eslint-disable-next-line no-undef
	var reader = new FileReader();
	reader.onload = () => {
		try {
			cb(JSON.parse(reader.result), file.name);
		} catch (e) {
			cb(undefined, undefined, e.message);
		}
	};
	return reader.readAsText(file);
}

const HomeContainer = ({ rulenames, loggedIn, uploadRuleset, login }) => {
	const [state, setState] = useState({
		uploadedFilesCount: 0,
		files: [],
		ruleset: [],
		uploadError: false,
		fileExist: false,
		message: {},
	});
	const appctx = useContext(ApperanceContext);
	const navigate = useNavigate();

	const allowDrop = e => {
		e.preventDefault();
	};

	const printFile = useCallback(
		(file, name, error) => {
			if (error) {
				setState(prevState => ({ ...prevState, uploadError: true, fileExist: false, message: RULE_UPLOAD_ERROR }));
			} else {
				const isFileAdded = state.files.some(fname => fname === name) || includes(rulenames, file.name);
				if (!isFileAdded) {
					const files = state.files.concat([name]);
					const ruleset = state.ruleset.concat(file);
					setState(prevState => ({ ...prevState, files, ruleset, fileExist: false }));
				} else {
					const message = { ...RULE_AVAILABLE_UPLOAD, heading: RULE_AVAILABLE_UPLOAD.heading.replace("<name>", file.name) };
					setState(prevState => ({ ...prevState, fileExist: true, message }));
				}
			}
		},
		[state.files, rulenames]
	);

	const chooseDirectory = e => {
		const files = e.target.files;
		if (files) {
			for (let i = 0; i < files.length; i++) {
				if (files[i].type === "application/json") {
					readFile(files[i], printFile);
				}
			}
		}
	};

	const drop = e => {
		e.preventDefault();
		const items = e.dataTransfer.items;
		if (items) {
			for (let i = 0; i < items.length; i++) {
				let item = items[i].webkitGetAsEntry();
				// uploadFile and uploadDirectory are omitted; please refer original component for implementation.
			}
		}
	};

	const handleUpload = () => {
		if (state.ruleset.length > 0) {
			uploadRuleset(state.ruleset);
			navigate("/ruleset");
		}
	};

	const { fileExist, uploadError, message } = state;
	const title = loggedIn ? "Upload Rules" : "Create / Upload Rules";

	return (
		<div className="home-container">
			<div className="home-container">
				<div className="single-panel-container">
					{(fileExist || uploadError) && (
						<Notification
							body={message.body}
							heading={message.heading}
							type={message.type}
						/>
					)}
					<TitlePanel
						title={title}
						titleClass={`title-panel ${appctx.background}`}
					>
						<div className="upload-panel">
							<div
								className={`drop-section ${appctx.background}`}
								onDrop={drop}
								onDragOver={allowDrop}
							>
								<div>
									<label htmlFor="uploadFile">
										Choose Ruleset directory
										<input
											id="uploadFile"
											type="file"
											onChange={chooseDirectory}
											webkitdirectory="true"
											multiple
										/>
									</label>{" "}
									or Drop Files
								</div>
								{state.files.length > 0 && <div className="file-drop-msg">{`${state.files.length} json files are dropped!`}</div>}
							</div>
						</div>
						<div className="btn-group">
							<Button
								label={"Upload"}
								onConfirm={handleUpload}
								classname="primary-btn"
								type="button"
							/>
							{!loggedIn && (
								<Button
									label={"Create"}
									onConfirm={() => navigate("/create-ruleset")}
									classname="primary-btn"
									type="button"
									disabled={state.files.length > 0}
								/>
							)}
						</div>
					</TitlePanel>
				</div>
				{!loggedIn && (
					<div className="footer-container home-page">
						<FooterLinks links={footerLinks} />
					</div>
				)}
			</div>
		</div>
	);
};

HomeContainer.propTypes = {
	rulenames: PropTypes.array,
	uploadRuleset: PropTypes.func,
	login: PropTypes.func,
	loggedIn: PropTypes.bool,
};

HomeContainer.defaultProps = {
	rulenames: [],
	uploadRuleset: () => false,
	login: () => false,
	loggedIn: false,
};

const mapStateToProps = state => ({
	rulenames: state.ruleset.rulesets.map((r, index) => r?.name || r?.id || "Ruleset " + index),
	loggedIn: state.app.loggedIn,
});

const mapDispatchToProps = dispatch => ({
	login: () => dispatch(login()),
	uploadRuleset: ruleset => dispatch(uploadRuleset(ruleset)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
