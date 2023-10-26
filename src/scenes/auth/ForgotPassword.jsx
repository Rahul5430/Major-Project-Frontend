import './ForgotPassword.css';

import React, { useState } from 'react';
import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';

import LandingBG from '../../assets/LandingInstructionsBG.jpg';
import InputField from '../../components/inputfields/InputField';
import usePost from '../../hooks/usePost';

const ForgotPassword = () => {
	const navigate = useNavigate();
	const handleBackToLogin = () => navigate('/login');

	const [step, setStep] = useState(1);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [token, setToken] = useState(null);
	const [error, setError] = useState('');

	const {
		error: step1PostError,
		sendRequest: step1SendRequest,
		isLoading: step1Loading,
	} = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/auth/forgotPassword/check`
	);

	const { error: step2PostError, sendRequest: step2SendRequest } = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/auth/forgotPassword/verify`
	);

	const { error: step3PostError, sendRequest: step3SendRequest } = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/auth/forgotPassword/reset`
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			if (step === 1) {
				step1SendRequest(
					{
						email,
					},
					(data) => {
						if (data.emailDoesNotExist || step1PostError) {
							setError('Email doesnt already exists.');
						} else {
							// Proceed to the next step
							setError('');
							setStep(2);
						}
					}
				);
			} else if (step === 2) {
				// Verify OTP
				step2SendRequest(
					{
						otp,
						email,
					},
					(data) => {
						if (step2PostError) {
							console.log(step2PostError);
							setError('Wrong OTP.');
						} else {
							// Proceed to the next step
							setToken(data.token);
							setError('');
							setStep(3);
						}
					}
				);
			} else if (step === 3) {
				// Update password
				console.log('step3');
				step3SendRequest(
					{
						email,
						new_password: newPassword,
						token,
					},
					(data) => {
						if (step3PostError) {
							console.log(data);
							setError(data.message);
						} else {
							// Proceed to the next step
							setError('');
							setStep(3);
							navigate('/login');
						}
					}
				);
			}
		} catch (err) {
			setError('An error occurred, please try again later');
		}
	};

	const renderStep1 = () => {
		return (
			<>
				<h2 className='forgot-password__title'>Forgot Password</h2>
				<form className='forgot-password__form' onSubmit={handleSubmit}>
					<InputField
						label='Email'
						type='email'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<button type='submit' className='forgot-password__button'>
						Reset Password
					</button>
					{step1Loading && (
						<h2 className='forgot-password__title'>...</h2>
					)}
				</form>
				{error && <p className='forgot-password__error'>{error}</p>}
				<a
					href='/login'
					onClick={handleBackToLogin}
					className='forgot-password__back-link'
				>
					Back to Login
				</a>
			</>
		);
	};

	const renderStep2 = () => {
		return (
			<>
				<h2 className='forgot-password__title'>Verify OTP</h2>
				<form className='forgot-password__form' onSubmit={handleSubmit}>
					<InputField
						label='OTP'
						type='text'
						placeholder='Enter the OTP we sent to your email'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
					/>
					<button type='submit' className='forgot-password__button'>
						Verify OTP
					</button>
				</form>
				{error && <p className='forgot-password__error'>{error}</p>}
				<a
					href='/login'
					onClick={handleBackToLogin}
					className='forgot-password__back-link'
				>
					Back to Login
				</a>
			</>
		);
	};

	const renderStep3 = () => {
		return (
			<>
				<h2 className='forgot-password__title'>Set New Password</h2>
				<form className='forgot-password__form' onSubmit={handleSubmit}>
					<InputField
						label='New Password'
						type='password'
						placeholder='Enter your new password'
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					<button type='submit' className='forgot-password__button'>
						Update Password
					</button>
				</form>
				{error && <p className='forgot-password__error'>{error}</p>}
				<a
					href='/login'
					onClick={handleBackToLogin}
					className='forgot-password__back-link'
				>
					Back to Login
				</a>
			</>
		);
	};

	const renderCurrentStep = () => {
		switch (step) {
			case 1:
				return renderStep1();
			case 2:
				return renderStep2();
			case 3:
				return renderStep3();
			default:
				return null;
		}
	};

	return (
		<Parallax
			bgImage={LandingBG}
			strength={500}
			className='forgot-password__bg'
			style={{ transition: 'transform 0.5s ease-out' }}
		>
			<div className='forgot-password__content'>
				<div className='forgot-password__box'>
					{renderCurrentStep()}
				</div>
			</div>
		</Parallax>
	);
};

export default ForgotPassword;
