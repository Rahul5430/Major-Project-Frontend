import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { useAuthContext } from '../../hooks/authContext';
import OauthFail from './OauthFail';

const OauthRedirect = () => {
	// get loginHandler function
	const authObject = useAuthContext();
	const setToken = authObject?.loginHandler;

	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	if (token) {
		const data = { token };
		setToken(data);
	} else {
		return <OauthFail />;
	}

	return <Navigate to='/dashboard' />;
};

export default OauthRedirect;
