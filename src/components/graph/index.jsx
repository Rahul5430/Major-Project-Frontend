import './Graph.css';

import React, { useEffect, useRef, useState } from 'react';
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import io from 'socket.io-client';

const Chart = () => {
	const [data, setData] = useState([]);

	const socketRef = useRef();

	// We limit the number of reads to the last 24 reading and drop the last read
	const limitData = (currentData, message) => {
		if (currentData.length > 24) {
			console.log('Limit reached, dropping first record!');
			currentData.shift();
		}
		return [
			...currentData,
			{
				id: message.date,
				sensorData: message.sensorData,
			},
		];
	};

	useEffect(() => {
		// Dummy data generation
		const generateDummyData = () => {
			const dummyData = [];
			const startDate = new Date();
			startDate.setHours(startDate.getHours() - 24); // Start 24 hours ago
			for (let i = 0; i < 24; i += 1) {
				const date = new Date(startDate);
				date.setHours(startDate.getHours() + i);
				const sensorData = Math.random() * 100; // Random sensor data
				dummyData.push({
					id: date.getTime(), // Unique ID for each data point
					date: date.toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					}),
					sensorData: sensorData.toFixed(2), // Limit to 2 decimal places
				});
			}
			return dummyData;
		};

		setData(generateDummyData());

		socketRef.current = io.connect(process.env.REACT_APP_BACKEND_URL);

		socketRef.current.on('message', (ev) => {
			const message = JSON.parse(ev.data);
			// console.log(`Received message :: ${message.sensorData}`);
			// Upon receiving websocket message then add it to the list of data that we are displaying
			// const newDataArray = [
			// 	...data,
			// 	{
			// 		id: message.date,
			// 		sensorData: message.sensorData,
			// 	},
			// ];
			// console.log(newDataArray);
			setData((currentData) => limitData(currentData, message));
		});

		return () => {
			socketRef.current.disconnect();
		};
	}, []);

	return (
		<div className='chart-page'>
			<div style={{ width: 1000, height: 400 }}>
				<ResponsiveContainer>
					<LineChart
						width={800}
						height={400}
						data={data}
						margin={{
							top: 0,
							right: 0,
							left: 0,
							bottom: 0,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='date' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line
							type='monotone'
							dataKey='sensorData'
							stroke='#8884d8'
							activeDot={{ r: 8 }}
							strokeWidth='2'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default Chart;
