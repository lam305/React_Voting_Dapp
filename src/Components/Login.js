import React from "react";

function Login(props){
    return(
        <div className="login">
            <h1 className="welcome"> Welcome to decentralized voting application</h1>
            <button className="login-button" onClick={props.connectWallet}>Login Metamask</button>
        </div>
    )

}

export default Login;