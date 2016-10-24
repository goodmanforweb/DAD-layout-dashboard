
import { handleActions } from 'redux-actions';

const initialState = [{
  titleName: 'barChart',
  titleProperty: 'barChart',
  dataSource: 'dataSource',
  chartProperty: 'chartProperty',
  chartParameter: 'chartParameter'
}];

export default handleActions({
  'edit title'(state, action) {
    return 'edit title';
  },

  'edit dataSource'(state, action) {
    return 'edit dataSource';
  },

  'edit chartProperty'(state, action) {
    return 'edit chartProperty';
  },

  'edit chartParameter'(state, action) {
    return 'edit chartParameter';
  }
}, initialState);
