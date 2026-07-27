/**
 * JSON scalar values accepted by Kabegame host APIs.
 *
 * @example
 * ```ts
 * const value: KabegameJsonPrimitive = "tag";
 * ```
 */
type KabegameJsonPrimitive = string | number | boolean | null;

/**
 * JSON-compatible value that can cross the Kabegame host boundary.
 *
 * @example
 * ```ts
 * const metadata: KabegameJsonValue = {
 *   schema: 1,
 *   title: "Post title",
 *   tags: ["wallpaper"],
 * };
 * ```
 */
type KabegameJsonValue =
  | KabegameJsonPrimitive
  | KabegameJsonValue[]
  | { [key: string]: KabegameJsonValue };

/**
 * Options for `Kabegame.downloadImage`.
 *
 * @example
 * ```ts
 * await Kabegame.downloadImage(imageUrl, {
 *   name: "artist / character",
 *   url: postUrl,
 *   metadata: { schema: 1, title: "Post title" },
 * });
 * ```
 */
interface KabegameDownloadImageOptions {
  /** Optional display filename/title shown in Kabegame. */
  name?: string | null;
  /** Existing metadata row id returned by `Kabegame.createImageMetadata`. */
  metadata_id?: number | null;
  /** Source/post URL associated with the downloaded file. */
  url?: string | null;
  /**
   * JSON metadata to store with the image. Ignored when `metadata_id` is set.
   * The stored row is stamped with the running plugin's version by the app;
   * keep a `schema` marker inside the metadata itself for your migration script.
   */
  metadata?: KabegameJsonValue;
}

/**
 * Options for `Kabegame.createImageMetadata`.
 *
 * The stored row is stamped with the running plugin's version by the app;
 * keep a `schema` marker inside the metadata itself for your migration script.
 *
 * @example
 * ```ts
 * const metadataId = Kabegame.createImageMetadata({ schema: 1, title: "Post title" });
 * await Kabegame.downloadImage(imageUrl, { metadata_id: Number(metadataId) });
 * ```
 */
interface KabegameCreateImageMetadataOptions {}

/** A path inside the current crawler task's private virtual file system. */
type KabegameFsPath = string | URL;

/** Seek origin accepted by `Kabegame.fs.open()` file handles: start, current, or end. */
type KabegameFsSeekMode = 0 | 1 | 2;

/** Options for opening a file through `Kabegame.fs` (async options are shared by both backends). */
interface KabegameFsOpenOptions {
  read?: boolean;
  write?: boolean;
  append?: boolean;
  truncate?: boolean;
  create?: boolean;
  createNew?: boolean;
  mode?: number;
}

/** Options for cancellable whole-file reads. */
interface KabegameFsReadFileOptions {
  signal?: AbortSignal;
}

/** Options for creating directories. */
interface KabegameFsMkdirOptions {
  recursive?: boolean;
  mode?: number;
}

/** Options for creating a temporary file or directory under the task's `tmp` mount. */
interface KabegameFsMakeTempOptions {
  dir?: string;
  prefix?: string;
  suffix?: string;
}

/** Options for removing files or directories. */
interface KabegameFsRemoveOptions {
  recursive?: boolean;
}

/** Options for whole-file writes. */
interface KabegameFsWriteFileOptions {
  append?: boolean;
  create?: boolean;
  createNew?: boolean;
  mode?: number;
  signal?: AbortSignal;
}

/** Windows symbolic-link type hint. Symbolic links are rejected by the plugin VFS. */
interface KabegameFsSymlinkOptions {
  type: "file" | "dir" | "junction";
}

/** Raw terminal mode options exposed by the Deno file-handle surface. */
interface KabegameFsSetRawOptions {
  cbreak: boolean;
}

/** Directory entry returned by `Kabegame.fs.readDir()`. */
interface KabegameFsDirEntry {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

/** File metadata returned by `stat`, `lstat`, and file handles. */
interface KabegameFsFileInfo {
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
  size: number;
  mtime: Date | null;
  atime: Date | null;
  birthtime: Date | null;
  ctime: Date | null;
  dev: number;
  ino: number | null;
  mode: number | null;
  nlink: number | null;
  uid: number | null;
  gid: number | null;
  rdev: number | null;
  blksize: number | null;
  blocks: number | null;
  isBlockDevice: boolean | null;
  isCharDevice: boolean | null;
  isFifo: boolean | null;
  isSocket: boolean | null;
}

/**
 * File handle returned by V8 `Kabegame.fs.open()` and `create()`.
 *
 * WebView handles expose only the async `read`, `write`, `seek`, `stat`, `truncate`, and `close`
 * methods from this interface. WebView `close()` returns a Promise and should be awaited.
 */
interface KabegameFsFile {
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
  write(data: Uint8Array): Promise<number>;
  writeSync(data: Uint8Array): number;
  truncate(len?: number): Promise<void>;
  truncateSync(len?: number): void;
  read(buffer: Uint8Array): Promise<number | null>;
  readSync(buffer: Uint8Array): number | null;
  seek(offset: number | bigint, whence: KabegameFsSeekMode): Promise<number>;
  seekSync(offset: number | bigint, whence: KabegameFsSeekMode): number;
  stat(): Promise<KabegameFsFileInfo>;
  statSync(): KabegameFsFileInfo;
  sync(): Promise<void>;
  syncSync(): void;
  syncData(): Promise<void>;
  syncDataSync(): void;
  utime(atime: number | Date, mtime: number | Date): Promise<void>;
  utimeSync(atime: number | Date, mtime: number | Date): void;
  isTerminal(): boolean;
  setRaw(mode: boolean, options?: KabegameFsSetRawOptions): void;
  lock(exclusive?: boolean): Promise<void>;
  lockSync(exclusive?: boolean): void;
  tryLock(exclusive?: boolean): Promise<boolean>;
  tryLockSync(exclusive?: boolean): boolean;
  unlock(): Promise<void>;
  unlockSync(): void;
  close(): void;
  [Symbol.dispose](): void;
}

/**
 * Complete `deno_fs` API exposed only by the V8 crawler backend.
 *
 * The WebView backend is intentionally smaller and has no synchronous methods. It exposes the
 * async path methods `readFile`, `readTextFile`, `writeFile`, `writeTextFile`, `mkdir`, `readDir`,
 * `remove`, `rename`, `copyFile`, `stat`, `lstat`, `exists`, `truncate`, `size`, and `getRoot`, plus
 * `open` / `create` handles with async `read`, `write`, `seek`, `stat`, `truncate`, and `close`.
 */
interface KabegameFsApi {
  readonly FsFile: abstract new (...args: never[]) => KabegameFsFile;
  getRoot(): string;
  chdir(directory: KabegameFsPath): void;
  cwd(): string;
  open(path: KabegameFsPath, options?: KabegameFsOpenOptions): Promise<KabegameFsFile>;
  openSync(path: KabegameFsPath, options?: KabegameFsOpenOptions): KabegameFsFile;
  create(path: KabegameFsPath): Promise<KabegameFsFile>;
  createSync(path: KabegameFsPath): KabegameFsFile;
  link(oldpath: string, newpath: string): Promise<void>;
  linkSync(oldpath: string, newpath: string): void;
  mkdir(path: KabegameFsPath, options?: KabegameFsMkdirOptions): Promise<void>;
  mkdirSync(path: KabegameFsPath, options?: KabegameFsMkdirOptions): void;
  makeTempDir(options?: KabegameFsMakeTempOptions): Promise<string>;
  makeTempDirSync(options?: KabegameFsMakeTempOptions): string;
  makeTempFile(options?: KabegameFsMakeTempOptions): Promise<string>;
  makeTempFileSync(options?: KabegameFsMakeTempOptions): string;
  chmod(path: KabegameFsPath, mode: number): Promise<void>;
  chmodSync(path: KabegameFsPath, mode: number): void;
  chown(path: KabegameFsPath, uid: number | null, gid: number | null): Promise<void>;
  chownSync(path: KabegameFsPath, uid: number | null, gid: number | null): void;
  remove(path: KabegameFsPath, options?: KabegameFsRemoveOptions): Promise<void>;
  removeSync(path: KabegameFsPath, options?: KabegameFsRemoveOptions): void;
  rename(oldpath: KabegameFsPath, newpath: KabegameFsPath): Promise<void>;
  renameSync(oldpath: KabegameFsPath, newpath: KabegameFsPath): void;
  readTextFile(path: KabegameFsPath, options?: KabegameFsReadFileOptions): Promise<string>;
  readTextFileSync(path: KabegameFsPath): string;
  readFile(path: KabegameFsPath, options?: KabegameFsReadFileOptions): Promise<Uint8Array>;
  readFileSync(path: KabegameFsPath): Uint8Array;
  realPath(path: KabegameFsPath): Promise<string>;
  realPathSync(path: KabegameFsPath): string;
  readDir(path: KabegameFsPath): AsyncIterable<KabegameFsDirEntry>;
  readDirSync(path: KabegameFsPath): IterableIterator<KabegameFsDirEntry>;
  copyFile(fromPath: KabegameFsPath, toPath: KabegameFsPath): Promise<void>;
  copyFileSync(fromPath: KabegameFsPath, toPath: KabegameFsPath): void;
  readLink(path: KabegameFsPath): Promise<string>;
  readLinkSync(path: KabegameFsPath): string;
  lstat(path: KabegameFsPath): Promise<KabegameFsFileInfo>;
  lstatSync(path: KabegameFsPath): KabegameFsFileInfo;
  stat(path: KabegameFsPath): Promise<KabegameFsFileInfo>;
  statSync(path: KabegameFsPath): KabegameFsFileInfo;
  writeFile(
    path: KabegameFsPath,
    data: Uint8Array | ReadableStream<Uint8Array>,
    options?: KabegameFsWriteFileOptions,
  ): Promise<void>;
  writeFileSync(
    path: KabegameFsPath,
    data: Uint8Array,
    options?: KabegameFsWriteFileOptions,
  ): void;
  writeTextFile(
    path: KabegameFsPath,
    data: string | ReadableStream<string>,
    options?: KabegameFsWriteFileOptions,
  ): Promise<void>;
  writeTextFileSync(
    path: KabegameFsPath,
    data: string,
    options?: KabegameFsWriteFileOptions,
  ): void;
  truncate(path: string, len?: number): Promise<void>;
  truncateSync(path: string, len?: number): void;
  symlink(
    oldpath: KabegameFsPath,
    newpath: KabegameFsPath,
    options?: KabegameFsSymlinkOptions,
  ): Promise<void>;
  symlinkSync(
    oldpath: KabegameFsPath,
    newpath: KabegameFsPath,
    options?: KabegameFsSymlinkOptions,
  ): void;
  utime(path: KabegameFsPath, atime: number | Date, mtime: number | Date): Promise<void>;
  utimeSync(path: KabegameFsPath, atime: number | Date, mtime: number | Date): void;
  /** Always rejected because process-wide umask cannot be contained by the task VFS. */
  umask(mask?: number): number;
}

interface KabegameFfmpegProbeResult {
  readonly isVideo: boolean;
  readonly mimeType: string;
  readonly width: number;
  readonly height: number;
  readonly browserSafe: boolean;
}

interface KabegameFfmpegApi {
  muxStreams(inputs: string[], output: string): Promise<void>;
  probe(path: string): Promise<KabegameFfmpegProbeResult | null>;
}

/**
 * Host API exposed to Kabegame V8 crawler plugins.
 *
 * `Kabegame` is provided by the runtime. It is not imported from the SDK.
 *
 * @example
 * ```ts
 * export async function crawl(common: { base_url: string | null }) {
 *   await Kabegame.to(`${common.base_url}/posts`);
 *   const doc = await Kabegame.currentDocument();
 *   const href = doc?.querySelector(".icon-download")?.getAttribute("href");
 *   if (href) await Kabegame.downloadImage(new URL(href, await Kabegame.currentUrl()).href);
 * }
 * ```
 */
interface KabegameHostApi {
  /**
   * Private virtual filesystem for this V8 crawler task.
   *
   * Start paths with `Kabegame.fs.getRoot()`; the returned session handle expires when the task
   * ends. Do not persist virtual paths. This declaration describes the V8 superset; WebView
   * exposes only the smaller async path and file-handle subsets documented on `KabegameFsApi`.
   */
  readonly fs: KabegameFsApi;

  /** High-level media helpers operating only on paths owned by the current virtual filesystem. */
  readonly ffmpeg: KabegameFfmpegApi;

  /**
   * Navigate to a URL and push the fetched page onto the crawler page stack.
   *
   * Relative URLs are resolved against the current page when one exists.
   *
   * @returns The final response URL after request resolution.
   *
   * @example
   * ```ts
   * const finalUrl = await Kabegame.to("/posts?page=1");
   * console.log(finalUrl);
   * ```
   */
  to(url: string): Promise<string>;

  /**
   * Pop the current page from the crawler page stack.
   *
   * @example
   * ```ts
   * await Kabegame.to(postUrl);
   * await Kabegame.downloadImage(imageUrl);
   * await Kabegame.back();
   * ```
   */
  back(): Promise<void>;

  /**
   * Read the URL of the current page stack entry.
   *
   * @example
   * ```ts
   * const current = await Kabegame.currentUrl();
   * const absolute = new URL("/download", current).href;
   * ```
   */
  currentUrl(): Promise<string>;

  /**
   * Read the raw HTML of the current page stack entry.
   *
   * Prefer `currentDocument()` when you need DOM querying.
   *
   * @example
   * ```ts
   * const html = await Kabegame.currentHtml();
   * if (html.includes("Cloudflare")) Kabegame.warn("challenge page");
   * ```
   */
  currentHtml(): Promise<string>;

  /**
   * Parse the current page HTML into a DOM document.
   *
   * Returns `null` when the current page is missing or parsing fails.
   *
   * @example
   * ```ts
   * const doc = await Kabegame.currentDocument();
   * const title = doc?.querySelector("h1")?.textContent?.trim();
   * ```
   */
  currentDocument(): Promise<Document | null>;

  /**
   * Read response headers from the current page stack entry.
   *
   * @example
   * ```ts
   * const headers = await Kabegame.currentHeaders();
   * console.log(headers["content-type"]);
   * ```
   */
  currentHeaders(): Promise<Record<string, string>>;

  /**
   * Read this plugin's private persisted JSON object.
   *
   * Data is isolated per plugin id.
   *
   * @example
   * ```ts
   * const data = Kabegame.pluginData<{ cursor?: string }>();
   * if (data.cursor) await Kabegame.to(data.cursor);
   * ```
   */
  pluginData<T extends Record<string, KabegameJsonValue> = Record<string, KabegameJsonValue>>(): T;

  /**
   * Replace this plugin's private persisted JSON object.
   *
   * @example
   * ```ts
   * Kabegame.setPluginData({ cursor: nextPageUrl, updatedAt: Date.now() });
   * ```
   */
  setPluginData(map: Record<string, KabegameJsonValue>): void;

  /**
   * Set a request header used by subsequent host HTTP requests and `fetch`.
   *
   * @example
   * ```ts
   * Kabegame.setHeader("Cookie", "sitelang=zh-cn");
   * await Kabegame.to("/posts");
   * ```
   */
  setHeader(key: string, value: string): void;

  /**
   * Inject the persisted surf cookie for a host into this task's `Cookie` request header.
   *
   * When omitted, `host` is resolved from the plugin base URL. The cookie value is never
   * exposed to plugin code; the return value only reports whether injection succeeded.
   *
   * @example
   * ```ts
   * if (!Kabegame.requireCookie()) {
   *   Kabegame.warn("Please sign in to this site in Surf first");
   * }
   * ```
   */
  requireCookie(host?: string): boolean;

  /**
   * Remove a request header previously set through `setHeader`.
   *
   * @example
   * ```ts
   * Kabegame.delHeader("Cookie");
   * ```
   */
  delHeader(key: string): void;

  /**
   * Emit a warning-level task log.
   *
   * @example
   * ```ts
   * Kabegame.warn("download link not found");
   * ```
   */
  warn(message: string): void;

  /**
   * Add to task progress.
   *
   * Progress is clamped by the host and returned after update.
   *
   * @example
   * ```ts
   * Kabegame.addProgress(100 / imageUrls.length);
   * ```
   */
  addProgress(percentage: number): number;

  /**
   * Queue an image download through Kabegame's downloader.
   *
   * @example
   * ```ts
   * await Kabegame.downloadImage(imageUrl, {
   *   name: "sample",
   *   url: postUrl,
   *   metadata: { schema: 1, tags: ["sample"] },
   * });
   * ```
   */
  downloadImage(url: string, opts?: KabegameDownloadImageOptions | null): Promise<void>;

  /**
   * Insert plugin image metadata and return its row id.
   *
   * Use this when multiple downloads should share one metadata row, or when
   * metadata creation needs to happen before resolving the image URL.
   *
   * @example
   * ```ts
   * const metadataId = Kabegame.createImageMetadata({ schema: 1, title: "Post" });
   * await Kabegame.downloadImage(imageUrl, { metadata_id: Number(metadataId) });
   * ```
   */
  createImageMetadata(
    map: KabegameJsonValue,
    opts?: KabegameCreateImageMetadataOptions | null,
  ): bigint;
}

/**
 * Kabegame host object available in every V8 crawler plugin.
 *
 * @example
 * ```ts
 * await Kabegame.to("https://example.test/posts");
 * console.log(await Kabegame.currentUrl());
 * ```
 */
declare var Kabegame: KabegameHostApi;
