/**
 * WHATWG URL object available in Kabegame V8 crawler plugins.
 *
 * @example
 * ```ts
 * const url = new URL("/posts", common.base_url ?? "https://example.test");
 * url.searchParams.set("page", "1");
 * await Kabegame.to(url.href);
 * ```
 */
interface URL {
  /** Fragment including the leading `#`, or an empty string. */
  hash: string;
  /** Hostname plus optional port. */
  host: string;
  /** Hostname without port. */
  hostname: string;
  /** Full serialized URL. */
  href: string;
  /** Origin, for example `https://example.test`. */
  readonly origin: string;
  /** URL password component. */
  password: string;
  /** Pathname beginning with `/`. */
  pathname: string;
  /** Port number as a string. */
  port: string;
  /** Protocol including the trailing `:`. */
  protocol: string;
  /** Query string including the leading `?`, or an empty string. */
  search: string;
  /** Mutable query parameter collection. */
  readonly searchParams: URLSearchParams;
  /** URL username component. */
  username: string;
  /** Serialize to JSON. */
  toJSON(): string;
  /** Serialize to a string. */
  toString(): string;
}

/** `URL` constructor and helpers. */
declare var URL: {
  new (url: string | URL, base?: string | URL): URL;
  /** Return whether a URL can be parsed. */
  canParse(url: string | URL, base?: string | URL): boolean;
  /** Parse a URL, returning `null` instead of throwing on invalid input. */
  parse(url: string | URL, base?: string | URL): URL | null;
};

/**
 * Mutable URL query parameter collection.
 *
 * @example
 * ```ts
 * const params = new URLSearchParams({ page: "1", tag: "blue archive" });
 * console.log(params.toString());
 * ```
 */
interface URLSearchParams {
  /** Number of query entries. */
  readonly size: number;
  /** Append a query parameter without replacing existing values. */
  append(name: string, value: string): void;
  /** Delete a query parameter, optionally matching one value. */
  delete(name: string, value?: string): void;
  /** Return the first value for a query parameter. */
  get(name: string): string | null;
  /** Return all values for a query parameter. */
  getAll(name: string): string[];
  /** Test whether a query parameter exists. */
  has(name: string, value?: string): boolean;
  /** Set or replace a query parameter. */
  set(name: string, value: string): void;
  /** Sort query parameters in place. */
  sort(): void;
  /** Serialize without a leading `?`. */
  toString(): string;
  /** Iterate over query entries. */
  forEach(callback: (value: string, key: string, parent: URLSearchParams) => void): void;
}

/** `URLSearchParams` constructor. */
declare var URLSearchParams: {
  new (init?: string | string[][] | Record<string, string> | URLSearchParams): URLSearchParams;
};
