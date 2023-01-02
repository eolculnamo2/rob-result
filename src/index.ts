const OK = true;
const ERR = false;
type OkType<T> = { type: typeof OK, data: T };
type ErrType<T = undefined> = { type: typeof ERR, data?: T };

export type Result<Ok, Err> = OkType<Ok> | ErrType<Err>;
export type AsyncResult<Ok, Err> = Promise<Result<Ok, Err>>;

// type constructors
export const Ok = <T>(data: T): OkType<T> => ({ type: OK, data });
export const Err = <T>(data?: T): ErrType<T> => ({ type: ERR, data });

// utilites
export const isErr = <Ok, Err>(result: Result<Ok, Err>): result is ErrType<Err> => result.type === ERR;
export const isOk = <Ok, Err>(result: Result<Ok, Err>): result is OkType<Ok> => result.type === OK;

export const map = <Ok, Err, T>(result: Result<Ok, Err>, callback: (value: Ok) => T) => {
  if (isOk(result)) {
    return Ok(callback(result.data));
  }
  return result;
}

// if is Ok, do callback which returns new Result, otherwise return error
export const flatMap = <Ok, Err, T>(result: Result<Ok, Err>, callback: (value: Ok) => Result<T, Err>) => {
  if (isOk(result)) {
    return callback(result.data);
  }
  return result;
}

export const match = <Ok, Err, OkReturn, ErrReturn>(result: Result<Ok, Err>, matchOptions: {
  ifOk: (value: Ok) => OkReturn;
  ifErr: (value?: Err) => ErrReturn;
}) => {
  const { ifOk, ifErr } = matchOptions;
  if (isOk(result)) {
    return ifOk(result.data);
  }
  return ifErr(result.data);
}

export const flatMatch = <Ok, Err, OkReturn, ErrReturn>(result: Result<Ok, Err>, matchOptions: {
  ifOk: (value: Ok) => OkReturn;
  ifErr: (value?: Err) => ErrReturn;
}) => {
  const { ifOk, ifErr } = matchOptions;
  if (isOk(result)) {
    return Ok(ifOk(result.data));
  }
  return Err(ifErr(result.data));
}

// error occurs when returning AsyncResult instead of Promise<Result even though they should be the same.
export const attempt = <Ok, CbArgs extends any[]>(callback: (...args: CbArgs) => Promise<Ok>): (...args: CbArgs) => Promise<Result<Ok, unknown>> => {
  return async (...args: CbArgs) => {
    try {
      return Ok(await callback(...args));
    } catch (e) {
      return Err(e);
    }
  }
}

export const attemptSync = <Ok, CbArgs extends any[]>(callback: (...args: CbArgs) => Ok): (...args: CbArgs) => Result<Ok, unknown> => {
  return (...args: CbArgs) => {
    try {
      return Ok(callback(...args));
    } catch (e) {
      return Err(e);
    }
  }
}

