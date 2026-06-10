import { CrystalCaseLibrary } from "@/components/crystal/CrystalCaseLibrary";
import { crystalCases, crystalProducts } from "@/lib/crystal-cases";

export default function Home() {
  return <CrystalCaseLibrary products={crystalProducts} cases={crystalCases} />;
}
