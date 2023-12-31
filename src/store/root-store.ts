import {Instance, types} from 'mobx-state-tree';

import {TeamStore} from './team/store';
import {ProfileStore} from './profile/store';

// thanks to -> https://github.com/radiosilence/HedgeSonic/blob/33c675b6105dce50523effce5a01582163575f4e/app/App.tsx

const RootStore = types
  .model('root', {
    teamStore: types.optional(TeamStore, {teams: []}),
    profileStore: types.optional(ProfileStore, {}),
  })
  .actions(self => ({
    /**
     * Define a lifecycle method that fetches teams
     * when the store is initialized
     */
    afterCreate() {
      __DEV__ && console.log('RootStore created');
      self.teamStore.getTeams();
      self.profileStore.getProfileInfo();
    },
  }));

export type RootStore = Instance<typeof RootStore>;

export const rootStore = RootStore.create({});
