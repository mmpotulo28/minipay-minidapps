import TransferCUSD from './TransferCUSD';
import TxStatus from '../components/TxStatus';
import { UserDetails } from '../components/UserDetails';

export default function MiniDApps() {
	return (
		<div className="dApps">
			<UserDetails />
			<TransferCUSD />
			<TxStatus />
		</div>
	);
}
