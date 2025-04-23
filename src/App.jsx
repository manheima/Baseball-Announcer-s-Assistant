import React, { useState } from 'react';
import './App.css';

function App() {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const positions = ["P", "C", "1B", "2B", "3B", "SS", "RF", "LF", "CF"];

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
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
                    <input type="text" placeholder={`Home Player ${index + 1}`} />
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
                    <input type="text" placeholder={`Away Player ${index + 1}`} />
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