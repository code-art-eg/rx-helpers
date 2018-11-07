import { OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const originalOnDestroySymbol = Symbol();
const destroySubjectSymbol = Symbol();

interface ComponentWithTakeUntilDestroy extends OnDestroy {
    [destroySubjectSymbol]: Subject<number>;
    [originalOnDestroySymbol]: () => void;
}

function ensureOnDestroyAttached(component: ComponentWithTakeUntilDestroy) {
    if (!component[destroySubjectSymbol]) {
        if (typeof component.ngOnDestroy !== 'function') {
            const constructor = (component as Object).constructor;
            throw new Error(`The component/directive/pipe of type ${
                constructor.name
            } does not implement method ${
                'ngOnDestroy'
            } for interface ${
                'OnDestroy'
            } and therefore cannot be used with takeUntilDestroyed operator.`);
        }
        component[originalOnDestroySymbol] = component.ngOnDestroy;
        component[destroySubjectSymbol] = new Subject<number>();
        component.ngOnDestroy = function () {
            component[destroySubjectSymbol].next(0);
            component[destroySubjectSymbol].complete();
            if (typeof component[originalOnDestroySymbol] === 'function') {
                component[originalOnDestroySymbol].apply(component, arguments);
            }
        };
    }
}

export function takeUntilDestroyed<T>(component: OnDestroy): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) => {
        const c = component as ComponentWithTakeUntilDestroy;
        ensureOnDestroyAttached(c);
        return source.pipe(takeUntil(c[destroySubjectSymbol]));
    };
}
