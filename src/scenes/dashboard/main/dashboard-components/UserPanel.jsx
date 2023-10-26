import './UserPanel.css';

import cn from 'classnames';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import clockIcon from '../../../../assets/dashheader-clock.png';
import friendsIcon from '../../../../assets/dashheader-friends.png';
import inviteIcon from '../../../../assets/dashheader-invite.png';
import rankIcon from '../../../../assets/dashheader-rank.png';
import scoreIcon from '../../../../assets/dashheader-score.png';
import winningsIcon from '../../../../assets/dashheader-winnings.png';

const UserPanel = ({ data }) => {
	const navigate = useNavigate();

	// Commented out the backend fetching line for testing
	// const userStatus = data?.userStatus;
	const userStatus = 'Open'; // Replace this with the actual user status
	const openToPlay = true; // Replace this with the actual open to play status

	const statusClasses = cn({
		'user-panel__profile-status': true,
		'user-panel__status-in-game': userStatus === 'In-Game',
		'user-panel__status-waiting': userStatus === 'Waiting',
		'user-panel__status-open': userStatus === 'Open',
	});

	return (
		<div className='user-panel__slider'>
			<div className='user-panel__slide'>
				<div className='user-panel'>
					<div className='user-panel__profile'>
						<div className='user-panel__profile-info'>
							<div className='user-panel__profile-username-status'>
								<div className='user-panel__profile-username'>
									@{data?.username}
									<div className={statusClasses}>
										{userStatus}
									</div>
								</div>
							</div>

							{data?.noGames ? (
								<div className='user-panel__profile-join'>
									Join game to see stats
								</div>
							) : (
								<>
									<div
										className='user-panel__icon-container'
										onClick={() => navigate('/gamelist')}
										onKeyDown={() => navigate('/gamelist')}
										role='button'
										tabIndex={0}
									>
										<img
											src={winningsIcon}
											alt='Winnings'
											className='user-panel__icon'
										/>
										<span className='user-panel__icon-label'>
											Wins
										</span>
										<div className='user-panel__game-info-value'>
											${data?.prize}
										</div>
									</div>
									{userStatus === 'In-Game' && (
										<div className='user-panel__game-info'>
											<div className='user-panel__Gamerank'>
												<div
													className='user-panel__icon-container'
													onClick={() =>
														navigate('/gamelist')
													}
													onKeyDown={() =>
														navigate('/gamelist')
													}
													role='button'
													tabIndex={0}
												>
													<img
														src={rankIcon}
														alt='Rank'
														className='user-panel__icon'
													/>
													<span className='user-panel__icon-label'>
														Rank
													</span>
													<div className='user-panel__game-info-value'>
														#{data?.rank}
													</div>
												</div>
											</div>
											<div className='user-panel__gamescore'>
												<div
													className='user-panel__icon-container'
													onClick={() =>
														navigate('/gamelist')
													}
													onKeyDown={() =>
														navigate('/gamelist')
													}
													role='button'
													tabIndex={0}
												>
													<img
														src={scoreIcon}
														alt='Score'
														className='user-panel__icon'
													/>
													<span className='user-panel__icon-label'>
														Score
													</span>
													<div className='user-panel__game-info-value'>
														{data?.score}
													</div>
												</div>
											</div>
										</div>
									)}
									{userStatus === 'Waiting' && (
										<div className='user-panel__game-info'>
											<div className='user-panel__game-info-label'>
												<img
													src={clockIcon}
													alt='Clock'
													className='user-panel__icon'
												/>
												Game Countdown
											</div>
											{/* <div className="user-panel__game-info-value">{gameCountdown}</div> */}
										</div>
									)}
									{userStatus === 'Open' && openToPlay && (
										<div className='user-panel__quick-action'>
											<button
												className='user-panel__join-button'
												onClick={() =>
													navigate('/gamejoin')
												}
												type='button'
											>
												Join Game
											</button>
										</div>
									)}
								</>
							)}
							{/* "Invites" and "Friends" sections are always visible */}
							<div className='user-panel__icons'>
								<div
									className='user-panel__icon-container'
									onClick={() => navigate('/gameinvites')}
									onKeyDown={() => navigate('/gameinvites')}
									role='button'
									tabIndex={0}
								>
									<img
										src={inviteIcon}
										alt='Invite'
										className='user-panel__icon'
									/>
									<span className='user-panel__icon-label'>
										Invites
									</span>
									<div className='user-panel__game-info-value'>
										{data?.invites}
									</div>
								</div>
								<div
									className='user-panel__icon-container'
									onClick={() => navigate('/friends')}
									onKeyDown={() => navigate('/friends')}
									role='button'
									tabIndex={0}
								>
									<img
										src={friendsIcon}
										alt='Friends'
										className='user-panel__icon'
									/>
									<span className='user-panel__icon-label'>
										Friends
									</span>
									<div className='user-panel__game-info-value'>
										{data?.score}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserPanel;
