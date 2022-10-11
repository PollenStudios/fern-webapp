import React from "react";

import { artworkPlaceHolderData } from "../Constants/Constants";
import ArtPreviewCard from "../Components/ArtPreviewCard";

type artworkCardPropsTypes = {
  img: string;
  name: string;
  artist: string;
};

const DiscoveryPage = () => {
  return (
    <div className="main-container mt-28">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
        {artworkPlaceHolderData.map(({ img, name, artist }: artworkCardPropsTypes) => (
          <div className="col-span-4" key={name}>
            <ArtPreviewCard img={img} name={name} artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryPage;