import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFilterComponent } from './movie-filter.component';

describe('MovieFilterComponent', () => {
  let component: MovieFilterComponent;
  let fixture: ComponentFixture<MovieFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
