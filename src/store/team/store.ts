import {flow, types} from 'mobx-state-tree';
import {Alert} from 'react-native';

import {Team} from './model/team';

const getTeam = (): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        {
          id: 2,
          region: 'HCMC',
          name: 'S',
          imageUrl: null,
          capacity: null,
          strategy: 'rebuilding',
          city: {
            id: 1,
            name: 'HCMC',
          },
        },
        {
          id: 1,
          city: null,
          region: 'HCMC',
          name: 'F',
          imageUrl: null,
          capacity: 1,
          strategy: 'rebuilding',
        },
      ];
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

export const TeamStore = types
  .model('team', {
    teams: types.array(Team),
    status: types.enumeration(['pending', 'loading', 'done', 'error', '']),
  })
  .actions(self => ({
    setTeams: (teams: typeof self.teams) => {
      self.teams = teams;
    },
    setStatus: (status: typeof self.status) => {
      self.status = status;
    },
    getTeams: flow(function* () {
      self.status = 'loading';
      try {
        const response = yield getTeam();
        self.teams = response;
      } catch (e: any) {
        Alert.alert(e ? e.message : 'An error occurred');
      }
      self.status = 'done';
      yield wait();
      self.status = '';
    }),
  }))
  .actions(self => ({
    /**
     * Define a lifecycle method that fetches teams
     * when the store is initialized
     */
    afterCreate() {
      __DEV__ && console.log('TeamStore created');
    },
  }))
  .views(self => ({
    get sortedTeams() {
      return self.teams.slice().sort((a, b) => {
        return a.id < b.id ? -1 : 1;
      });
    },
  }));
