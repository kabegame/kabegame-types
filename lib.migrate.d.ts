/** `export function migrate(input)`: metadata JSON string in/out; idempotent. Optional (identity if absent). */
type KabegameMigrateFn = (input: string) => string | Promise<string>;

/** `export function provideLabels(input)`: called with migrate's output when it succeeded. */
type KabegameProvideLabelsFn = (
  input: string,
) => KabegameLabelInput[] | Promise<KabegameLabelInput[]>;
