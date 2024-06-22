import { ethers, utils } from 'ethers';
import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';

const Alfajores_ADDRESS = '0x874069fa1eb16d44d622f2e0ca25eea172369bc1';
let receiverAddress = '0x28323adb899EE5ea8E4C3C24DFe3E38E1117C559';

// DApp to quickly test transfer of cUSD to a specific address using the cUSD contract.
export default function TransferCUSD() {
	const publicClient = createPublicClient({
		chain: celoAlfajores,
		transport: http(),
	});

	// estimate gas
	const estimateGas = async (publicClient: any, transaction: any) => {
		let response;
		let feeCurrency = utils.getAddress(Alfajores_ADDRESS);
		if (!utils.isAddress(feeCurrency)) {
			feeCurrency = '';
		}
		try {
			response = await publicClient.estimateGas({
				...transaction,
				feeCurrency: feeCurrency,
			});
		} catch (error: string | any) {
			throw new Error('Error estimating gas!: ' + error.message);
		}

		return response;
	};

	// estimate gas price
	const estimateGasPrice = async (publicClient: any) => {
		let response;
		let feeCurrency = utils.getAddress(Alfajores_ADDRESS);
		if (!utils.isAddress(feeCurrency)) {
			feeCurrency = '';
		}

		try {
			response = await publicClient.request({
				method: 'eth_gasPrice',
				params: feeCurrency ? [feeCurrency] : [],
			});
		} catch (error: string | any) {
			throw new Error('Error! estimating gas price > ' + error.message);
		}

		return response;
	};

	const checkIfTransactionSucceeded = async (publicClient: any, transactionHash: string) => {
		let receipt = await publicClient.getTransactionReceipt({
			hash: transactionHash,
		});

		return { status: receipt.status === 'success', receipt };
	};

	// update balance
	const updateBalance = async () => {
		let statusText = document.querySelector('.status-text');
		if (window.ethereum) {
			try {
				let accounts = await window.ethereum.request({
					method: 'eth_requestAccounts',
				});
				let address = accounts[0];

				// get cUSD balance
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const contract = new ethers.Contract(
					'0x874069fa1eb16d44d622f2e0ca25eea172369bc1',
					[
						'function balanceOf(address) view returns (uint)',
						'function decimals() view returns (uint8)',
					],
					provider,
				);

				const decimals = await contract.decimals();
				const balance = await contract.balanceOf(address);
				const formattedBalance = ethers.utils.formatUnits(balance, decimals);

				const balanceText = document.querySelector('.balance');
				balanceText!.textContent = 'Balance: ' + parseFloat(formattedBalance).toFixed(7) + ' cUSD';
			} catch (error: string | any) {
				statusText!.textContent = 'Error getting balance: ' + error.message;
			}
		}
	};

	async function transferCUSD() {
		let statusText = document.querySelector('.status-text');
		const toAddress = document.getElementById('to-address') as HTMLInputElement;
		const amount = document.getElementById('amount') as HTMLInputElement;
		const TxStatus = document.querySelector('.tx-status') as HTMLDivElement;
		statusText!.textContent = 'processing...';

		if (window.ethereum) {
			let accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});
			let address = accounts[0];

			receiverAddress = toAddress.value || '0x0717329C677ab484EAA73F4C8EEd92A2FA948746';
			const amountValue = amount.value || '0.1';
			toAddress.value = receiverAddress;

			let iface = new utils.Interface(['function transfer(address to, uint256 value)']);
			let calldata = iface.encodeFunctionData('transfer', [
				receiverAddress,
				utils.parseUnits(amountValue, 15).toString(),
			]);

			let gasLimit = await estimateGas(publicClient, {
				account: address,
				to: receiverAddress,
				value: utils.parseUnits(amountValue, 15).toString(),
				data: calldata,
			});
			let gasPrice = await estimateGasPrice(publicClient);

			try {
				// Send transaction to the injected wallet to be confirmed by the user.
				statusText!.textContent = 'Sending transaction...';
				let tx = await window.ethereum.request({
					method: 'eth_sendTransaction',
					params: [
						{
							from: address,
							to: receiverAddress,
							value: utils.parseUnits(amountValue, 15).toString(),
							data: calldata,
							gas: gasLimit.toString(),
							gasPrice: gasPrice.toString(),
						},
					],
				});

				// Wait until tx confirmation and get tx receipt
				statusText!.textContent = 'Waiting for confirmation...';
				// delay for 10	seconds
				await new Promise((resolve) => setTimeout(resolve, 10000));
				let transactionStatus = await checkIfTransactionSucceeded(publicClient, tx);
				await updateBalance();

				if (transactionStatus.status) {
					statusText!.textContent = 'Transaction status: ' + transactionStatus.receipt.status;
				} else {
					statusText!.textContent = 'Transaction failed:	' + transactionStatus.receipt.status;
				}

				let receiptTable = document.createElement('table');
				let receipt = transactionStatus.receipt;
				const keys = [
					'to',
					'from',
					'status',
					'blockNumber',
					'transactionIndex',
					'cumulativeGasUsed',
					'gasUsed',
				];
				for (let key in receipt) {
					if (!keys.includes(key)) {
						continue;
					}
					let row = document.createElement('tr');
					let cell1 = document.createElement('td');
					let cell2 = document.createElement('td');
					cell1.textContent = key;
					cell2.textContent = receipt[key];
					row.appendChild(cell1);
					row.appendChild(cell2);
					receiptTable.appendChild(row);
				}
				TxStatus.innerHTML = '';
				TxStatus.appendChild(statusText as Node);
				TxStatus.appendChild(receiptTable);

				// status button
				let statusButton = document.createElement('button');
				statusButton.className = 'status-button';
				statusButton.textContent = 'Clear';
				TxStatus.appendChild(statusButton);
				statusButton.onclick = () => {
					TxStatus.innerHTML = '';
					TxStatus.appendChild(statusText as Node);
					statusButton.className = 'status-button';
				};
			} catch (error: string | any) {
				statusText!.textContent = error.message;
				console.error('Error transferring cUSD: ', error.message);
			}
		} else {
			statusText!.textContent = 'No	wallet found!';
		}
	}

	return <button onClick={transferCUSD}>Transfer cUSD</button>;
}
