import { privateFunctionsPaymentsCore } from './receive-payments.handler';

describe('privateFunctionsPaymentsCore', () => {
  it('should work', () => {
    expect(privateFunctionsPaymentsCore()).toEqual(
      'private-functions-payments-core'
    );
  });
});
