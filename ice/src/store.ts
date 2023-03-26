import { createStore } from 'ice';
import type { IStoreModels, IStoreRootState, IStoreDispatch } from 'ice';

import index from '@/models';

interface StoreModels extends IStoreModels {
  index: typeof index;
}
const storeModels: StoreModels = {
  index,
};

export default createStore(storeModels);
export type StoreState = IStoreRootState<typeof storeModels>;
export type StoreDispatch = IStoreDispatch<typeof storeModels>;
