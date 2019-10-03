import React, { PureComponent } from 'react';
import WithContract from "../../containers/HOC's/WithContract";
import SimpleStorage from '../../contracts/SimpleStorage';

class Example extends PureComponent {

    state = {
        isLoading: false
    }

    componentDidMount = async () => {
        await this.setState({ isLoading: true });
        await this.runExample();
        await this.setState({ isLoading: false });
    }

    runExample = async () => {
        const { accounts, SimpleStorage } = this.props;
        // Stores a given value, 5 by default.
        await SimpleStorage.set(5).send({ from: accounts[0] })
        // Get the value from the contract to prove it worked.
        const response = await SimpleStorage.get().call();
        // Update state with the result.
        this.setState({ storageValue: response });
    };

    render() {
        if (this.state.isLoading) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>
                <p>
                    If your contracts compiled and migrated successfully, below will show
                    a stored value of 5 (by default).
                </p>
                <p>
                    Try changing the value stored on <strong>line 40</strong> of App.js.
                </p>
                <div>The stored value is: {this.state.storageValue}</div>
            </div>
        );
    }
}

export default WithContract(Example)(SimpleStorage);
