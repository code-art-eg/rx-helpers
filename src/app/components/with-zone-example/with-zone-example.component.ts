import { Component, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { withZone } from '@code-art-eg/rx-helpers';

@Component({
  selector: 'app-with-zone-example',
  templateUrl: './with-zone-example.component.html',
})
export class WithZoneExampleComponent  {

  public readonly timerSubject = new Subject<number>();
  public readonly timerWithZone: Observable<number>;
  private _value = 1;
  constructor(private readonly zone: NgZone) {
    this.timerWithZone = this.timerSubject.pipe(withZone(this.zone));
    zone.runOutsideAngular(() => {
      // The next operator executes outside angular.
      setInterval(() => this.timerSubject.next(this._value++), 1000);
    });
   }
}
