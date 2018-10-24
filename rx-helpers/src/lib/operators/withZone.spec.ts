import { TestBed } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { withZone } from './withZone';

@Component({
    template: 'TestDefaultSetupComponent works'
})
class TestNoZoneComponent {
    private readonly subject = new Subject<number>();
    private value = 0;
    public readonly observable = this.subject.asObservable();

    constructor() {

    }

    public triggerIncrementAction() {
        this.subject.next(++this.value);
    }
}

@Component({
    template: 'TestZoneComponent works'
})
class TestZoneComponent {
    private subject = new Subject<number>();
    private value = 0;
    public readonly observable: Observable<number>;

    constructor(zone: NgZone) {
        this.observable = this.subject.asObservable().pipe(withZone(zone));
    }

    public triggerIncrementAction() {
        this.subject.next(++this.value);
    }

    public triggerError(msg: string) {
        this.subject.error(msg);
    }

    public triggerComplete() {
        this.subject.complete();
    }
}

describe('withZone', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestNoZoneComponent, TestZoneComponent]
        });
    });

    it('executes in angular zone with basic setup', () => {
        const component = TestBed.createComponent(TestNoZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        let value: number;
        const sub = component.observable.subscribe((n) => {
            value = n;
            isInAngular = NgZone.isInAngularZone();
        });
        zone.run(() => component.triggerIncrementAction());
        expect(isInAngular).toBe(true);
        expect(value).toBe(1);
        try {

        } finally {
            sub.unsubscribe();
        }
    });

    it('executes outside angular zone with basic setup', () => {
        const component = TestBed.createComponent(TestNoZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        let value: number;
        const sub = component.observable.subscribe((n) => {
            value = n;
            isInAngular = NgZone.isInAngularZone();
        });
        zone.runOutsideAngular(() => component.triggerIncrementAction());
        expect(isInAngular).toBe(false);
        expect(value).toBe(1);
        try {

        } finally {
            sub.unsubscribe();
        }
    });

    it('executes in angular zone with operator and in zone trigger', () => {
        const component = TestBed.createComponent(TestZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        let value: number;
        const sub = component.observable.subscribe((n) => {
            value = n;
            isInAngular = NgZone.isInAngularZone();
        });
        zone.run(() => component.triggerIncrementAction());
        expect(isInAngular).toBe(true);
        expect(value).toBe(1);
        try {

        } finally {
            sub.unsubscribe();
        }
    });

    it('executes in angular zone with operator and outside zone trigger', () => {
        const component = TestBed.createComponent(TestZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        let value: number;
        const sub = component.observable.subscribe((n) => {
            value = n;
            isInAngular = NgZone.isInAngularZone();
        });
        zone.runOutsideAngular(() => component.triggerIncrementAction());
        expect(isInAngular).toBe(true);
        expect(value).toBe(1);
        try {

        } finally {
            sub.unsubscribe();
        }
    });

    it('completes in angular zone with operator and outside zone trigger', () => {
        const component = TestBed.createComponent(TestZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        const sub = component.observable.subscribe(() => {}, () => {}, () => {
            isInAngular = NgZone.isInAngularZone();
        });
        zone.runOutsideAngular(() => component.triggerComplete());
        expect(isInAngular).toBe(true);
        try {

        } finally {
            sub.unsubscribe();
        }
    });

    it('errors in angular zone with operator and outside zone trigger', () => {
        const component = TestBed.createComponent(TestZoneComponent).componentInstance;
        const zone = TestBed.get(NgZone) as NgZone;
        let isInAngular: boolean;
        let msg: string;
        const sub = component.observable.subscribe(() => {}, (e) => {
            msg = e;
            isInAngular = NgZone.isInAngularZone();
        });
        zone.runOutsideAngular(() => component.triggerError('X'));
        expect(isInAngular).toBe(true);
        expect(msg).toBe('X');
        try {

        } finally {
            sub.unsubscribe();
        }
    });
});
