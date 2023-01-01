# Rob Result
An ergonomic TypeScript Result type library.

This is something I'm developing for personal use in mind, but the ins and outs of how this works are documented here in case anyone wants to understand the library.

## Getting started
Install the dependency with npm, yarn, or pnpm

npm install rob-result\
yarn add rob-result\
pnpm install rob-result


Basic Example:
```
import { match, isErr, isOk, Result, Err, Ok } from 'rob-result';

// create a Result function that has a number Ok case and string Error case
const validDivide = (a: number, b: number): Result<number, string> => {
  if (b === 0) {
    return Err("Cannot divide by 0!");
  }
  return Ok(a/b);
}

// execute validDivide
const divideResult = validDivide(4, 2);

// log a message depending on outcome
if (isOk(divideResult)) {
  console.log(`The answer is: ${divideResult.data}`);
}
if (isErr(divideResult)) {
  console.log(`Divide Error: ${divideResult.data}`);
}

// can also use a match utility instead of if statements
match({
  result: divideResult,
  ifOk: (value) => console.log(`The answer is: ${divideResult.data}`),
  ifErr: (error) => console.log(`Divide Error: ${divideResult.data}`),
})
```

## Features

#### Result Type
```
  type Result<Ok, Err> = OkType<Ok> | ErrType<Err>;
```

The Result type is a discriminated union for handling errors. The first generic argument is the data expected when a function has an Ok result.
The second generic argument defines the error data type for when a function has an Err result.

### AsyncResult
```
  type AsyncResult<Ok, Err> =  Promise<Result<Ok, Err>>
```

AsyncResult is syntatic sugar for when a Result type wrapped by a Promise type.

### Ok
Ok example:

```
  const okResult = Ok(4);
```

Ok is a type constructor which builds the Ok variant for results.

### Err
Err example:

```
  const errResult = Err("Something went wrong!");
```

Err is a type constructor which builds the Ok variant for results.

### isOk
isOk example:
```
  const okResult = Ok(2);
  isOk(okResult) // true

  const errResult = Err(2);
  isOk(errResult) // false
```

isOk is a type predicate that returns true if a result type value is Ok and false if is Err.

### isErr
isErr example:
```
  const okResult = Ok(2);
  isErr(okResult) // false

  const errResult = Err(2);
  isErr(errResult) // true
```

isErr is a type predicate that returns false if a result type value is Ok and true if is Err.

### map
map example:
```
  const double = (n: number) => n * 2;

  const okValue = ok(2);
  const newOkValue = map(okValue, double);
  // newOkValue is Ok(4);

  const errValue = Err(2);
  const newOkValue = map(okValue, double);
  // newOkValue is Err(2) -- nothing happens since its an Err type
```

Because Result is a functor, it's convenient to provide a map function. The map function applies a function to the value of Ok
if the provided result value is Ok. If the result value is Err, then map simply returns back the Err.

### flatMap
flatMap example:
```
  const double = (n: number) => Ok(n * 2);

  const okValue = ok(2);
  const newOkValue = map(okValue, double);
  // newOkValue is Ok(4);

  const errValue = Err(2);
  const newOkValue = map(okValue, double);
  // newOkValue is Err(2) -- nothing happens since its an Err type
```

Like map except the return type of the mapping function returns a Result. This is useful for composing
several result functions together.

### match
match example instead of checking both ifOk and ifErr utilities like in the getting started example, we can also use
a match function. match returns an unwrapped union of the Ok and Err types which can be useful in JSX when both the 
Ok case and Err case both return JSX.
```
  const divideResult = [[Code from getting started example above]];
  match({
    result: divideResult,
    ifOk: (value) => console.log(`The answer is: ${divideResult.data}`),
    ifErr: (error) => console.log(`Divide Error: ${divideResult.data}`),
  })
```

### flatMatch
flatMatch example:
```
  const divideResult = [[Code from getting started example above]];
  const x = flatMatch({
    result: divideResult,
    ifOk: (value) => value
    ifErr: (error) => error,
  })
  // x is a Result type instead of a union of values like in match
```
flatMatch will likely be renamed. It's like match except it returns a Result

### attempt
attempt example:
```
  // apiResult will be Ok(value) if the api succeeds otherwise it returns Err(e) where e the parameter of
  // what would otherwise be a catch block
  const apiFunction = attempt(async (name: string) => {
    const derpResponse = await fetch('https://derp.com?name=' + name);
    return await derpResponse.json();
  });

  const apiResult = await apiFunction();
  
```

The purpose of attempt is to remove the need for try catch blocks in your code as much as possible. The attempt function internally wraps the async
code in a try catch and returns Ok with whatever is returned in the callback or will return an Err response with whatever the error parameter
would return in the catch block.

### attemptSync
attemptSync example:
```
  // apiResult will be Ok(value) if the api succeeds otherwise it returns Err(e) where e the parameter of
  // what would otherwise be a catch block
  const validDivide = attemptSync((a: number, b: number) => {
    if (b === 0) {
      throw 'Cannot divide by 0';
    }
    return a/b;
  });
  
  const divideResult = validDivide(4, 2); // Ok(2)
```

attemptSync is like attempt except for synchronous functions.

