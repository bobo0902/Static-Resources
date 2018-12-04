import { TestBed } from '@angular/core/testing';

import { TreeSelectService } from './tree-select.service';

describe('TreeSelectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TreeSelectService = TestBed.get(TreeSelectService);
    expect(service).toBeTruthy();
  });
});
