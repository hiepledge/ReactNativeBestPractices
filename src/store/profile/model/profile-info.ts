import {types} from 'mobx-state-tree';

export const ProfileInfo = types.model({
  id: types.identifier,
  name: types.maybe(types.string),
  bio: types.maybe(types.string),
});
