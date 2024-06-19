import { utils } from 'ethers';

// Mainnet address of cUSD
const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';

const receiverAddress = '0x0717329C677ab484EAA73F4C8EEd92A2FA948746';

// DApp to quickly test transfer of cUSD to a specific address using the cUSD contract.
export default function TransferCUSD() {
	async function transferCUSD() {
		console.log('Transfer cUSD');

		if (window.ethereum) {
			let statusText = document.querySelector('.status-text');
			let accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			// The current selected account out of the connected accounts.
			let userAddress = accounts[0];
			statusText!.textContent = 'Connected account: ' + userAddress;

			let iface = new utils.Interface(['function transfer(address to, uint256 value)']);

			let calldata = iface.encodeFunctionData('transfer', [
				receiverAddress,
				utils.parseEther('0.1'), // 10 cUSD - This amount is in wei
			]);

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

				// wait for	the transaction to be received by the network do not use tx.await()
				// wait for the transaction to be received by the network do not use tx.await()
				await new Promise((resolve) => setTimeout(resolve, 4000));

				statusText!.textContent = 'waiting confirmation...';
				console.log('Transaction hash: ' + tx);

				// confirm transaction
				let receipt = await window.ethereum.request({
					method: 'eth_getTransactionReceipt',
					params: [tx],
				});

				console.log('Transaction receipt: ' + receipt);

				// Check if the transaction was successful
				if (receipt && receipt.status === '0x1') {
					statusText!.textContent = 'Transaction successful' + tx;
					console.log('Transaction successful', receipt);
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
