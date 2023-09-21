import {types} from 'mobx-state-tree';

import {City} from './city';

export const Team = types.model({
  id: types.number,
  city: types.maybeNull(City),
  region: types.maybeNull(types.string),
  name: types.maybeNull(types.string),
  imageUrl: types.maybeNull(types.string),
  capacity: types.maybeNull(types.number),
  strategy: types.maybeNull(
    types.enumeration('strategy', ['rebuilding', 'contending']),
  ),
});
