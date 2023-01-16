import React, { useState, useEffect } from "react";
import Header from '../Header/Header';
import { useDispatch, useSelector } from "react-redux";
import { userLastActivity } from "../../redux/users/userActions";

const PrivateLayout = ({ title, children }) => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.user?.user);
	const [isActive, setActive] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

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
		if (!localStorage.uToken) {
			if (localStorage.userInfo)
				window.location.href = '/welcome-back';
			else
				window.location.href = '/login';
		}
		// if (localStorage.userType == 'admin') {
		// 	axios.get("/admin/logout").then((errors) => { });
		// 	localStorage["userType"] = 'user';
		// } else {
		// 	localStorage["userType"] = 'user';
		// }
	}, []);

	useEffect(() => {
		if (localStorage.uToken && userData._id) {
			dispatch(userLastActivity(userData._id));
			setInterval(() => {
				dispatch(userLastActivity(userData._id));
			}, 20000);
		}
	}, [userData]);

	return (
		localStorage.uToken ?
			<div className="wrapper">
				<Header />
				{children}
			</div>
			: null

	);
};
export default PrivateLayout;
