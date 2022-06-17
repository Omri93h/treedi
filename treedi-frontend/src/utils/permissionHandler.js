import Notificator from "./Notificator";

const canEditScreen = (user, owner, editPermission, screenToWriteTo) => {
	if (user.email !== owner) {
		if (editPermission[user.email].indexOf(screenToWriteTo) === -1) {
			Notificator("edit-permission");
			return false;
		}
	}
	return true;
};

const canReadScreen = (user, owner, readPermission, screenToWriteTo) => {
	if (user.email !== owner) {
		if (readPermission[user.email].indexOf(screenToWriteTo) === -1) {
			return false;
		}
	}
	return true;
};

export { canEditScreen, canReadScreen };
