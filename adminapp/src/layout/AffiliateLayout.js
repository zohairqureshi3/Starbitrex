import React, { useState, useEffect } from "react";
import AffiliateHeader from "./AffiliateHeader";
import AffiliateNavigationMenu from "./AffiliateNavigationMenu";

const AffiliateLayout = ({ title, children }) => {
	useEffect(() => {
		if (title)
			document.title = title;
		else
			document.title = "StarBitrex";
	}, [title]);

	useEffect(() => {
		if (!localStorage.affToken) {
			window.location.href = '/';
		}
	}, []);

	return (
		localStorage.affToken ?
			<>
				<AffiliateHeader />
				<div className="dashboard-wrapper main-padding">
					<div className="row">
						<AffiliateNavigationMenu />
						{children}
					</div>
				</div>
			</>
			: null
	);
};
export default AffiliateLayout;
