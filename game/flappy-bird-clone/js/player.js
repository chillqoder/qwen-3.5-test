/**
 * Player (Bird) Module
 * Handles bird physics and movement
 */

const Player = {
    // Position
    x: 0,
    y: 0,
    
    // Velocity
    velocityY: 0,
    
    // Rotation for visual effect
    rotation: 0,
    
    // Dimensions
    width: CONFIG.BIRD_WIDTH,
    height: CONFIG.BIRD_HEIGHT,
    
    /**
     * Initialize player at starting position
     */
    init() {
        this.x = CONFIG.BIRD_X;
        this.y = CONFIG.HEIGHT / 2 - this.height / 2;
        this.velocityY = 0;
        this.rotation = 0;
    },
    
    /**
     * Update player physics
     * @param {number} deltaTime - Time since last frame in seconds
     */
    update(deltaTime) {
        // Apply gravity
        this.velocityY += CONFIG.GRAVITY * deltaTime;
        
        // Clamp velocity to terminal velocity
        if (this.velocityY > CONFIG.MAX_FALL_VELOCITY) {
            this.velocityY = CONFIG.MAX_FALL_VELOCITY;
        }
        
        // Update position
        this.y += this.velocityY * deltaTime;
        
        // Calculate rotation based on velocity
        // Tilt up when going up, tilt down when falling
        const targetRotation = this.velocityY / CONFIG.MAX_FALL_VELOCITY * 0.5;
        this.rotation = targetRotation;
        
        // Clamp position to ground and ceiling
        const groundY = CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT - this.height;
        if (this.y > groundY) {
            this.y = groundY;
            this.velocityY = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocityY = 0;
        }
    },
    
    /**
     * Apply flap impulse
     */
    flap() {
        this.velocityY = CONFIG.FLAP_VELOCITY;
    },
    
    /**
     * Get bounding box for collision detection
     * @returns {Object} Bounding box with x, y, width, height
     */
    getBounds() {
        // Slightly smaller hitbox for more forgiving gameplay
        const padding = 4;
        return {
            x: this.x + padding,
            y: this.y + padding,
            width: this.width - padding * 2,
            height: this.height - padding * 2
        };
    },
    
    /**
     * Render the bird
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        ctx.save();
        
        // Translate to bird center for rotation
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-centerX, -centerY);
        
        // Draw bird body (ellipse)
        ctx.fillStyle = CONFIG.COLORS.BIRD;
        ctx.beginPath();
        ctx.ellipse(
            centerX,
            centerY,
            this.width / 2,
            this.height / 2,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();
        
        // Draw outline
        ctx.strokeStyle = CONFIG.COLORS.BIRD_OUTLINE;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw eye
        const eyeX = centerX + this.width / 4;
        const eyeY = centerY - this.height / 6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(eyeX + 2, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw beak
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(centerX + this.width / 2 - 4, centerY + 2);
        ctx.lineTo(centerX + this.width / 2 + 8, centerY + 4);
        ctx.lineTo(centerX + this.width / 2 - 4, centerY + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw wing
        ctx.fillStyle = '#e5be2a';
        ctx.beginPath();
        ctx.ellipse(
            centerX - 4,
            centerY + 4,
            8,
            5,
            -0.2,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }
};
