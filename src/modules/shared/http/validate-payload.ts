type PayloadValidity = {
  parameter?: string;
  succeeds: boolean;
}

export default function validatePayload<T>(
  payload: T, requiredParameters: string[],
): PayloadValidity {
  for (const parameter of requiredParameters) {
    const missingRequiredParameter = !Object
      .prototype
      .hasOwnProperty
      .call(payload, parameter);

    if (missingRequiredParameter) {
      return {
        parameter,
        succeeds: false,
      };
    }
  }

  return {
    succeeds: true,
  };
}
