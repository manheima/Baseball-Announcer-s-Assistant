import React, { useState } from 'react';
import './App.css';

function App() {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isTopInning, setIsTopInning] = useState(true); // State to track inning half
  const [isHovering, setIsHovering] = useState(false); // State to track hover
  const [playerOnBase, setPlayerOnBase] = useState(null); // State to track player on base
  const [playerOnSecondBase, setPlayerOnSecondBase] = useState(null); // State for second base player
  const [playerOnThirdBase, setPlayerOnThirdBase] = useState(null); // State for third base player

  const [homePlayers, setHomePlayers] = useState(Array(9).fill(''));
  const [awayPlayers, setAwayPlayers] = useState(Array(9).fill(''));
  const [homePositions, setHomePositions] = useState(Array(9).fill(''));
  const [awayPositions, setAwayPositions] = useState(Array(9).fill(''));
  const positions = ["P", "C", "1B", "2B", "3B", "SS", "RF", "LF", "CF"];
  const classNameMap = {
    P: 'pitcher-display',
    C: 'catcher-display',
    '1B': 'firstbase-display',
    '2B': 'secondbase-display',
    '3B': 'thirdbase-display',
    SS: 'shortstop-display',
    RF: 'rightfield-display',
    LF: 'leftfield-display',
    CF: 'centerfield-display',
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const toggleInningHalf = () => {
    setIsTopInning(!isTopInning);
    setPlayerOnBase(null); // Clear first base
    setPlayerOnSecondBase(null); // Clear second base
    setPlayerOnThirdBase(null); // Clear third base
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

  const getAvailablePositions = (teamPositions, currentIndex) => {
    const selectedPositions = teamPositions.filter((_, i) => i !== currentIndex);
    return positions.filter((position) => !selectedPositions.includes(position));
  };

  // Get the current players for all positions based on the inning half
  const currentPlayers = isTopInning ? homePlayers : awayPlayers;
  const currentPositions = isTopInning ? homePositions : awayPositions;

  // Determine the batting order based on the inning half
  const battingOrder = isTopInning ? awayPlayers : homePlayers;

  // Handle moving a player to the base
  const handleMoveToBase = (player) => {
    if (playerOnBase) {
      if (playerOnSecondBase) {
        if (playerOnThirdBase) {
          setPlayerOnThirdBase(null); // Clear third base if occupied
        }
        setPlayerOnThirdBase(playerOnSecondBase); // Move second base player to third base
      }
      setPlayerOnSecondBase(playerOnBase); // Move first base player to second base
    }
    setPlayerOnBase(player); // Move batting order player to first base
  };

  const handleMoveToSecondBase = () => {
    if (playerOnBase) {
      if (playerOnSecondBase) {
        if (playerOnThirdBase) {
          setPlayerOnThirdBase(null); // Clear third base if occupied
        }
        setPlayerOnThirdBase(playerOnBase); // Move second base player to third base
      }
      setPlayerOnSecondBase(playerOnBase); // Move player from first base to second base
      setPlayerOnBase(null); // Clear first base
    }
  };

  const handleMoveToThirdBase = () => {
    if (playerOnSecondBase) {
      setPlayerOnThirdBase(playerOnSecondBase); // Move player from second base to third base
      setPlayerOnSecondBase(null); // Clear second base
    }
  };

  const clearFirstBase = () => setPlayerOnBase(null);
  const clearSecondBase = () => setPlayerOnSecondBase(null);
  const clearThirdBase = () => setPlayerOnThirdBase(null);

  // Function to export team data to CSV
  const exportToCSV = (team, teamName) => {
    const csvContent = `data:text/csv;charset=utf-8,Player,Position\n` +
      team.map((player, index) => `${player},${team === homePlayers ? homePositions[index] : awayPositions[index]}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${teamName}_team.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to import team data from CSV
  const importFromCSV = (event, setPlayers, setPositions) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split('\n').slice(1); // Skip header
      const players = [];
      const positions = [];
      lines.forEach((line) => {
        const [player, position] = line.split(',');
        if (player) {
          players.push(player.trim());
          positions.push(position ? position.trim() : '');
        }
      });
      setPlayers(players);
      setPositions(positions);
    };
    reader.readAsText(file);
  };

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
            ? 'Switch to Bottom Half'
            : 'Switch to Top Half'
          : isTopInning
          ? 'Top Half'
          : 'Bottom Half'}
      </button>
      {!isTableVisible && (
        <>
          {positions.map((position) => {
            const playerName = currentPlayers[currentPositions.indexOf(position)];
            return (
              playerName && (
                <div key={position} className={classNameMap[position]}>
                  {playerName}
                </div>
              )
            );
          })}
          {playerOnBase && (
            <div className="on-firstbase-display">
              <button
                className="move-to-base-button"
                onClick={handleMoveToSecondBase}
              >
                ←
              </button>
              {playerOnBase}
              <button className="clear-base-button" onClick={clearFirstBase}>
                x
              </button>
            </div>
          )}
          {playerOnSecondBase && (
            <div className="on-secondbase-display">
              <button
                className="move-to-base-button"
                onClick={handleMoveToThirdBase}
              >
                ←
              </button>
              {playerOnSecondBase}
              <button className="clear-base-button" onClick={clearSecondBase}>
                x
              </button>
            </div>
          )}
          {playerOnThirdBase && (
            <div className="on-thirdbase-display">
              {playerOnThirdBase}
              <button className="clear-base-button" onClick={clearThirdBase}>
                x
              </button>
            </div>
          )}
          <div className="batting-order-display">
            <h3>Batting Order</h3>
            <ol>
              {battingOrder.map((player, index) => {
                const isPlayerOnBase =
                  player === playerOnBase ||
                  player === playerOnSecondBase ||
                  player === playerOnThirdBase;

                return (
                  <li key={index}>
                    <button
                      className="move-to-base-button"
                      onClick={() => handleMoveToBase(player)}
                      disabled={isPlayerOnBase} // Disable button if player is on a base
                      style={{
                        cursor: isPlayerOnBase ? 'not-allowed' : 'pointer',
                        opacity: isPlayerOnBase ? 0.5 : 1,
                      }}
                    >
                      ←
                    </button>
                    {player || `Player ${index + 1}`}
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}
      {isTableVisible && (
        <div className="table-container">
          <div className="import-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="import-home">
              <label className="custom-file-input">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => importFromCSV(e, setHomePlayers, setHomePositions)}
                />
                Import Home
              </label>
            </div>
            <div className="import-away">
              <label className="custom-file-input">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => importFromCSV(e, setAwayPlayers, setAwayPositions)}
                />
                Import Away
              </label>
            </div>
          </div>
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
                      onChange={(e) => {
                        const updatedHomePlayers = [...homePlayers];
                        updatedHomePlayers[index] = e.target.value;
                        setHomePlayers(updatedHomePlayers);
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={homePositions[index]}
                      onChange={(e) => handleHomePositionChange(index, e.target.value)}
                    >
                      <option value="">Bench</option>
                      {getAvailablePositions(homePositions, index).map((position) => (
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
                      onChange={(e) => {
                        const updatedAwayPlayers = [...awayPlayers];
                        updatedAwayPlayers[index] = e.target.value;
                        setAwayPlayers(updatedAwayPlayers);
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={awayPositions[index]}
                      onChange={(e) => handleAwayPositionChange(index, e.target.value)}
                    >
                      <option value="">Bench</option>
                      {getAvailablePositions(awayPositions, index).map((position) => (
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
          <div className="export-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => exportToCSV(homePlayers, 'Home')}>Export Home Team</button>
            <button onClick={() => exportToCSV(awayPlayers, 'Away')}>Export Away Team</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;