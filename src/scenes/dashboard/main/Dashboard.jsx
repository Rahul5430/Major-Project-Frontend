import './Dashboard.css';

import DashLayout from '../../layouts/DashLayout';
import Sidebar from '../../layouts/Sidebar';

const Dashboard = () => {
	return (
		<DashLayout>
			<div className='dashboard'>
				<Sidebar />
			</div>
		</DashLayout>
	);
};

export default Dashboard;
