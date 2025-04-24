import React, { useState } from 'react';
import './App.css';

function App() {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isTopInning, setIsTopInning] = useState(true); // State to track inning half
  const [isHovering, setIsHovering] = useState(false); // State to track hover

  const [homePlayers, setHomePlayers] = useState(Array(9).fill(''));
  const [awayPlayers, setAwayPlayers] = useState(Array(9).fill(''));
  const [homePositions, setHomePositions] = useState(Array(9).fill(''));
  const [awayPositions, setAwayPositions] = useState(Array(9).fill(''));
  const positions = ["P", "C", "1B", "2B", "3B", "SS", "RF", "LF", "CF"];

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const toggleInningHalf = () => {
    setIsTopInning(!isTopInning);
  };

  const handleHoverEnter = () => {
    setIsHovering(true);
  };

  const handleHoverLeave = () => {
    setIsHovering(false);
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

  const handleHomePositionChange = (index, value) => {
    const updatedHomePositions = [...homePositions];
    updatedHomePositions[index] = value;
    setHomePositions(updatedHomePositions);
  };

  const handleAwayPositionChange = (index, value) => {
    const updatedAwayPositions = [...awayPositions];
    updatedAwayPositions[index] = value;
    setAwayPositions(updatedAwayPositions);
  };

  // Get the name of the pitcher and catcher for the current inning half
  const homePitcherIndex = homePositions.indexOf("P");
  const awayPitcherIndex = awayPositions.indexOf("P");
  const homeCatcherIndex = homePositions.indexOf("C");
  const awayCatcherIndex = awayPositions.indexOf("C");

  const homePitcherName = homePitcherIndex !== -1 ? homePlayers[homePitcherIndex] : "";
  const awayPitcherName = awayPitcherIndex !== -1 ? awayPlayers[awayPitcherIndex] : "";
  const homeCatcherName = homeCatcherIndex !== -1 ? homePlayers[homeCatcherIndex] : "";
  const awayCatcherName = awayCatcherIndex !== -1 ? awayPlayers[awayCatcherIndex] : "";

  const currentPitcherName = isTopInning ? homePitcherName : awayPitcherName;
  const currentCatcherName = isTopInning ? homeCatcherName : awayCatcherName;

  return (
    <div className="App">
      <button className="toggle-button" onClick={toggleTableVisibility}>
        {isTableVisible ? 'Hide Table' : 'Show Table'}
      </button>
      <button
        className="inning-toggle-button"
        onClick={toggleInningHalf}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        {isHovering
          ? isTopInning
            ? 'Switch to Bottom'
            : 'Switch to Top'
          : isTopInning
          ? 'Top of Inning'
          : 'Bottom of Inning'}
      </button>
      {!isTableVisible && (
        <>
          {currentPitcherName && (
            <div className="pitcher-display">
              {currentPitcherName}
            </div>
          )}
          {currentCatcherName && (
            <div className="catcher-display">
              {currentCatcherName}
            </div>
          )}
        </>
      )}
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
                    <select
                      value={homePositions[index]}
                      onChange={(e) => handleHomePositionChange(index, e.target.value)}
                    >
                      <option value="">Bench</option>
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
                    <select
                      value={awayPositions[index]}
                      onChange={(e) => handleAwayPositionChange(index, e.target.value)}
                    >
                      <option value="">Bench</option>
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