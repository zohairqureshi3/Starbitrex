import React, { useState, useEffect } from "react";
import Header from './Header';
import NavigationMenu from "./NavigationMenu";
import { useDispatch, useSelector } from "react-redux";
import { userLastActivity } from "../redux/users/userActions";

const PrivateLayout = ({ title, children }) => {
	const [isActive, setActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

	const dispatch = useDispatch();

	const toggleClass = () => {
		setActive(!isActive);
	};

	useEffect(() => {
		if (title)
			document.title = title;
		else
			document.title = "StarBitrex";
	}, [title]);

	useEffect(() => {
		if (!localStorage.token) {
			window.location.href = '/admin/login';
		} else {
			if (localStorage.userId) {
				let validateUserId = localStorage.userId.slice(1, -1);
				dispatch(userLastActivity(validateUserId));
				// setInterval(() => {
				// 	dispatch(userLastActivity(validateUserId));
				// }, 60000);
			}
		}
	}, []);

	return (
		localStorage.token ?
			<>
				<Header />
				<div className="dashboard-wrapper main-padding">
					<div className="row">
						<NavigationMenu />
						{children}
					</div>
				</div>
			</>
			: null
	);
};
export default PrivateLayout;
