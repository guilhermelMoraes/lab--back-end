type ValidationFailed = {
  succeed: false;
  error: Error;
}

type ValidationSucceed = {
  succeed: true;
}

type ValidationResponse = ValidationSucceed | ValidationFailed;

export default ValidationResponse;
