import React from "react";

function Connected(props) {
  return (
    <div className="connected">
      <h1 className="connected-header"> You are connected to Metamask</h1>
      <p className="account">Metamask account: {props.account}</p>
      <p className="remaining-time">Remaining Time: {props.remainingTime}</p>

      <div>
        
        {
            props.showButton ? (
                <p className="remaining-time">You have already voted</p>
            ) : (
            <div>
            <input
                type="number"
                placeholder="Choose Index"
                value={props.number}
                onChange={props.handleNumberChange}
              />

              <button className="vote-btn" onClick={props.voteFunction}>
          Vote
        </button>
        </div>)
        }
        
      </div>

      <table id="table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Name</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {props.candidates.map((candidate, index) => (
            <tr key={index}>
              <td>{candidate.index}</td>
              <td>{candidate.name}</td>
              <td>{candidate.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Connected;
