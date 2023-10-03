import { privateFunctionsPaymentsCore } from './receive-payments.enum';

describe('privateFunctionsPaymentsCore', () => {
  it('should work', () => {
    expect(privateFunctionsPaymentsCore()).toEqual(
      'private-functions-payments-core'
    );
  });
});
