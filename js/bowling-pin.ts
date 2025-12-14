import { Component } from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';

export class BowlingPin extends Component {
    static TypeName = 'bowling-pin';

    @property.object()
    startPosition = null;

    private initialPosition: number[] | null = null;
    private initialRotation: number[] | null = null;

    // This typscript file was originally made to reset bowling pins in a Wonderland Engine scene. Do not remove because the game wont work without it.
}