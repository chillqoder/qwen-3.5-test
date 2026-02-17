/**
 * Pipes Module
 * Handles pipe generation, movement, and cleanup
 */

const Pipes = {
    // Array of pipe objects
    pipes: [],
    
    // Time until next pipe spawn
    spawnTimer: 0,
    
    /**
     * Reset pipes for new game
     */
    init() {
        this.pipes = [];
        this.spawnTimer = 0;
    },
    
    /**
     * Update pipes (spawn, move, cleanup)
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Spawn new pipes
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnPipe();
            this.spawnTimer = CONFIG.PIPE_SPAWN_INTERVAL;
        }
        
        // Move pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= CONFIG.PIPE_SPEED * deltaTime;
            
            // Remove off-screen pipes
            if (pipe.x + CONFIG.PIPE_WIDTH < 0) {
                this.pipes.splice(i, 1);
            }
        }
    },
    
    /**
     * Spawn a new pipe pair
     */
    spawnPipe() {
        // Calculate random gap position
        const minPipeY = CONFIG.PIPE_MIN_HEIGHT;
        const maxPipeY = CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT - CONFIG.PIPE_GAP - CONFIG.PIPE_MIN_HEIGHT;
        const gapY = Math.random() * (maxPipeY - minPipeY) + minPipeY;
        
        this.pipes.push({
            x: CONFIG.WIDTH,
            gapY: gapY,
            scored: false // Track if player has passed this pipe
        });
    },
    
    /**
     * Get all pipe bounding boxes for collision
     * @returns {Array} Array of bounding box objects
     */
    getBounds() {
        const bounds = [];
        
        for (const pipe of this.pipes) {
            // Top pipe
            bounds.push({
                x: pipe.x,
                y: 0,
                width: CONFIG.PIPE_WIDTH,
                height: pipe.gapY
            });
            
            // Bottom pipe
            bounds.push({
                x: pipe.x,
                y: pipe.gapY + CONFIG.PIPE_GAP,
                width: CONFIG.PIPE_WIDTH,
                height: CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT - pipe.gapY - CONFIG.PIPE_GAP
            });
        }
        
        return bounds;
    },
    
    /**
     * Check if player passed a pipe and return score increment
     * @param {number} playerX - Player's x position
     * @returns {number} Score increment (0 or 1)
     */
    checkScore(playerX) {
        let scoreIncrement = 0;
        
        for (const pipe of this.pipes) {
            if (!pipe.scored && pipe.x + CONFIG.PIPE_WIDTH < playerX) {
                pipe.scored = true;
                scoreIncrement = 1;
            }
        }
        
        return scoreIncrement;
    },
    
    /**
     * Render all pipes
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        for (const pipe of this.pipes) {
            const x = pipe.x;
            const gapTop = pipe.gapY;
            const gapBottom = pipe.gapY + CONFIG.PIPE_GAP;
            const groundY = CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT;
            
            // Top pipe
            ctx.fillStyle = CONFIG.COLORS.PIPE;
            ctx.fillRect(x, 0, CONFIG.PIPE_WIDTH, gapTop);
            
            // Top pipe outline
            ctx.strokeStyle = CONFIG.COLORS.PIPE_OUTLINE;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, 0, CONFIG.PIPE_WIDTH, gapTop);
            
            // Top pipe cap
            ctx.fillStyle = CONFIG.COLORS.PIPE;
            ctx.fillRect(x - 3, gapTop - 25, CONFIG.PIPE_WIDTH + 6, 25);
            ctx.strokeRect(x - 3, gapTop - 25, CONFIG.PIPE_WIDTH + 6, 25);
            
            // Bottom pipe
            const bottomPipeHeight = groundY - gapBottom;
            ctx.fillStyle = CONFIG.COLORS.PIPE;
            ctx.fillRect(x, gapBottom, CONFIG.PIPE_WIDTH, bottomPipeHeight);
            
            // Bottom pipe outline
            ctx.strokeStyle = CONFIG.COLORS.PIPE_OUTLINE;
            ctx.strokeRect(x, gapBottom, CONFIG.PIPE_WIDTH, bottomPipeHeight);
            
            // Bottom pipe cap
            ctx.fillStyle = CONFIG.COLORS.PIPE;
            ctx.fillRect(x - 3, gapBottom, CONFIG.PIPE_WIDTH + 6, 25);
            ctx.strokeRect(x - 3, gapBottom, CONFIG.PIPE_WIDTH + 6, 25);
        }
    }
};
