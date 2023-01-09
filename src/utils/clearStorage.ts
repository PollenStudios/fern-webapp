import config from './config'

const clearStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('backendToken')
  localStorage.removeItem(config.f3rnStore)
}
export default clearStorage
