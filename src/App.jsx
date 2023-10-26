import './App.css';

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { IfLoggedIn, RequireAuth } from './hooks/authContext';
import PhoneVerify from './scenes/auth/PhoneVerify';
import Loading from './scenes/fallbacks/Loading';

// oauth redirect funciton
const OauthFail = React.lazy(() => import('./scenes/auth/OauthFail'));
const OauthRedirect = React.lazy(() => import('./scenes/auth/OauthRedirect'));
const Error404 = React.lazy(() => import('./scenes/fallbacks/NotFound'));
const Layout = React.lazy(() => import('./scenes/layouts/Layout'));
const ForgotPassword = React.lazy(() => import('./scenes/auth/ForgotPassword'));
const Landing = React.lazy(() => import('./scenes/auth/Landing'));
const Login = React.lazy(() => import('./scenes/auth/Login'));
const Register = React.lazy(() => import('./scenes/auth/Register'));
const Dashboard = React.lazy(() =>
	import('./scenes/dashboard/main/Dashboard.jsx')
);
const User = React.lazy(() => import('./scenes/dashboard/main/User'));

function App() {
	return (
		<Router>
			<Routes>
				{/* fallback is * path */}
				<Route exact path='*' element={<Error404 />} />
				<Route path='oauth' element={<OauthRedirect />} />
				<Route
					path='oauthFail'
					element={
						<IfLoggedIn>
							<Suspense fallback={<Loading />}>
								<OauthFail />
							</Suspense>
						</IfLoggedIn>
					}
				/>
				<Route
					path='/'
					element={
						<Suspense fallback={<Loading />}>
							<Layout />
						</Suspense>
					}
				>
					<Route
						path='/'
						element={
							<Suspense fallback={<Loading />}>
								<Landing />
							</Suspense>
						}
					/>
					<Route
						path='/forgotpassword'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<ForgotPassword />
								</Suspense>
							</IfLoggedIn>
						}
					/>
					<Route
						path='/register'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<Register />
								</Suspense>
							</IfLoggedIn>
						}
					/>
					<Route
						path='/login'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<Login />
								</Suspense>
							</IfLoggedIn>
						}
					/>
					<Route
						path='/loginfail'
						element={
							<IfLoggedIn>
								<Suspense fallback={<Loading />}>
									<OauthFail />
								</Suspense>
							</IfLoggedIn>
						}
					/>
				</Route>
				{/* all below are protected routes */}

				<Route
					path='/'
					element={
						<Suspense fallback={<Loading />}>
							<Layout />
						</Suspense>
					}
				>
					<Route
						path='/verifyPhone'
						element={
							<RequireAuth>
								<Suspense fallback={<Loading />}>
									<PhoneVerify />
								</Suspense>
							</RequireAuth>
						}
					/>
				</Route>
				<Route
					path='/dashboard'
					element={
						<RequireAuth>
							<Suspense fallback={<Loading />}>
								<Dashboard />
							</Suspense>
						</RequireAuth>
					}
				/>
				<Route
					path='/user'
					element={
						<RequireAuth>
							<Suspense fallback={<Loading />}>
								<User />
							</Suspense>
						</RequireAuth>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
