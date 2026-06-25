// ===== BACKROOMS HORROR GAME - COMPLETE GAME.JS =====
// Fichier principal du jeu avec tous les 100 niveaux
// Prêt à copier/coller dans votre dossier

'use strict';

class BackroomsGame {
    constructor() {
        this.currentLevel = 0;
        this.player = {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            sanity: 100,
            maxSanity: 100,
            inventory: [],
            x: 0,
            y: 0,
            z: 0
        };
        this.monsters = [];
        this.items = [];
        this.isPaused = false;
        this.isGameOver = false;
        this.godMode = false;
        this.gameStarted = false;

        this.initializeLevels();
        this.setupEventListeners();
    }

    // ===== INITIALISER LES 100 NIVEAUX =====
    initializeLevels() {
        this.levels = [
            // ===== LEVELS 0-9 : THE BEGINNING =====
            { id: 0, name: 'The Lobby', description: 'L\'entrée des Backrooms. Fluorescent lights et murs jaunes.', difficulty: 1, monsters: ['shadow'], items: ['flashlight', 'can_of_beans'], darkness: 0.2, ambiance: 'buzzing' },
            { id: 1, name: 'The Hallways', description: 'Des couloirs infinis. Les murs vous observent.', difficulty: 2, monsters: ['shadow', 'watcher'], items: ['water_bottle', 'key'], darkness: 0.5, ambiance: 'whispers' },
            { id: 2, name: 'The Poolrooms', description: 'Un immense bassin d\'eau. Quelque chose bouge dessous...', difficulty: 3, monsters: ['crawler', 'watcher'], items: ['rope', 'matches'], darkness: 0.7, ambiance: 'water_dripping' },
            { id: 3, name: 'The Offices', description: 'Des bureaux abandonnés. Ordinateurs allumés sans raison.', difficulty: 3, monsters: ['machine', 'reflector'], items: ['document', 'coffee_cup'], darkness: 0.4, ambiance: 'computer_hum' },
            { id: 4, name: 'The Dark Place', description: 'Noir complet. Tu entends respirer autour de toi.', difficulty: 5, monsters: ['shadow', 'crawler', 'watcher'], items: ['lighter', 'last_hope'], darkness: 0.99, ambiance: 'breathing' },
            { id: 5, name: 'The Exit', description: 'Une porte brillante. C\'est enfin la liberté...', difficulty: 1, monsters: [], items: ['freedom'], darkness: 0.0, ambiance: 'light' },
            { id: 6, name: 'The Basement', description: 'Un sous-sol humide et sombre. Des tuyaux rouillés.', difficulty: 2, monsters: ['crawler'], items: ['pipe', 'rust'], darkness: 0.7, ambiance: 'water_dripping' },
            { id: 7, name: 'The Rooftop', description: 'Tout en haut. Le vent souffle très fort.', difficulty: 3, monsters: ['watcher'], items: ['rope', 'flag'], darkness: 0.2, ambiance: 'wind_howling' },
            { id: 8, name: 'The Kitchen', description: 'Une cuisine vide. L\'odeur de pourri emplit l\'air.', difficulty: 2, monsters: ['shadow'], items: ['knife', 'food'], darkness: 0.3, ambiance: 'flies_buzzing' },
            { id: 9, name: 'The Bedroom', description: 'Des lits sans draps. Quelqu\'un dort dedans?', difficulty: 2, monsters: [], items: ['pillow', 'blanket'], darkness: 0.4, ambiance: 'snoring' },
            
            // ===== LEVELS 10-19 : THE INDUSTRIAL ZONE =====
            { id: 10, name: 'The Factory', description: 'Une usine déserte. Les machines tournent toutes seules.', difficulty: 3, monsters: ['machine'], items: ['metal_pipe', 'oil'], darkness: 0.5, ambiance: 'machinery_sounds' },
            { id: 11, name: 'The Power Plant', description: 'Électricité partout. Les murs brillent.', difficulty: 4, monsters: ['machine', 'reflector'], items: ['battery', 'wire'], darkness: 0.3, ambiance: 'electrical_buzz' },
            { id: 12, name: 'The Warehouse', description: 'Des milliers de caisses empilées. Certaines bougent.', difficulty: 2, monsters: ['shadow'], items: ['box', 'crate'], darkness: 0.6, ambiance: 'echo' },
            { id: 13, name: 'The Dock', description: 'Un port abandonné. Sent le sel et la rouille.', difficulty: 3, monsters: ['watcher', 'crawler'], items: ['anchor', 'chain'], darkness: 0.4, ambiance: 'waves' },
            { id: 14, name: 'The Mine', description: 'Une mine souterraine. Les murs sont perlants.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['pickaxe', 'gem'], darkness: 0.8, ambiance: 'dripping' },
            { id: 15, name: 'The Construction Site', description: 'Un chantier inachevé. Des ossatures métalliques partout.', difficulty: 2, monsters: ['machine'], items: ['helmet', 'nail'], darkness: 0.5, ambiance: 'metal_clanging' },
            { id: 16, name: 'The Train Station', description: 'Une gare vide. Un train siffle au loin.', difficulty: 3, monsters: ['watcher'], items: ['ticket', 'luggage'], darkness: 0.4, ambiance: 'train_whistle' },
            { id: 17, name: 'The Subway', description: 'Des tunnels souterrains. L\'air sent l\'ozone.', difficulty: 3, monsters: ['shadow', 'machine'], items: ['token', 'map'], darkness: 0.7, ambiance: 'rumbling' },
            { id: 18, name: 'The Bridge', description: 'Un pont suspendu dans le vide. C\'est très haut.', difficulty: 3, monsters: ['watcher'], items: ['rope', 'torch'], darkness: 0.3, ambiance: 'wind_howling' },
            { id: 19, name: 'The Turbine Room', description: 'Des énormes turbines tournent. L\'air vibre.', difficulty: 4, monsters: ['machine', 'crawler'], items: ['screw', 'bearing'], darkness: 0.5, ambiance: 'spinning' },
            
            // ===== LEVELS 20-29 : THE NATURE ZONE =====
            { id: 20, name: 'The Garden', description: 'Un jardin envahi. Les plantes bougent seules.', difficulty: 1, monsters: [], items: ['flower', 'seed'], darkness: 0.2, ambiance: 'birds_singing' },
            { id: 21, name: 'The Forest', description: 'Une forêt dense et noire. Les arbres vous suivent.', difficulty: 3, monsters: ['shadow', 'crawler'], items: ['stick', 'leaf'], darkness: 0.7, ambiance: 'wind_rustling' },
            { id: 22, name: 'The Mountain', description: 'Une montagne escarpée. Le sommet disparaît dans les nuages.', difficulty: 3, monsters: ['watcher'], items: ['rock', 'flag'], darkness: 0.4, ambiance: 'wind_howling' },
            { id: 23, name: 'The Lake', description: 'Un lac calme. Trop calme.', difficulty: 2, monsters: ['crawler'], items: ['water', 'fish'], darkness: 0.5, ambiance: 'water_lapping' },
            { id: 24, name: 'The Cave', description: 'Une grotte sombre et profonde.', difficulty: 3, monsters: ['crawler', 'shadow'], items: ['stalactite', 'crystal'], darkness: 0.9, ambiance: 'dripping' },
            { id: 25, name: 'The Jungle', description: 'Une jungle épaisse. Quelque chose respire dans les buissons.', difficulty: 3, monsters: ['shadow', 'watcher'], items: ['vine', 'herb'], darkness: 0.6, ambiance: 'creatures_sounds' },
            { id: 26, name: 'The Desert', description: 'Un désert infini. Rien ne se voit.', difficulty: 2, monsters: ['watcher'], items: ['sand', 'cactus'], darkness: 0.1, ambiance: 'wind_howling' },
            { id: 27, name: 'The Swamp', description: 'Un marais putride. L\'eau est noire.', difficulty: 3, monsters: ['crawler', 'shadow'], items: ['mud', 'moss'], darkness: 0.7, ambiance: 'squelch' },
            { id: 28, name: 'The Volcano', description: 'Un volcan actif. C\'est très chaud.', difficulty: 4, monsters: ['machine', 'reflector'], items: ['lava', 'ash'], darkness: 0.3, ambiance: 'rumbling' },
            { id: 29, name: 'The Glacier', description: 'Un glacier gelé. Tes pieds glissent.', difficulty: 2, monsters: ['shadow'], items: ['ice', 'snow'], darkness: 0.2, ambiance: 'wind_howling' },
            
            // ===== LEVELS 30-39 : THE BUILDINGS ZONE =====
            { id: 30, name: 'The Hospital', description: 'Un hôpital désert. Des bruits bizarres partout.', difficulty: 4, monsters: ['machine', 'crawler', 'watcher'], items: ['medicine', 'stethoscope'], darkness: 0.6, ambiance: 'heartbeat' },
            { id: 31, name: 'The School', description: 'Une école vide. Des enfants ricanent.', difficulty: 3, monsters: ['shadow', 'reflector'], items: ['notebook', 'pencil'], darkness: 0.5, ambiance: 'laughter' },
            { id: 32, name: 'The Library', description: 'Des milliers de livres. Certains s\'ouvrent tous seuls.', difficulty: 2, monsters: ['shadow'], items: ['book', 'candle'], darkness: 0.5, ambiance: 'pages_turning' },
            { id: 33, name: 'The Church', description: 'Une église abandonnée. Les cloches sonnent.', difficulty: 2, monsters: ['reflector'], items: ['candle', 'bible'], darkness: 0.4, ambiance: 'bells_ringing' },
            { id: 34, name: 'The Prison', description: 'Des cellules vides. Quelqu\'un pleure.', difficulty: 4, monsters: ['shadow', 'machine'], items: ['key', 'mirror'], darkness: 0.8, ambiance: 'crying' },
            { id: 35, name: 'The Museum', description: 'Un musée avec des statues bizarres.', difficulty: 3, monsters: ['reflector', 'watcher'], items: ['painting', 'statue'], darkness: 0.6, ambiance: 'echo' },
            { id: 36, name: 'The Theater', description: 'Un théâtre vide. Les lumières s\'allument toutes seules.', difficulty: 3, monsters: ['shadow', 'watcher'], items: ['ticket', 'curtain'], darkness: 0.4, ambiance: 'music_box' },
            { id: 37, name: 'The Bank', description: 'Une banque fermée. Les coffres sont ouverts.', difficulty: 3, monsters: ['machine', 'reflector'], items: ['gold', 'diamond'], darkness: 0.3, ambiance: 'silence' },
            { id: 38, name: 'The Store', description: 'Un magasin aux rayons infinis.', difficulty: 2, monsters: ['shadow'], items: ['product', 'price_tag'], darkness: 0.4, ambiance: 'muzak' },
            { id: 39, name: 'The Motel', description: 'Un motel délabré. Des cris viennent des chambres.', difficulty: 3, monsters: ['shadow', 'watcher'], items: ['key', 'towel'], darkness: 0.6, ambiance: 'screaming' },
            
            // ===== LEVELS 40-49 : THE WATER ZONE =====
            { id: 40, name: 'The Aquarium', description: 'Un aquarium géant. Les créatures dedans te regardent.', difficulty: 3, monsters: ['crawler', 'watcher'], items: ['fish', 'algae'], darkness: 0.5, ambiance: 'bubbling' },
            { id: 41, name: 'The Ocean', description: 'Un océan infini. Quelque chose de grand passe.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['shell', 'seaweed'], darkness: 0.6, ambiance: 'waves' },
            { id: 42, name: 'The River', description: 'Une rivière souterraine. Le courant est fort.', difficulty: 3, monsters: ['crawler'], items: ['water', 'stone'], darkness: 0.7, ambiance: 'rushing_water' },
            { id: 43, name: 'The Waterfall', description: 'Une cascade énorme. L\'eau s\'écoule dans le vide.', difficulty: 3, monsters: ['watcher'], items: ['rock', 'moss'], darkness: 0.4, ambiance: 'roaring' },
            { id: 44, name: 'The Bathtub', description: 'Une salle de bain géante. L\'eau est noire.', difficulty: 2, monsters: ['shadow'], items: ['soap', 'towel'], darkness: 0.5, ambiance: 'dripping' },
            { id: 45, name: 'The Swimming Pool', description: 'Une piscine olympique vide. Des traces de sang.', difficulty: 3, monsters: ['shadow', 'crawler'], items: ['chlorine', 'goggles'], darkness: 0.6, ambiance: 'echo' },
            { id: 46, name: 'The Sewers', description: 'Des égouts puants. Des choses bougent dans l\'eau.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['pipe', 'slime'], darkness: 0.8, ambiance: 'squelch' },
            { id: 47, name: 'The Fountain', description: 'Une fontaine avec de l\'eau noire.', difficulty: 2, monsters: [], items: ['coin', 'water'], darkness: 0.3, ambiance: 'water_lapping' },
            { id: 48, name: 'The Marsh', description: 'Un marais stagnant. L\'odeur est insoutenable.', difficulty: 3, monsters: ['crawler', 'shadow'], items: ['mud', 'insect'], darkness: 0.7, ambiance: 'squelch' },
            { id: 49, name: 'The Mist', description: 'Une vallée couverte de brouillard épais.', difficulty: 3, monsters: ['watcher', 'shadow'], items: ['cloth', 'moisture'], darkness: 0.8, ambiance: 'silence' },
            
            // ===== LEVELS 50-59 : THE TECHNOLOGY ZONE =====
            { id: 50, name: 'The Laboratory', description: 'Un labo avec des expériences bizarres.', difficulty: 4, monsters: ['machine', 'reflector'], items: ['test_tube', 'chemical'], darkness: 0.6, ambiance: 'machinery_sounds' },
            { id: 51, name: 'The Computer Room', description: 'Des milliers d\'ordinateurs qui tournent.', difficulty: 3, monsters: ['machine'], items: ['floppy_disk', 'keyboard'], darkness: 0.4, ambiance: 'computer_hum' },
            { id: 52, name: 'The Server Farm', description: 'Des racks de serveurs qui s\'étendent à l\'infini.', difficulty: 3, monsters: ['machine', 'reflector'], items: ['circuit_board', 'cable'], darkness: 0.3, ambiance: 'fan_noise' },
            { id: 53, name: 'The Spaceship', description: 'Un vaisseau spatial. Les panneaux clignotent.', difficulty: 4, monsters: ['machine', 'watcher'], items: ['circuit', 'helmet'], darkness: 0.5, ambiance: 'beeping' },
            { id: 54, name: 'The Antenna Farm', description: 'Des centaines d\'antennes qui captent des signaux bizarres.', difficulty: 3, monsters: ['reflector'], items: ['signal', 'radio'], darkness: 0.2, ambiance: 'static' },
            { id: 55, name: 'The Nuclear Reactor', description: 'Un réacteur nucléaire. Les alarmes sonnent.', difficulty: 5, monsters: ['machine', 'reflector', 'shadow'], items: ['radiation', 'plutonium'], darkness: 0.4, ambiance: 'alarm' },
            { id: 56, name: 'The Cryogenic Chamber', description: 'Une chambre avec du froid extrême.', difficulty: 4, monsters: ['machine'], items: ['ice', 'freeze_crystal'], darkness: 0.6, ambiance: 'hissing' },
            { id: 57, name: 'The Tesla Tower', description: 'Une tour avec de l\'électricité partout.', difficulty: 4, monsters: ['machine', 'reflector'], items: ['coil', 'electricity'], darkness: 0.3, ambiance: 'crackling' },
            { id: 58, name: 'The Particle Accelerator', description: 'Une machine géante qui crée des portails.', difficulty: 5, monsters: ['machine', 'watcher'], items: ['particle', 'blueprint'], darkness: 0.5, ambiance: 'humming' },
            { id: 59, name: 'The Hologram Room', description: 'Des projections holographiques bizarres.', difficulty: 3, monsters: ['reflector', 'watcher'], items: ['holochip', 'projector'], darkness: 0.4, ambiance: 'buzzing' },
            
            // ===== LEVELS 60-69 : THE SCARY ZONE =====
            { id: 60, name: 'The Graveyard', description: 'Un cimetière où les tombes s\'ouvrent.', difficulty: 4, monsters: ['shadow', 'watcher', 'crawler'], items: ['bone', 'tombstone'], darkness: 0.8, ambiance: 'moaning' },
            { id: 61, name: 'The Morgue', description: 'Une morgue avec des corps.', difficulty: 4, monsters: ['shadow', 'machine'], items: ['ice', 'tag'], darkness: 0.7, ambiance: 'silence' },
            { id: 62, name: 'The Haunted House', description: 'Une maison hantée. Les murs saignent.', difficulty: 5, monsters: ['shadow', 'reflector', 'watcher'], items: ['ghost', 'curse'], darkness: 0.8, ambiance: 'screaming' },
            { id: 63, name: 'The Torture Chamber', description: 'Une chambre avec des instruments de torture.', difficulty: 5, monsters: ['shadow', 'machine'], items: ['chain', 'blood'], darkness: 0.9, ambiance: 'screaming' },
            { id: 64, name: 'The Bloodroom', description: 'Une salle couverte de sang.', difficulty: 5, monsters: ['shadow', 'crawler', 'watcher'], items: ['blood', 'corpse'], darkness: 0.8, ambiance: 'dripping' },
            { id: 65, name: 'The Nightmare', description: 'C\'est un cauchemar. Rien n\'est réel.', difficulty: 5, monsters: ['shadow', 'watcher', 'crawler', 'machine'], items: ['dream_catcher', 'memory'], darkness: 0.9, ambiance: 'screaming' },
            { id: 66, name: 'The Void', description: 'Le néant absolu. Tu flottes.', difficulty: 5, monsters: ['shadow', 'crawler'], items: ['nothing', 'emptiness'], darkness: 0.99, ambiance: 'silence' },
            { id: 67, name: 'The Hell', description: 'L\'enfer. Tout brûle.', difficulty: 5, monsters: ['machine', 'reflector', 'crawler'], items: ['fire', 'ash'], darkness: 0.5, ambiance: 'burning' },
            { id: 68, name: 'The Abyss', description: 'Un gouffre sans fond.', difficulty: 5, monsters: ['crawler', 'shadow', 'watcher'], items: ['darkness', 'despair'], darkness: 0.99, ambiance: 'silence' },
            { id: 69, name: 'The Infirmary', description: 'Une infirmerie abandonnée avec des lits tâchés.', difficulty: 4, monsters: ['shadow', 'watcher'], items: ['medicine', 'bandage'], darkness: 0.7, ambiance: 'heartbeat' },
            
            // ===== LEVELS 70-79 : THE DIMENSION ZONE =====
            { id: 70, name: 'The Mirror World', description: 'Un monde en miroir. Les reflections ont une vie propre.', difficulty: 4, monsters: ['reflector', 'watcher'], items: ['mirror', 'reflection'], darkness: 0.5, ambiance: 'echo' },
            { id: 71, name: 'The Upside Down', description: 'Tout est inversé. Le plafond est le sol.', difficulty: 3, monsters: ['watcher', 'crawler'], items: ['gravity_reversal', 'compass'], darkness: 0.4, ambiance: 'woosh' },
            { id: 72, name: 'The Pocket Dimension', description: 'Un espace poche plus petit que possible.', difficulty: 3, monsters: ['machine', 'shadow'], items: ['tesseract', 'key'], darkness: 0.5, ambiance: 'humming' },
            { id: 73, name: 'The Parallel Universe', description: 'Tu vois une autre version de toi.', difficulty: 4, monsters: ['reflector', 'shadow'], items: ['alternate_self', 'choice'], darkness: 0.5, ambiance: 'whispers' },
            { id: 74, name: 'The Time Loop', description: 'Tu reviens au même endroit toutes les minutes.', difficulty: 3, monsters: ['watcher', 'machine'], items: ['clock', 'memory'], darkness: 0.4, ambiance: 'ticking' },
            { id: 75, name: 'The Fractured Reality', description: 'La réalité se brise en morceaux.', difficulty: 4, monsters: ['shadow', 'crawler', 'watcher'], items: ['shard', 'glue'], darkness: 0.6, ambiance: 'cracking' },
            { id: 76, name: 'The Liminal Space', description: 'Un espace entre les mondes. Vide et triste.', difficulty: 3, monsters: ['watcher'], items: ['nothing', 'void'], darkness: 0.6, ambiance: 'silence' },
            { id: 77, name: 'The Fourth Dimension', description: 'Tu ne peux pas vraiment le voir.', difficulty: 5, monsters: ['machine', 'reflector', 'watcher'], items: ['dimension', 'insight'], darkness: 0.7, ambiance: 'humming' },
            { id: 78, name: 'The Pocket Universe', description: 'Un univers entier dans une poche.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['universe', 'star'], darkness: 0.4, ambiance: 'cosmic_hum' },
            { id: 79, name: 'The Infinite Spiral', description: 'Une spirale infinie qui descend.', difficulty: 4, monsters: ['crawler', 'watcher'], items: ['spiral', 'depth'], darkness: 0.7, ambiance: 'whooshing' },
            
            // ===== LEVELS 80-89 : THE ANCIENT ZONE =====
            { id: 80, name: 'The Ancient Temple', description: 'Un temple ancien avec des hiéroglyphes.', difficulty: 4, monsters: ['shadow', 'watcher'], items: ['artifact', 'scroll'], darkness: 0.6, ambiance: 'mystical' },
            { id: 81, name: 'The Pyramid', description: 'Une pyramide souterraine. Des pièges partout.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['gold', 'curse'], darkness: 0.7, ambiance: 'echo' },
            { id: 82, name: 'The Catacombs', description: 'Des tunnels avec des squelettes empilés.', difficulty: 4, monsters: ['shadow', 'crawler', 'watcher'], items: ['bone', 'torch'], darkness: 0.8, ambiance: 'dripping' },
            { id: 83, name: 'The Colosseum', description: 'Un arène antique. Les spectres applaudissent.', difficulty: 4, monsters: ['shadow', 'watcher'], items: ['sword', 'shield'], darkness: 0.5, ambiance: 'cheering' },
            { id: 84, name: 'The Oracle\'s Cave', description: 'La caverne d\'un oracle. Elle parle.', difficulty: 4, monsters: ['watcher', 'reflector'], items: ['prophecy', 'crystal'], darkness: 0.6, ambiance: 'whispers' },
            { id: 85, name: 'The Stonehenge', description: 'Des pierres géantes avec des symboles.', difficulty: 3, monsters: ['watcher'], items: ['rune', 'stone'], darkness: 0.3, ambiance: 'wind_howling' },
            { id: 86, name: 'The Lost City', description: 'Une ville antique entièrement submergée.', difficulty: 4, monsters: ['crawler', 'shadow'], items: ['artifact', 'map'], darkness: 0.7, ambiance: 'water_lapping' },
            { id: 87, name: 'The Sacrifice Altar', description: 'Un autel avec des traces de rituels.', difficulty: 5, monsters: ['shadow', 'machine', 'watcher'], items: ['blood', 'knife'], darkness: 0.8, ambiance: 'chanting' },
            { id: 88, name: 'The Tomb', description: 'Un tombeau royal. Le pharaon se réveille.', difficulty: 4, monsters: ['shadow', 'crawler'], items: ['mummy', 'treasure'], darkness: 0.8, ambiance: 'moaning' },
            { id: 89, name: 'The Sacred Well', description: 'Un puits sacré avec de l\'eau ancienne.', difficulty: 3, monsters: ['crawler', 'watcher'], items: ['water', 'wish'], darkness: 0.6, ambiance: 'echoing' },
            
            // ===== LEVELS 90-99 : THE FINAL ZONE =====
            { id: 90, name: 'The Observation Deck', description: 'Tu regardes le monde en bas. C\'est trop haut.', difficulty: 3, monsters: ['watcher'], items: ['telescope', 'map'], darkness: 0.2, ambiance: 'wind_howling' },
            { id: 91, name: 'The Control Room', description: 'Des milliers de boutons et d\'interrupteurs.', difficulty: 4, monsters: ['machine', 'reflector'], items: ['button', 'switch'], darkness: 0.3, ambiance: 'humming' },
            { id: 92, name: 'The Escape Pod', description: 'Un dernier moyen de s\'échapper.', difficulty: 4, monsters: ['machine'], items: ['key', 'fuel'], darkness: 0.4, ambiance: 'beeping' },
            { id: 93, name: 'The Archive', description: 'Des millions de fichiers. Ton histoire est dedans.', difficulty: 4, monsters: ['machine', 'watcher'], items: ['file', 'truth'], darkness: 0.5, ambiance: 'whispers' },
            { id: 94, name: 'The Throne Room', description: 'Un trône vide. Quelqu\'un l\'attend.', difficulty: 5, monsters: ['shadow', 'machine', 'watcher'], items: ['crown', 'power'], darkness: 0.6, ambiance: 'echo' },
            { id: 95, name: 'The Creator\'s Studio', description: 'L\'atelier du créateur des Backrooms.', difficulty: 5, monsters: ['reflector', 'machine', 'shadow'], items: ['blueprint', 'god_particle'], darkness: 0.7, ambiance: 'creation_sounds' },
            { id: 96, name: 'The Heart', description: 'Le cœur des Backrooms. Il bat.', difficulty: 5, monsters: ['crawler', 'shadow', 'watcher', 'machine'], items: ['heartbeat', 'soul'], darkness: 0.8, ambiance: 'heartbeat' },
            { id: 97, name: 'The Source Code', description: 'Le code source de la réalité elle-même.', difficulty: 5, monsters: ['machine', 'reflector'], items: ['code', 'truth'], darkness: 0.5, ambiance: 'digital_sounds' },
            { id: 98, name: 'The Singularity', description: 'Le centre de tout. L\'infini.', difficulty: 5, monsters: ['shadow', 'machine', 'watcher', 'crawler', 'reflector'], items: ['infinity', 'everything'], darkness: 0.95, ambiance: 'cosmic_hum' },
            { id: 99, name: 'The Ending', description: 'La fin des Backrooms. Ou le commencement?', difficulty: 1, monsters: [], items: ['freedom', 'choice'], darkness: 0.0, ambiance: 'peaceful' }
        ];
    }

    // ===== SETUP EVENT LISTENERS =====
    setupEventListeners() {
        // Boutons du menu
        document.getElementById('start-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn')?.addEventListener('click', () => this.showInstructions());
        document.getElementById('back-btn')?.addEventListener('click', () => this.hideInstructions());
        
        // Pause et menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.togglePause();
        });
        
        document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn')?.addEventListener('click', () => this.restart());
        document.getElementById('quit-btn')?.addEventListener('click', () => this.quit());
        
        // Game Over
        document.getElementById('retry-btn')?.addEventListener('click', () => this.restart());
        document.getElementById('main-menu-btn')?.addEventListener('click', () => this.quit());
        
        // Contrôles du jeu
        document.addEventListener('keydown', (e) => {
            if (!this.isPaused && this.gameStarted) {
                this.handleInput(e.key);
            }
        });
    }

    // ===== DÉMARRER LE JEU =====
    startGame() {
        this.gameStarted = true;
        this.currentLevel = 0;
        this.player = {
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            sanity: 100,
            maxSanity: 100,
            inventory: [],
            x: 0,
            y: 0,
            z: 0
        };
        this.monsters = [];
        this.items = [];
        this.isGameOver = false;
        
        this.showScreen('game-screen');
        this.loadLevel(this.currentLevel);
        this.gameLoop();
    }

    // ===== CHARGER UN NIVEAU =====
    loadLevel(levelId) {
        const level = this.levels[levelId];
        if (!level) return;
        
        this.currentLevel = levelId;
        
        // Mettre à jour le HUD
        document.getElementById('room-name').textContent = `Level ${level.id} - ${level.name}`;
        document.getElementById('room-description').textContent = level.description;
        
        // Appliquer les paramètres du niveau
        this.applyLevelSettings(level);
        
        // Spawnner les monstres
        this.spawnMonstersFromLevel(level);
        
        console.log(`📍 Chargement: Level ${level.id} - ${level.name}`);
    }

    // ===== APPLIQUER LES PARAMÈTRES DU NIVEAU =====
    applyLevelSettings(level) {
        const viewport = document.getElementById('viewport');
        if (viewport) {
            const brightness = 1 - level.darkness;
            viewport.style.filter = `brightness(${brightness})`;
            viewport.style.opacity = brightness;
        }
    }

    // ===== SPAWNNER LES MONSTRES =====
    spawnMonstersFromLevel(level) {
        this.monsters = [];
        level.monsters.forEach((monsterType, index) => {
            this.monsters.push({
                type: monsterType,
                health: 50,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speed: Math.random() * 2 + 1
            });
        });
    }

    // ===== GESTION DE L'ENTRÉE =====
    handleInput(key) {
        const step = 10;
        
        switch(key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                this.player.y -= step;
                this.player.energy -= 2;
                break;
            case 'arrowdown':
            case 's':
                this.player.y += step;
                this.player.energy -= 2;
                break;
            case 'arrowleft':
            case 'a':
            case 'q':
                this.player.x -= step;
                this.player.energy -= 2;
                break;
            case 'arrowright':
            case 'd':
                this.player.x += step;
                this.player.energy -= 2;
                break;
            case ' ':
            case 'e':
                this.interact();
                break;
        }
        
        // Limiter l'énergie
        this.player.energy = Math.max(0, Math.min(this.player.maxEnergy, this.player.energy));
    }

    // ===== INTERACTION =====
    interact() {
        console.log('Interaction!');
        // À développer
    }

    // ===== METTRE À JOUR LE HUD =====
    updateHUD() {
        // Santé
        const healthPercent = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-bar').style.width = healthPercent + '%';
        document.getElementById('health-text').textContent = `${this.player.health}/${this.player.maxHealth}`;
        
        // Énergie
        const energyPercent = (this.player.energy / this.player.maxEnergy) * 100;
        document.getElementById('energy-bar').style.width = energyPercent + '%';
        document.getElementById('energy-text').textContent = `${this.player.energy}/${this.player.maxEnergy}`;
        
        // Sanité
        const sanityPercent = (this.player.sanity / this.player.maxSanity) * 100;
        document.getElementById('sanity-bar').style.width = sanityPercent + '%';
        document.getElementById('sanity-text').textContent = `${this.player.sanity}/${this.player.maxSanity}`;
    }

    // ===== BOUCLE DE JEU =====
    gameLoop() {
        if (this.isPaused || this.isGameOver) return;
        
        // Mise à jour
        this.update();
        this.updateHUD();
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    // ===== MISE À JOUR DU JEU =====
    update() {
        // Énergie diminue
        if (this.gameStarted && !this.isPaused) {
            this.player.energy -= 0.1;
            
            if (this.player.energy <= 0) {
                this.player.health -= 1;
                this.player.energy = 0;
            }
        }
        
        // Sanité diminue avec le temps
        if (this.currentLevel >= 60) {
            this.player.sanity -= 0.05;
        }
        
        // Vérifier mort
        if (this.player.health <= 0) {
            this.gameOver('Tu es mort...');
        }
        
        if (this.player.sanity <= 0) {
            this.gameOver('Tu as perdu ta sanité mentale...');
        }
    }

    // ===== RENDU =====
    render() {
        // À développer selon votre système de rendu
    }

    // ===== GAME OVER =====
    gameOver(message) {
        this.isGameOver = true;
        document.getElementById('game-over-title').textContent = 'GAME OVER';
        document.getElementById('game-over-message').textContent = message;
        this.showScreen('game-over-screen');
    }

    // ===== PAUSE =====
    togglePause() {
        if (!this.gameStarted) return;
        
        this.isPaused = !this.isPaused;
        const pauseMenu = document.getElementById('pause-menu');
        pauseMenu.classList.toggle('hidden');
    }

    // ===== RESTART =====
    restart() {
        this.startGame();
    }

    // ===== QUIT =====
    quit() {
        this.showScreen('start-screen');
        this.gameStarted = false;
        this.isGameOver = false;
        this.isPaused = false;
    }

    // ===== AFFICHAGE D'ÉCRAN =====
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId)?.classList.add('active');
    }

    showInstructions() {
        this.showScreen('instructions-screen');
    }

    hideInstructions() {
        this.showScreen('start-screen');
    }

    // ===== ADMIN FUNCTIONS =====
    showAdminLogin() {
        document.getElementById('admin-login-screen').classList.add('active');
    }

    closeAdminLogin() {
        document.getElementById('admin-login-screen').classList.remove('active');
    }

    checkAdminCode() {
        const code = document.getElementById('admin-code-input').value;
        if (code === 'admin123') {
            document.getElementById('admin-login-screen').classList.remove('active');
            this.toggleAdminPanel();
            document.getElementById('admin-code-input').value = '';
        } else {
            document.getElementById('admin-error').textContent = 'Code incorrect!';
        }
    }

    toggleAdminPanel() {
        document.getElementById('admin-panel').classList.toggle('active');
    }

    adminSetInvulnerable() {
        this.godMode = !this.godMode;
        const btn = event.target;
        btn.textContent = `God Mode: ${this.godMode ? 'ON' : 'OFF'}`;
    }

    adminAddHealth(amount) {
        this.player.health = Math.min(this.player.maxHealth, this.player.health + amount);
        this.updateHUD();
    }

    adminAddEnergy(amount) {
        this.player.energy = Math.min(this.player.maxEnergy, this.player.energy + amount);
        this.updateHUD();
    }

    adminAddSanity(amount) {
        this.player.sanity = Math.min(this.player.maxSanity, this.player.sanity + amount);
        this.updateHUD();
    }

    adminKillAllEnemies() {
        this.monsters = [];
        console.log('Tous les monstres sont morts');
    }

    adminNextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            this.loadLevel(this.currentLevel + 1);
        }
    }

    adminPrevLevel() {
        if (this.currentLevel > 0) {
            this.loadLevel(this.currentLevel - 1);
        }
    }

    adminGoToLevel(levelId) {
        if (levelId >= 0 && levelId < this.levels.length) {
            this.loadLevel(levelId);
        }
    }

    adminSpawnMonster(type) {
        this.monsters.push({
            type: type,
            health: 50,
            x: Math.random() * 100,
            y: Math.random() * 100,
            speed: Math.random() * 2 + 1
        });
    }
}

// ===== INITIALISER LE JEU =====
window.addEventListener('DOMContentLoaded', () => {
    window.game = new BackroomsGame();
});
