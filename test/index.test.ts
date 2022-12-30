import { attempt, attemptSync, Err, isErr, isOk, flatMatch, Ok, Result, match } from '../src';

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

    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
    expect(returnValue).toBe(5);
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

    expect(returnValue).toBe('Derp');
    expect(errFn).toHaveBeenCalledWith('Derp');
    expect(okFn).not.toHaveBeenCalled();
  })
});

describe('flatMatch', () => {
  it('should flatMatch on Ok type', () => {
    const okResult = Ok(5);
    const okFn = jest.fn().mockReturnValue(5);
    const errFn = jest.fn();
    const returnValue = flatMatch({
      result: okResult,
      ifOk: okFn,
      ifErr: errFn,
    })

    const unwrappedReturn = unwrapOk(returnValue);
    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
    expect(unwrappedReturn).toBe(5);
  })
  it('should flatMatch on Err type', () => {
    const okResult = Err('Derp');
    const okFn = jest.fn();
    const errFn = jest.fn().mockReturnValue('Derp');
    const returnValue = flatMatch({
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
    const outcome = attempt(async (a: number, b: number) => {
      return a + b;
    });
    const unwrappedOutcome = unwrapOk(await outcome(1, 2));
    expect(unwrappedOutcome).toBe(3);
  })

  it('should return Err with error param from catch block', async () => {
    const mockFailFn = jest.fn().mockRejectedValue('bar')
    const outcome = attempt(mockFailFn);
    const unwrappedOutcome = unwrapErr(await outcome());
    expect(unwrappedOutcome).toBe('bar');
  })
})

describe('attemptSync', () => {
  it('should return Ok case with correct value when callback successful', async () => {
    const outcome = attemptSync((a: number, b: number) => {
      return a + b;
    });
    const unwrappedOutcome = unwrapOk(outcome(1, 2));
    expect(unwrappedOutcome).toBe(3);
  })

  it('should return Err with error param from catch block', async () => {
    const mockFailFn = jest.fn().mockImplementation(() => {
      throw 'bar';
    })
    const outcome = attemptSync(mockFailFn);
    const unwrappedOutcome = unwrapErr(outcome());
    expect(unwrappedOutcome).toBe('bar');
  })
})

