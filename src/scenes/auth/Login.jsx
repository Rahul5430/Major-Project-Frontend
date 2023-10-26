import './Login.css';
import './Register.css';

import React, { useState } from 'react';
import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';

import LandingBG from '../../assets/LandingInstructionsBG.jpg';
import GoogleOauth from '../../components/auth/oauth';
import InputField from '../../components/inputfields/InputField';
import { useAuthContext } from '../../hooks/authContext';
import usePost from '../../hooks/usePost';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const auth = useAuthContext();
	const { loginHandler } = auth;

	const {
		isLoading,
		error: postError,
		sendRequest,
		resetError,
	} = usePost(`${process.env.REACT_APP_BACKEND_URL}/auth/login`);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		resetError();

		if (!email) {
			setError('Enter Email or username!');
			return;
		}

		if (!password) {
			setError('Password cannot be empty!');
			return;
		}

		setError('');
		sendRequest({ email, password }, (data) => {
			loginHandler(data);
		});
	};

	const handleForgotPassword = () => navigate('/forgotpassword');
	const handleSignUp = () => navigate('/register');

	return (
		<Parallax
			bgImage={LandingBG}
			strength={500}
			className='login__bg'
			style={{ transition: 'transform 0.5s ease-out' }}
		>
			<div className='login__content'>
				<div className='login__box'>
					<div className='login__social'>
						<GoogleOauth />
					</div>
					<div className='login__divider'>
						<span className='login__divider-line' />
						<span className='login__divider-text'>or</span>
						<span className='login__divider-line' />
					</div>
					<form className='register__form' onSubmit={handleSubmit}>
						<InputField
							label='Username'
							type='string'
							placeholder='Enter your email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<InputField
							label='Password'
							type='password'
							placeholder='Enter your password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{error && <p className='login__error'>{error}</p>}
						{postError && (
							<p className='login__error'>{postError}</p>
						)}
						{isLoading && (
							<p className='login__error'>Loading...</p>
						)}
						<button type='submit' className='login__button'>
							Login
						</button>
					</form>
					<a
						href='/forgotpassword'
						onClick={handleForgotPassword}
						className='login__button_2 login__form'
					>
						Forgot password?
					</a>
					<p className='login__signup-text'>
						Don't have an account?{' '}
						<span
							className='login__signup-link'
							onClick={handleSignUp}
							onKeyDown={handleSignUp}
							role='button'
							tabIndex={0}
						>
							Sign Up
						</span>
					</p>
				</div>
			</div>
		</Parallax>
	);
};

export default Login;
