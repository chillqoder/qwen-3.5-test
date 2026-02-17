/**
 * Game Configuration Constants
 * All game balance parameters are defined here
 */

const CONFIG = {
    // Logical resolution (portrait mode)
    WIDTH: 360,
    HEIGHT: 640,
    
    // Physics constants
    GRAVITY: 1200,           // pixels per second squared
    FLAP_VELOCITY: -400,     // initial upward velocity after flap
    MAX_FALL_VELOCITY: 600,  // terminal velocity
    
    // Player (Bird) settings
    BIRD_WIDTH: 34,
    BIRD_HEIGHT: 24,
    BIRD_X: 80,              // horizontal position of bird
    
    // Pipe settings
    PIPE_WIDTH: 60,
    PIPE_GAP: 160,           // vertical gap between pipes
    PIPE_SPEED: 180,         // pixels per second
    PIPE_SPAWN_INTERVAL: 1.8, // seconds between pipe spawns
    PIPE_MIN_HEIGHT: 80,     // minimum pipe height
    
    // Ground settings
    GROUND_HEIGHT: 100,
    
    // Game states
    STATE: {
        START: 'start',
        PLAYING: 'playing',
        GAME_OVER: 'gameover'
    },
    
    // Colors (for placeholder graphics)
    COLORS: {
        SKY: '#4ec0ca',
        GROUND: '#ded895',
        GROUND_TOP: '#73bf2e',
        BIRD: '#f4ce42',
        BIRD_OUTLINE: '#000000',
        PIPE: '#73bf2e',
        PIPE_OUTLINE: '#558c22',
        TEXT: '#ffffff',
        TEXT_SHADOW: '#000000'
    }
};

// Scale factor (calculated at runtime based on screen size)
let SCALE = 1;
