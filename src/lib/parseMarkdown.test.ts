import { parseMarkdown } from "./parseMarkdown";

describe("parseMarkdown", () => {
  it("keeps adjacent wallet headings as separate wallets when separators are missing", () => {
    const wallets = parseMarkdown(`
## [Vizor](https://vizor.cash/)
![logo](https://i.ibb.co/zhW2d2fV/Vizorphoto.png "Vizor")
- Devices: Desktop
- Operating System: macOS
- Wallet Support: Seed Phrase | Unified Address | Hardware
- Pools: Transparent | Sapling | Orchard
- Features: Automatic Shielding | Shielded Memo

## [Noir wallet](https://www.zknoir.com/)
![logo](https://global.discourse-cdn.com/zcash/original/3X/3/b/3b88be907de788f367f7993bc24eed726d63a0c6.jpeg)
- Devices: Web | Desktop
- Operating System: Browser
- Pools: Shielded | Transparent
- Features: Browser Extension

## [Leodex Wallet](https://leodex.io/)
![logo](https://leodex.io/assets/logo.webp)
- Devices: Web | Desktop
- Operating System: Browser | Windows | macOS
- Wallet Support: Seed Phrase | External Wallet
- Pools: Shielded | Transparent
- Features: Multi Coin | Cross-chain Swap
`);

    expect(wallets.map((wallet) => wallet.title)).toEqual([
      "Vizor",
      "Noir wallet",
      "Leodex Wallet",
    ]);
    expect(wallets.find((wallet) => wallet.title === "Vizor")?.imageUrl).toBe(
      "https://i.ibb.co/zhW2d2fV/Vizorphoto.png",
    );
    expect(wallets.find((wallet) => wallet.title === "Leodex Wallet")?.imageUrl).toBe(
      "https://leodex.io/assets/logo.webp",
    );
  });
});
