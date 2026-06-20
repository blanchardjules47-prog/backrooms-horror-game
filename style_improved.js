* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: #000;
    color: #ccc;
    overflow: hidden;
}

#game-container {
    width: 100vw;
    height: 100vh;
    position: relative;
}

/* Écrans */
.screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.screen.active {
    opacity: 1;
    pointer-events: all;
}

.menu-content {
    text-align: center;
    color: #fff;
    max-width: 600px;
    padding: 40px;
}

#start-screen h1 {
    font-size: 4em;
    margin-bottom: 20px;
    color: #ff3333;
    text-shadow: 0 0 20px #ff3333;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { text-shadow: 0 0 20px #ff3333; }
    50% { text-shadow: 0 0 40px #ff3333, 0 0 60px #ff0000; }
}

.subtitle {
    font-size: 1.2em;
    color: #999;
    margin-bottom: 40px;
    font-style: italic;
}

/* Boutons */
.btn-primary, .btn-secondary {
    padding: 15px 40px;
    font-size: 1.1em;
    border: 2px solid;
    background: transparent;
    cursor: pointer;
    margin: 10px;
    transition: all 0.3s;
    text-transform: uppercase;
    font-weight: bold;
}

.btn-primary {
    border-color: #ff3333;
    color: #ff3333;
}

.btn-primary:hover {
    background: #ff3333;
    color: #000;
    box-shadow: 0 0 20px #ff3333;
}

.btn-secondary {
    border-color: #666;
    color: #666;
}

.btn-secondary:hover {
    border-color: #999;
    color: #999;
}

/* Jeu principal */
#game-screen {
    opacity: 0;
    pointer-events: none;
    background: #1a1a1a;
}

#game-screen.active {
    opacity: 1;
    pointer-events: all;
}

.game-viewport {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    overflow: hidden;
    transition: filter 0.1s, transform 0.05s, box-shadow 0.2s;
}

/* HUD */
.hud {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid #333;
    border-radius: 5px;
    padding: 20px;
    max-width: 400px;
    color: #ccc;
}

.stats {
    margin-bottom: 20px;
}

.stat-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 0.9em;
}

.stat-bar label {
    min-width: 120px;
    font-weight: bold;
}

.bar-bg {
    flex: 1;
    height: 20px;
    background: #111;
    border: 1px solid #333;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
}

.bar-fill {
    height: 100%;
    width: 100%;
    transition: width 0.3s;
}

.bar-fill.health {
    background: linear-gradient(90deg, #00ff00, #ffff00);
}

.bar-fill.health.danger {
    background: linear-gradient(90deg, #ff0000, #ff3333);
}

/* Animation de pulsation lors des dégâts */
.bar-fill.damage-pulse {
    animation: healthPulse 0.3s;
}

@keyframes healthPulse {
    0% { box-shadow: 0 0 10px #ff0000; }
    50% { box-shadow: 0 0 20px #ff0000, inset 0 0 10px #ff0000; }
    100% { box-shadow: 0 0 5px #ff0000; }
}

.bar-fill.energy {
    background: linear-gradient(90deg, #00ffff, #0088ff);
}

.bar-fill.sanity {
    background: linear-gradient(90deg, #ff00ff, #ff0088);
}

.stat-bar span {
    min-width: 80px;
    text-align: right;
}

.location {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #333;
}

.location h3 {
    color: #ffff00;
    margin-bottom: 5px;
    font-size: 1.1em;
}

.location p {
    font-size: 0.85em;
    color: #999;
}

.inventory {
    font-size: 0.9em;
}

.inventory h4 {
    color: #ccc;
    margin-bottom: 8px;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 5px;
}

.item-slot {
    width: 60px;
    height: 60px;
    background: rgba(50, 50, 50, 0.8);
    border: 1px solid #444;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    cursor: pointer;
    transition: all 0.2s;
}

.item-slot:hover {
    border-color: #666;
    background: rgba(80, 80, 80, 0.8);
    transform: scale(1.05);
}

/* Message Box */
.message-box {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    max-width: 500px;
    background: rgba(0, 0, 0, 0.8);
    border-left: 4px solid #ff3333;
    padding: 15px;
    border-radius: 3px;
    color: #ccc;
    min-height: 40px;
    display: flex;
    align-items: center;
    font-size: 0.95em;
    animation: messageSlide 0.3s ease-out;
}

@keyframes messageSlide {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.message-box.warning {
    border-left-color: #ffff00;
    background: rgba(20, 20, 0, 0.9);
}

.message-box.danger {
    border-left-color: #ff0000;
    animation: messageDangerSlide 0.3s, shake 0.3s;
    background: rgba(30, 0, 0, 0.9);
    font-weight: bold;
}

@keyframes messageDangerSlide {
    from {
        transform: translateX(-100%) scaleY(0.8);
        opacity: 0;
    }
    to {
        transform: translateX(0) scaleY(1);
        opacity: 1;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Menu Pause */
.pause-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s;
}

.pause-menu.hidden {
    display: none;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.pause-content {
    text-align: center;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #ff3333;
    padding: 40px;
    border-radius: 10px;
    animation: scaleIn 0.3s;
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.pause-content h2 {
    color: #ff3333;
    font-size: 2em;
    margin-bottom: 30px;
}

/* ========== ENTITIES ET OBJETS DU JEU ========== */

.entity {
    position: absolute;
    width: 40px;
    height: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

/* PERSONNAGE DU JOUEUR */
.player {
    position: absolute;
    width: 40px;
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    z-index: 100;
}

/* Tête du joueur */
.player::before {
    content: '';
    width: 16px;
    height: 16px;
    background: #ffccaa;
    border-radius: 50%;
    border: 2px solid #ffaa88;
    margin-bottom: 2px;
    box-shadow: 0 0 8px rgba(0, 200, 255, 0.6);
}

/* Corps du joueur */
.player::after {
    content: '';
    width: 20px;
    height: 28px;
    background: linear-gradient(to bottom, #0088ff 40%, #0055ff 100%);
    border: 2px solid #00ffff;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(0, 200, 255, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.3);
}

/* ========== CRÉATURES HOSTILES ========== */

.entity.hostile {
    position: absolute;
    width: 60px;
    height: 80px;
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    animation: flicker 0.15s infinite;
}

/* États de l'IA - couleurs différentes */
.entity.hostile.patrol {
    opacity: 0.6;
}

.entity.hostile.hunt {
    animation: flicker 0.1s infinite, entityPulse 1.5s infinite;
}

.entity.hostile.chase {
    animation: flicker 0.08s infinite, entityIntense 0.5s infinite;
}

@keyframes entityPulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
}

@keyframes entityIntense {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 5px #ff0000); }
    50% { filter: brightness(1.4) drop-shadow(0 0 15px #ff0000); }
}

/* Tête de la créature hostile */
.entity.hostile::before {
    content: '';
    width: 20px;
    height: 24px;
    background: #2a2a2a;
    border: 3px solid #ff0000;
    border-radius: 8px;
    margin-bottom: 2px;
    box-shadow: 0 0 15px #ff0000, inset 0 0 8px rgba(0, 0, 0, 0.8);
}

/* Corps de la créature hostile */
.entity.hostile::after {
    content: '';
    width: 8px;
    height: 50px;
    background: linear-gradient(to bottom, #1a1a1a 0%, #0a0a0a 100%);
    border: 2px solid #ff4444;
    box-shadow: 0 0 10px #ff0000;
    border-radius: 2px;
    position: relative;
    margin-top: -4px;
}

/* Jambes de la créature hostile - longues et maigres */
.entity.hostile {
    background: 
        linear-gradient(90deg, transparent 35%, #ff4444 35%, #ff4444 40%, transparent 40%, transparent 60%, #ff4444 60%, #ff4444 65%, transparent 65%),
        transparent;
    background-size: 100% 25px;
    background-position: 0 55px;
    background-repeat: no-repeat;
}

@keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

/* CRÉATURES AMICALES */
.entity.friendly {
    position: absolute;
    width: 40px;
    height: 40px;
    background: #00ffff;
    border: 2px solid #0088ff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ffff;
    animation: friendlyGlow 2s infinite;
}

@keyframes friendlyGlow {
    0%, 100% { box-shadow: 0 0 10px #00ffff; }
    50% { box-shadow: 0 0 20px #00ffff, 0 0 30px #0088ff; }
}

/* PORTES */
.door {
    width: 50px;
    height: 80px;
    background: linear-gradient(90deg, #666 0%, #999 50%, #666 100%);
    border: 3px solid #333;
    position: relative;
    cursor: pointer;
    transition: all 0.3s;
}

.door::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #ffff00;
    border-radius: 50%;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    animation: doorGlow 1.5s infinite;
}

@keyframes doorGlow {
    0%, 100% { box-shadow: 0 0 5px #ffff00; }
    50% { box-shadow: 0 0 15px #ffff00; }
}

.door:hover {
    background: linear-gradient(90deg, #888 0%, #aaa 50%, #888 100%);
    border-color: #666;
    transform: scale(1.05);
}

/* ITEMS */
.item {
    width: 20px;
    height: 20px;
    background: #ffff00;
    border: 1px solid #ffaa00;
    cursor: pointer;
    border-radius: 3px;
    animation: itemBob 1.5s infinite ease-in-out;
    box-shadow: 0 0 8px #ffff00;
}

@keyframes itemBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
}

.item:hover {
    animation: itemBobFast 0.8s infinite ease-in-out;
    box-shadow: 0 0 15px #ffff00;
}

@keyframes itemBobFast {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

/* Responsive */
@media (max-width: 768px) {
    #start-screen h1 {
        font-size: 2.5em;
    }

    .hud {
        max-width: 100%;
        left: 10px;
        right: 10px;
        bottom: 10px;
        font-size: 0.85em;
    }

    .message-box {
        max-width: calc(100% - 40px);
    }

    .stat-bar label {
        min-width: 80px;
    }
}

/* Instructions */
.instructions-text {
    text-align: left;
    background: rgba(50, 50, 50, 0.5);
    padding: 20px;
    border-radius: 5px;
    margin: 20px 0;
}

.instructions-text ul {
    margin-left: 20px;
    margin-top: 10px;
}

.instructions-text li {
    margin: 8px 0;
    color: #ccc;
}

.instructions-text p {
    color: #fff;
    margin: 15px 0;
}
