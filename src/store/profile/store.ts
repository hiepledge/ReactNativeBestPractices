import {flow, types} from 'mobx-state-tree';
import {Alert} from 'react-native';
import {ProfileInfo} from './model/profile-info';

const getProfile = (): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = {
        id: '5',
        name: 'hiepledge',
        bio: 'mobile developer',
      };
      resolve(data);
    }, 1500);
  });
};

const wait = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

export const ProfileStore = types
  .model('profile', {
    profileInfo: types.maybeNull(ProfileInfo),
    status: types.maybeNull(
      types.enumeration(['pending', 'loading', 'done', 'error']),
    ),
  })
  .actions(self => ({
    setProfileInfo: (profileInfo: typeof self.profileInfo) => {
      self.profileInfo = profileInfo;
    },
    getProfileInfo: flow(function* () {
      self.status = 'loading';
      try {
        const response = yield getProfile();
        self.profileInfo = response;
      } catch (e: any) {
        Alert.alert(e ? e.message : 'An error occurred');
      }
      self.status = 'done';
      yield wait();
      self.status = null;
    }),
  }))
  .actions(self => ({
    /**
     * Define a lifecycle method that fetches teams
     * when the store is initialized
     */
    afterCreate() {
      __DEV__ && console.log('ProfileStore created');
    },
  }))
  .views(self => ({
    get getName() {
      return self.profileInfo?.name || '';
    },
  }));
