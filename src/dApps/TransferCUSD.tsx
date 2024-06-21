import { utils } from 'ethers';
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

// Mainnet address of cUSD
const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
let receiverAddress = '0x0717329C677ab484EAA73F4C8EEd92A2FA948746';

// DApp to quickly test transfer of cUSD to a specific address using the cUSD contract.
export default function TransferCUSD() {
	const publicClient = createPublicClient({
		chain: celo,
		transport: http(),
	});

	async function checkIfTransactionSucceeded(publicClient: any, transactionHash: string) {
		let receipt = await publicClient.getTransactionReceipt({
			hash: transactionHash,
		});

		return receipt.status === 'success';
	}

	async function transferCUSD() {
		console.log('Transfer cUSD');

		if (window.ethereum) {
			let statusText = document.querySelector('.status-text');
			const toAddress = document.getElementById('to-address') as HTMLInputElement;
			receiverAddress = toAddress.value || '0x0717329C677ab484EAA73F4C8EEd92A2FA948746';
			let accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			// The current selected account out of the connected accounts.
			let userAddress = accounts[0];
			statusText!.textContent = 'Connected account: ' + userAddress;

			let iface = new utils.Interface(['function transfer(address to, uint256 value)']);
			let calldata = iface.encodeFunctionData('transfer', [receiverAddress, utils.parseUnits('1', 2)]);

			try {
				statusText!.textContent = 'Sending transaction...';
				let tx = await window.ethereum.request({
					method: 'eth_sendTransaction',
					params: [
						{
							from: userAddress,
							to: CUSD_ADDRESS,
							data: calldata,
						},
					],
				});

				await new Promise((resolve) => setTimeout(resolve, 4000));
				statusText!.textContent = 'waiting confirmation...';
				console.log('Transaction hash: ' + tx);

				// confirm transaction
				let transactionStatus = await checkIfTransactionSucceeded(publicClient, tx);

				// Check if the transaction was successful
				if (transactionStatus) {
					statusText!.textContent = 'Transaction successful: ' + tx;
					console.log('Transaction successful', tx);
				} else {
					statusText!.textContent = 'Transaction failed!' + tx;
					console.error('Transaction failed', JSON.stringify(tx, null, 2));
				}
			} catch (error: string | any) {
				statusText!.textContent = 'Transaction failed: ' + error.message;
				console.error('Transaction failed: ' + error.message);
			}
		}
	}

	return <button onClick={transferCUSD}>Transfer cUSD</button>;
}
