import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const ParentLink = ({ link, onConfirm, isVisible }) => (
	<li
		className={link?.linkClass || "parent-link"}
		onClick={onConfirm}
	>
		<Link
			to={`${link.navigate}`}
			onClick={e => e.preventDefault()}
			className={`link ${isVisible ? "active" : ""}`}
		>
			<span className={link?.iconClass} />
			{<FontAwesomeIcon icon={link?.fontIcons} />}
			<span className="text">{link?.name}</span>
		</Link>
	</li>
);

export default ParentLink;
