import {types} from 'mobx-state-tree';

export const City = types.model({
  id: types.maybeNull(types.number),
  name: types.maybeNull(types.string),
});
