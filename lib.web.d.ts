/**
 * UTF-8 encoder provided by the Kabegame V8 runtime.
 *
 * @example
 * ```ts
 * const bytes = new TextEncoder().encode("hello");
 * ```
 */
interface TextEncoder {
  /** Always `"utf-8"`. */
  readonly encoding: "utf-8";
  /** Encode a string into a new `Uint8Array`. */
  encode(input?: string): Uint8Array;
  /** Encode into an existing buffer. */
  encodeInto(input: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}

/** Result returned by `TextEncoder.encodeInto`. */
interface TextEncoderEncodeIntoResult {
  /** UTF-16 code units read from the input string. */
  read: number;
  /** Bytes written to the destination buffer. */
  written: number;
}

/** `TextEncoder` constructor. */
declare var TextEncoder: {
  new (): TextEncoder;
};

/**
 * Text decoder provided by the Kabegame V8 runtime.
 *
 * @example
 * ```ts
 * const text = new TextDecoder().decode(bytes);
 * ```
 */
interface TextDecoder {
  /** Decoder label, usually `"utf-8"`. */
  readonly encoding: string;
  /** Whether invalid byte sequences throw. */
  readonly fatal: boolean;
  /** Whether byte order marks are ignored. */
  readonly ignoreBOM: boolean;
  /** Decode bytes into a string. */
  decode(input?: BufferSource, options?: { stream?: boolean }): string;
}

/** `TextDecoder` constructor. */
declare var TextDecoder: {
  new (label?: string, options?: { fatal?: boolean; ignoreBOM?: boolean }): TextDecoder;
};

/** Binary input accepted by Web APIs. */
type BufferSource = ArrayBufferView | ArrayBuffer;

/**
 * Console available in crawler plugins. Messages are forwarded to task logs.
 *
 * @example
 * ```ts
 * console.log("found", imageUrls.length, "images");
 * ```
 */
interface Console {
  log(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  debug(...args: unknown[]): void;
}

/** Runtime console forwarded to Kabegame task logs. */
declare var console: Console;

/** Decode a base64 string into a binary string. */
declare function atob(data: string): string;
/** Encode a binary string into base64. */
declare function btoa(data: string): string;
/**
 * Schedule a callback after at least `ms` milliseconds.
 *
 * @example
 * ```ts
 * await new Promise((resolve) => setTimeout(resolve, 1000));
 * ```
 */
declare function setTimeout(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): number;
/** Cancel a timeout returned by `setTimeout`. */
declare function clearTimeout(id?: number): void;
/** Schedule a repeated callback. */
declare function setInterval(callback: (...args: unknown[]) => void, ms?: number, ...args: unknown[]): number;
/** Cancel an interval returned by `setInterval`. */
declare function clearInterval(id?: number): void;
/**
 * Queue a microtask after the current JavaScript stack unwinds.
 *
 * @example
 * ```ts
 * queueMicrotask(() => console.log("later"));
 * ```
 */
declare function queueMicrotask(callback: () => void): void;
