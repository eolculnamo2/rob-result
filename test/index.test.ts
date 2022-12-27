import { Err, match, Ok} from '../src';
describe('match', () =>{
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
})
