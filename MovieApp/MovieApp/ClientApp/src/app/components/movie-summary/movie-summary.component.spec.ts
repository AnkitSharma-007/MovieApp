import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSummaryComponent } from './movie-summary.component';

describe('MovieSummaryComponent', () => {
  let component: MovieSummaryComponent;
  let fixture: ComponentFixture<MovieSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
