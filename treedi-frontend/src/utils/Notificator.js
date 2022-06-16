import { toast } from "react-toastify";

const Notificator = (notification) => {
	switch (notification) {
		case "share-success":
			toast.success("Shared Successfully", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			break;
		case "share-error":
			toast.error("Load error", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			break;
		default:
			toast.info("Notification Not Working.....", {
				position: "bottom-left",
				autoClose: 800,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
			break;
	}
};

export default Notificator;
