// Spieleinstellungen
let gameSettings = {
    legsToWin: 1,
    currentLeg: 1,
    checkoutMode: 'single'
};

// Spieler-Daten
let players = [
    { 
        name: 'Spieler 1', 
        score: 501, 
        history: [],
        legsWon: 0,
        stats: {
            totalPoints: 0,
            dartsThrown: 0
        }
    },
    { 
        name: 'Spieler 2', 
        score: 501, 
        history: [],
        legsWon: 0,
        stats: {
            totalPoints: 0,
            dartsThrown: 0
        }
    }
];

let currentPlayer = 0;
let lastGameState = null;

// Rundensumme berechnen
function calculateRoundTotal() {
    const throwInputs = document.querySelectorAll('.throw input');
    const total = Array.from(throwInputs).reduce((sum, input) => {
        return sum + (parseInt(input.value) || 0);
    }, 0);
    document.querySelector('.round-total span').textContent = total;
    return total;
}

// Spielzustand speichern für Rückgängig-Funktion
function saveGameState() {
    lastGameState = {
        players: JSON.parse(JSON.stringify(players)),
        currentPlayer: currentPlayer,
        currentLeg: gameSettings.currentLeg
    };
    document.querySelector('.undo-round').disabled = false;
}

// Rückgängig machen
function undoLastMove() {
    if (lastGameState) {
        players = lastGameState.players;
        currentPlayer = lastGameState.currentPlayer;
        gameSettings.currentLeg = lastGameState.currentLeg;
        
        updateUI();
        
        document.querySelectorAll('.throw input').forEach(input => input.value = '');
        calculateRoundTotal();
        document.querySelector('.error-message').textContent = '';
        
        document.querySelector('.undo-round').disabled = true;
        lastGameState = null;
    }
}

// Runde eintragen
function submitRound() {
    console.log('Submit round called'); // Debug-Log
    const throwInputs = document.querySelectorAll('.throw input');
    const throws = Array.from(throwInputs).map(input => parseInt(input.value) || 0);
    const roundTotal = throws.reduce((a, b) => a + b, 0);
    
    // Validierung
    if (throws.some(t => t < 0 || t > 180)) {
        document.querySelector('.error-message').textContent = 
            'Bitte gültige Zahlen zwischen 0 und 180 eingeben';
        return;
    }

    if (players[currentPlayer].score - roundTotal < 0) {
        document.querySelector('.error-message').textContent = 
            'Punktzahl würde unter 0 fallen';
        return;
    }

    // Double-Checkout Prüfung
    if (gameSettings.checkoutMode === 'double' && 
        players[currentPlayer].score - roundTotal === 0) {
        const lastThrow = throws[throws.length - 1];
        const isDoubleFinish = lastThrow % 2 === 0 && lastThrow > 0;
        
        if (!isDoubleFinish) {
            document.querySelector('.error-message').textContent = 
                'Checkout muss mit einem Double erfolgen!';
            return;
        }
    }

    saveGameState();

    // Statistiken aktualisieren
    players[currentPlayer].stats.dartsThrown += 3;
    players[currentPlayer].stats.totalPoints += roundTotal;

    // Score aktualisieren
    players[currentPlayer].score -= roundTotal;
    console.log(`Updated score for player ${currentPlayer + 1}: ${players[currentPlayer].score}`); // Debug-Log

    players[currentPlayer].history.push({
        throws: throws,
        roundTotal: roundTotal,
        remaining: players[currentPlayer].score
    });

    updateUI();

    // Gewinnprüfung
    if (players[currentPlayer].score === 0) {
        showWinner();
    } else {
        switchPlayer();
    }

    // Eingabefelder zurücksetzen
    throwInputs.forEach(input => input.value = '');
    calculateRoundTotal();
    document.querySelector('.error-message').textContent = '';
}

// Spielerwechsel
function switchPlayer() {
    document.querySelector(`.player${currentPlayer + 1}`).classList.remove('active');
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    document.querySelector(`.player${currentPlayer + 1}`).classList.add('active');
}

// UI aktualisieren
function updateUI() {
    console.log('Updating UI'); // Debug-Log
    console.log('Current player scores:', players.map(p => p.score)); // Debug-Log

    // Update player scores and stats
    players.forEach((player, index) => {
        const playerElement = document.querySelector(`.player${index + 1}`);
        if (!playerElement) {
            console.error(`Player element ${index + 1} not found`);
            return;
        }

        const scoreElement = playerElement.querySelector('.score');
        if (scoreElement) {
            scoreElement.textContent = player.score;
        }
        
        const averageElement = playerElement.querySelector('.average');
        if (averageElement) {
            const average = player.stats.dartsThrown > 0 
                ? ((player.stats.totalPoints / player.stats.dartsThrown) * 3).toFixed(1) 
                : '-';
            averageElement.textContent = average;
        }
    });

    // Update history
    const historyList = document.querySelector('.history-list');
    if (historyList) {
        const historyHTML = players[currentPlayer].history.map((round, index) => `
            <div class="entry">
                Runde ${index + 1}: ${round.throws.join(' + ')} = ${round.roundTotal} 
                (Rest: ${round.remaining})
            </div>
        `).join('');
        historyList.innerHTML = historyHTML;
    }

    // Update active player highlight
    document.querySelectorAll('.player').forEach((player, index) => {
        player.classList.toggle('active', index === currentPlayer);
    });
}

// Gewinner anzeigen
function showWinner() {
    const winner = players[currentPlayer];
    winner.legsWon++;
    
    if (winner.legsWon >= gameSettings.legsToWin) {
        const average = ((winner.stats.totalPoints / winner.stats.dartsThrown) * 3).toFixed(1);
        const winnerMessage = document.querySelector('.winner-message');
        winnerMessage.innerHTML = `
            ${winner.name} hat das Match gewonnen! 🎯<br>
            Legs gewonnen: ${winner.legsWon}<br>
            Average: ${average}
        `;
        winnerMessage.style.display = 'block';
    } else {
        alert(`${winner.name} gewinnt das Leg! Stand: ${players[0].name}: ${players[0].legsWon} - ${players[1].name}: ${players[1].legsWon}`);
        startNewLeg();
    }
}

// Neues Leg starten
function startNewLeg() {
    gameSettings.currentLeg++;
    players.forEach(player => {
        player.score = 501;
        player.history = [];
    });
    currentPlayer = (gameSettings.currentLeg % 2 === 0) ? 1 : 0;
    document.querySelectorAll('.throw input').forEach(input => input.value = '');
    calculateRoundTotal();
    document.querySelector('.error-message').textContent = '';
    document.querySelector('.history-list').innerHTML = '';
    updateUI();
}

// Spieleinstellungen aktualisieren
function updateGameSettings() {
    const legsSelect = document.getElementById('legs-select');
    const checkoutSelect = document.getElementById('checkout-select');
    gameSettings.legsToWin = Math.ceil(parseInt(legsSelect.value) / 2);
    gameSettings.checkoutMode = checkoutSelect.value;
}

// Neues Spiel
function resetGame() {
    updateGameSettings();
    gameSettings.currentLeg = 1;
    players = players.map(player => ({
        ...player,
        score: 501,
        history: [],
        legsWon: 0,
        stats: {
            totalPoints: 0,
            dartsThrown: 0
        }
    }));
    
    currentPlayer = 0;
    document.querySelectorAll('.throw input').forEach(input => input.value = '');
    calculateRoundTotal();
    document.querySelector('.error-message').textContent = '';
    document.querySelector('.winner-message').style.display = 'none';
    document.querySelector('.history-list').innerHTML = '';
    
    document.querySelector('.player2').classList.remove('active');
    document.querySelector('.player1').classList.add('active');
    
    document.querySelector('.undo-round').disabled = true;
    lastGameState = null;
    
    updateUI();
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); // Debug-Log

    // Input Event Listener für Wurfberechnung
    const throwInputs = document.querySelectorAll('.throw input');
    throwInputs.forEach(input => {
        input.addEventListener('input', calculateRoundTotal);
    });
    
    // Submit Button Event Listener
    const submitButton = document.querySelector('.submit-round');
    submitButton.onclick = function() {
        console.log('Submit button clicked'); // Debug-Log
        submitRound();
    };

    // Undo Button Event Listener
    const undoButton = document.querySelector('.undo-round');
    undoButton.onclick = function() {
        if (confirm('Möchtest du wirklich den letzten Wurf rückgängig machen?')) {
            undoLastMove();
        }
    };

    // New Game Button Event Listener
    const newGameButton = document.querySelector('.new-game');
    newGameButton.onclick = resetGame;
    
    // Settings Event Listeners
    document.getElementById('legs-select').onchange = function() {
        if (confirm('Möchtest du wirklich ein neues Spiel mit dieser Leg-Anzahl starten?')) {
            resetGame();
        }
    };
    
    document.getElementById('checkout-select').onchange = function() {
        if (confirm('Möchtest du wirklich ein neues Spiel mit diesen Einstellungen starten?')) {
            resetGame();
        }
    };

    // Initial UI update
    updateUI();
});
