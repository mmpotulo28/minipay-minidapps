// component for user details
// user wallet balance and address

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const UserDetails = () => {
	const [userAddress, setUserAddress] = useState<string>('');
	const [userBalance, setUserBalance] = useState<string>('');

	useEffect(() => {
		async function getUserDetails() {
			if (window.ethereum) {
				try {
					let accounts = await window.ethereum.request({
						method: 'eth_requestAccounts',
					});

					let address = accounts[0];

					// get cUSD balance
					const provider = new ethers.providers.Web3Provider(window.ethereum);
					const contract = new ethers.Contract(
						'0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
						[
							'function balanceOf(address) view returns (uint)',
							'function decimals() view returns (uint8)',
						],
						provider,
					);

					const decimals = await contract.decimals();
					const balance = await contract.balanceOf(address);
					const formattedBalance = ethers.utils.formatUnits(balance, decimals);

					setUserAddress(address);
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
			<p className="balance">Balance: {parseFloat(userBalance).toFixed(7)} CELO</p>
			<input id="to-address" type="text" placeholder="Enter Address to send to" />
			<input id="amount" type="number" min={0} placeholder="Enter Amount to send (cUSD)" />
		</div>
	);
};

export { UserDetails };
