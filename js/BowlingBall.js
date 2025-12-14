import { Component } from '@wonderlandengine/api';

export class BowlingBall extends Component {
    static TypeName = 'bowling-ball';

    resetBall() {

        this.object.setPositionLocal([0, 1, 10]);
        this.object.resetRotation();

        const physx = this.object.getComponent('physx');
        if (physx) {
            physx.active = true;
            physx.kinematic = true;
            physx.static = false;
            physx.gravity = false;
        }

        this.object.active = true;
    }
}