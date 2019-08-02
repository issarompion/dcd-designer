import { TestBed } from '@angular/core/testing';

import { DcdUiAngularService } from './dcd-ui-angular.service';

describe('DcdUiAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DcdUiAngularService = TestBed.get(DcdUiAngularService);
    expect(service).toBeTruthy();
  });
});
