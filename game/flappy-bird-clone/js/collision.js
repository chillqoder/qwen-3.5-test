/**
 * Collision Detection Module
 * Handles all collision checks
 */

const Collision = {
    /**
     * Check collision between two rectangles (AABB)
     * @param {Object} a - First rectangle {x, y, width, height}
     * @param {Object} b - Second rectangle {x, y, width, height}
     * @returns {boolean} True if colliding
     */
    checkRectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    },
    
    /**
     * Check if player hit any pipe
     * @param {Object} playerBounds - Player bounding box
     * @param {Array} pipeBounds - Array of pipe bounding boxes
     * @returns {boolean} True if collision detected
     */
    checkPipeCollision(playerBounds, pipeBounds) {
        for (const pipe of pipeBounds) {
            if (this.checkRectCollision(playerBounds, pipe)) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Check if player hit the ground
     * @param {Object} playerBounds - Player bounding box
     * @returns {boolean} True if on ground
     */
    checkGroundCollision(playerBounds) {
        const groundY = CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT;
        return playerBounds.y + playerBounds.height >= groundY;
    },
    
    /**
     * Check if player hit the ceiling
     * @param {Object} playerBounds - Player bounding box
     * @returns {boolean} True if hit ceiling
     */
    checkCeilingCollision(playerBounds) {
        return playerBounds.y <= 0;
    },
    
    /**
     * Full collision check for game over condition
     * @param {Object} playerBounds - Player bounding box
     * @param {Array} pipeBounds - Array of pipe bounding boxes
     * @returns {boolean} True if any collision detected
     */
    checkGameOver(playerBounds, pipeBounds) {
        // Check pipe collision
        if (this.checkPipeCollision(playerBounds, pipeBounds)) {
            return true;
        }
        
        // Check ground collision
        if (this.checkGroundCollision(playerBounds)) {
            return true;
        }
        
        return false;
    }
};
