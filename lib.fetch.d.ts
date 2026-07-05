/** Accepted `Headers` constructor input. */
type HeadersInit = Headers | string[][] | Record<string, string>;

/**
 * Accepted request/response body input.
 *
 * Note: `fetch`/`Request` bodies are host-backed and only transmit as text —
 * pass a `string` (a `URLSearchParams` is stringified to `a=1&b=2`). `Response`
 * bodies (e.g. `Response.json`) accept the full set.
 */
type BodyInit = string | ArrayBuffer | ArrayBufferView | URLSearchParams;

/**
 * HTTP headers collection.
 *
 * @example
 * ```ts
 * const headers = new Headers({ accept: "application/json" });
 * headers.set("x-plugin", "demo");
 * ```
 */
interface Headers {
  /** Append a header value without replacing existing values. */
  append(name: string, value: string): void;
  /** Delete a header. */
  delete(name: string): void;
  /** Get a header value, or `null` when absent. */
  get(name: string): string | null;
  /** Test whether a header is present. */
  has(name: string): boolean;
  /** Set or replace a header value. */
  set(name: string, value: string): void;
  /** Iterate over header entries. */
  forEach(callback: (value: string, key: string, parent: Headers) => void): void;
}

/** `Headers` constructor. */
declare var Headers: {
  new (init?: HeadersInit): Headers;
};

/**
 * Common body-reading methods for `Request` and `Response`.
 *
 * @example
 * ```ts
 * const response = await fetch(apiUrl);
 * const data = await response.json();
 * ```
 */
interface Body {
  /** Whether the body has already been consumed. */
  readonly bodyUsed: boolean;
  /** Read the body as bytes. */
  arrayBuffer(): Promise<ArrayBuffer>;
  /** Read the body as a blob. */
  blob(): Promise<Blob>;
  /** Parse the body as JSON. */
  json(): Promise<unknown>;
  /** Read the body as text. */
  text(): Promise<string>;
}

/**
 * Request options for `fetch` and `new Request`.
 *
 * @example
 * ```ts
 * const init: RequestInit = {
 *   method: "POST",
 *   headers: { "content-type": "application/json" },
 *   body: JSON.stringify({ page: 1 }),
 * };
 * ```
 */
interface RequestInit {
  /** Request body. Transmitted as text (see `BodyInit`). */
  body?: BodyInit | null;
  headers?: HeadersInit;
  method?: string;
}

/**
 * HTTP request object.
 *
 * Minimal, host-backed shape used to normalize `fetch` inputs — it carries
 * `url`/`method`/`headers` but has no body-reading methods (unlike `Response`).
 *
 * @example
 * ```ts
 * const request = new Request(apiUrl, { headers: { accept: "application/json" } });
 * const response = await fetch(request);
 * ```
 */
interface Request {
  /** Request headers. */
  readonly headers: Headers;
  /** HTTP method. */
  readonly method: string;
  /** Request URL. */
  readonly url: string;
}

/** `Request` constructor. */
declare var Request: {
  new (input: string | URL | Request, init?: RequestInit): Request;
};

/**
 * Response options for `new Response` and `Response.json`.
 *
 * @example
 * ```ts
 * const response = Response.json({ ok: true }, { status: 200 });
 * ```
 */
interface ResponseInit {
  headers?: HeadersInit;
  status?: number;
  statusText?: string;
}

/**
 * HTTP response object returned by `fetch`.
 *
 * @example
 * ```ts
 * const response = await fetch(apiUrl);
 * if (!response.ok) throw new Error(`HTTP ${response.status}`);
 * const html = await response.text();
 * ```
 */
interface Response extends Body {
  /** Response headers. */
  readonly headers: Headers;
  /** `true` for HTTP 2xx status codes. */
  readonly ok: boolean;
  /** Whether the response followed redirects. */
  readonly redirected: boolean;
  /** HTTP status code. */
  readonly status: number;
  /** HTTP status text. */
  readonly statusText: string;
  /** Final response URL. */
  readonly url: string;
}

/** `Response` constructor and helpers. */
declare var Response: {
  new (body?: BodyInit | null, init?: ResponseInit): Response;
  /** Create a JSON response object. */
  json(data: unknown, init?: ResponseInit): Response;
};

/**
 * Blob of binary/text data, as returned by `Response.blob()`.
 *
 * There is no global `Blob` constructor in the crawler runtime; a `Blob` can
 * only be obtained from a `Response` body.
 *
 * @example
 * ```ts
 * const blob = await (await fetch(imageUrl)).blob();
 * console.log(blob.size, blob.type);
 * ```
 */
interface Blob {
  /** Blob size in bytes. */
  readonly size: number;
  /** MIME type. */
  readonly type: string;
  /** Read blob bytes. */
  arrayBuffer(): Promise<ArrayBuffer>;
  /** Read blob text. */
  text(): Promise<string>;
}

/**
 * Fetch a resource through Kabegame's V8 runtime.
 *
 * Host-backed: requests go through Kabegame's proxy-aware HTTP client (same
 * proxy/`no_proxy` config as the rest of the crawler) and follow up to 10
 * redirects. Plugins get no raw-socket surface.
 *
 * Header precedence: headers set with `Kabegame.setHeader` are applied as
 * defaults on the host, then overridden by any headers passed in `init` or the
 * `Request`.
 *
 * Unlike `Kabegame.to`, `fetch` does NOT resolve relative URLs against the
 * current page — pass an absolute URL or resolve it yourself with
 * `new URL(rel, await Kabegame.currentUrl())`.
 *
 * @example
 * ```ts
 * Kabegame.setHeader("Cookie", "session=...");
 * const url = new URL("/api/posts", await Kabegame.currentUrl());
 * const json = await (await fetch(url)).json();
 * ```
 */
declare function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;
