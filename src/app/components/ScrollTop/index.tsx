import React, {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import ProgressBar from 'utils/ProgressBar'

const ScrollTop = () => {
  const {pathname} = useLocation()
  useEffect(() => {
    // Run on every location change
    ProgressBar.start()
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [pathname])

  setTimeout(() => {
    // Run on every location change
    ProgressBar.finish()
  }, 1000)

  return <></>
}

export default ScrollTop
