const OK = true;
const ERR = false;
type OkType<T> = { type: typeof OK, data: T };
type ErrType<T = undefined> = { type: typeof ERR, data?: T };

export type Result<Ok, Err> = OkType<Ok> | ErrType<Err>;
export type AsyncResult<Ok, Err> = Promise<Result<Ok,Err>>

// type constructors
export const Ok = <T>(data: T): OkType<T> => ({ type: OK, data });
export const Err = <T>(data?: T): ErrType<T> => ({ type: ERR, data });

// utilites
export const isErr = <Ok, Err>(result: Result<Ok, Err>): result is ErrType<Err> => result.type === ERR;
export const isOk = <Ok, Err>(result: Result<Ok, Err>): result is OkType<Ok> => result.type === OK;

// if is Ok, do callback which returns new Result, otherwise return error
export const flatMap = <Ok, Err, T>(result: Result<Ok, Err>, callback: (value: Ok) => Result<T, Err>) => {
  if (isOk(result)) {
    return callback(result.data);
  }
  return result;
}

export const map = <Ok, Err, T>(result: Result<Ok, Err>, callback: (value: Ok) => T) => {
  if (isOk(result)) {
    return Ok(callback(result.data));
  }
  return Err(result);
}

export function match<Ok,Err>(result: Result<Ok, Err>) {
  return {
    ifOk(callback: (value: Ok) => void) {
      if (isOk(result)) {
        callback(result.data);
      }
      return this;
    },
    ifErr(callback: (value?: Err) => void) {
      if (isErr(result)) {
        callback(result.data);
      }
      return this;
    }
  }
}

