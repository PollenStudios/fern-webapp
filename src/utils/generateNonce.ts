import axios from 'axios';
import forge from 'node-forge';
import config from './config';

const generateNonce = async (userName: string, walletAddress: string, profileId: string) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: config.backendUri + '/generate-nonce/',
      data: {
        username: userName,
        wallet_address: walletAddress,
        lens_profile: profileId,
      },
    });

    const { otp, public_key } = data;
    var publicKey = forge.pki.publicKeyFromPem(public_key);

    var secretMessage = `${userName}@${profileId}@${otp}`;
    var encrypted = publicKey.encrypt(secretMessage, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(secretMessage),
    });
    var base64 = forge.util.encode64(encrypted);
    const generateTokenResult = await generateToken(base64, walletAddress);
    // console.log(generateTokenResult.token);
    localStorage.setItem('backendToken', generateTokenResult.token);
  } catch (error) {
    console.log(error);
  }
};
const generateToken = async (key: string, walletAddress: string) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: config.backendUri + '/generate-token/',
      data: {
        encoded_data: key,
        wallet_address: walletAddress,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const createUser = async (formData: FormData) => {
  try {
    const data = await axios({
      method: 'post',
      url: config.backendUri + '/user-profile/',
      data: formData,
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getToken = async ({
  userName,
  walletAddress,
  profileId,
}: {
  userName: string;
  walletAddress: string;
  profileId: string;
}) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: config.backendUri + '/get-token/',
      data: {
        username: userName,
        wallet_address: walletAddress,
        lens_profile: profileId,
      },
    });
    // console.log(data);
    localStorage.setItem('backendToken', data.token);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getBackendProfile = async () => {
  try {
    const token = localStorage.getItem('backendToken');
    const { data } = await axios({
      method: 'get',
      url: config.backendUri + '/user-profile/me/',
      headers: {
        Authorization: `TOKEN ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export default generateNonce;
