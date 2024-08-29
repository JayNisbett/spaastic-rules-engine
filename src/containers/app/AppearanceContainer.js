import React, { useContext } from "react";
import { connect } from "react-redux";
import AppearanceContext from "@src/context/apperance-context";

const themes = [
	{ name: "Light", value: "light", class: "light-mode" },
	{ name: "Dark", value: "dark", class: "dark-mode" },
	{ name: "Midnight Blue", value: "md-blue", class: "mdblue-mode" },
];

const AppearanceContainer = () => {
	const { toggleBackground, background } = useContext(AppearanceContext);

	return (
		<div
			style={{
				marginLeft: "320px",
				paddingLeft: "20px",
			}}
		>
			<h3>Theme</h3>
			<div className="theme-container">
				{themes.map(theme => (
					<div
						className="theme-icon"
						key={theme.value}
					>
						<span className={theme.class}></span>
						<div>
							<input
								type="radio"
								name="themeMode"
								value={theme.value}
								checked={background === theme.value}
								onClick={e => toggleBackground(e.target.value)}
							/>
							{theme.name}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

const mapStateToProps = () => {};

const mapDispatchToProps = () => {};

export default connect(mapStateToProps, mapDispatchToProps)(AppearanceContainer);
