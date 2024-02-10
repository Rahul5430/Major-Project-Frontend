import './Dashboard.css';

import Landing from '../../auth/Landing';
import DashLayout from '../../layouts/DashLayout';
import Sidebar from '../../layouts/Sidebar';

const Dashboard = () => {
	return (
		<DashLayout>
			{/* <div className='dashboard' /> */}
			<Sidebar />
			<Landing />
		</DashLayout>
	);
};

export default Dashboard;
