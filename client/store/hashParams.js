import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_HASH = 'GET_HASH';

/**
 * INITIAL STATE
 */
const userHash = {};

/**
 * ACTION CREATORS
 */
const getHash = hashParams => ({type: GET_HASH, hashParams});

/**
 * THUNK CREATORS
 */
export const getHashParams = () => dispatch => {
    const hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return dispatch(getHash(hashParams));
  }


/**
 * REDUCER
 */
export default function(state = userHash, action) {
  switch (action.type) {
    case GET_HASH:
      return action.hashParams
    default:
      return state
  }
}