# @code-art/rx-helpers

## About the library

A library with [Rxjs](https://rxjs-dev.firebaseapp.com/) operators that can be used in your [Angular 6](https://angular.io) projects.

## Consuming the library

### 1. Installing the library

To install the library in your Angular application you need to run the following commands:

```bash
$ npm install @code-art/rx-helper --save
```
or

```bash
$ yarn add @code-art/rx-helper
```

### 2. Using withZone operator

The withZone operator will cause the observable next, error and complete callbacks to be executed withing an Angular `NgZone`. This is useful when having asynchronous events that are triggered outside Angular such as a server event when websockets, etc.

```typescript
import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withZone } from '@code-art/rx-helpers';

@Component({
  selector: 'app-with-zone-example',
  templateUrl: './with-zone-example.component.html',
})
export class WithZoneExampleComponent  {

  timerSubject = new Subject<number>();
  timerWithZone: Observable<number>;
  private _value = 1;
  constructor(private readonly zone: NgZone) {
    this.timerWithZone = this.timerSubject.pipe(withZone(this.zone));
    zone.runOutsideAngular(() => {
      // The next operator executes outside angular.
      setInterval(() => this.timerSubject.next(this._value++), 1000);
    });
   }
}

```

### 3. Using takeUntilDestroyed operator

The `takeUntilDestroyed` operator will cause the observable to emit values until a component, pipe or directive are destroyed (ngOnDestroy called). 

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@code-art/rx-helpers';

@Component({
  selector: 'app-take-until-destroyed-example',
  templateUrl: './take-until-destroyed-example.component.html',
})
export class TakeUntilDestroyedExampleComponent implements OnDestroy {
  timer = timer(1000, 1000).pipe(takeUntilDestroyed(this));

  constructor() {
    this.timer.subscribe(() => {}, () => {}, () => {
      console.log('completed');
    });
  }

  ngOnDestroy(): void {
    console.log('destroyed');
  }
}
```

## License

MIT © Sherif Elmetainy \(Code Art\)
