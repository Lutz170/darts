* {
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f0f2f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

h1, h2 {
    text-align: center;
    color: #1a2b3c;
    margin: 10px 0;
}

.game-settings {
    text-align: center;
    margin-bottom: 20px;
    padding: 15px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-row {
    margin: 10px 0;
}

.legs-selector, .checkout-selector {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-left: 10px;
    font-size: 1em;
}

.players {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.player {
    padding: 20px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.player.active {
    border: 2px solid #4CAF50;
    background: #f7fcf7;
}

.player-name {
    width: 100%;
    padding: 8px;
    font-size: 1.2em;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.score {
    font-size: 3.5em;
    font-weight: bold;
    text-align: center;
    margin: 15px 0;
    color: #2c3e50;
}

.stats {
    font-size: 1.1em;
    color: #666;
    text-align: center;
}

.throw-inputs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.throw input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.round-total {
    text-align: center;
    font-size: 1.2em;
    margin: 15px 0;
}

.buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

button {
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.2s;
}

.submit-round {
    background: #4CAF50;
    color: white;
    flex: 2;
}

.submit-round:hover {
    background: #45a049;
}

.undo-round {
    background: #ff9800;
    color: white;
    flex: 1;
}

.undo-round:hover {
    background: #f57c00;
}

.undo-round:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.new-game {
    background: #607D8B;
    color: white;
    flex: 1;
}

.new-game:hover {
    background: #546e7a;
}

.error-message {
    color: #f44336;
    margin: 10px 0;
    text-align: center;
}

.winner-message {
    background: #4CAF50;
    color: white;
    padding: 15px;
    border-radius: 4px;
    margin: 10px 0;
    display: none;
    text-align: center;
}

.history {
    background: white;
    padding: 20px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-top: 20px;
}

.history h3 {
    margin-top: 0;
    text-align: center;
}

.history-list .entry {
    padding: 8px;
    border-bottom: 1px solid #eee;
}

@media (max-width: 600px) {
    .players {
        grid-template-columns: 1fr;
    }
    
    .throw-inputs {
        grid-template-columns: 1fr;
    }
    
    .buttons {
        flex-direction: column;
    }
}
