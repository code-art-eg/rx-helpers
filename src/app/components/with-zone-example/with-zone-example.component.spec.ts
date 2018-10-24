import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithZoneExampleComponent } from './with-zone-example.component';

describe('WithZoneExampleComponent', () => {
  let component: WithZoneExampleComponent;
  let fixture: ComponentFixture<WithZoneExampleComponent>;

  beforeEach(async(() => {
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
