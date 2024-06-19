// component for user details
// user wallet balance and address

import React, { useEffect, useState } from 'react';
import { utils } from 'ethers';

const UserDetails = () => {
	const [userAddress, setUserAddress] = useState<string>('');
	const [userBalance, setUserBalance] = useState<string>('');

	useEffect(() => {
		async function getUserDetails() {
			if (window.ethereum) {
				let accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});

				// The current selected account out of the connected accounts.
				let userAddress = accounts[0];
				setUserAddress(userAddress);

				try {
					let balance = await window.ethereum.request({
						method: 'eth_getBalance',
						params: [userAddress, 'latest'],
					});
					let formattedBalance = utils.formatEther(balance);
					setUserBalance(formattedBalance);
				} catch (error: string | any) {
					alert('Error getting balance: ' + error.message);
				}
			}
		}

		getUserDetails();
	}, []);

	return (
		<div className="user-details">
			<h3>User Details</h3>
			<p>Your Address: {userAddress}</p>
			<p>Balance: {parseFloat(userBalance).toFixed(7)} CELO</p>
			<input id="to-address" type="text" placeholder="Enter Address to send to" />
		</div>
	);
};

export { UserDetails };
