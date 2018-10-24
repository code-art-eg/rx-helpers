import { Component, OnInit, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-without-zone-example',
  templateUrl: './without-zone-example.component.html',
  styleUrls: ['./without-zone-example.component.scss']
})
export class WithoutZoneExampleComponent implements OnInit {

  public readonly timerSubject = new Subject<number>();
  public readonly timer: Observable<number>;
  private _value = 1;
  constructor(private readonly zone: NgZone) {
    this.timer = this.timerSubject.asObservable();
    zone.runOutsideAngular(() => {
      setInterval(() => this.timerSubject.next(this._value++), 1000);
    });
   }

  ngOnInit() {
  }
}
