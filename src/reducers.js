﻿import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import { RECEIVE_PROFILE, RECEIVE_POSITIONS, RECEIVE_WORLD, RECEIVE_MAPSETTINGS, RECEIVE_RIDERS } from './actions/fetch';
import { RECEIVE_LOGINTYPE, RECEIVE_LOGINFAILURE } from './actions/login';
import { RECEIVE_HOST } from './actions/host';
import {
  TOGGLE_GHOSTS, TOGGLE_ADDGHOST, CHANGED_RIDER, RECEIVE_ACTIVITIES, CHANGED_ACTIVITY,
  RECEIVE_GHOSTS, ADDING_GHOST, ADDED_GHOST, CHANGED_GHOST,
  REQUESTING_REGROUP, RECEIVE_REGROUP, RECEIVE_ACTIVITY, RESET_GHOSTS
} from './actions/ghosts';
import { SET_MENU_STATE } from './actions/summary';

import { COOKIE_WARNING } from './actions/cookie-warning'

function world(state = { positions: [] }, action) {
  switch (action.type) {
    case RECEIVE_WORLD:
      const { worldId, positions } = action.data;

      const newState = { worldId };
      if (positions) newState.positions = positions;

      return Object.assign({}, state, newState);
    case RECEIVE_POSITIONS:
      return Object.assign({}, state, {
        positions: action.data
      });
  default:
    return state;
  }
}

function login(state = {}, action) {
  switch (action.type) {
    case RECEIVE_LOGINFAILURE:
      return Object.assign({}, state, {
        error: action.data
      })
    case RECEIVE_LOGINTYPE:
      return Object.assign({}, state, {
        user: action.data
      })
    default:
      return state;
  }
}

const defaultEnv = {
    electron: navigator.userAgent.toLowerCase().indexOf('electron') !== -1,
    analytics: (window.ga && window.ga.trackingId) ? { trackingId: window.ga.trackingId } : {},
    cookieWarning: false
}

function environment(state = defaultEnv, action) {
  switch (action.type) {
    case COOKIE_WARNING:
      return Object.assign({}, state, {
        cookieWarning: action.value
      })
    default:
      return state;
  }
}

const defaultGhosts = {
	ghosts: [],
  showButton: false,
  show: false,
  addingGhost: false,
  riderId: null,
	loadingActivities: false,
  activities: [],
  activityId: null,
  waitingAddGhost: false,
  ghostId: null,
	requestingRegroup: false,
  displayActivity: null
}

function ghosts(state = defaultGhosts, action) {
  switch (action.type) {
    case RECEIVE_GHOSTS:
      return Object.assign({}, state, {
        ghosts: action.data,
        showButton: action.showButton
      });
    case TOGGLE_GHOSTS:
      return Object.assign({}, state, {
				show: !state.show,
        activityId: null,
        ghostId: null,
        displayActivity: null
      });
    case TOGGLE_ADDGHOST:
      return Object.assign({}, state, {
        addingGhost: !state.addingGhost,
        activityId: null,
        ghostId: null,
        displayActivity: null
      });
    case CHANGED_RIDER:
      return Object.assign({}, state, {
        riderId: action.riderId,
        loadingActivities: true,
        activities: [],
        activityId: null
      });
		case RECEIVE_ACTIVITIES:
      return Object.assign({}, state, {
        loadingActivities: false,
        activities: action.data
      });
    case CHANGED_ACTIVITY:
      return Object.assign({}, state, {
				activityId: action.activityId,
        displayActivity: null
      });
    case ADDING_GHOST:
      return Object.assign({}, state, {
        waitingAddGhost: true
      });
    case ADDED_GHOST:
      return Object.assign({}, state, {
        waitingAddGhost: false,
        addingGhost: false,
        activityId: null,
        ghostId: null,
        displayActivity: null
      });
    case CHANGED_GHOST:
      return Object.assign({}, state, {
        ghostId: action.ghostId,
        displayActivity: null
      });
    case REQUESTING_REGROUP:
      return Object.assign({}, state, {
        requestingRegroup: true
      });
		case RECEIVE_REGROUP:
      return Object.assign({}, state, {
        requestingRegroup: false
      });
    case RECEIVE_ACTIVITY:
      return Object.assign({}, state, {
        displayActivity: action.data
      });
    case RESET_GHOSTS:
      return Object.assign({}, state, {
        ghosts: [],
        show: false,
        addingGhost: false,
        riderId: null,
        loadingActivities: false,
        activities: [],
        activityId: null,
        ghostId: null,
        displayActivity: null
      });
    default:
      return state;
  }
}

function summary(state = { showingMenu: false }, action) {
  switch (action.type) {
    case SET_MENU_STATE:
      return Object.assign({}, state, {
        showingMenu: action.visible
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  profile: createReducer(RECEIVE_PROFILE),
  mapSettings: createReducer(RECEIVE_MAPSETTINGS),
  riders: createReducer(RECEIVE_RIDERS, []),
  world,
  login,
  environment,
	ghosts,
  summary,
  host: createReducer(RECEIVE_HOST),
  routing: routerReducer
})

function createReducer(actionType, defaultState = {}) {
  return function reducer(state = defaultState, action) {
    switch (action.type) {
      case actionType:
        return action.data;
      default:
        return state;
    }
  }
}

export default rootReducer
