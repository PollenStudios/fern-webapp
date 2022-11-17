import { apiRoutes } from 'API/apiRoutes';
import axios from 'axios';
import forge from 'node-forge';
import toast from 'react-hot-toast';
import config from './config';

const generateNonce = async (userName: string, walletAddress: string, profileId: string) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: config.backendUriLocal + apiRoutes.generateNonce,
      data: {
        username: userName,
        wallet_address: walletAddress,
        lens_profile: profileId,
      },
    });

    const { otp } = data;
    var publicKey = forge.pki.publicKeyFromPem(config?.public_Key ? config?.public_Key : '');

    var secretMessage = `${userName}@${profileId}@${otp}`;
    var encrypted = publicKey.encrypt(secretMessage, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(secretMessage),
    });
    var base64 = forge.util.encode64(encrypted);
    const generateTokenResult = await generateToken(base64, walletAddress);
    localStorage.setItem('backendToken', generateTokenResult.token);
    return generateTokenResult;
  } catch (error) {
    console.log(error);
  }
};
const generateToken = async (key: string, walletAddress: string) => {
  try {
    const { data } = await axios({
      method: 'post',
      url: config.backendUriLocal + apiRoutes.generateToken,
      data: {
        encoded_data: key,
        wallet_address: walletAddress,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    toast.error('login is not successful');
    return error;
  }
};
export const createUser = async (formData: FormData) => {
  try {
    const data = await axios({
      method: 'post',
      url: config.backendUriLocal + apiRoutes.userProfile,
      data: formData,
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const userProfileLens = async (id: string | undefined) => {
  try {
    const { data } = await axios({
      method: 'get',
      url: config.backendUriLocal + apiRoutes.userProfile + id + '/',
    });
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// export const getToken = async ({
//   userName,
//   walletAddress,
//   profileId,
// }: {
//   userName: string;
//   walletAddress: string;
//   profileId: string;
// }) => {
//   try {
//     const { data } = await axios({
//       method: 'post',
//       url: config.backendUriLocal + '/get-token/',
//       data: {
//         username: userName,
//         wallet_address: walletAddress,
//         lens_profile: profileId,
//       },
//     });
//     // console.log(data);
//     localStorage.setItem('backendToken', data.token);

//     return data;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };
export const getBackendProfile = async () => {
  try {
    const token = localStorage.getItem('backendToken');
    const { data } = await axios({
      method: 'get',
      url: config.backendUriLocal + apiRoutes.userProfileMe,
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
