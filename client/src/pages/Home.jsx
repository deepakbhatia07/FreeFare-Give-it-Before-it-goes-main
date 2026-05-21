import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CommunityImpact from "../components/CommunityImpact";
import NewArrivals from "../components/NewArrivals";
import ShareItemModal from "../components/ShareItemModal";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="relative">
      {/* Blur the page when modal is open */}
      <div className={showShare ? "filter blur-sm pointer-events-none" : ""}>
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowShare={setShowShare} // pass setter to HeroSection
        />
        <CommunityImpact />
        <NewArrivals searchQuery={searchQuery} />
      </div>

      {/* Modal at top-level, full-page overlay */}
      {showShare && <ShareItemModal closeModal={() => setShowShare(false)} />}
    </div>
  );
}
