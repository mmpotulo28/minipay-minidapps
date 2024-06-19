import PayTokenFunctionCall from './PayTokenFunctionCall';
import TransferCUSD from './TransferCUSD';
import TxStatus from '../components/TxStatus';

export default function MiniDApps() {
	return (
		<div className="dApps">
			<TransferCUSD />
			<PayTokenFunctionCall />
			<TxStatus />
		</div>
	);
}
