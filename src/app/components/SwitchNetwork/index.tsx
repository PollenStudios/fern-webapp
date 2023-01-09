import config from 'utils/config'
import {useSwitchNetwork} from 'wagmi'
import React from 'react'

import {toast} from 'react-hot-toast'
import {Loader} from '../atoms/Loader'

function SwitchNetwork() {
  const {switchNetwork, isLoading} = useSwitchNetwork({
    onError(error) {
      toast.error(error.message)
    },
  })

  const handleSwitchNetwork = () => {
    if (switchNetwork) {
      switchNetwork(config.chainId)
    } else {
      toast.error('error in switching network chain')
    }
  }
  return (
    <button
      className='heading-6 w-full sm:w-auto px-3 py-2 sm:px-6 sm:py-3 border text-base font-medium rounded-full shadow-sm text-white focus:outline-none bg-primary'
      onClick={handleSwitchNetwork}
    >
      {isLoading ? (
        <div className='w-[6vw]'>
          <Loader />
        </div>
      ) : (
        'Switch Network'
      )}
    </button>
  )
}

export default SwitchNetwork
