import React from 'react'
import Modal from '.'
import {Button} from '../atoms/Buttons'

type Props = {
  openRefreshModal: boolean
  setOpenRefreshModal: (openRefreshModal: boolean) => void
  setOpenRefreshModalFalse?: (openRefreshModalFalse: boolean) => void
}

function RefreshModal({openRefreshModal}: Props) {
  return (
    <Modal open={openRefreshModal} setOpen={() => {}}>
      <div>
        <div className='flex justify-between items-center border-b pb-2'>
          <p className='heading-5 sm:heading-5'>Updated</p>
          {/* <XMarkIcon
            className="w-8 h-8 cursor-pointer rounded-full hover:bg-gray-200 p-1"
            onClick={() => setOpenRefreshModal(false)}
          /> */}
        </div>

        <div className='my-3 text-left sm:mt-5'>
          <p className='paragraph-2 sm:paragraph-1'>
            Data has been updated, Please refresh the page.
          </p>
        </div>

        <div className='w-full flex justify-end'>
          <Button name='Refresh' onClick={() => window.location.reload()} />
        </div>
      </div>
    </Modal>
  )
}

export default RefreshModal
