import { useContext, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import ArtBoardPosts from './UserArtBoards';
import Publications from './UserPublication';

//The commented code below is for future purposes, so don't delete it

function View({ isArtist }: any) {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const [selectedTab, setSelectedTab] = useState(isArtist ? 'posts' : 'artBoards');
  // const [selectedTab, setSelectedTab] = useState('posts');

  const selectedTabClass = (condition: any) => {
    if (condition) return 'border-primary border-b-4';
    else return '';
  };

  return (
    <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
      <div className="flex gap-4 border-b mb-6">
        {isArtist && (
          <p
            className={`heading-5 cursor-pointer pb-4 ${selectedTabClass(selectedTab === 'posts')}`}
            onClick={() => setSelectedTab('posts')}
          >
            Art Work
          </p>
        )}
        <p
          className={`heading-5 cursor-pointer pb-4 ${selectedTabClass(selectedTab === 'artBoards')}`}
          onClick={() => setSelectedTab('artBoards')}
        >
          Art Board
        </p>
      </div>

      {selectedTab === 'posts' ? (
        <Publications currentProfile={currentProfile} />
      ) : (
        <ArtBoardPosts currentProfile={currentProfile} />
      )}
    </div>
  );
}

export default View;
