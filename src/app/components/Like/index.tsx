import { ReactionTypes, useAddReactionMutation, useRemoveReactionMutation } from 'graphql/generated/types';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { WalletContext } from 'store/WalletContextProvider';
import { LoginModal } from '../Modal/LoginModal';

function Like({ publication }: any) {
  const {
    currentProfileState: { currentProfile },
    isLoggedInState: { isLoggedIn },
  }: any = useContext(WalletContext);

  const [ifUserNotLoggedInShowModal, setIfUserNotLoggedInShowModal] = useState<boolean>(false);

  const [addReaction] = useAddReactionMutation({
    onCompleted: () => {
      console.log('liked');
    },
    onError: (error: any) => {
      toast.error(error);
    },
    // update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => {
      console.log('unliked');
    },
    onError: (error: any) => {
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
          publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id,
        },
      },
    };

    if (publication?.reaction === 'UPVOTE') {
      //   setLiked(false);
      //   setCount(count - 1);
      removeReaction(variable);
    } else {
      //   setLiked(true);
      //   setCount(count + 1);
      addReaction(variable);
    }
  };

  return (
    <>
      <LoginModal openModal={ifUserNotLoggedInShowModal} setIsLoading={setIfUserNotLoggedInShowModal} />

      <div onClick={createLike}>Like</div>
      <p>{publication?.stats?.totalUpvotes}</p>
    </>
  );
}

export default Like;
