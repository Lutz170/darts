// Warte bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
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

    // DOM-Elemente
    const throw1Input = document.getElementById('throw1');
    const throw2Input = document.getElementById('throw2');
    const throw3Input = document.getElementById('throw3');
    const roundTotalSpan = document.querySelector('.round-total span');
    const submitButton = document.getElementById('submit-round');
    const undoButton = document.getElementById('undo-round');
    const newGameButton = document.getElementById('new-game');
    const errorMessageDiv = document.querySelector('.error-message');
    const winnerMessageDiv = document.querySelector('.winner-message');
    const historyListDiv = document.querySelector('.history-list');
    const legsSelect = document.getElementById('legs-select');
    const checkoutSelect = document.getElementById('checkout-select');

    // Rundensumme berechnen
    function calculateRoundTotal() {
        const throws = [
            parseInt(throw1Input.value) || 0,
            parseInt(throw2Input.value) || 0,
            parseInt(throw3Input.value) || 0
        ];
        const total = throws.reduce((a, b) => a + b, 0);
        roundTotalSpan.textContent = total;
        return total;
    }

    // Spielzustand speichern für Rückgängig-Funktion
    function saveGameState() {
        lastGameState = {
            players: JSON.parse(JSON.stringify(players)),
            currentPlayer: currentPlayer,
            currentLeg: gameSettings.currentLeg
        };
        undoButton.disabled = false;
    }

    // Runde eintragen
    function submitRound() {
        const throws = [
            parseInt(throw1Input.value) || 0,
            parseInt(throw2Input.value) || 0,
            parseInt(throw3Input.value) || 0
        ];
        const roundTotal = throws.reduce((a, b) => a + b, 0);
        
        // Validierung
        if (throws.some(t => t < 0 || t > 180)) {
            errorMessageDiv.textContent = 'Bitte gültige Zahlen zwischen 0 und 180 eingeben';
            return;
        }

        if (players[currentPlayer].score - roundTotal < 0) {
            errorMessageDiv.textContent = 'Punktzahl würde unter 0 fallen';
            return;
        }

        // Double-Checkout Prüfung
        if (gameSettings.checkoutMode === 'double' && 
            players[currentPlayer].score - roundTotal === 0) {
            const lastThrow = throws.filter(t => t > 0).pop(); // letzter Wurf > 0
            const isDoubleFinish = lastThrow % 2 === 0 && lastThrow > 0;
            
            if (!isDoubleFinish) {
                errorMessageDiv.textContent = 'Checkout muss mit einem Double erfolgen!';
                return;
            }
        }

        saveGameState();

        // Statistiken aktualisieren
        players[currentPlayer].stats.dartsThrown += 3;
        players[currentPlayer].stats.totalPoints += roundTotal;

        // Score aktualisieren
        players[currentPlayer].score -= roundTotal;
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
        throw1Input.value = '';
        throw2Input.value = '';
        throw3Input.value = '';
        calculateRoundTotal();
        errorMessageDiv.textContent = '';
    }

    // Rückgängig machen
    function undoLastMove() {
        if (lastGameState) {
            players = lastGameState.players;
            currentPlayer = lastGameState.currentPlayer;
            gameSettings.currentLeg = lastGameState.currentLeg;
            
            updateUI();
            
            throw1Input.value = '';
            throw2Input.value = '';
            throw3Input.value = '';
            calculateRoundTotal();
            errorMessageDiv.textContent = '';
            
            undoButton.disabled = true;
            lastGameState = null;
        }
    }

    // Spielerwechsel
    function switchPlayer() {
        document.querySelector(`.player${currentPlayer + 1}`).classList.remove('active');
        currentPlayer = currentPlayer === 0 ? 1 : 0;
        document.querySelector(`.player${currentPlayer + 1}`).classList.add('active');
    }

    // UI aktualisieren
    function updateUI() {
        // Update player scores and stats
        players.forEach((player, index) => {
            const playerElement = document.querySelector(`.player${index + 1}`);
            const scoreElement = playerElement.querySelector('.score');
            const averageElement = playerElement.querySelector('.average');
            
            scoreElement.textContent = player.score;
            
            const average = player.stats.dartsThrown > 0 
                ? ((player.stats.totalPoints / player.stats.dartsThrown) * 3).toFixed(1) 
                : '-';
            averageElement.textContent = average;
        });

        // Update history
        const historyHTML = players[currentPlayer].history.map((round, index) => `
            <div class="entry">
                Runde ${index + 1}: ${round.throws.join(' + ')} = ${round.roundTotal} 
                (Rest: ${round.remaining})
            </div>
        `).join('');
        historyListDiv.innerHTML = historyHTML;

        // Update active player highlight
        document.querySelector('.player1').classList.toggle('active', currentPlayer === 0);
        document.querySelector('.player2').classList.toggle('active', currentPlayer === 1);
    }

    // Gewinner anzeigen
    function showWinner() {
        const winner = players[currentPlayer];
        winner.legsWon++;
        
        if (winner.legsWon >= gameSettings.legsToWin) {
            const average = ((winner.stats.totalPoints / winner.stats.dartsThrown) * 3).toFixed(1);
            winnerMessageDiv.innerHTML = `
                ${winner.name} hat das Match gewonnen! 🎯<br>
                Legs gewonnen: ${winner.legsWon}<br>
                Average: ${average}
            `;
            winnerMessageDiv.style.display = 'block';
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
        throw1Input.value = '';
        throw2Input.value = '';
        throw3Input.value = '';
        calculateRoundTotal();
        errorMessageDiv.textContent = '';
        historyListDiv.innerHTML = '';
        updateUI();
    }

    // Spieleinstellungen aktualisieren
    function updateGameSettings() {
        gameSettings.legsToWin = Math.ceil(parseInt(legsSelect.value) / 2);
        gameSettings.checkoutMode = checkoutSelect.value;
    }

    // Neues Spiel
    function resetGame() {
        updateGameSettings();
        gameSettings.currentLeg = 1;
        players = players.map(player => ({
            name: player.name, // Name beibehalten
            score: 501,
            history: [],
            legsWon: 0,
            stats: {
                totalPoints: 0,
                dartsThrown: 0
            }
        }));
        
        currentPlayer = 0;
        throw1Input.value = '';
        throw2Input.value = '';
        throw3Input.value = '';
        calculateRoundTotal();
        errorMessageDiv.textContent = '';
        winnerMessageDiv.style.display = 'none';
        historyListDiv.innerHTML = '';
        
        document.querySelector('.player2').classList.remove('active');
        document.querySelector('.player1').classList.add('active');
        
        undoButton.disabled = true;
        lastGameState = null;
        
        updateUI();
    }

    // Event Listener
    throw1Input.addEventListener('input', calculateRoundTotal);
    throw2Input.addEventListener('input', calculateRoundTotal);
    throw3Input.addEventListener('input', calculateRoundTotal);
    
    submitButton.addEventListener('click', submitRound);
    
    undoButton.addEventListener('click', function() {
        if (confirm('Möchtest du wirklich den letzten Wurf rückgängig machen?')) {
            undoLastMove();
        }
    });
    
    newGameButton.addEventListener('click', resetGame);
    
    legsSelect.addEventListener('change', function() {
        if (confirm('Möchtest du wirklich ein neues Spiel mit dieser Leg-Anzahl starten?')) {
            resetGame();
        }
    });
    
    checkoutSelect.addEventListener('change', function() {
        if (confirm('Möchtest du wirklich ein neues Spiel mit diesen Einstellungen starten?')) {
            resetGame();
        }
    });

    // Spielernamen Event Listener
    document.querySelectorAll('.player-name').forEach((input, index) => {
        input.addEventListener('change', function() {
            players[index].name = this.value;
        });
    });

    // Initial UI update
    updateUI();
});
