import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToWatchlistComponent } from './add-to-watchlist.component';

describe('AddToWatchlistComponent', () => {
  let component: AddToWatchlistComponent;
  let fixture: ComponentFixture<AddToWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToWatchlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
