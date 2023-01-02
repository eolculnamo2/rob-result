import { attempt, attemptSync, Err, isErr, isOk, flatMatch, Ok, Result, match, map, flatMap } from '../src';

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

describe('map', () => {
  it('should return the mapped value correctly when ok', () => {
    const value = Ok(5);
    const outcome = map(value, (x) => x * 2);
    const unwrappedOutcome = unwrapOk(outcome);
    expect(unwrappedOutcome).toBe(10);
  })
  it('should return the same error when err', () => {
    const value = Err(5);
    const outcome = map(value, () => null);
    expect(outcome).toStrictEqual(value);
  })
})

describe('flatMap', () => {
  it('should return the correctly mapped Ok value when ok', () => {
    const value = Ok(5);
    const outcome = flatMap(value, (x) => Ok(x * 2));
    expect(outcome).toStrictEqual(Ok(10));
  })
  it('should return the same error when err', () => {
    const value = Err(5);
    const outcome = flatMap(value, () => Ok(null));
    expect(outcome).toStrictEqual(value);
  })
})

describe('match', () => {
  it('should match on Ok type', () => {
    const okResult = Ok(5);
    const okFn = jest.fn().mockReturnValue(5);
    const errFn = jest.fn();
    const returnValue = match(okResult, {
      ifOk: okFn,
      ifErr: errFn,
    })

    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
    expect(returnValue).toBe(5);
  })
  it('should match on Err type', () => {
    const errResult = Err('Derp');
    const okFn = jest.fn();
    const errFn = jest.fn().mockReturnValue('Derp');
    const returnValue = match(errResult, {
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
    const returnValue = flatMatch(okResult, {
      ifOk: okFn,
      ifErr: errFn,
    })

    const unwrappedReturn = unwrapOk(returnValue);
    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
    expect(unwrappedReturn).toBe(5);
  })
  it('should flatMatch on Err type', () => {
    const errResult = Err('Derp');
    const okFn = jest.fn();
    const errFn = jest.fn().mockReturnValue('Derp');
    const returnValue = flatMatch(errResult, {
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

