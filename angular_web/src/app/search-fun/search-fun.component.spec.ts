import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFunComponent } from './search-fun.component';

describe('SearchFunComponent', () => {
  let component: SearchFunComponent;
  let fixture: ComponentFixture<SearchFunComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchFunComponent]
    });
    fixture = TestBed.createComponent(SearchFunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
