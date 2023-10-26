/* eslint-disable react/jsx-no-useless-fragment */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

const useAuthContext = () => useContext(AuthContext);

function AuthProvider({ children }) {
	const [isPhoneVerified, setIsPhoneVerified] = useState(true);
	const [authState, setAuthState] = useState(() => {
		const storedToken = localStorage.getItem('stockbettoken');
		return storedToken ? JSON.parse(storedToken) : null;
	});

	const isAuth = authState !== null;

	// eslint-disable-next-line no-shadow
	const loginHandler = (token, isPhoneVerified = true) => {
		setIsPhoneVerified(isPhoneVerified);
		setAuthState(token);
		localStorage.setItem('stockbettoken', JSON.stringify(token));
		toast.success('Logged-In Successfully');
	};

	const logoutHandler = (noToast = false) => {
		setAuthState(null);
		localStorage.removeItem('stockbettoken');
		if (!noToast) toast.success('Logged-Out Successfully');
	};

	useEffect(() => {
		// eslint-disable-next-line consistent-return
		const checkIsUserVerified = async () => {
			const url = `${process.env.REACT_APP_BACKEND_URL}/users/isUserVerified`;
			const headers = { Authorization: `Bearer ${authState.token}` };

			try {
				const result = await fetch(url, { method: 'GET', headers });
				if (result.status === 403) {
					toast('Session timeout!');
					return logoutHandler();
				}
				const data = await result.json();
				if (data.error === 'User not found') {
					return logoutHandler();
				}
				setIsPhoneVerified(data.isPhoneVerified);
			} catch (error) {
				console.error(error);
			}
		};

		if (authState) {
			checkIsUserVerified();
		}
	}, [authState]);

	const authObject = useMemo(
		() => ({
			isAuth,
			isPhoneVerified,
			authState,
			loginHandler,
			logoutHandler,
			setIsPhoneVerified,
		}),
		[isAuth, isPhoneVerified, authState]
	);

	return (
		<AuthContext.Provider value={authObject}>
			{children}
		</AuthContext.Provider>
	);
}

function RequireAuth({ children }) {
	const location = useLocation();
	const authObject = useAuthContext();

	if (!authObject.isAuth) {
		return <Navigate to='/login' state={{ from: location.pathname }} />;
	}

	if (!authObject.isPhoneVerified && location.pathname !== '/verifyPhone') {
		return <Navigate to='/verifyPhone' />;
	}

	if (authObject.isPhoneVerified && location.pathname === '/verifyPhone') {
		return <Navigate to='/dashboard' />;
	}

	return <>{children}</>;
}

function IfLoggedIn({ children }) {
	const authObject = useAuthContext();
	const location = useLocation();
	const pathName = location.state?.from || '/dashboard';

	if (authObject.isAuth) {
		return <Navigate to={pathName} state={{ from: location.pathname }} />;
	}

	return <>{children}</>;
}

export { AuthProvider, IfLoggedIn, RequireAuth, useAuthContext };
