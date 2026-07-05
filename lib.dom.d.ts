/**
 * Minimal DOM node interface available in Kabegame V8 crawler plugins.
 *
 * @example
 * ```ts
 * const doc = new DOMParser().parseFromString("<h1>Hello</h1>", "text/html");
 * const node: Node | null = doc.querySelector("h1");
 * console.log(node?.textContent);
 * ```
 */
interface Node {
  /** Node name such as `#document`, `DIV`, or `#text`. */
  readonly nodeName: string;
  /** Text content for this node and its descendants. */
  textContent: string | null;
}

/**
 * Minimal element interface for DOM queries in crawler plugins.
 *
 * @example
 * ```ts
 * const link = document.querySelector("a.icon-download");
 * const href = link?.getAttribute("href");
 * ```
 */
interface Element extends Node {
  /** Uppercase HTML tag name, for example `A` or `DIV`. */
  readonly tagName: string;
  /** Serialized HTML of this element's children. */
  readonly innerHTML: string;
  /** Serialized HTML of this element and its children. */
  readonly outerHTML: string;
  /**
   * Read an attribute value.
   *
   * @example
   * ```ts
   * const href = element.getAttribute("href");
   * ```
   */
  getAttribute(name: string): string | null;
  /**
   * Return the first descendant matching a CSS selector.
   *
   * @example
   * ```ts
   * const title = element.querySelector("h1")?.textContent;
   * ```
   */
  querySelector(selector: string): Element | null;
  /**
   * Return all descendants matching a CSS selector.
   *
   * @example
   * ```ts
   * for (const image of element.querySelectorAll("img")) {
   *   console.log(image.getAttribute("src"));
   * }
   * ```
   */
  querySelectorAll(selector: string): NodeListOf<Element>;
}

/**
 * Parsed HTML document returned by `DOMParser` or `Kabegame.currentDocument()`.
 *
 * @example
 * ```ts
 * const doc = await Kabegame.currentDocument();
 * const download = doc?.querySelector(".icon-download")?.getAttribute("href");
 * ```
 */
interface Document extends Node {
  /** Root `<html>` element. */
  readonly documentElement: Element;
  /** Document body, or `null` for malformed/empty documents. */
  readonly body: Element | null;
  /**
   * Return the first element matching a CSS selector.
   *
   * @example
   * ```ts
   * const title = document.querySelector("title")?.textContent;
   * ```
   */
  querySelector(selector: string): Element | null;
  /**
   * Return all elements matching a CSS selector.
   *
   * @example
   * ```ts
   * const links = Array.from(document.querySelectorAll("a[href]"));
   * ```
   */
  querySelectorAll(selector: string): NodeListOf<Element>;
}

/**
 * Array-like DOM node list.
 *
 * @example
 * ```ts
 * const anchors = document.querySelectorAll("a");
 * for (let i = 0; i < anchors.length; i += 1) {
 *   console.log(anchors[i].textContent);
 * }
 * ```
 */
interface NodeListOf<TNode extends Node> {
  /** Number of nodes in the list. */
  readonly length: number;
  /** Return a node by index, or `null` when out of range. */
  item(index: number): TNode | null;
  [index: number]: TNode;
}

/**
 * HTML/XML parser constructor.
 *
 * Kabegame crawler plugins normally use `"text/html"` to parse fetched pages.
 *
 * @example
 * ```ts
 * const doc = new DOMParser().parseFromString(html, "text/html");
 * const imageUrl = doc.querySelector("img")?.getAttribute("src");
 * ```
 */
interface DOMParser {
  /**
   * Parse a string into a DOM document.
   *
   * @example
   * ```ts
   * const doc = new DOMParser().parseFromString("<main></main>", "text/html");
   * ```
   */
  parseFromString(source: string, mimeType: "text/html" | "text/xml" | "application/xml"): Document;
}

/**
 * Create a DOM parser.
 *
 * @example
 * ```ts
 * const parser = new DOMParser();
 * ```
 */
declare var DOMParser: {
  new (): DOMParser;
};
