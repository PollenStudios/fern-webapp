import React from 'react'

import {Routes} from 'react-router-dom'

const PublicRoute = ({children}: any) => {
  return <Routes>{children}</Routes>
}
export default PublicRoute
