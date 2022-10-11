import React from "react";

import { card } from "../Constant";

import ArtCard from "../Components/ArtCard";

const Discoverypage = () => {
  return (
    <div className="main-container mt-28">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
        {card.map(({ img, name, artist }) => (
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
