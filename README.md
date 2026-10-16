# @kabegame/types

TypeScript types for [Kabegame](https://github.com/kabegame/kabegame) crawler plugins.

Kabegame runs V8 plugins in its own runtime, not in Node.js or a browser.
This package tells TypeScript which globals exist there:

- The `Kabegame` host API: `Kabegame.to`, `Kabegame.downloadImage`, `Kabegame.fs`, `Kabegame.ffmpeg`, and more.
- Web globals: `fetch`, `URL`, `crypto`, `DOMParser`, and others.
- Function types for metadata migration: `migrate`, `provideLabels`, `provideSearchTextList`.

The package only contains `.d.ts` files. It adds no code to your plugin.

## Install

```bash
npm install -D @kabegame/types
```

## Use

Add it to `types` in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["ES2022"],
    "types": ["@kabegame/types"]
  }
}
```

Do not add `"DOM"` to `lib`. The runtime is not a browser.

## Links

- Kabegame: https://github.com/kabegame/kabegame
- Plugin SDK: [@kabegame/plugin-sdk](https://www.npmjs.com/package/@kabegame/plugin-sdk)
- Official plugins: https://github.com/kabegame/crawler-plugins
