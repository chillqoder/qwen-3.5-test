/**
 * Game Module
 * Main game loop and state management
 */

const Game = {
    // Canvas and context
    canvas: null,
    ctx: null,
    
    // Game state
    state: CONFIG.STATE.START,
    
    // Timing
    lastTime: 0,
    groundOffset: 0,
    
    /**
     * Initialize game
     * @param {HTMLCanvasElement} canvas - Game canvas
     */
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONFIG.WIDTH;
        this.canvas.height = CONFIG.HEIGHT;
        
        // Initialize systems
        UI.init();
        Player.init();
        Pipes.init();
        
        // Setup input handler
        Input.init(() => this.handleInput());
        
        // Start game loop
        requestAnimationFrame((time) => this.loop(time));
    },
    
    /**
     * Handle player input
     */
    handleInput() {
        switch (this.state) {
            case CONFIG.STATE.START:
                this.startGame();
                break;
            case CONFIG.STATE.PLAYING:
                Player.flap();
                this.playSound('flap');
                break;
            case CONFIG.STATE.GAME_OVER:
                this.resetGame();
                break;
        }
    },
    
    /**
     * Start the game
     */
    startGame() {
        this.state = CONFIG.STATE.PLAYING;
        Player.init();
        Pipes.init();
        UI.reset();
        Input.resetCooldown();
    },
    
    /**
     * Reset game after game over
     */
    resetGame() {
        this.state = CONFIG.STATE.START;
        Player.init();
        Pipes.init();
        UI.reset();
        this.groundOffset = 0;
        Input.resetCooldown();
    },
    
    /**
     * Trigger game over
     */
    gameOver() {
        this.state = CONFIG.STATE.GAME_OVER;
        this.playSound('hit');
    },
    
    /**
     * Main game loop
     * @param {number} currentTime - Current time in milliseconds
     */
    loop(currentTime) {
        // Calculate delta time in seconds
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.loop(time));
    },
    
    /**
     * Update game logic
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Update ground scroll
        this.groundOffset += CONFIG.PIPE_SPEED * deltaTime;
        if (this.groundOffset > 30) {
            this.groundOffset = 0;
        }
        
        if (this.state === CONFIG.STATE.PLAYING) {
            // Update player
            Player.update(deltaTime);
            
            // Update pipes
            Pipes.update(deltaTime);
            
            // Check for score
            const scoreIncrement = Pipes.checkScore(Player.x);
            if (scoreIncrement > 0) {
                UI.addScore(scoreIncrement);
                this.playSound('score');
            }
            
            // Check collisions
            const playerBounds = Player.getBounds();
            const pipeBounds = Pipes.getBounds();
            
            if (Collision.checkGameOver(playerBounds, pipeBounds)) {
                this.gameOver();
            }
        } else if (this.state === CONFIG.STATE.START) {
            // Bobbing animation for bird on start screen
            const bobOffset = Math.sin(Date.now() / 300) * 5;
            Player.y = CONFIG.HEIGHT / 2 - Player.height / 2 + bobOffset;
            Player.rotation = 0;
        }
    },
    
    /**
     * Render game
     */
    render() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = CONFIG.COLORS.SKY;
        ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        
        // Draw background clouds (simple decoration)
        this.drawClouds(ctx);
        
        // Draw pipes
        Pipes.render(ctx);
        
        // Draw ground
        UI.renderGround(ctx, this.groundOffset);
        
        // Draw player
        Player.render(ctx);
        
        // Draw UI
        UI.render(ctx, this.state);
    },
    
    /**
     * Draw decorative clouds
     * @param {CanvasRenderingContext2D} ctx
     */
    drawClouds(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        // Simple cloud shapes
        const cloudPositions = [
            { x: 50, y: 80, size: 30 },
            { x: 200, y: 120, size: 40 },
            { x: 280, y: 60, size: 25 }
        ];
        
        for (const cloud of cloudPositions) {
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 0.8, cloud.y - cloud.size * 0.2, cloud.size * 0.7, 0, Math.PI * 2);
            ctx.arc(cloud.x + cloud.size * 1.4, cloud.y, cloud.size * 0.9, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    },
    
    /**
     * Play sound effect
     * @param {string} sound - Sound name ('flap', 'score', 'hit')
     */
    playSound(sound) {
        try {
            const audio = document.getElementById(`sound-${sound}`);
            if (audio) {
                audio.currentTime = 0;
                audio.volume = 0.3;
                audio.play().catch(() => {
                    // Ignore autoplay errors (audio not loaded or blocked)
                });
            }
        } catch (e) {
            // Silently fail if audio is not available
        }
    }
};
