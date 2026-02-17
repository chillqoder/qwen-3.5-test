/**
 * Input Handler Module
 * Centralized input system for mouse, touch, and keyboard
 */

const Input = {
    // Callback function to trigger on input
    onInput: null,
    
    // Prevent input spam
    canInput: true,
    
    // Cooldown between inputs (ms)
    inputCooldown: 100,
    
    // Last input time
    lastInputTime: 0,
    
    /**
     * Initialize all input listeners
     * @param {Function} callback - Function to call on valid input
     */
    init(callback) {
        this.onInput = callback;
        
        // Mouse click
        document.addEventListener('mousedown', (e) => this.handleInput(e));
        
        // Touch input
        document.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            this.handleInput(e);
        }, { passive: false });
        
        // Keyboard (Spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent page scrolling
                this.handleInput(e);
            }
        });
    },
    
    /**
     * Handle input event
     * @param {Event} e - Input event
     */
    handleInput(e) {
        const now = Date.now();
        
        // Check cooldown to prevent spam
        if (!this.canInput || (now - this.lastInputTime) < this.inputCooldown) {
            return;
        }
        
        this.lastInputTime = now;
        
        // Call the callback if set
        if (this.onInput) {
            this.onInput();
        }
    },
    
    /**
     * Enable or disable input processing
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.canInput = enabled;
    },
    
    /**
     * Reset input cooldown
     */
    resetCooldown() {
        this.lastInputTime = 0;
    }
};
