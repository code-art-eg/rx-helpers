import { Component, OnDestroy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { timer, Subject } from 'rxjs';
import { takeUntilDestroyed } from './takeUntilDestroyed';

@Component({
    template: 'TestUntilDestroyedComponent',
})
class TestUntilDestroyedComponent implements OnDestroy {
    public destroyedCalled = false;

    constructor() {

    }

    ngOnDestroy(): void {
        this.destroyedCalled = true;
    }
}

@Component({
    template: 'TestUntilComponent',
})
class TestUntilComponent {

    constructor() {

    }
}

describe('takeUntilDestroyed', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestUntilDestroyedComponent, TestUntilComponent]
        });
    });

    it('executes stops emitting calls original onDestroy', () => {
        const fixture = TestBed.createComponent(TestUntilDestroyedComponent);
        const component = fixture.componentInstance;
        let completed = false;
        const sub = timer(100).pipe(takeUntilDestroyed(component)).subscribe(() => {}, () => {}, () => {
            completed = true;
        });
        try {
            fixture.destroy();
            expect(completed).toBe(true);
            expect(component.destroyedCalled).toBe(true);
        } finally {
            sub.unsubscribe();
        }
    });

    it('executes continues emitting when not destroyed', () => {
        const fixture = TestBed.createComponent(TestUntilDestroyedComponent);
        const component = fixture.componentInstance;
        let completed = false;
        const subject = new Subject<number>();
        let val = 0;
        const sub = subject.pipe(takeUntilDestroyed(component)).subscribe((v) => {
            val = v;
        }, () => {}, () => {
            completed = true;
        });
        try {
            subject.next(1);
            expect(completed).toBe(false);
            expect(component.destroyedCalled).toBe(false);
            expect(val).toBe(1);
        } finally {
            sub.unsubscribe();
        }
    });

    it('fails when component does not implement OnDestroy', () => {
        const fixture = TestBed.createComponent(TestUntilComponent);
        const component = fixture.componentInstance;
        const subject = new Subject<number>();
        expect(() => subject.pipe(takeUntilDestroyed(component as OnDestroy))).toThrow();
    });
});
