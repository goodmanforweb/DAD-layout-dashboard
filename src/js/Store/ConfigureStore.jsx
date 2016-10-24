
import { createStore, applyMiddleware } from 'redux';

import { logger } from '../Middleware';
import rootReducer from '../Reducers';

export default function configureStore(initialState) {
  const create = window.devToolsExtension ?
   window.devToolsExtension()(createStore) : createStore;
  const createStoreWithMiddleware = applyMiddleware(
    logger
  )(create);
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../Reducers', () => {
      const nextReducer = require('../Reducers');

      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
