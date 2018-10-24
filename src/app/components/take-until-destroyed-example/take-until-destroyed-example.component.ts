import { Component, OnInit, OnDestroy } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@code-art/rx-helpers';

@Component({
  selector: 'app-take-until-destroyed-example',
  templateUrl: './take-until-destroyed-example.component.html',
  styleUrls: ['./take-until-destroyed-example.component.scss']
})
export class TakeUntilDestroyedExampleComponent implements OnInit, OnDestroy {
  public timer = timer(1000, 1000).pipe(takeUntilDestroyed(this));

  constructor() {
    this.timer.subscribe(() => {}, () => {}, () => {
      console.log('completed');
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    console.log('destroyed');
  }
}
