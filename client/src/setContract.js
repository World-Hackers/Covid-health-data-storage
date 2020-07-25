import React, { Component } from "react";
import HealthCareContract from "./contracts/HealthCare.json";
import HealthCareTokenContract from "./contracts/HealthToken.json";
// HealthToken
import getWeb3 from "./getWeb3";

import { connect } from 'react-redux';

// import { BrowserRouter } from 'react-router-dom';
// import routes from './routes';

// import Main from './components/main';

// import { Switch, Route } from 'react-router-dom';

// import Home from './components/pages/home';
// import Register from './components/pages/admin/registerDoctor';
// import Upload from './components/pages/admin/documentUpload';
// import Menu from './components/menu';
import App from './App'

import "./App.css";

class SetContract extends Component {

    state = {
        web3: null,
        contract: null,
        tokenContract: null,
        accounts: null
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            console.log("\nPROPS IN SETCONTRACT\n", this.props);

            const web3 = await getWeb3();

            const accounts = await web3.eth.getAccounts();
            this.setState({ accounts: accounts });
            
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = HealthCareContract.networks[networkId];
            const instance = new web3.eth.Contract(
                HealthCareContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const deployedNetwork2 = HealthCareTokenContract.networks[networkId];
            const instance2 = new web3.eth.Contract(
                HealthCareTokenContract.abi,
                deployedNetwork2 && deployedNetwork2.address,
            );

            console.log(instance.methods);
            console.log(instance2.methods);

            let owner = await instance.methods.owner().call();

            this.changeState({ web3, contract: instance, tokenContract: instance2, owner: owner })
            this.setState({ web3, contract: instance });
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    changeState = (s) => {
        console.log("\nIN CHANGE STATE\n")
        this.props.initializeContract(s);
    }


    runExample = async () => {

        console.log("\nAfter click\n", this.props.state);

        const { accounts, contract } = this.state;

        console.log(accounts, contract);
        const response = await contract.methods.get().call();
        console.log(response);
    };

    render() {

        return (
            <div>
                <App />
            </div>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        initializeContract: (newState) => { dispatch({ type: 'INIT_CONTRACT', state: newState }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetContract);
