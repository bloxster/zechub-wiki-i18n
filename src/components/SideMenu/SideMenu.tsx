'use client';
import { matchIcons } from "@/constants/Icons";
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import Link from "next/link";
import { useState } from "react";
import {
  BiRightArrowAlt as Arrow,
  BiMenu as BurgerMenuIcon,
  BiSolidWallet as Wallet,
} from "react-icons/bi";
import { FaListAlt } from "react-icons/fa";
import { FiFile as FileIcon } from "react-icons/fi";
import { Icon } from "../UI/Icon";
import { MdPayment } from "react-icons/md";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/lib/localizedPath";

const getIconSize = (name: string): number | "tiny" | "small" | "medium" | "large" => {
  const sizes: Record<string, number | "tiny" | "small" | "medium" | "large"> = {
    Wallets: 24,                    
    Treasury: 22,                   
    "Using Zcash": 20,
    Guides: 20,
    "Zcash Organizations": 20,
    "Zcash Community": 20,
    "Zcash Tech": 20,
    "Privacy Tools": 20,
    "Raspberry pi 4 Zebra Node": 28,
    Contribute: 20,
    "Glossary & FAQ's": 18,
    "ZK Shielded Asset Platforms": 12,
    //"Cbdc": 24,
    // Add any other item name here, e.g.:
    // "Blockchain Explorers": 26,
    // "Shielded Pools": 18,
  };
  return sizes[name] ?? "small";   // default size for everything else
};

const images = [
  "/exchangetutorials.png",
  "/fullnodetutorials.png",
  "/usingzcashtutorials.png",
  "/wallettutorials.png",
];

interface MenuProps {
  folder: string;
  roots: string[];
}

const SideMenu = ({ folder, roots }: MenuProps) => {
  const { locale, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const root = roots.map((item) => item.slice(0, -3));
  const name = folder[0].toUpperCase() + folder.slice(1);
  const fold = getName(name);
  const folderLabel =
    {
      "Using Zcash": t.navigation?.usingZcash?.label,
      "Zcash Community": t.navigation?.zcashCommunity?.label,
      "Zcash Organizations": t.navigation?.organizations?.label,
      "Zcash Tech": locale === "it" ? "Tecnologia Zcash" : "Zcash Tech",
      "Start Here": locale === "it" ? "Inizia da Qui" : fold,
      "Privacy Tools": locale === "it" ? "Strumenti per la Privacy" : fold,
      "Guides": locale === "it" ? "Guide" : fold,
      "Tutorials": locale === "it" ? "Tutorial" : fold,
      "Research": locale === "it" ? "Ricerca" : fold,
      "Glossary & FAQ's": locale === "it" ? "Glossario e FAQ" : fold,
      "Zcash Use Cases": locale === "it" ? "Casi d'uso di Zcash" : fold,
      "Contribute": locale === "it" ? "Contribuisci" : fold,
    }[fold] ?? fold;
  const itemLabel = (itemName: string) =>
    ({
      "Developer Resources": locale === "it" ? "Risorse per sviluppatori" : "Developer Resources",
      "Development Fund": locale === "it" ? "Development Fund" : "Development Fund",
      "Network Upgrades": locale === "it" ? "Aggiornamenti di rete" : "Network Upgrades",
      "New User Guide": locale === "it" ? "Guida per nuovi utenti" : "New User Guide",
      "Using This Wiki": locale === "it" ? "Usare questa wiki" : "Using This Wiki",
      "What is ZEC and Zcash": locale === "it" ? "Che cosa sono ZEC e Zcash" : "What is ZEC and Zcash",
      "What is ZecHub": locale === "it" ? "Che cos'è ZecHub" : "What is ZecHub",
      "ZEC Use Cases": locale === "it" ? "Casi d'uso di ZEC" : "ZEC Use Cases",
      "Zcash Monetary Policy": locale === "it" ? "Politica monetaria di Zcash" : "Zcash Monetary Policy",
      "Zcash Resources": locale === "it" ? "Risorse Zcash" : "Zcash Resources",
      "Buying ZEC": t.navigation?.usingZcash?.buyingZec,
      Faucets: t.navigation?.usingZcash?.faucets,
      Testnet: "Testnet",
      Wallets: t.navigation?.usingZcash?.wallets,
      "Metamask Snap": t.navigation?.usingZcash?.metamaskSnap,
      Exchanges: t.navigation?.usingZcash?.exchanges,
      "Blockchain Explorers": t.navigation?.usingZcash?.blockExplorers,
      "Block Explorers": t.navigation?.usingZcash?.blockExplorers,
      "Shielded Pools": t.navigation?.usingZcash?.shieldedPools,
      "Transparent Exchange Addresses": t.navigation?.usingZcash?.transparentExchangeAddresses,
      Transactions: t.navigation?.usingZcash?.transactions,
      Memos: t.navigation?.usingZcash?.memos,
      "Mobile Top Ups": t.navigation?.usingZcash?.mobileTopUps,
      "Payment Request URIs": t.navigation?.usingZcash?.paymentRequestUris,
      "Recovering Funds": t.navigation?.usingZcash?.recoveringFunds,
      "Custodial Exchanges": t.navigation?.usingZcash?.exchanges,
      "Payment Processors": t.navigation?.usingZcash?.paymentProcessors,
      "Arborist Calls": t.navigation?.zcashCommunity?.arboristCalls,
      "Zcash Governance": t.navigation?.governance,
      "Community Blogs": t.navigation?.zcashCommunity?.communityBlogs,
      "Community Links": t.navigation?.zcashCommunity?.communityLinks,
      "Community Forum": t.navigation?.zcashCommunity?.communityForum,
      "Community Projects": t.navigation?.zcashCommunity?.communityProjects,
      "Zcash Global Ambassadors": t.navigation?.zcashCommunity?.globalAmbassadors,
      "Zcash Media": t.navigation?.zcashCommunity?.zcashMedia,
      ZCAP: t.navigation?.zcashCommunity?.zcap,
      "Zcash Podcasts": t.navigation?.zcashCommunity?.zcashPodcasts,
      "Zcash Ecosystem Security": t.navigation?.zcashCommunity?.ecosystemSecurity,
      "Cypherpunk Zero NFT": t.navigation?.zcashCommunity?.cypherpunkZeroNFT,
      "Zcon Archive": t.navigation?.zcashCommunity?.zconArchive,
      "Electric Coin Company": t.navigation?.organizations?.electricCoinCompany,
      "Zcash Foundation": t.navigation?.organizations?.zcashFoundation,
      "Zcash Community Grants": t.navigation?.organizations?.communityGrants,
      "Financial Privacy Foundation": t.navigation?.organizations?.financialPrivacyFoundation,
      "Shielded Labs": t.navigation?.organizations?.shieldedLabs,
      "Zingo Labs": t.navigation?.organizations?.zingoLabs,
      ZODL: "ZODL",
      Brand: t.navigation?.organizations?.brand,
      ZKAV: t.navigation?.organizations?.zkavClub,
      "ZKAV Club": t.navigation?.organizations?.zkavClub,
      "Crosslink Protocol": "Crosslink Protocol",
      FROST: "FROST",
      "Full Nodes": "Full Nodes",
      Halo: "Halo",
      "Lightwallet Nodes": "Lightwallet Nodes",
      "Pepper Sync": "Pepper Sync",
      "Post Quantum Security": "Post-Quantum Security",
      "Viewing Keys": "Viewing Keys",
      "ZAP1 Attestation Protocol": "ZAP1 Attestation Protocol",
      Zaino: "Zaino",
      "Zcash Shielded Assets": "Zcash Shielded Assets",
      "Zcash Wallet Syncing": "Zcash Wallet Syncing",
      "Zebra Full Node": "Zebra Full Node",
      "zk SNARKS": "zk-SNARKs",
      "Zgo Payment Processor": t.navigation?.guidesSubmenu?.zgoPaymentProcessor,
      "Free2z Live": t.navigation?.guidesSubmenu?.free2zLive,
      "Keystone Zashi": t.navigation?.guidesSubmenu?.keystoneZashi,
      "Maya Protocol": t.navigation?.guidesSubmenu?.mayaProtocol,
      "Nym VPN": t.navigation?.guidesSubmenu?.nymVpn,
      "Using ZEC in DeFi": t.navigation?.guidesSubmenu?.usingZecInDefi,
      "Using ZEC Privately": t.navigation?.guidesSubmenu?.usingZecPrivately,
      "Raspberry Pi 4 Full Node": t.navigation?.guidesSubmenu?.raspberryPiZcashdNode,
      "Raspberry pi5 Zebra Lightwalletd Zingo": t.navigation?.guidesSubmenu?.raspberryPi5ZebraLightwalletdZingo,
      "Akash Network Zebra": t.navigation?.guidesSubmenu?.akashNetwork,
      "Avalanche RedBridge": t.navigation?.guidesSubmenu?.avalancheRedbridge,
      "Zkool Multisig": t.navigation?.guidesSubmenu?.zkoolMultisig,
      "Ywallet FROST Demo": t.navigation?.guidesSubmenu?.ywalletFrostDemo,
      "Brave Wallet Guide": t.navigation?.guidesSubmenu?.braveWallet,
      "BTCPayServer Zcash Plugin": t.navigation?.guidesSubmenu?.btcPayServerPlugin,
      "Visualizing the Zcash Network": t.navigation?.guidesSubmenu?.visualizingZcashNetwork,
      "Visualizing Zcash Addresses": t.navigation?.guidesSubmenu?.visualizingZcashAddresses,
      "Zcash Devtool": t.navigation?.guidesSubmenu?.zcashDevtool,
      "Zcash Improvement Proposals": t.navigation?.guidesSubmenu?.zcashImprovementProposals,
      "Zingolib and Zaino Tutorial": t.navigation?.guidesSubmenu?.zingolibAndZainoTutorial,
      "Zenith Installation": t.navigation?.guidesSubmenu?.zenithInstallation,
      "Zero-Knowledge vs Decoys": t.navigation?.guidesSubmenu?.zeroKnowledgeVsDecoys,
    }[itemName] ?? itemName);

  return (
    <div className="relative flex flex-wrap items-center xl:items-start order-1 justify-between xl:flex-col">
      <button onClick={toggleMenu} className="xl:hidden flex cursor-pointer">
        <BurgerMenuIcon size={24} />{" "}
        <h3 className="ms-2 font-bold">{locale === "it" ? "Navigazione" : "Navigation"}</h3>
      </button>

      <div className="flex justify-end xl:justify-center w-auto order-2 xl:order-3">
        <Link
          href={localizedPath("/explore", locale)}
          className="flex items-center rounded-full font-bold px-4 py-2 hover:bg-[#1984c7]"
          style={{
            background: "#1984c7",
            fontWeight: "600",
            borderRadius: "0.4rem",
            color: "white",
          }}
        >
          {t.navigation?.explore ?? "Explore"}
          <Icon size={"medium"} icon={Arrow} />
        </Link>
      </div>

      <div
        className={`flex flex-col shrink-0 top-0 py-4 xl:items-center justify-start w-full px-3 order-3 xl:order-2 ${
          isMenuOpen ? "block mt-7" : "hidden xl:block"
        }`}
      >
        <h1 className="text-4xl font-bold mb-6"> {folderLabel}: </h1>
        <div>
          <ul>
            {root.map((item: any, i: any) => {
              if (getName(item) === "Wallets") return null;
              if (getName(item) === "Payment Processors") return null;
              if (getName(item) === "Custodial Exchanges") return null;
              return (
                <li
                  key={i}
                  className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-1`}
                >
                  <Link
                    href={`${localizedPath(`/${transformGithubFilePathToWikiLink(item)}`, locale)}#content`}
                  >
                    <div className={`flex items-center space-x-4`}>
                      <div className="flex-shrink-0">
                        <Icon
                          icon={matchIcons(fold, getName(item)) ?? FileIcon}
                          size={getIconSize(getName(item))}   // ← individual size!
                          className="text-current"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium ">
                          {item ? itemLabel(getName(item)) : ""}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold ">
                        <Icon icon={Arrow} size={16} />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}

            {/* Wallets (custom PNG support + individual size) */}
            {fold === "Using Zcash" && (
              <li className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}>
                <Link href={localizedPath("/wallets", locale)}>
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon
                        icon={matchIcons(fold, "Wallets")}
                        size={getIconSize("Wallets")}   // ← controlled here
                        className="text-current"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">{itemLabel("Wallets")}</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} size={16} />
                    </div>
                  </div>
                </Link>
              </li>
            )}

            {/* Custodial Exchanges & Payment Processors (same pattern) */}
            {fold === "Using Zcash" && (
              <li className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}>
                <Link href={localizedPath("/using-zcash/custodial-exchanges", locale)}>
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon
                        icon={matchIcons(fold, "Custodial Exchanges") ?? FaListAlt}
                        size={getIconSize("Custodial Exchanges")}
                        className="text-current"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">{itemLabel("Custodial Exchanges")}</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} size={16} />
                    </div>
                  </div>
                </Link>
              </li>
            )}

            {fold === "Using Zcash" && (
              <li className={`my-3 hover:scale-110 hover:underline hover:cursor-pointer py-3`}>
                <Link href={localizedPath("/payment-processors", locale)}>
                  <div className={`flex items-center space-x-4`}>
                    <div className="flex-shrink-0">
                      <Icon
                        icon={matchIcons(fold, "Payment Processors") ?? MdPayment}
                        size={getIconSize("Payment Processors")}
                        className="text-current"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium ">{itemLabel("Payment Processors")}</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold ">
                      <Icon icon={Arrow} size={16} />
                    </div>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
