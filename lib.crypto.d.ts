/**
 * Web Crypto algorithm name or descriptor.
 *
 * @example
 * ```ts
 * const algorithm: AlgorithmIdentifier = "SHA-256";
 * ```
 */
type AlgorithmIdentifier = string | { name: string };

/**
 * SubtleCrypto subset available in Kabegame V8 crawler plugins.
 *
 * @example
 * ```ts
 * const bytes = new TextEncoder().encode("payload");
 * const digest = await crypto.subtle.digest("SHA-256", bytes);
 * ```
 */
interface SubtleCrypto {
  /** Calculate a digest such as `SHA-1`, `SHA-256`, `SHA-384`, or `SHA-512`. */
  digest(algorithm: AlgorithmIdentifier, data: BufferSource): Promise<ArrayBuffer>;
}

/**
 * Web Crypto API available in crawler plugins.
 *
 * @example
 * ```ts
 * const id = crypto.randomUUID();
 * const nonce = crypto.getRandomValues(new Uint8Array(16));
 * ```
 */
interface Crypto {
  /** Cryptographic digest API. */
  readonly subtle: SubtleCrypto;
  /** Fill a typed array with cryptographically strong random values. */
  getRandomValues<T extends ArrayBufferView>(array: T): T;
  /** Generate a random UUID string. */
  randomUUID(): string;
}

/** Runtime Web Crypto object. */
declare var crypto: Crypto;
