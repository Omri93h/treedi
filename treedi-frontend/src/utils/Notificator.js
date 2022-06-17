import { toast } from "react-toastify";

const Notificator = (notification) => {
	const notificationParams = {
		position: "bottom-left",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	};
	const infoParams = {
		position: "bottom-left",
		autoClose: 3000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	};

	switch (notification) {
		// SAVE
		case "saving":
			toast.info("Saving File ...", infoParams);
			break;
		case "save-success":
			toast.success("Saved Successfully", notificationParams);
			break;
		case "save-error":
			toast.error("Could not save file", notificationParams);
			break;
		// LOAD
		case "loading":
			toast.info("Loading File ...", infoParams);
			break;
		case "load-success":
			toast.success("Loaded Successfully", notificationParams);
			break;
		case "load-error":
			toast.error("Could not load file", notificationParams);
			break;

		// SHARE
		case "share-success":
			toast.success("Shared Successfully", notificationParams);
			break;
		case "share-error":
			toast.error("Share Error", notificationParams);
			break;

		// EDIT PERMISSON ERROR
		case "edit-permission":
			toast.error("You are not permitted to edit this layer", notificationParams);
			break;
		//DEFAULT
		default:
			toast.info("Notification Not Working.....", infoParams);
			break;
	}
};

export default Notificator;
