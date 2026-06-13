import { CrystalCaseLibrary } from "@/components/crystal/CrystalCaseLibrary";
import { crystalCases, crystalProducts } from "@/lib/crystal-cases";

const siteUrl = "https://box-cyan-one.vercel.app";

export default function Home() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "水晶手串 AI 商业视觉案例库",
    url: siteUrl,
    hasPart: crystalCases.map((caseItem, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: caseItem.title,
      url: `${siteUrl}/case/${caseItem.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CrystalCaseLibrary products={crystalProducts} cases={crystalCases} />
    </>
  );
}
