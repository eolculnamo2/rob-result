import { attempt, Err, isErr, isOk, match, Ok, Result } from '../src';

// test utils

const unwrapOk = <Ok, Err>(result: Result<Ok, Err>) => {
  if (isErr(result)) {
    throw Error('Expected Ok result, but got Err');
  }
  return result.data;
}
const unwrapErr = <Ok, Err>(result: Result<Ok, Err>) => {
  if (isOk(result)) {
    throw Error('Expected Ok result, but got Err');
  }
  return result.data;
}

describe('match', () => {
  it('should match on Ok type', () => {
    const okResult = Ok(5);
    const okFn = jest.fn().mockReturnValue(5);
    const errFn = jest.fn();
    const returnValue = match({
      result: okResult,
      ifOk: okFn,
      ifErr: errFn,
    })

    const unwrappedReturn = unwrapOk(returnValue);
    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
    expect(unwrappedReturn).toBe(5);
  })
  it('should match on Err type', () => {
    const okResult = Err('Derp');
    const okFn = jest.fn();
    const errFn = jest.fn().mockReturnValue('Derp');
    const returnValue = match({
      result: okResult,
      ifOk: okFn,
      ifErr: errFn,
    })

    const unwrappedReturn = unwrapErr(returnValue);
    expect(unwrappedReturn).toBe('Derp');
    expect(errFn).toHaveBeenCalledWith('Derp');
    expect(okFn).not.toHaveBeenCalled();
  })
})

describe('attempt', () => {
  it('should return Ok case with correct value when callback successful', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('foo');
    const outcome = await attempt(mockAsyncFn);
    const unwrappedOutcome = unwrapOk(outcome);
    expect(unwrappedOutcome).toBe('foo');
  })

  it('should return Err with error param from catch block', async () => {
    const mockAsyncFn = jest.fn().mockRejectedValue('bar');
    const outcome = await attempt(mockAsyncFn);
    const unwrappedOutcome = unwrapErr(outcome);
    expect(unwrappedOutcome).toBe('bar');
  })
})
