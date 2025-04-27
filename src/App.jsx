import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isTopInning, setIsTopInning] = useState(true); // State to track inning half
  const [isHovering, setIsHovering] = useState(false); // State to track hover
  const [playerOnBase, setPlayerOnBase] = useState(null); // State to track player on base
  const [playerOnSecondBase, setPlayerOnSecondBase] = useState(null); // State for second base player
  const [playerOnThirdBase, setPlayerOnThirdBase] = useState(null); // State for third base player
  const [fontSize, setFontSize] = useState(16); // State to control font size of outfield players
  const [backgroundPositionY, setBackgroundPositionY] = useState(50); // Initial background position (centered)

  const [homePlayers, setHomePlayers] = useState(() => {
    const saved = localStorage.getItem('homePlayers');
    return saved ? JSON.parse(saved) : Array(10).fill('');
  });

  const [awayPlayers, setAwayPlayers] = useState(() => {
    const saved = localStorage.getItem('awayPlayers');
    return saved ? JSON.parse(saved) : Array(10).fill('');
  });

  const [homePositions, setHomePositions] = useState(() => {
    const saved = localStorage.getItem('homePositions');
    return saved ? JSON.parse(saved) : Array(10).fill('');
  });

  const [awayPositions, setAwayPositions] = useState(() => {
    const saved = localStorage.getItem('awayPositions');
    return saved ? JSON.parse(saved) : Array(10).fill('');
  });

  const [homeRosterSuggestions, setHomeRosterSuggestions] = useState([]); // Suggestions for home players
  const [awayRosterSuggestions, setAwayRosterSuggestions] = useState([]); // Suggestions for away players

  const positions = ["DH", "C", "1B", "2B", "3B", "SS", "RF", "LF", "CF", "P"];
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

  // Save to localStorage whenever the states change
  useEffect(() => {
    localStorage.setItem('homePlayers', JSON.stringify(homePlayers));
  }, [homePlayers]);

  useEffect(() => {
    localStorage.setItem('awayPlayers', JSON.stringify(awayPlayers));
  }, [awayPlayers]);

  useEffect(() => {
    localStorage.setItem('homePositions', JSON.stringify(homePositions));
  }, [homePositions]);

  useEffect(() => {
    localStorage.setItem('awayPositions', JSON.stringify(awayPositions));
  }, [awayPositions]);

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
          // Keep the player already on third base
        } else {
          setPlayerOnThirdBase(playerOnSecondBase); // Move second base player to third base
        }
      }
      setPlayerOnSecondBase(playerOnBase); // Move first base player to second base
    }
    setPlayerOnBase(player); // Move batting order player to first base
  };

  const handleMoveToSecondBase = () => {
    if (playerOnBase) {
      if (playerOnSecondBase) {
        if (!playerOnThirdBase) {
          setPlayerOnThirdBase(playerOnSecondBase); // Move second base player to third base
        }
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

  // Function to handle importing a roster CSV
  const importRosterFromCSV = (event, setRosterSuggestions) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const names = content
        .split(/[\n,]/) // Split by new lines or commas
        .map((name) => name.trim()) // Trim whitespace
        .filter((name) => name); // Remove empty strings
      setRosterSuggestions(names);
    };
    reader.readAsText(file);
  };

  const handleZoomIn = () => {
    setFontSize((prevFontSize) => prevFontSize + 2); // Increase font size
  };

  const handleZoomOut = () => {
    setFontSize((prevFontSize) => Math.max(10, prevFontSize - 2)); // Decrease font size, minimum 10px
  };

  const moveBackgroundUp = () => {
    setBackgroundPositionY((prev) => Math.max(prev - 5, 0)); // Move up, limit to 0%
  };

  const moveBackgroundDown = () => {
    setBackgroundPositionY((prev) => Math.min(prev + 5, 100)); // Move down, limit to 100%
  };

  return (
    <div
      className="App"
      style={{
        backgroundPosition: `center ${backgroundPositionY}%`, // Dynamically set background position
      }}
    >
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
      <div className="zoom-controls">
        <button className="zoom-button" onClick={handleZoomIn}>Zoom +</button>
        <button className="zoom-button" onClick={handleZoomOut}>Zoom -</button>
      </div>
      <div className="arrow-controls">
        <button className="arrow-button" onClick={moveBackgroundUp}>↑</button>
        <button className="arrow-button" onClick={moveBackgroundDown}>↓</button>
      </div>
      {!isTableVisible && (
        <>
          {positions
            .filter((position) => position !== "DH") // Exclude "DH" from field display
            .map((position) => {
              const playerName = currentPlayers[currentPositions.indexOf(position)];
              return (
                playerName && (
                  <div key={position} className={classNameMap[position]} style={{ fontSize: `${fontSize}px` }}>
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
              {battingOrder
                .filter((_, index) => currentPositions[index] !== "P") // Exclude players in the "P" position
                .map((player, index) => {
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
          <div
            className="import-buttons"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div className="import-home">
              <label
                className="custom-file-input"
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '10px', // Match the larger button's padding
                  borderRadius: '5px',
                  display: 'inline-block',
                  textAlign: 'center',
                  width: '180px', // Match the larger button's width
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    importFromCSV(e, setHomePlayers, setHomePositions)
                  }
                  style={{ display: 'none' }}
                />
                Import Home Lineup
              </label>
              <label
                className="custom-file-input"
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px', // Match the larger button's padding
                  borderRadius: '5px',
                  display: 'inline-block',
                  textAlign: 'center',
                  width: '180px', // Match the larger button's width
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    importRosterFromCSV(e, setHomeRosterSuggestions)
                  }
                  style={{ display: 'none' }}
                />
                Import Home Roster
              </label>
            </div>
            <div className="import-away">
              <label
                className="custom-file-input"
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  padding: '10px', // Match the larger button's padding
                  borderRadius: '5px',
                  display: 'inline-block',
                  textAlign: 'center',
                  width: '180px', // Match the larger button's width
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    importFromCSV(e, setAwayPlayers, setAwayPositions)
                  }
                  style={{ display: 'none' }}
                />
                Import Away Lineup
              </label>
              <label
                className="custom-file-input"
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '10px', // Match the larger button's padding
                  borderRadius: '5px',
                  display: 'inline-block',
                  textAlign: 'center',
                  width: '180px', // Match the larger button's width
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) =>
                    importRosterFromCSV(e, setAwayRosterSuggestions)
                  }
                  style={{ display: 'none' }}
                />
                Import Away Roster
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
              {Array.from({ length: 10 }).map((_, index) => (
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
                      list="home-roster-suggestions"
                    />
                    <datalist id="home-roster-suggestions">
                      {homeRosterSuggestions.map((name, idx) => (
                        <option key={idx} value={name} />
                      ))}
                    </datalist>
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
                      list="away-roster-suggestions"
                    />
                    <datalist id="away-roster-suggestions">
                      {awayRosterSuggestions.map((name, idx) => (
                        <option key={idx} value={name} />
                      ))}
                    </datalist>
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
          <div
            className="table-controls"
            style={{
              display: 'flex',
              justifyContent: 'center', // Center the button horizontally
              marginTop: '1rem',
            }}
          >
            <button
              className="clear-table-button"
              onClick={() => {
                setHomePlayers(Array(10).fill(''));
                setAwayPlayers(Array(10).fill(''));
                setHomePositions(Array(10).fill(''));
                setAwayPositions(Array(10).fill(''));
                localStorage.removeItem('homePlayers');
                localStorage.removeItem('awayPlayers');
                localStorage.removeItem('homePositions');
                localStorage.removeItem('awayPositions');
              }}
              style={{
                backgroundColor: 'red',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Clear Table
            </button>
          </div>
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