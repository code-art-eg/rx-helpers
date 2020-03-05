import { Component, OnDestroy, Injectable, Pipe, PipeTransform, Directive } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { takeUntilDestroyed, TakeUntilDestroyed } from './takeUntilDestroyed';

@TakeUntilDestroyed()
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

@TakeUntilDestroyed()
@Injectable()
class BaseComponent {

}

@Component({
  template: 'TestInheritedComponent',
})
class TestInheritedComponent extends BaseComponent {
}

@Component({
  template: 'TestUntilComponent',
})
class TestUntilComponent {

  constructor() {

  }
}

@Component({
  template: 'TestOnDestroyComponent',
})
class TestOnDestroyComponent implements OnDestroy {
  constructor() {

  }

  ngOnDestroy(): void {
  }
}

@Injectable()
export class TestSubjectService {
  public subject?: Subject<any>;
  public completed = false;
}

@TakeUntilDestroyed()
@Pipe({
  name: 'pip1'
})
class TestPipe implements PipeTransform {
  constructor(
    service: TestSubjectService
  ) {
    service.subject?.pipe(takeUntilDestroyed(this)).subscribe(() => { }, () => { }, () => {
      service.completed = true;
    });
  }
  transform() {
    return 'test';
  }
}

@Component({
  template: ' {{ 0 | pip1 }}'
})
class TestPipeComponent {

}

@TakeUntilDestroyed()
@Injectable()
class BasePipe {
  constructor(
    service: TestSubjectService
  ) {
    service.subject?.pipe(takeUntilDestroyed(this)).subscribe(() => { }, () => { }, () => {
      service.completed = true;
    });
  }
}

@Pipe({
  name: 'pip2'
})
class TestInheritedPipe extends BasePipe implements PipeTransform {

  transform() {
    return 'test2';
  }
}

@Component({
  template: ' {{ 0 | pip2 }}'
})
class TestInheritedPipeComponent {

}

@TakeUntilDestroyed()
@Directive({
  selector: '[libDir1]',
})
class TestDirective {
  constructor(
    service: TestSubjectService
  ) {
    service.subject?.pipe(takeUntilDestroyed(this)).subscribe(() => { }, () => { }, () => {
      service.completed = true;
    });
  }
}

@TakeUntilDestroyed()
@Injectable()
class BaseDirective {
  constructor(
    service: TestSubjectService
  ) {
    service.subject?.pipe(takeUntilDestroyed(this)).subscribe(() => { }, () => { }, () => {
      service.completed = true;
    });
  }
}

@Directive({
  selector: '[libDir2]',
})
export class TestInheritedDirective extends BaseDirective {

}

@Component({
  template: '<div libDir1></div>',
})
export class TestDirectiveComponent {

}

@Component({
  template: '<div libDir2></div>',
})
export class TestInheritedDirectiveComponent {

}

@TakeUntilDestroyed()
@Injectable()
class TestService {

}

@Component({
  template: 'TestServiceComponent',
  providers: [TestService],
})
class TestServiceComponent {
  constructor(
    public readonly service: TestService,
  ) {
  }
}

describe('takeUntilDestroyed', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestUntilDestroyedComponent,
        TestUntilComponent,
        TestInheritedComponent,
        TestOnDestroyComponent,
        TestPipeComponent,
        TestPipe,
        TestInheritedPipe,
        TestInheritedPipeComponent,
        TestDirectiveComponent,
        TestDirective,
        TestInheritedDirectiveComponent,
        TestInheritedDirective,
        TestServiceComponent,
      ],
      providers: [TestSubjectService],
    });
  }));

  it('executes stops emitting calls original onDestroy', async () => {
    const fixture = TestBed.createComponent(TestUntilDestroyedComponent);
    const component = fixture.componentInstance;
    let completed = false;
    const sub = new Subject().pipe(takeUntilDestroyed(component)).subscribe(() => { }, () => { }, () => {
      completed = true;
    });
    try {
      fixture.destroy();
      await fixture.whenStable();
      expect(completed).toBe(true);
      expect(component.destroyedCalled).toBe(true);
    } finally {
      sub.unsubscribe();
    }
  });

  it('works with plain OnDestroy objects', () => {
    let completed = false;
    const obj = {
      destroyCalled: false,
      ngOnDestroy() {
        this.destroyCalled = true;
      }
    };
    const sub = new Subject().pipe(takeUntilDestroyed(obj)).subscribe(() => { }, () => { }, () => {
      completed = true;
    });
    try {
      obj.ngOnDestroy();
      expect(completed).toBe(true);
      expect(obj.destroyCalled).toBe(true);
    } finally {
      sub.unsubscribe();
    }
  });

  it('works with services', async () => {
    const fixture = TestBed.createComponent(TestServiceComponent);
    const component = fixture.componentInstance;
    const service = component.service;
    let completed = false;
    const sub = new Subject().pipe(takeUntilDestroyed(service)).subscribe(() => { }, () => { }, () => {
      completed = true;
    });
    try {
      fixture.destroy();
      await fixture.whenStable();
      expect(completed).toBe(true);
    } finally {
      sub.unsubscribe();
    }
  });

  it('works with pipes', async () => {
    const service = TestBed.inject(TestSubjectService);
    service.subject = new Subject();
    service.completed = false;
    const fixture = TestBed.createComponent(TestPipeComponent);
    fixture.destroy();
    await fixture.whenStable();
    expect(service.completed).toBe(true);
  });

  it('works with inherited pipes', async () => {
    const service = TestBed.inject(TestSubjectService);
    service.subject = new Subject();
    service.completed = false;
    const fixture = TestBed.createComponent(TestInheritedPipeComponent);
    fixture.destroy();
    await fixture.whenStable();
    expect(service.completed).toBe(true);
  });

  it('works with directives', async () => {
    const service = TestBed.inject(TestSubjectService);
    service.subject = new Subject();
    service.completed = false;
    const fixture = TestBed.createComponent(TestDirectiveComponent);
    fixture.destroy();
    await fixture.whenStable();
    expect(service.completed).toBe(true);
  });

  it('works with inherited directives', async () => {
    const service = TestBed.inject(TestSubjectService);
    service.subject = new Subject();
    service.completed = false;
    const fixture = TestBed.createComponent(TestInheritedDirectiveComponent);
    fixture.destroy();
    await fixture.whenStable();
    expect(service.completed).toBe(true);
  });

  it('works with inherited component', async () => {
    const fixture = TestBed.createComponent(TestInheritedComponent);
    const component = fixture.componentInstance;
    let completed = false;
    const sub = new Subject().pipe(takeUntilDestroyed(component)).subscribe(() => { }, () => { }, () => {
      completed = true;
    });
    try {
      fixture.destroy();
      await fixture.whenStable();
      expect(completed).toBe(true);
    } finally {
      sub.unsubscribe();
    }
  });

  it('executes continues emitting when not destroyed', async () => {
    const fixture = TestBed.createComponent(TestUntilDestroyedComponent);
    const component = fixture.componentInstance;
    let completed = false;
    const subject = new Subject<number>();
    let val = 0;
    const sub = subject.pipe(takeUntilDestroyed(component)).subscribe((v) => {
      val = v;
    }, () => { }, () => {
      completed = true;
    });
    try {
      subject.next(1);
      expect(completed).toBe(false);
      expect(component.destroyedCalled).toBe(false);
      expect(val).toBe(1);
      fixture.destroy();
      await fixture.whenStable();
      expect(completed).toBe(true);
      expect(component.destroyedCalled).toBe(true);
    } finally {
      sub.unsubscribe();
    }
  });

  it('fails when component is not decorated with TakeUntilDestroy', () => {
    const fixture = TestBed.createComponent(TestUntilComponent);
    const component = fixture.componentInstance;
    const subject = new Subject<number>();
    expect(() => subject.pipe(takeUntilDestroyed(component as OnDestroy))).toThrow();
  });

  it('fails when component is not decorated with TakeUntilDestroy and implements OnDestroy', () => {
    const fixture = TestBed.createComponent(TestOnDestroyComponent);
    const component = fixture.componentInstance;
    const subject = new Subject<number>();
    expect(() => subject.pipe(takeUntilDestroyed(component as OnDestroy))).toThrow();
  });
});
