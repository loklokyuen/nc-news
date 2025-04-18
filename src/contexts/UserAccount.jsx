import { createContext, useEffect, useState } from "react";
import { getUserInfoByUsername } from "../api";

export const UserAccount = createContext(null);

export const UserAccountProvider = ({ children }) => {
	const [loggedInUser, setLoggedInUser] = useState(null);
	const [displayName, setDisplayName] = useState(null);
	const [avatarURL, setAvatarURL] = useState(null);
	useEffect(() => {
		getUserInfoByUsername("jessjelly").then(({ user }) => {
			setLoggedInUser(user.username);
			setDisplayName(user.name);
			setAvatarURL(user.avatar_url);
		});
	}, []);
	return (
		<UserAccount.Provider value={{ loggedInUser, displayName, avatarURL }}>
			{children}
		</UserAccount.Provider>
	);
};
