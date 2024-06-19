import MiniDApps from './dApps/MiniDApps';
import Navbar from './components/Navbar';
// add css
import './App.css';
import { Footer } from './components/Footer';

export default function App() {
	return (
		<div
			style={{
				marginTop: '0px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: '12px',
				width: '100%',
				height: '100%',
				backgroundColor: '#f0f0f0',
			}}
		>
			<Navbar />
			<MiniDApps />
			<Footer />
		</div>
	);
}
