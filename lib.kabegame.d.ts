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
