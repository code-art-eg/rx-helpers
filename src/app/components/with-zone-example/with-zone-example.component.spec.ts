import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WithZoneExampleComponent } from './with-zone-example.component';

describe('WithZoneExampleComponent', () => {
  let component: WithZoneExampleComponent;
  let fixture: ComponentFixture<WithZoneExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WithZoneExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithZoneExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
