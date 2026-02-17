/**
 * UI Module
 * Handles all UI rendering with Russian text
 */

const UI = {
    // Current score display
    score: 0,
    
    // Best score (persisted)
    bestScore: 0,
    
    /**
     * Initialize UI
     */
    init() {
        // Load best score from localStorage
        const saved = localStorage.getItem('flappyBestScore');
        this.bestScore = saved ? parseInt(saved, 10) : 0;
        this.score = 0;
    },
    
    /**
     * Reset score for new game
     */
    reset() {
        this.score = 0;
    },
    
    /**
     * Add to score
     * @param {number} points - Points to add
     */
    addScore(points) {
        this.score += points;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('flappyBestScore', this.bestScore.toString());
        }
    },
    
    /**
     * Render all UI elements
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} gameState - Current game state
     */
    render(ctx, gameState) {
        // Draw score during gameplay
        if (gameState === CONFIG.STATE.PLAYING || gameState === CONFIG.STATE.GAME_OVER) {
            this.drawScore(ctx);
        }
        
        // Draw state-specific UI
        switch (gameState) {
            case CONFIG.STATE.START:
                this.drawStartScreen(ctx);
                break;
            case CONFIG.STATE.GAME_OVER:
                this.drawGameOverScreen(ctx);
                break;
        }
    },
    
    /**
     * Draw current score at top center
     * @param {CanvasRenderingContext2D} ctx
     */
    drawScore(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Text shadow
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.fillText(this.score.toString(), CONFIG.WIDTH / 2 + 2, 22);
        
        // Main text
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText(this.score.toString(), CONFIG.WIDTH / 2, 20);
        
        ctx.restore();
    },
    
    /**
     * Draw start screen
     * @param {CanvasRenderingContext2D} ctx
     */
    drawStartScreen(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        
        // Title
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = 'bold 42px Arial, sans-serif';
        ctx.fillText('Flappy Bird', CONFIG.WIDTH / 2 + 2, 182);
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText('Flappy Bird', CONFIG.WIDTH / 2, 180);
        
        // Start message
        ctx.font = '24px Arial, sans-serif';
        ctx.fillText('Нажмите чтобы начать', CONFIG.WIDTH / 2 + 2, 342);
        ctx.fillText('Нажмите чтобы начать', CONFIG.WIDTH / 2, 340);
        
        // Instructions
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText('Пробел, клик или касание', CONFIG.WIDTH / 2 + 1, 382);
        ctx.fillText('Пробел, клик или касание', CONFIG.WIDTH / 2, 380);
        
        ctx.restore();
    },
    
    /**
     * Draw game over screen
     * @param {CanvasRenderingContext2D} ctx
     */
    drawGameOverScreen(ctx) {
        ctx.save();
        ctx.textAlign = 'center';
        
        // Panel background
        const panelX = CONFIG.WIDTH / 2 - 120;
        const panelY = 200;
        const panelWidth = 240;
        const panelHeight = 200;
        
        ctx.fillStyle = '#ded895';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = '#553c1f';
        ctx.lineWidth = 4;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Game Over text
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = 'bold 36px Arial, sans-serif';
        ctx.fillText('Игра окончена', CONFIG.WIDTH / 2 + 2, 142);
        ctx.fillStyle = '#ff6600';
        ctx.fillText('Игра окончена', CONFIG.WIDTH / 2, 140);
        
        // Score label
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = '20px Arial, sans-serif';
        ctx.fillText('Счёт:', CONFIG.WIDTH / 2 + 1, 232);
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText('Счёт:', CONFIG.WIDTH / 2, 230);
        
        // Current score
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.fillText(this.score.toString(), CONFIG.WIDTH / 2 + 2, 262);
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText(this.score.toString(), CONFIG.WIDTH / 2, 260);
        
        // Best score label
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = '18px Arial, sans-serif';
        ctx.fillText('Рекорд:', CONFIG.WIDTH / 2 + 1, 312);
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText('Рекорд:', CONFIG.WIDTH / 2, 310);
        
        // Best score value
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px Arial, sans-serif';
        ctx.fillText(this.bestScore.toString(), CONFIG.WIDTH / 2 + 2, 338);
        ctx.fillText(this.bestScore.toString(), CONFIG.WIDTH / 2, 336);
        
        // Restart message
        ctx.fillStyle = CONFIG.COLORS.TEXT_SHADOW;
        ctx.font = '20px Arial, sans-serif';
        ctx.fillText('Нажмите для рестарта', CONFIG.WIDTH / 2 + 2, 442);
        ctx.fillStyle = CONFIG.COLORS.TEXT;
        ctx.fillText('Нажмите для рестарта', CONFIG.WIDTH / 2, 440);
        
        ctx.restore();
    },
    
    /**
     * Render ground scrolling effect
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} offset - Scroll offset
     */
    renderGround(ctx, offset) {
        const groundY = CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT;
        
        // Ground top (grass)
        ctx.fillStyle = CONFIG.COLORS.GROUND_TOP;
        ctx.fillRect(0, groundY, CONFIG.WIDTH, 15);
        
        // Ground body
        ctx.fillStyle = CONFIG.COLORS.GROUND;
        ctx.fillRect(0, groundY + 15, CONFIG.WIDTH, CONFIG.GROUND_HEIGHT - 15);
        
        // Scrolling pattern on ground
        ctx.strokeStyle = '#c9b86e';
        ctx.lineWidth = 2;
        const patternSpacing = 30;
        
        for (let x = -offset % patternSpacing; x < CONFIG.WIDTH; x += patternSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, groundY + 15);
            ctx.lineTo(x - 15, CONFIG.HEIGHT);
            ctx.stroke();
        }
        
        // Top border
        ctx.strokeStyle = '#558c22';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(CONFIG.WIDTH, groundY);
        ctx.stroke();
    }
};
