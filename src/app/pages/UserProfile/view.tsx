import { useContext, useState } from 'react';
import { WalletContext } from 'store/WalletContextProvider';
import ArtBoardPosts from './UserArtBoards';
import Publications from './UserPublication';

function View({ isArtist }: any) {
  const {
    currentProfileState: { currentProfile },
  }: any = useContext(WalletContext);

  const [selectedTab, setSelectedTab] = useState(isArtist ? 'posts' : 'artBoards');

  return (
    <div className="col-span-4 pt-10 md:pt-auto md:pl-36">
      <div className="flex gap-4 border-b">
        {isArtist && (
          <p
            className={`heading-4 cursor-pointer ${selectedTab === 'posts' ? 'border-primary border-b-4' : ''}`}
            onClick={() => setSelectedTab('posts')}
          >
            Art Work
          </p>
        )}
        <p
          className={`heading-4 cursor-pointer ${selectedTab === 'artBoards' ? 'border-primary border-b-4' : ''}`}
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
