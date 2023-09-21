import React from 'react';
import {observer} from 'mobx-react';

import AnimatedBottomToast from '../../components/animated-bottom-toast/animated-bottom-toast';

import useRootStore from '../../hooks/use-root-store';

const LoadingView = observer(() => {
  const {teamStore} = useRootStore();
  return (
    <AnimatedBottomToast
      showToast={teamStore.status !== null}
      status={teamStore.status}
    />
  );
});

export default LoadingView;
