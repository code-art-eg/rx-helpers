import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WithoutZoneExampleComponent } from './without-zone-example.component';

describe('WithoutZoneExampleComponent', () => {
  let component: WithoutZoneExampleComponent;
  let fixture: ComponentFixture<WithoutZoneExampleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WithoutZoneExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithoutZoneExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
