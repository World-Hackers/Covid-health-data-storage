const initState = {
    owner: null,
    account: null,
    web3: null,
    contract: null,
    tokenContract: null
};

const rootReducer = (state = initState, action) => {
    console.log("ACTION\n", action);

    if (action.type === "INIT_CONTRACT") {
        var s = {
            ...state,
            web3: action.state.web3,
            owner: action.state.owner,
            contract: action.state.contract,
            tokenContract: action.state.tokenContract
        }

        console.log("\n\nSTATE\n", s, "\nSTATE\n")

        // localStorage.setItem("OWNER", JSON.stringify(s.owner));
        // localStorage.setItem("ACCOUNT", JSON.stringify(s.account));
        // localStorage.setItem("WEB3", JSON.stringify(s.web3.eth.getAccounts()));
        // localStorage.setItem("CONTRACT", JSON.stringify(s.contract.methods));
        // localStorage.setItem("TOKENCONTRACT", JSON.stringify(s.tokenContract.methods));

        return s;
    }

    if (action.type === "ACCOUNT_CHANGE") {
        var s2 = {
            ...state,
            account: action.state.account,
        }
        // localStorage.setItem("STATE", JSON.stringify(s));
        return s2;
    }

    // localStorage.setItem("STATE", JSON.stringify(state));

    return state;
}

export default rootReducer;