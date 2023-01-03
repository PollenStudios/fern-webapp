import config from 'utils/config';
import { useSwitchNetwork } from 'wagmi';
import { Button } from '../atoms/Buttons';
import { toast } from 'react-hot-toast';

function SwitchNetwork() {
  const { switchNetwork, isLoading } = useSwitchNetwork({
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSwitchNetwork = () => {
    if (switchNetwork) {
      switchNetwork(config.chainId);
    } else {
      toast.error('error in switching network chain');
    }
  };
  return <Button onClick={handleSwitchNetwork} name={isLoading ? 'Loading...' : 'Switch Network'} />;
}

export default SwitchNetwork;
