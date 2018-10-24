import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutZoneExampleComponent } from './without-zone-example.component';

describe('WithoutZoneExampleComponent', () => {
  let component: WithoutZoneExampleComponent;
  let fixture: ComponentFixture<WithoutZoneExampleComponent>;

  beforeEach(async(() => {
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
