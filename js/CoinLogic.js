import { Component, Property } from '@wonderlandengine/api';
import { CursorTarget } from '@wonderlandengine/components';

export class CoinLogic extends Component {
    static TypeName = 'coin-logic';

    static Properties = {
        rotationSpeed: Property.float(150),
        rotationAxis: Property.vector3(0, 1, 0),
        clickedColor: Property.color([0, 1, 0, 1]),
        nextCoin: Property.object(),
        isFirstCoin: Property.bool(false),
        triggersDrop: Property.bool(false),
        hideObject1: Property.object(),
        hideObject2: Property.object(),
        clickSound: Property.object(),
        soundVolume: Property.float(1.0),
    };

    init() {
        this.targetBall = null;
        this.isClicked = false;
    }

    start() {
        if (this.isFirstCoin) {
            this.object.active = true;
        } else {
            this.object.active = false;
        }

        this.mesh = this.object.getComponent('mesh');
        if (this.mesh?.material) this.mesh.material = this.mesh.material.clone();

        this.cursorTarget = this.object.getComponent(CursorTarget);
        if (this.cursorTarget) this.cursorTarget.onClick.add(this.onClick.bind(this));

        if (this.clickSound) {
            this.audioSource = this.clickSound.getComponent('audio-source');
        }
    }

    onClick() {
        if (this.isClicked) return;
        this.isClicked = true;

        this.playClickSound();

        if (this.mesh?.material) {
            this.mesh.material.diffuseColor = this.clickedColor;
        }

        if (this.nextCoin) {
            this.nextCoin.active = true;
        }

        if (this.triggersDrop) {
            this.startImmediateDrop();

            if (this.hideObject1) this.hideObject1.active = false;
            if (this.hideObject2) this.hideObject2.active = false;

            if (this.mesh) this.mesh.active = false;
        } else {
            console.log("Coin clicked, staying visible.");
        }
    }

    playClickSound() {
        if (this.audioSource) {
            if (this.soundVolume !== undefined) {
                this.audioSource.volume = this.soundVolume;
            }
            this.audioSource.play();
        }
    }

    startImmediateDrop() {
        const results = this.engine.scene.findByName("s1BowlingBall");
        if (results.length > 0) {
            this.targetBall = results[0];
            const physx = this.targetBall.getComponent('physx');

            if (physx) {
                if (physx.setLinearVelocity) physx.setLinearVelocity([0, 0, 0]);
                if (physx.setAngularVelocity) physx.setAngularVelocity([0, 0, 0]);

                physx.active = true;
                physx.kinematic = false;
                physx.static = false;
                physx.gravity = true;

                if (physx.addImpulse) physx.addImpulse([0, -1.0, 0.5]);
            }

            const gameManager = this.engine.scene.findByName("GameLogic")[0]?.getComponent('game-manager');
            if (gameManager && gameManager.nextTurn) {
                gameManager.nextTurn();
            }
        }
    }

    update(dt) {
        this.object.rotateAxisAngleDegObject(this.rotationAxis, this.rotationSpeed * dt);
    }
}