import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Operator, Subscribable, Subscriber, TeardownLogic } from 'rxjs';

class ZoneSubscriber<T> extends Subscriber<T> {
  constructor(private readonly _zone: NgZone, destination: Subscriber<T>) {
    super(destination);
  }

  protected _next(value: T) {
    this._zone.run(() => {
      if (typeof this.destination.next === 'function') {
        this.destination.next(value);
      }
    });
  }

  protected _error(error: any) {
    this._zone.run(() => {
      if (typeof this.destination.error === 'function') {
        this.destination.error(error);
      }
    });
  }

  protected _complete() {
    this._zone.run(() => {
      if (typeof this.destination.complete === 'function') {
        this.destination.complete();
      }
    });
  }
}

class ZoneOperator<T> implements Operator<T, T> {
  constructor(private readonly _zone: NgZone) {

  }

  public call(subscriber: Subscriber<T>, source: Subscribable<T>): TeardownLogic {
    return source.subscribe(new ZoneSubscriber<T>(this._zone, subscriber));
  }
}

export function withZone<T>(zone: NgZone): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => source.lift(new ZoneOperator(zone));
}
