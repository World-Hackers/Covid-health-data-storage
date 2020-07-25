import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { connect } from 'react-redux';

import Menu from './components/menu';


import "./App.css";
import routes from "./routes.js";

class App extends Component {

  // console.log(this.props)
  state = {
    redirect: false
  }

  componentDidMount = () => {

    var p = this.props;

    console.log("APP", this.props)
    console.log(window.web3);

    window.ethereum.on('accountsChanged', function (accounts) {
      console.log("\n\nACOUNT\n\n", accounts);
      if (accounts[0] !== p.state.account) {
        p.changeAccount({ account: accounts[0] });
        console.log("PROPS", p)
      }
    })

  }



  render() {
    return (
      <div>
        <Menu />
        {routes}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeAccount: (newState) => { dispatch({ type: 'ACCOUNT_CHANGE', state: newState }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
