import { SelectModule } from './select.module';

describe('SelectModule', () => {
  let selectModule: SelectModule;

  beforeEach(() => {
    selectModule = new SelectModule();
  });

  it('should create an instance', () => {
    expect(selectModule).toBeTruthy();
  });
});
