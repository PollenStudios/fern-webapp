import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export const signMessage = async (message: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.log(error);
    toast.error('Rejected');
  }
};
