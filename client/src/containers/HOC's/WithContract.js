import React, { Component } from 'react';
import getWeb3 from "../../utils/getWeb3";

export default (WrappingComponent) => (contract) => {
    return class WithContract extends Component {
        state = {
            isLoaded: false
        };

        componentDidMount = async () => {
            try {
                // Get network provider and web3 instance.
                const web3 = await getWeb3();

                // Use web3 to get the user's accounts.
                const [ account ] = await web3.eth.getAccounts();

                // Get the contract instance.
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = contract.networks[networkId];
                const instance = new web3.eth.Contract(
                    contract.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                // Set web3, accounts, and contract to the state, and then proceed with an
                // example of interacting with the contract's methods.
                this.setState({ web3, account, [contract.contractName]: instance.methods, isLoaded: true });
            } catch (error) {
                // Catch any errors for any of the above operations.
                this.setState({ isLoaded: false, error: error.message })
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        }

        render() {
            return this.state.isLoaded ? <WrappingComponent {...this.state} /> : null
        }
    }
}
