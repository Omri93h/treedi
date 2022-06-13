import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Routing from "./route";

ReactDOM.render(
	<BrowserRouter>
		<Routing />
	</BrowserRouter>,
	document.getElementById("root")
);
