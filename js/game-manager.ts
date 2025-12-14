import { Component, TextComponent } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';
import { BowlingPin } from './bowling-pin.js';
import { BowlingBall } from './BowlingBall.js';

export class GameManager extends Component {
    static TypeName = 'game-manager';

    @property.object()
    screenTextObject: any = null;

    @property.object()
    coin1: any = null;

    @property.object()
    coin2: any = null;

    @property.object()
    coin3: any = null;

    private _throwCount = 1;
    private _isWaiting = false;
    private _timer = 0;
    private _isRightSide = true;

    start() {
        this.resetAllCoins();
        this.updateScreen("RIGHT SIDE\nTHROW 1");
    }

    update(dt: number) {
        if (this._isWaiting) {
            this._timer -= dt;
            const sideText = this._isRightSide ? "RIGHT" : "LEFT";
            this.updateScreen(`${sideText} DONE\nRESET IN: ${Math.ceil(this._timer)}`);

            if (this._timer <= 0) {
                this._isWaiting = false;
                this.executeFlipAndReset();
            }
        }
    }

    nextTurn() {
        if (this._isWaiting) return;
        this._isWaiting = true;
        this._timer = 10.0;
    }

    executeFlipAndReset() {
        this._isRightSide = !this._isRightSide;

        const sideText = this._isRightSide ? "RIGHT SIDE" : "LEFT SIDE";

        if (this._throwCount === 1) {
            this._throwCount = 2;
            this.resetAllBalls();
            this.updateScreen(`${sideText}\nTHROW 2`);
        } else {
            this._throwCount = 1;
            this.resetAllBalls();
            this.resetAllPins();
            this.resetAllCoins();
            this.updateScreen(`${sideText}\nTHROW 1`);
        }
    }

    resetAllBalls() {

        const ballNames = ["s1BowlingBall", "s2BowlingBall", "s3BowlingBall", "s4BowlingBall"];
        for (let name of ballNames) {
            const balls = this.engine.scene.findByName(name);
            for (let ballObj of balls) {

                if (this._isRightSide) {
                    ballObj.setPositionLocal([0, 1, 10]);
                    ballObj.resetRotation();
                } else {
                    ballObj.setPositionLocal([0, 1, -10]);
                    ballObj.rotateAxisAngleDegObject([0, 1, 0], 180);
                }

                const physx = ballObj.getComponent('physx') as any;
                if (physx) {
                    physx.active = true;
                    physx.kinematic = true;
                    physx.static = false;
                    physx.gravity = false;

                    if (typeof physx.getLinearVelocity === 'function') {
                        const velocity = physx.getLinearVelocity();
                        if (velocity && typeof velocity.set === 'function') {
                            velocity.set([0, 0, 0]);
                        }
                    }

                    setTimeout(() => {
                        if (physx) {
                            physx.kinematic = false;
                            physx.gravity = true;
                        }
                    }, 100);
                }

                ballObj.active = true;

                const ballComp = ballObj.getComponent(BowlingBall);
                if (ballComp && (ballComp as any).resetBall) {
                    (ballComp as any).resetBall(this._isRightSide);
                }
            }
        }
    }

    resetAllPins() {

        const pins = this.engine.scene.getComponents(BowlingPin);

        if (pins.length === 0) {
            for (let i = 1; i <= 10; i++) {
                const pinName1 = `BowlingPin${i}`;
                const pinName2 = `Pin${i}`;
                const pinName3 = `Object_${70 + i}`;

                let pinResults = this.engine.scene.findByName(pinName1);
                if (pinResults.length === 0) pinResults = this.engine.scene.findByName(pinName2);
                if (pinResults.length === 0) pinResults = this.engine.scene.findByName(pinName3);

                for (let pinObj of pinResults) {
                    pinObj.active = true;

                    const pinComp = pinObj.getComponent(BowlingPin);
                    if (pinComp && (pinComp as any).resetPin) {
                        (pinComp as any).resetPin();
                    } else {
                        pinObj.resetTransform();
                        pinObj.setPositionLocal([0, 1, 0]);

                        const physx = pinObj.getComponent('physx') as any;
                        if (physx) {
                            physx.active = true;
                            physx.kinematic = true;
                            physx.static = false;
                            physx.gravity = false;

                            setTimeout(() => {
                                if (physx) {
                                    physx.kinematic = false;
                                    physx.gravity = true;
                                }
                            }, 100);
                        }
                    }
                }
            }
        } else {
            for (let pin of pins) {
                if ((pin as any).resetPin) {
                    (pin as any).resetPin();
                }
            }
        }
    }

    resetAllCoins() {
        if (this.coin1) {
            this.coin1.active = true;
            const coin1Comp = this.coin1.getComponent('coin-logic') as any;
            if (coin1Comp) {
                coin1Comp.isClicked = false;
                coin1Comp.object.active = true;

                const mesh = this.coin1.getComponent('mesh') as any;
                if (mesh?.material) {
                    if (typeof mesh.material.color === 'object') {
                        mesh.material.color.set([1, 1, 1, 1]);
                    }
                }
            }
        }

        if (this.coin2) {
            this.coin2.active = false; 
            const coin2Comp = this.coin2.getComponent('coin-logic') as any;
            if (coin2Comp) {
                coin2Comp.isClicked = false;

                const mesh = this.coin2.getComponent('mesh') as any;
                if (mesh?.material) {
                    if (typeof mesh.material.color === 'object') {
                        mesh.material.color.set([1, 1, 1, 1]);
                    }
                }
            }
        }

        if (this.coin3) {
            this.coin3.active = false;
            const coin3Comp = this.coin3.getComponent('coin-logic') as any;
            if (coin3Comp) {
                coin3Comp.isClicked = false;
                coin3Comp.object.active = false;

                const mesh = this.coin3.getComponent('mesh') as any;
                if (mesh?.material) {
                    if (typeof mesh.material.color === 'object') {
                        mesh.material.color.set([1, 1, 1, 1]);
                    }
                }
            }
        }

        const coinNames = ['Coin', 'coin', 'Coin1', 'Coin2', 'Coin3'];
        for (const coinName of coinNames) {
            const coinResults = this.engine.scene.findByName(coinName);
            for (let coinObj of coinResults) {
                coinObj.active = true;

                const coinComp = coinObj.getComponent('coin-logic') as any;
                if (coinComp) {
                    coinComp.isClicked = false;

                    const mesh = coinObj.getComponent('mesh') as any;
                    if (mesh?.material) {
                        if (typeof mesh.material.color === 'object') {
                            mesh.material.color.set([1, 1, 1, 1]);
                        }
                    }
                }
            }
        }
    }

    updateScreen(text: string) {
        if (this.screenTextObject) {
            const textComp = this.screenTextObject.getComponent(TextComponent);
            if (textComp) textComp.text = text;
        }
    }
}