/* eslint-disable no-unused-vars */
import './Register.css';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';

import LandingBG from '../../assets/LandingInstructionsBG.jpg';
import GoogleOauth from '../../components/auth/oauth';
import InputField from '../../components/inputfields/InputField';
import { useAuthContext } from '../../hooks/authContext';
import usePost from '../../hooks/usePost';

const Register = () => {
	const [step, setStep] = useState(1);
	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [username, setUsername] = useState('');
	const [phone, setPhone] = useState('');
	const [enteredOtpCode, setEnteredOtpCode] = useState('');
	const [bio, setBio] = useState('');
	const [website, setWebsite] = useState('');
	const [profilePic, setProfilePic] = useState('');
	const [referralCode, setReferralCode] = useState('');
	const [error, setError] = useState('');

	const auth = useAuthContext();
	const { loginHandler } = auth;

	const {
		isLoading: step0Loading,
		error: step0PostError,
		sendRequest: step0SendRequest,
	} = usePost(`${process.env.REACT_APP_BACKEND_URL}/auth/checkUsername`);

	const { isLoading: step1Loading, sendRequest: step1SendRequest } = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/auth/register`
	);
	const {
		isLoading: step2Loading,
		error: step2PostError,
		sendRequest: step2SendRequest,
	} = usePost(`${process.env.REACT_APP_BACKEND_URL}/auth/verify`);

	const {
		isLoading: step3Loading,
		error: step3PostError,
		sendRequest: step3SendRequest,
	} = usePost(`${process.env.REACT_APP_BACKEND_URL}/auth/registerDetails`);

	const handleBack = () => {
		setError('');
		setStep((prevStep) => Math.max(prevStep - 1, 1));
	};

	const handleStepOneSubmit = (e) => {
		e.preventDefault();
		setError('');

		if (!fullName || !username || !password || !confirmPassword) {
			setError('All fields should be filled!');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		// Check username availability
		step0SendRequest(
			{
				username,
			},
			(data) => {
				if (data.usernameExists) {
					setError(
						'Username already exists. Please choose a different one.'
					);
				} else {
					// Proceed to the next step
					setError('');
					setStep(2);
				}
			}
		);
	};

	const handleStepTwoSubmit = (e) => {
		e.preventDefault();
		setError('');

		if (!phone || !email) {
			setError('All fields should be filled!');
			return;
		}

		if (phone.length < 10) {
			setError('Phone numbers must be longer than 9 digits');
			return;
		}

		step1SendRequest(
			{
				username,
				name: fullName,
				phone,
				email,
				password,
			},
			(data) => {
				console.log(data);
				setError('');
				setStep(3);
			}
		);
		// Proceed to the next step
	};

	const handleStepThreeSubmit = (e) => {
		e.preventDefault();
		setError('');

		if (!enteredOtpCode) {
			setError('Enter otp sent to your email!');
			return;
		}

		step2SendRequest(
			{
				email,
				otp: enteredOtpCode,
			},
			(data) => {
				console.log(data);
				setStep(4);
				toast.success('Your mail has been verified!!');
			}
		);
	};

	const handleStepFourSubmit = (e) => {
		e.preventDefault();
		setError('');

		step3SendRequest(
			{
				email,
				bio,
				referralCode,
				website,
				profilePic,
			},
			(data) => {
				loginHandler(data);
			}
		);
	};

	const navigate = useNavigate();
	const handleSignIn = () => navigate('/login');
	const handleTAndC = () => navigate('/termsandconditions');
	const handlePrivacyPolicy = () => navigate('/privacypolicy');

	const renderStepOne = () => (
		<>
			<h2 className='register__title'>Join StockBets today</h2>
			<div className='register__social'>
				<GoogleOauth />
			</div>
			<div className='register__divider'>
				<span className='register__divider-line' />
				<span className='register__divider-text'>or</span>
				<span className='register__divider-line' />
			</div>
			<form className='register__form' onSubmit={handleStepOneSubmit}>
				<InputField
					label='Full Name'
					type='text'
					placeholder='Enter your full name'
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
				<InputField
					label='Username'
					type='text'
					placeholder='Enter your username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<InputField
					label='Password'
					type='password'
					placeholder='Enter your password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<InputField
					label='Confirm Password'
					type='password'
					placeholder='Confirm your password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<button type='submit' className='register__button'>
					Create Account
				</button>
			</form>
			{error && <p className='register__error'>{error}</p>}
			{step0Loading && <p className='register__error'>Loading...</p>}
			{step0PostError && (
				<p className='register__error'>{step0PostError}</p>
			)}
			<p className='register__signup-text'>
				Have an account already?{' '}
				<span
					className='register__signup-link'
					onClick={handleSignIn}
					onKeyDown={handleSignIn}
					role='button'
					tabIndex={0}
				>
					Sign In
				</span>
			</p>
		</>
	);

	const renderStepTwo = () => (
		<>
			<h2 className='register__title'>1/3 Enter Email and Phone</h2>
			<form className='register__form' onSubmit={handleStepTwoSubmit}>
				<InputField
					label='Email'
					type='email'
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<InputField
					label='Phone'
					type='text'
					placeholder='Enter your phone number'
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
				/>
				<button
					type='submit'
					className='register__button'
					disabled={step1Loading}
				>
					Next
				</button>
			</form>
		</>
	);

	const renderStepThree = () => (
		<>
			<h2 className='register__title'>2/3 Verify Email</h2>
			<form className='register__form' onSubmit={handleStepThreeSubmit}>
				<InputField
					label='otp'
					type='text'
					placeholder='Enter the code sent to your email'
					value={enteredOtpCode}
					onChange={(e) => setEnteredOtpCode(e.target.value)}
				/>
				{error && <p className='register__error'>{error}</p>}
				{step2Loading && <p className='register__error'>Loading...</p>}
				{step2PostError && (
					<p className='register__error'>{step2PostError}</p>
				)}
				<button type='submit' className='register__button'>
					Next
				</button>
			</form>
		</>
	);

	const renderStepFour = () => (
		<>
			<h2 className='register__title'>3/3 Complete Sign Up</h2>
			<form className='register__form' onSubmit={handleStepFourSubmit}>
				<InputField
					label='Referral Code (optional)'
					type='text'
					placeholder='Enter your referral code (optional)'
					value={referralCode}
					onChange={(e) => setReferralCode(e.target.value)}
				/>
				{error && <p className='register__error'>{error}</p>}
				{step3Loading && <p className='register__error'>Loading...</p>}
				{step3PostError && (
					<p className='register__error'>{step3PostError}</p>
				)}
				<button type='submit' className='register__button'>
					Finish
				</button>
			</form>
		</>
	);

	const renderStepContent = () => {
		switch (step) {
			case 1:
				return renderStepOne();
			case 2:
				return renderStepTwo();
			case 3:
				return renderStepThree();
			case 4:
				return renderStepFour();
			default:
				return null;
		}
	};

	return (
		<Parallax
			bgImage={LandingBG}
			strength={200}
			className='register__bg'
			style={{ transition: 'transform 0.5s ease-out' }}
		>
			<div className='register__content'>
				<div className='register__box'>
					{renderStepContent()}
					{/* Back button */}
					{step !== 1 && (
						<button
							onClick={handleBack}
							className='register__button register__back-button'
							type='button'
						>
							Back
						</button>
					)}
				</div>
			</div>
		</Parallax>
	);
};

export default Register;
