import React from "react";
import { artworkPlaceHolderData } from "../Constants/Constants";


import ArtCard from "../Components/ArtPreviewCard";

const Discoverypage = () => {
  return (
    <div className="main-container mt-28">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
        {artworkPlaceHolderData.map(({ img, name, artist }) => (
          <div className="col-span-4">
            {" "}
            <ArtCard key={name} img={img} name={name} artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discoverypage;
