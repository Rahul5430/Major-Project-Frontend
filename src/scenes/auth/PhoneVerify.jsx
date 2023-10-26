import './Login.css';
import './Register.css';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';

import LandingBG from '../../assets/LandingInstructionsBG.jpg';
import InputField from '../../components/inputfields/InputField';
import { useAuthContext } from '../../hooks/authContext';
import usePost from '../../hooks/usePost';

const PhoneVerify = () => {
	const { setIsPhoneVerified } = useAuthContext();

	const [phone, setPhone] = useState('');
	const [error, setError] = useState('');

	const {
		isLoading: verifyLoading,
		error: verifyError,
		sendRequest: verifyPhone,
	} = usePost(
		`${process.env.REACT_APP_BACKEND_URL}/users/verifyPhone`,
		null,
		true
	);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');

		if (phone.length < 10) {
			setError('Phone numbers must be longer than 9 digits');
			return;
		}

		setError('');
		verifyPhone({ phone }, (data) => {
			if (verifyError && data.status !== 200) {
				console.error(verifyError);
				toast.error(data.message);
			} else {
				setIsPhoneVerified(true);
				toast.success(data.message);
				navigate('/dashboard');
			}
		});
	};

	const handleTAndC = () => navigate('/termsandconditions');
	const handlePrivacyPolicy = () => navigate('/privacypolicy');

	return (
		<Parallax
			bgImage={LandingBG}
			strength={500}
			className='login__bg'
			style={{ transition: 'transform 0.5s ease-out' }}
		>
			<div className='login__content'>
				<div className='login__box'>
					<h2 className='login__title'>Verify your Phone Number</h2>
					<form className='register__form' onSubmit={handleSubmit}>
						<InputField
							label='Phone'
							type='text'
							placeholder='Enter your phone number'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						{error && <p className='login__error'>{error}</p>}
						{verifyError && (
							<p className='login__error'>{verifyError}</p>
						)}
						{verifyLoading && (
							<p className='login__error'>Loading...</p>
						)}
						<button type='submit' className='login__button'>
							Verify
						</button>
					</form>
					<div className='login__footer'>
						<p className='login__footer-text'>
							By signing in, you agree to our
							<br />{' '}
							<span
								className='login__footer-link'
								onClick={handleTAndC}
								onKeyDown={handleTAndC}
								role='button'
								tabIndex={0}
							>
								T&amp;C
							</span>{' '}
							and{' '}
							<span
								className='login__footer-link'
								onClick={handlePrivacyPolicy}
								onKeyDown={handlePrivacyPolicy}
								role='button'
								tabIndex={0}
							>
								Privacy Policy
							</span>
							.
						</p>
					</div>
				</div>
			</div>
		</Parallax>
	);
};

export default PhoneVerify;
