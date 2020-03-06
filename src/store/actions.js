import {LOGIN_USER, LOGOUT_USER, FETCH_PROJECTS_DATA, FETCH_USERS_DATA, FETCH_PROJECTS_GEOM,
  VIEW_PROJECTS, VIEW_ONE_PROJECT, ADD_PROJECT_FILTER, REMOVE_PROJECT_FILTER, RESET_PROJECT_FILTERS, SET_VIEWPORT} from "./actionTypes"
import {ROOT_URL} from "../constants"

// payload: projects
const PROJECTS_URL = ROOT_URL + "json/projects_data.geojson";
export const fetchProjectsData = async dispatch => {
  //console.log(FETCH_PROJECTS_DATA + " action started");

  const data = await fetch(PROJECTS_URL);
  const dataJSON = await data.json();
  return dispatch({
    type: FETCH_PROJECTS_DATA,
    payload: dataJSON.features
  });
};

const GEOM_URL = ROOT_URL + "json/projects_geom.geojson";
export const fetchProjectsGeom = async dispatch => {
  const data = await fetch(GEOM_URL);

  const dataJSON = await data.json();
  return dispatch({
    type: FETCH_PROJECTS_GEOM,
    payload: dataJSON.features
  });
};

// param: {filter name, filter data}
// payload: projectFilters
export const toggleProjectFilters = (filter, state, dispatch) => {
  // find filter from list
  // add or remove filter
  const filterActive = state.projectFilters.find(function(element) { 
    return element.name == filter.name && element.value == filter.value;
  });

  let dispatchObj = {
    type: ADD_PROJECT_FILTER,
    payload: filter
  };

  if (filterActive != undefined) {
    dispatchObj = {
      type: REMOVE_PROJECT_FILTER,
      payload: state.projectFilters.filter(function(element) { 
        return element.name != filter.name || element.value != filter.value;
      })
    }
  }

  return dispatch(dispatchObj);
};

// reset project filters
// payload: projectFilters ([])


// view project (fetch project data)
// param: project id
// payload: project
export const viewOneProject = (projectId, state, dispatch) => {
  if (state.project != null && state.project.properties.id == projectId)
    return {type: '', payload: null};
  
  // future: fetch project data from server
  var project = state.projects.find(function(element) {
      return element.properties.id == projectId;
  });

  let dispatchObj = {
    type: VIEW_ONE_PROJECT,
    payload: project
  };
  return dispatch(dispatchObj);
};

export const viewProjects = (state, dispatch) => {
  let dispatchObj = {
    type: VIEW_PROJECTS,
    payload: null
  };
  return dispatch(dispatchObj);
};

export const setViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: SET_VIEWPORT,
    payload: viewport
  };
  return dispatch(dispatchObj);
};

// login
// param: user
// payload: user


// logout
// param: -
// payload: null user


// 
