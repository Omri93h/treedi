import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Home from "./Home";
import App from "./App";
// import TreediDraw from './TreediDraw';

function Routing() {
	const [loginData, setLoginData] = useState(
		localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null
	);

	const handleLogout = () => {
		setLoginData(null);
	};

	const handleLogin = (data) => {
		setLoginData(data);
	};

	return (
		<Routes>
			<Route exact path='/' element={<Home handleLogin={handleLogin} />}></Route>
			{/* <Route path="/homepage" element={<App />}>
        </Route> */}
			{/* <Route path="/treedi" element={<TreediDraw handleLogout={handleLogout}/>}>
        </Route> */}
			<Route path='/treedi' element={<App handleLogout={handleLogout} />}></Route>
		</Routes>
	);
}
export default Routing;
