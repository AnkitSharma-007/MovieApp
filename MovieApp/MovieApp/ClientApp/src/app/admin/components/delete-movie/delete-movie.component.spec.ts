import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMovieComponent } from './delete-movie.component';

describe('DeleteMovieComponent', () => {
  let component: DeleteMovieComponent;
  let fixture: ComponentFixture<DeleteMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteMovieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
