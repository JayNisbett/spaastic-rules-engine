import React, { useState, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSquarePlus, faCloudArrowUp, faSliders } from "@fortawesome/free-solid-svg-icons";
import NavigationLinks from "./NavigationLinks"; // Assuming this is used elsewhere or remove if not used
import ApperanceContext from "@src/context/apperance-context";
import { useDispatch } from "react-redux";
import { fetchAndSetRule } from "@src/reducers/actions/ruleset";
import { fetchRule } from "@src/rules/index.mjs";
import FooterLinks from "../footer/footer";
import footerLinks from "../../data-objects/footer-links.json";

const mainLinks = [
	{ name: "Create Rules", navigate: "/create-ruleset", iconClass: "icon", fontIcons: faSquarePlus, linkClass: "navmenu" },
	{ name: "Upload Rules", navigate: "/home", iconClass: "icon", fontIcons: faCloudArrowUp, linkClass: "navmenu" },
	{ name: "Appearance", navigate: "/appearance", iconClass: "icon", fontIcons: faSliders, linkClass: "navmenu" },
];

const ParentLink = ({ link, onConfirm }) => (
	<li className={link.linkClass || "parent-link"}>
		<Link
			to={link.navigate}
			onClick={onConfirm}
			className="link active"
		>
			<FontAwesomeIcon
				icon={link.fontIcons}
				className={link.iconClass}
			/>
			<span className="text">{link.name}</span>
		</Link>
	</li>
);

ParentLink.propTypes = {
	link: PropTypes.object.isRequired,
	onConfirm: PropTypes.func.isRequired,
};

const ChildLink = ({ sublinks, isVisible, onConfirm }) =>
	isVisible && (
		<ul className="sublink-container">
			{sublinks.map((sublink, index) => (
				<li
					className="sublink"
					key={`${sublink.id}-${index}`}
				>
					<Link
						to={sublink.navigate}
						onClick={() => onConfirm(sublink.navigate)}
						className="link"
					>
						<span className="text">{sublink.name}</span>
					</Link>
				</li>
			))}
		</ul>
	);

ChildLink.propTypes = {
	sublinks: PropTypes.array.isRequired,
	isVisible: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func.isRequired,
};

const NavigationPanel = ({ closedState, rulenames, setActiveRulesetIndex }) => {
	const [links, setLinks] = useState(mainLinks);
	const doNavigate = useNavigate();
	const dispatch = useDispatch();
	const { background } = useContext(ApperanceContext);

	useEffect(() => {
		if (rulenames.length > 0) {
			const uniqueNewLinks = rulenames
				.map(rule => {
					const { name, id } = rule;
					return {
						name,
						id,
						navigate: `/ruleset/${id}`,
						iconClass: "icon",
						fontIcons: faSquarePlus,
						linkClass: "navmenu",
					};
				})
				.filter((item, index, self) => {
					return index === self.findIndex(t => t.name === item.name);
				});

			setLinks([...mainLinks, ...uniqueNewLinks]);
		}
	}, [rulenames]);

	/* 	useEffect(() => {
		const user = new UserSettings(userData);
		user.authenticateDefaultUser();
		user.createDefaultRules();

		const rules = ["19cf5d07-2391-4410-b262-d0625dcaba54"];
		rules.forEach(rule => {
			dispatch(user.fetchAndSetRule(rule, "ruleset"));
		});
	}, [dispatch]); */

	const handleNavLink = navigate => {
		doNavigate(navigate);
	};

	return (
		<div className={`nav-container ${closedState ? "closed" : "open"} ${background}`}>
			<div className="menu-bar">
				<a
					href="#"
					onClick={e => {
						e.preventDefault();
						// Assuming updateState is defined somewhere globally or this needs a specific handler
					}}
				>
					<FontAwesomeIcon
						icon={faBars}
						className="close-icon"
					/>
				</a>
			</div>
			<div className="links-section">
				<ul className="link-container">
					{links.map((link, index) => (
						<React.Fragment key={link.id + "_" + index}>
							<ParentLink
								link={link}
								onConfirm={() => handleNavLink(link.navigate)}
							/>
							{/* {links.filter(link => rulenames.map(item => item.name).includes(link.name)).length > 0 && (
								<ChildLink
									sublinks={links.filter(link => rulenames.map(item => item.name).includes(link.name))}
									isVisible={true}
									onConfirm={handleNavLink}
								/>
							)} */}
						</React.Fragment>
					))}
				</ul>
			</div>
			<FooterLinks links={footerLinks} />
		</div>
	);
};

NavigationPanel.propTypes = {
	closedState: PropTypes.bool.isRequired,
	rulenames: PropTypes.object.isRequired,
	setActiveRulesetIndex: PropTypes.func.isRequired,
};

export default NavigationPanel;
