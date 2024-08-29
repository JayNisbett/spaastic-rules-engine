import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChildLink = ({ sublinks, isVisible, onConfirm, activeIndex }) =>
	isVisible &&
	sublinks.map((sublink, index) => (
		<ul
			className="sublink-container"
			key={`sublink_${index}`}
		>
			<li
				className={`sublink ${index === activeIndex ? "active" : ""}`}
				onClick={() => onConfirm(sublink)}
			>
				<Link
					to={`${sublink}`}
					onClick={e => e.preventDefault()}
					className="link"
				>
					<span className="text">{sublink}</span>
				</Link>
			</li>
		</ul>
	));

export default ChildLink;
