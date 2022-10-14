import React from "react";

import { artworkPlaceHolderData } from "../Constants/Constants";
import ArtPreviewCard from "../Components/ArtPreviewCard";

const DiscoveryPage = () => {
  return (
    <div className="main-container mt-28 h-screen">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
        {artworkPlaceHolderData.map(({ img, artName, artistName, likes, share }, index) => (
          <div className="col-span-4" key={artName + index}>
            <ArtPreviewCard img={img} artName={artName} artistName={artistName} likes={likes} share={share} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryPage;
