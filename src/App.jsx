import React, { useState } from 'react';
import './App.css';

function App() {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [homePlayers, setHomePlayers] = useState(Array(9).fill(''));
  const [awayPlayers, setAwayPlayers] = useState(Array(9).fill(''));
  const positions = ["P", "C", "1B", "2B", "3B", "SS", "RF", "LF", "CF"];

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const handleHomePlayerChange = (index, value) => {
    const updatedHomePlayers = [...homePlayers];
    updatedHomePlayers[index] = value;
    setHomePlayers(updatedHomePlayers);
  };

  const handleAwayPlayerChange = (index, value) => {
    const updatedAwayPlayers = [...awayPlayers];
    updatedAwayPlayers[index] = value;
    setAwayPlayers(updatedAwayPlayers);
  };

  return (
    <div className="App">
      <button className="toggle-button" onClick={toggleTableVisibility}>
        {isTableVisible ? 'Hide Table' : 'Show Table'}
      </button>
      {isTableVisible && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Home</th>
                <th>Position</th>
                <th>Away</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 9 }).map((_, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      value={homePlayers[index]}
                      placeholder={`Home Player ${index + 1}`}
                      onChange={(e) => handleHomePlayerChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <select>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={awayPlayers[index]}
                      placeholder={`Away Player ${index + 1}`}
                      onChange={(e) => handleAwayPlayerChange(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <select>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;