import React, { useContext } from "react";

import { artworkPlaceHolderData } from "../Constants/Constants";
import ArtPreviewCard from "../Components/ArtPreviewCard";
import { WalletContext } from "../Context/WalletContextProvider";
import { ExploreFeedDocument, PublicationSortCriteria, PublicationTypes } from "../Generated/types";
import { useQuery } from "@apollo/client";
import getIPFSLink from "../Lib/getIPFSLink";

import cardImg from "../Assets/Images/defaultlogo.png";
const DiscoveryPage = () => {
  // Variables
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    publicationTypes: [PublicationTypes.Post],
    noRandomize: true,
    limit: 20,
  };
  const { data } = useQuery(ExploreFeedDocument, {
    variables: { request },
  });

  console.log("data", data);
  return (
    <div className="main-container mt-28">
      <div className="grid sm:grid-cols-8 lg:grid-cols-12 gap-6">
        {data?.explorePublications.items.map((post, index) => (
          <div className="col-span-4" key={index}>
            <ArtPreviewCard art={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryPage;

{
  /* {recommendedProfilesData?.map((profile: any, index: React.Key | null | undefined) => (
          <div className="col-span-4" key={index}>
            <ArtPreviewCard profile={profile} />
          </div>
        ))} */
}

// <div key={index}>
//   <img
//     src={post.metadata.image != null ? getIPFSLink(post.metadata.image) : cardImg}
//     alt={post.id}
//     className="cursor-pointer object-cover rounded-t-3xl w-full h-96 text-white"
//   />
// </div>
