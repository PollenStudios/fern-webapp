import type {ApolloCache} from '@apollo/client'
import {useMutation} from '@apollo/client'

import toast from 'react-hot-toast'
import {BroadcastDocument} from 'graphql/generated/types'

interface Props {
  onCompleted?: (data: any) => void
  update?: (cache: ApolloCache<any>) => void
}

const useBroadcast = ({
  onCompleted,
  update,
}: Props): {broadcast: any; data: any; loading: boolean} => {
  const [broadcast, {data, loading}] = useMutation(BroadcastDocument, {
    onCompleted,
    update,
    onError: (error) => {
      if (error.message) {
        toast.error(error.message)
      }
    },
  })

  return {
    broadcast: ({request}: any) => broadcast({variables: {request}}),
    data,
    loading,
  }
}

export default useBroadcast
