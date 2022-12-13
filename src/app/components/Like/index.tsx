import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ReactionTypes, useAddReactionMutation, useRemoveReactionMutation } from 'graphql/generated/types';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { WalletContext } from 'store/WalletContextProvider';
import { LoginModal } from '../Modal/LoginModal';

function Like({ publication, primary }: any) {
  const {
    currentProfileState: { currentProfile },
    isLoggedInState: { isLoggedIn },
  }: any = useContext(WalletContext);
  const isMirror = publication.__typename === 'Mirror';

  const [ifUserNotLoggedInShowModal, setIfUserNotLoggedInShowModal] = useState<boolean>(false);

  const [liked, setLiked] = useState((isMirror ? publication?.mirrorOf?.reaction : publication?.reaction) === 'UPVOTE');
  const [count, setCount] = useState(
    isMirror ? publication?.mirrorOf?.stats?.totalUpvotes : publication?.stats?.totalUpvotes,
  );

  const [addReaction] = useAddReactionMutation({
    onCompleted: () => {
      console.log('liked');
    },
    onError: (error: any) => {
      setLiked(!liked);
      setCount(count - 1);
      toast.error(error);
    },
    // update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => {
      console.log('unliked');
    },
    onError: (error: any) => {
      setLiked(!liked);
      setCount(count + 1);
      toast.error(error);
    },
  });

  const createLike = () => {
    if (!isLoggedIn) {
      return setIfUserNotLoggedInShowModal(true);
    }

    const variable = {
      variables: {
        request: {
          profileId: currentProfile?.id,
          reaction: ReactionTypes.Upvote,
          publicationId: isMirror ? publication?.mirrorOf?.id : publication?.id,
        },
      },
    };

    if (liked) {
      setLiked(false);
      setCount(count - 1);
      removeReaction(variable);
    } else {
      setLiked(true);
      setCount(count + 1);
      addReaction(variable);
    }
  };

  return (
    <>
      <LoginModal openModal={ifUserNotLoggedInShowModal} setIsLoading={setIfUserNotLoggedInShowModal} />
      <div className="flex items-center gap-1">
        <div
          onClick={createLike}
          className={`flex justify-center items-center  w-8 h-8 rounded-full cursor-pointer space-x-1 ${
            primary ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
          }`}
        >
          {liked ? (
            <HeartIconSolid className={`w-5 ${primary ? ' text-black' : 'text-white '}`} />
          ) : (
            <HeartIcon className={`w-5 ${primary ? 'text-primary' : 'text-white '}`} />
          )}
        </div>
        <div className={`w-5 ${primary ? 'text-primary' : 'text-white '}`}>{count}</div>
      </div>
    </>
  );
}

export default Like;
