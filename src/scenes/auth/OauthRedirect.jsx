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
	const isPhoneVerified = searchParams.get('isPhoneVerified') === 'true';

	if (token) {
		const data = { token };
		setToken(data, isPhoneVerified);
	} else {
		return <OauthFail />;
	}

	return <Navigate to='/verifyPhone' />;
};

export default OauthRedirect;
