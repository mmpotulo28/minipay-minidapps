import { utils } from 'ethers';

// Testnet contract address with mint function that transfers 0.01 cUSD for minting tokens.
const CONTRACT_ADDRESS = '0xFEeEB43FFC9f947413009864d00Ccf9B9146A55d';

// A function call that requires transfer of cUSD
export default function PayTokenFunctionCall() {
	async function callMint() {
		if (window.ethereum) {
			let statusText = document.querySelector('.status-text');

			let accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			statusText!.textContent = 'Connected account: ' + accounts[0];

			// The current selected account out of the connected accounts.
			let userAddress = accounts[0];
			let iface = new utils.Interface(['function mint(address to)']);
			let calldata = iface.encodeFunctionData('mint', [userAddress]);

			// Send transaction to the injected wallet to be confirmed by the user.
			try {
				statusText!.textContent = 'Minting...';
				let tx = await window.ethereum.request({
					method: 'eth_sendTransaction',
					params: [
						{
							from: userAddress,
							to: CONTRACT_ADDRESS,
							data: calldata,
						},
					],
				});

				// wait for the transaction to be received by the network do not use tx.await()
				await new Promise((resolve) => setTimeout(resolve, 2000));

				statusText!.textContent = 'Waiting confirmation...';
				console.log('Transaction hash: ' + tx);

				// confirm transaction
				let receipt = await window.ethereum.request({
					method: 'eth_getTransactionReceipt',
					params: [tx],
				});

				console.log('Transaction receipt: ' + receipt);

				// Check if the transaction was successful
				if (receipt && receipt.status === '0x1') {
					statusText!.textContent = 'Transaction successful' + receipt;
					console.log('Transaction successful', JSON.stringify(receipt, null, 2));
				} else {
					statusText!.textContent = 'Transaction failed';
					console.error('Transaction failed', JSON.stringify(receipt, null, 2));
				}
			} catch (error: string | any) {
				let msg = error.message.split('error: ')[1].trim();
				let errorObject = JSON.parse(msg);
				let errorMessage = errorObject['error']['message'];
				statusText!.textContent = errorMessage;
				console.error('Transaction failed: ' + error.message);
			}
		}
	}

	return <button onClick={callMint}>Call Mint</button>;
}
