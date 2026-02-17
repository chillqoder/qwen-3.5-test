/**
 * Main Entry Point
 * Initializes the game when DOM is ready
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Get canvas element
    const canvas = document.getElementById('game-canvas');
    
    // Calculate scale for responsive display
    function calculateScale() {
        const targetAspect = CONFIG.WIDTH / CONFIG.HEIGHT;
        const windowAspect = window.innerWidth / window.innerHeight;
        
        let scale;
        let width, height;
        
        if (windowAspect < targetAspect) {
            // Window is narrower - fit to width
            scale = window.innerWidth / CONFIG.WIDTH;
            width = CONFIG.WIDTH * scale;
            height = CONFIG.HEIGHT * scale;
        } else {
            // Window is wider - fit to height
            scale = window.innerHeight / CONFIG.HEIGHT;
            width = CONFIG.WIDTH * scale;
            height = CONFIG.HEIGHT * scale;
        }
        
        // Apply scale
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        
        // Store scale for other modules if needed
        window.GAME_SCALE = scale;
    }
    
    // Initial scale calculation
    calculateScale();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateScale);
    
    // Initialize the game
    Game.init(canvas);
    
    // Log ready state
    console.log('Flappy Bird initialized');
});
