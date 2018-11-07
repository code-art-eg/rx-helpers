import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Operator, Subscribable, Subscriber, TeardownLogic } from 'rxjs';

class OutsideZoneSubscriber<T> extends Subscriber<T> {
    constructor(private readonly _zone: NgZone, destination: Subscriber<T>) {
        super(destination);
    }

    protected _next(value: T) {
        this._zone.runOutsideAngular(() => {
            if (typeof this.destination.next === 'function') {
                this.destination.next(value);
            }
        });
    }

    protected _error(error: any) {
        this._zone.runOutsideAngular(() => {
            if (typeof this.destination.error === 'function') {
                this.destination.error(error);
            }
        });
    }

    protected _complete() {
        this._zone.runOutsideAngular(() => {
            if (typeof this.destination.complete === 'function') {
                this.destination.complete();
            }
        });
    }
}

class OutsideZoneOperator<T> implements Operator<T, T> {
    constructor(private readonly _zone: NgZone) {

    }

    public call(subscriber: Subscriber<T>, source: Subscribable<T>): TeardownLogic {
        return source.subscribe(new OutsideZoneSubscriber<T>(this._zone, subscriber));
    }
}

export function outsideZone<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => source.lift(new OutsideZoneOperator(zone));
}
