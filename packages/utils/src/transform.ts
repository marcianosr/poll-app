type Transform<TInput> = {
  apply: <TValue, TOutput>(
    test: TValue | undefined | false,
    mutation: (input: TInput, value: TValue) => TOutput
  ) => Transform<TOutput | TInput>;
  result: () => TInput;
};

export const transform = <TInput>(value: TInput): Transform<TInput> => ({
  apply: (test, mutation) =>
    transform(
      test !== undefined && test !== false ? mutation(value, test) : value
    ),
  result: () => value,
});
