const canEditScreen = (user, owner, editPermission, screenToWriteTo) => {

	if (user.email !== owner) {
		if (editPermission[user.email].indexOf(screenToWriteTo) === -1) {
			return false;
		}
	}
	return true;
};

const canReadScreen = () => {
	return;
};

export { canEditScreen, canReadScreen };
