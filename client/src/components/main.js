import React, { Component } from "react";
import routes from '../routes';


import "../App.css";

class Main extends Component {
    render() {
        return (
            <div>
                {routes}
            </div>
        )
    }
}

export default Main;