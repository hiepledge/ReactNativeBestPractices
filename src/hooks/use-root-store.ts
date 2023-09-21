import {MobXProviderContext} from 'mobx-react';
import {useContext} from 'react';
import {RootStore} from '../store/root-store';

const useRootStore = (): RootStore => {
  const rootStore = useContext(MobXProviderContext).rootStore;
  return rootStore;
};

export default useRootStore;
