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
    white-space: pre-wrap;
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

/* ========== PLAYER ==========*/
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

.player::after {
    content: '';
    width: 20px;
    height: 28px;
    background: linear-gradient(to bottom, #0088ff 40%, #0055ff 100%);
    border: 2px solid #00ffff;
    border-radius: 4px;
    box-shadow: 0 0 12px rgba(0, 200, 255, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.3);
}

/* ========== CRÉATURES: 5 TYPES DIFFÉRENTS ==========*/

.entity {
    position: absolute;
}

/* ========== TYPE 1: SHADOW - Créature d'ombre rapide ==========*/
.entity.shadow {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
    border: 2px solid #4a4aff;
    border-radius: 5px;
    box-shadow: 0 0 15px #4a4aff;
    animation: flicker 0.15s infinite;
}

.entity.shadow.patrol {
    opacity: 0.5;
    box-shadow: 0 0 5px #4a4aff;
}

.entity.shadow.hunt {
    animation: flicker 0.1s infinite, shadowPulse 1.5s infinite;
}

.entity.shadow.chase {
    animation: flicker 0.08s infinite, shadowIntense 0.5s infinite;
    box-shadow: 0 0 25px #4a4aff, 0 0 40px #0088ff;
}

@keyframes shadowPulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
}

@keyframes shadowIntense {
    0%, 100% { filter: brightness(1) drop-shadow(0 0 10px #4a4aff); }
    50% { filter: brightness(1.4) drop-shadow(0 0 20px #0088ff); }
}

/* ========== TYPE 2: WATCHER - Créature qui regarde ==========*/
.entity.watcher {
    width: 45px;
    height: 45px;
    background: radial-gradient(circle, #2a2a4a, #0a0a1a);
    border: 3px solid #ff8800;
    border-radius: 50%;
    box-shadow: 0 0 20px #ff8800;
    animation: flicker 0.2s infinite;
}

.entity.watcher::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #ffff00;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ffff00;
    animation: watcherEye 0.8s infinite;
}

@keyframes watcherEye {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
}

.entity.watcher.patrol {
    opacity: 0.6;
}

.entity.watcher.hunt {
    animation: flicker 0.1s infinite, watcherAlert 1.2s infinite;
}

.entity.watcher.chase {
    animation: flicker 0.08s infinite, watcherHunt 0.4s infinite;
    box-shadow: 0 0 30px #ff8800, 0 0 50px #ff4400;
}

@keyframes watcherAlert {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.4); }
}

@keyframes watcherHunt {
    0%, 100% { transform: scale(1); box-shadow: 0 0 30px #ff8800; }
    50% { transform: scale(1.1); box-shadow: 0 0 40px #ff4400; }
}

/* ========== TYPE 3: CRAWLER - Petite créature rampante ==========*/
.entity.crawler {
    width: 25px;
    height: 25px;
    background: linear-gradient(45deg, #3a3a00, #1a1a00);
    border: 2px solid #dddd00;
    border-radius: 50%;
    box-shadow: 0 0 10px #dddd00;
    animation: crawlerScurry 0.4s infinite;
}

.entity.crawler.patrol {
    opacity: 0.7;
    animation: crawlerMove 1.5s infinite ease-in-out;
}

.entity.crawler.chase {
    animation: crawlerAttack 0.25s infinite;
    box-shadow: 0 0 15px #ffff00, 0 0 25px #dddd00;
}

@keyframes crawlerScurry {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

@keyframes crawlerMove {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(2px, -2px); }
    50% { transform: translate(-2px, 2px); }
    75% { transform: translate(2px, 2px); }
}

@keyframes crawlerAttack {
    0%, 100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 15px #ffff00; }
    50% { transform: scale(0.9) rotate(180deg); box-shadow: 0 0 25px #ff8800; }
}

/* ========== TYPE 4: REFLECTOR - Reflet du joueur ==========*/
.entity.reflector {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #4a4a6a, #2a2a4a);
    border: 3px solid #ff00ff;
    border-radius: 3px;
    box-shadow: 0 0 20px #ff00ff;
    animation: flicker 0.12s infinite;
}

.entity.reflector::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid #ff00ff;
    box-shadow: inset 0 0 15px #ff00ff;
    border-radius: 3px;
    animation: reflectorGlow 0.8s infinite;
}

@keyframes reflectorGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
}

.entity.reflector.patrol {
    opacity: 0.8;
}

.entity.reflector.hunt {
    animation: flicker 0.1s infinite, reflectorHunt 1s infinite;
}

.entity.reflector.chase {
    animation: flicker 0.08s infinite, reflectorChase 0.3s infinite;
    box-shadow: 0 0 30px #ff00ff, 0 0 50px #ff0088;
    filter: brightness(1.5);
}

@keyframes reflectorHunt {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
}

@keyframes reflectorChase {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

/* ========== TYPE 5: MACHINE - Entité mécanique ==========*/
.entity.machine {
    width: 50px;
    height: 50px;
    background: linear-gradient(90deg, #333333, #555555);
    border: 3px solid #ff0000;
    border-radius: 2px;
    box-shadow: 0 0 20px #ff0000;
    animation: flicker 0.1s infinite;
    clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%, 5% 50%);
}

.entity.machine::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #00ff00;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: 0 0 15px #00ff00;
    animation: machineEye 0.5s infinite;
}

@keyframes machineEye {
    0%, 100% { box-shadow: 0 0 15px #00ff00; }
    50% { box-shadow: 0 0 25px #ff0000; }
}

.entity.machine.patrol {
    opacity: 0.7;
}

.entity.machine.chase {
    animation: flicker 0.08s infinite, machineActivate 0.4s infinite;
    box-shadow: 0 0 30px #ff0000, 0 0 50px #ff6600;
}

@keyframes machineActivate {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(10deg) scale(1.05); }
    50% { transform: rotate(0deg) scale(1); }
    75% { transform: rotate(-10deg) scale(1.05); }
}

/* ========== TYPE 6: DRONE - Entité neutre ==========*/
.entity.drone {
    width: 35px;
    height: 35px;
    background: radial-gradient(circle, #00ffff, #0088ff);
    border: 2px solid #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ffff;
    animation: droneBob 2s infinite ease-in-out;
}

@keyframes droneBob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

/* ========== PORTES ==========*/
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

/* ========== ITEMS ==========*/
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

@keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
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
        font-size: 0.85em;
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
