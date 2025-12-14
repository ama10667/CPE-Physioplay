import { Component, Property } from '@wonderlandengine/api';

/**
 * Start Screen Component for Wonderland Bowling VR
 * Shows a 2D overlay menu before entering VR
 */
export class StartScreen extends Component {
    static TypeName = 'start-screen';

    static Properties = {
        /** Name of the scene or object to activate when starting */
        targetScene: Property.string(''),
        /** Progress percentage for today's session (0-100) */
        progressPercentage: Property.float(65.0),
        /** Total number of sessions completed */
        totalSessions: Property.int(24),
        /** Player's best bowling score */
        bestScore: Property.int(187)
    };

    start() {
        console.log('StartScreen component initialized');
        this.createStartUI();
        this.setupEventListeners();
    }

    createStartUI() {
        // Create overlay div for 2D UI
        const overlay = document.createElement('div');
        overlay.id = 'start-screen-overlay';
        overlay.innerHTML = `
            <style>
                #start-screen-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    font-family: Arial, sans-serif;
                }
                
                .floating-element {
                    position: absolute;
                    animation: float 6s ease-in-out infinite;
                    opacity: 0.3;
                    font-size: 40px;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(10deg); }
                }
                
                .container {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 30px;
                    padding: 60px;
                    max-width: 600px;
                    width: 90%;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                
                .logo {
                    font-size: 48px;
                    font-weight: bold;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }
                
                .subtitle {
                    color: #666;
                    font-size: 18px;
                    margin-bottom: 40px;
                }
                
                .start-button {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    padding: 20px 60px;
                    font-size: 24px;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
                    transition: all 0.3s ease;
                    width: 100%;
                }
                
                .start-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
                }
                
                .progress-section {
                    background: #f8f9ff;
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 30px;
                    border: 2px solid #e0e7ff;
                }
                
                .progress-bar {
                    background: #e0e7ff;
                    height: 25px;
                    border-radius: 15px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    height: 100%;
                    width: ${this.progressPercentage}%;
                    border-radius: 15px;
                    transition: width 0.5s ease;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 10px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .info-cards {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 25px;
                }
                
                .info-card {
                    background: #f8f9ff;
                    padding: 15px;
                    border-radius: 12px;
                    border: 2px solid #e0e7ff;
                }
                
                .info-card-title {
                    color: #764ba2;
                    font-size: 13px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .info-card-value {
                    color: #333;
                    font-size: 24px;
                    font-weight: bold;
                }
            </style>
            
            <div class="floating-element" style="top: 10%; left: 15%;">🎩</div>
            <div class="floating-element" style="top: 70%; left: 10%; animation-delay: 1s;">🫖</div>
            <div class="floating-element" style="top: 20%; right: 10%; animation-delay: 2s;">🃏</div>
            <div class="floating-element" style="bottom: 15%; right: 15%; animation-delay: 1.5s;">🐰</div>
            
            <div class="container">
                <div style="font-size: 60px; margin-bottom: 20px;">🎳</div>
                <h1 class="logo">WONDERLAND BOWLING</h1>
                <p class="subtitle">Physiotherapy Through Play</p>
                
                <div class="progress-section">
                    <div style="color: #555; font-size: 14px; margin-bottom: 10px; font-weight: 600;">TODAY'S PROGRESS</div>
                    <div class="progress-bar">
                        <div class="progress-fill">13/20 min</div>
                    </div>
                </div>
                
                <button class="start-button" id="start-vr-button">START SESSION</button>
                
                <div class="info-cards">
                    <div class="info-card">
                        <div class="info-card-title">Sessions</div>
                        <div class="info-card-value">${this.totalSessions}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-card-title">Best Score</div>
                        <div class="info-card-value">${this.bestScore}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    setupEventListeners() {
        const startButton = document.getElementById('start-vr-button');
        if (startButton) {
            startButton.addEventListener('click', () => this.startVRSession());
        }
    }

    startVRSession() {
        const startButton = document.getElementById('start-vr-button');
        if (startButton) {
            startButton.textContent = 'ENTERING VR...';
            startButton.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        }

        // Hide the overlay with fade effect
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                this.overlay.style.transition = 'opacity 0.5s ease';

                setTimeout(() => {
                    if (this.overlay && this.overlay.parentNode) {
                        this.overlay.remove();
                    }
                    this.startGame();
                }, 500);
            }
        }, 1000);
    }

    startGame() {
        console.log('Starting VR Bowling Game...');

        // Activate target scene if specified
        if (this.targetScene) {
            const scene = this.engine.scene.findByName(this.targetScene);
            if (scene) {
                scene.active = true;
                console.log('Activated scene:', this.targetScene);
            }
        }

        // You can also trigger VR mode here if needed
        // Example: this.engine.xr?.session?.requestSession('immersive-vr');
    }

    onDestroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.remove();
        }
    }
}
