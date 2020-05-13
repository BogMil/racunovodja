import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import {
  increment,
  decrement,
  incrementIfOdd,
  incrementAsync
} from '../actions/counter';
import { racunovodjaStoreType } from '../reducers/types';

function mapStateToProps(state: racunovodjaStoreType) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(
    {
      increment,
      decrement,
      incrementIfOdd,
      incrementAsync
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
