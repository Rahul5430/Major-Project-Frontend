import './DashLayout.css';

import React from 'react';

import DashBG from '../../assets/DashBG.png';
import DashHeader from './DashHeader';

function DashLayout({ children }) {
	return (
		<div
			className='dash-layout'
			style={{ backgroundImage: `url(${DashBG})` }}
		>
			<DashHeader />
			{children}
		</div>
	);
}

export default DashLayout;
