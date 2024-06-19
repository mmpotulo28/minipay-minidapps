// a mini div component to display the status of the transaction
// it will be used in the main App component

const TxStatus = () => {
	function clearStatus() {
		let statusText = document.querySelector('.status-text');
		statusText.innerText = '';
	}

	return (
		<div className="tx-status">
			<p className="status-text"></p>
			<button onClick={clearStatus}>Clear</button>
		</div>
	);
};

export default TxStatus;
