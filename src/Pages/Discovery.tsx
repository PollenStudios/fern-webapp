import React from "react";

import { artworkPlaceHolderData } from "../Constants/Constants";
import ArtPreviewCard from "../Components/ArtPreviewCard";

const DiscoveryPage = () => {
  return (
    <div className="main-container mt-28">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
<<<<<<< HEAD
<<<<<<< HEAD
        {artworkPlaceHolderData.map(({ img, name, artist }: artworkCardPropsTypes) => (
          <div className="col-span-4" key={name}>
            <ArtPreviewCard img={img} name={name} artist={artist} />
=======
        {artworkPlaceHolderData.map(({ img, artName, artistName }, index) => (
          <div className="col-span-4" key={artName + index}>
            <ArtPreviewCard img={img} artName={artName} artistName={artistName} />
>>>>>>> 681a6df (variable name fixes)
=======
        {artworkPlaceHolderData.map(({ img, artName, artistName, likes, share }, index) => (
          <div className="col-span-4" key={artName + index}>
            <ArtPreviewCard img={img} artName={artName} artistName={artistName} likes={likes} share={share} />
>>>>>>> 92ecd29 (modification in card)
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryPage;
