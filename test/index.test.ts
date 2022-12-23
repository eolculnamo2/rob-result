import { Err, match, Ok} from '../src';
describe('match', () =>{
  it('should match on Ok type', () => {
    const okResult = Ok(5);
    const okFn = jest.fn();
    const errFn = jest.fn();
    match(okResult)
      .ifOk(okFn)
      .ifErr(errFn);
    expect(okFn).toHaveBeenCalledWith(5);
    expect(errFn).not.toHaveBeenCalled();
  })
  it('should match on Err type', () => {
    const okResult = Err('Derp');
    const okFn = jest.fn();
    const errFn = jest.fn();
    match(okResult)
      .ifOk(okFn)
      .ifErr(errFn);
    expect(errFn).toHaveBeenCalledWith('Derp');
    expect(okFn).not.toHaveBeenCalled();
  })
})
