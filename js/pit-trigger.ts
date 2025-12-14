import { Component } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { GameManager } from './game-manager.js';
import { BowlingBall } from './BowlingBall.js';

export class PitTrigger extends Component {
    static TypeName = 'pit-trigger';

    @property.object()
    gameManager = null;

    onTriggerEnter(otherObject) {
        const ballScript = otherObject.getComponent(BowlingBall);

        if (ballScript) {
            if (this.gameManager) {
                const manager = this.gameManager.getComponent(GameManager);
                if (manager) {
                    setTimeout(() => {
                        manager.nextTurn();
                    }, 3000);
                }
            }
        }
    }
}