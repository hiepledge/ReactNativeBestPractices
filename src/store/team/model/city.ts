import {types} from 'mobx-state-tree';

export const City = types.model({
  id: types.identifier,
  name: types.maybeNull(types.string),
});
