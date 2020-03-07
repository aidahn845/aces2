import React from "react";
import {
  LOGIN_USER, LOGOUT_USER, FETCH_PROJECTS_DATA, FETCH_USERS_DATA, VIEW_PROJECTS, VIEW_ONE_PROJECT,
  FETCH_PROJECTS_GEOM, ADD_PROJECT_FILTER, REMOVE_PROJECT_FILTER, RESET_PROJECT_FILTERS, SET_VIEWPORT
} from "./actionTypes"
import { ROOT_URL, FILTER_NAME_CATEGORY, FILTER_NAME_MODE, FILTER_NAME_STATUS, FILTER_NAME_DISTRICT } from "../constants"

export const Store = React.createContext("");


/* project filters (multiple per filter possible, '|' delimited)
  category: aces
  mode: auto, bike, transit
  status: planning, implementation, active
  district: 1-7, turnpike, central office
*/
const initialViewport = {
  latitude: 28.15,
  longitude: -82.5,
  zoom: 6,
  bearing: 0,
  pitch: 0,
  transitionDuration: 500
};

const initialState = {
  users: [],
  user: null,
  projects: [],
  projectgeoms: [],
  projectFilters: [],
  visibleProjects: [],
  visibleProjectGeoms: [],
  project: null,
  viewport: initialViewport
};

const peopleDB = [
  {
    id: 1000, name: 'Vanko Antonov',
  }, {
    id: 1001, name: 'Juan Battle',
  }, {
    id: 1002, name: 'Megan Cott',
  }, {
    id: 1003, name: 'Julie Bond',
  }, {
    id: 1004, name: 'Omkar Dokur',
  }, {
    id: 1005, name: 'Lucy Deba Enomah',
  }, {
    id: 1006, name: 'Dennis Hinebaugh',
  }, {
    id: 1007, name: 'Jason Jackman',
  }, {
    id: 1008, name: 'Chanyoung Lee Ph.D.',
  }, {
    id: 1009, name: 'Stephanie Lewis',
  }, {
    id: 1010, name: 'Dr. Fred L. Mannering',
  }, {
    id: 1011, name: 'Nikhil Menon Ph.D.',
  }, {
    id: 1012, name: 'Lori Palaio',
  }
];

function devPackProjectData(projects) {
  return projects.map((proj, index) => {

    // img url
    var imgURL = proj.properties.desc_photo;
    if (imgURL && !imgURL.toLowerCase().startsWith('http')) {
      proj.properties.desc_photo = ROOT_URL + proj.properties.desc_photo;
    }

    // people
    var num = 1 + Math.floor(Math.random() * 10);
    let ppeople = [];
    for (let i = 0; i < num; i++) {
      var rnd = Math.floor(Math.random() * 12);
      var person = peopleDB[rnd];
      const match = ppeople.find(function (element) {
        return element.id == person.id;
      });
      if (!match)
        ppeople.push(person);
    }
    proj.properties['people'] = ppeople;

    // datasets
    let lineseries = [];
    for (let i = 0; i < 7; i++) {
      lineseries.push(Math.floor(Math.random() * 50));
    }
    let linechartData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      series: [lineseries]
    }

    let barseries = [];
    for (let i = 0; i < 12; i++) {
      barseries.push(50 + Math.floor(Math.random() * 950));
    }
    let barchartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      series: [barseries]
    }
    proj.properties['datasets'] = [linechartData, barchartData];

    return proj;
  });
}

function reducer(state, action) {
  var newFilters;

  console.log('reducer: ' + action.type);

  switch (action.type) {
    case FETCH_PROJECTS_DATA:
      // payload = projects

      let projects = devPackProjectData(action.payload);

      return {
        ...state, projects: projects, visibleProjects: Array.from(projects)
      };
    case FETCH_PROJECTS_GEOM:
      // payload = projects
      return {
        ...state, projectgeoms: action.payload, visibleProjectGeoms: Array.from(action.payload)
      };
    case SET_VIEWPORT:
      return {
        ...state, viewport: action.payload
      };
    case VIEW_PROJECTS:
      return {
        ...state, project: null, viewport: initialViewport
      };
    case VIEW_ONE_PROJECT:
      // payload = project
      // update viewport
      let proj = action.payload;
      let vp = {
        ...state.viewport,
        longitude: proj.geometry.coordinates[0],
        latitude: proj.geometry.coordinates[1],
        zoom: 14,
        transitionDuration: 500
      };
      return {
        ...state, project: action.payload, viewport: vp
      };
    case ADD_PROJECT_FILTER:
      // payload = filter
      newFilters = [...state.projectFilters, action.payload];
      return {
        ...state,
        projectFilters: newFilters,
        visibleProjects: filterProjects(state.projects, newFilters)
      };
      return state;
    case REMOVE_PROJECT_FILTER:
      // payload = updated filters
      return {
        ...state,
        projectFilters: action.payload,
        visibleProjects: filterProjects(state.projects, action.payload)
      };
    case RESET_PROJECT_FILTERS:
      // payload = null
      return {
        ...state,
        filters: [],
        visibleProjects: Array.from(state.projects)
      };
    default:
      return state;
  }
}

// todo: optimize
// within filter group, match any filter
function filterProjects(projects, filters) {
  let filtered = [];

  let statusFilters = filters.filter(function (element) {
    return element.name == 'status';
  });
  let categoryFilters = filters.filter(function (element) {
    return element.name == 'category';
  });
  let modeFilters = filters.filter(function (element) {
    return element.name == 'mode';
  });
  let districtFilters = filters.filter(function (element) {
    return element.name == 'district';
  });

  projects.forEach(project => {
    let statusMatch = statusFilters.length == 0;
    let categoryMatch = categoryFilters.length == 0;
    let modeMatch = modeFilters.length == 0;
    let districtMatch = districtFilters.length == 0;

    // 'and' among filter groups; 'or' within filter group
    for (let i = 0; i < statusFilters.length; i++) {
      let filter = statusFilters[i];
      if (projectIsMatch(project, filter)) {
        statusMatch = true;
        break;
      }
    }
    for (let i = 0; i < categoryFilters.length; i++) {
      let filter = categoryFilters[i];
      if (projectIsMatch(project, filter)) {
        categoryMatch = true;
        break;
      }
    }
    for (let i = 0; i < modeFilters.length; i++) {
      let filter = modeFilters[i];
      if (projectIsMatch(project, filter)) {
        modeMatch = true;
        break;
      }
    }
    for (let i = 0; i < districtFilters.length; i++) {
      let filter = districtFilters[i];
      if (projectIsMatch(project, filter)) {
        districtMatch = true;
        break;
      }
    }

    if (statusMatch && categoryMatch && modeMatch && districtMatch) {
      filtered.push(project);
    }
  });

  return filtered;
}

// ';' delimited
function projectIsMatch(project, filter) {
  var projectData;
  var vals;

  switch (filter.name) {
    case FILTER_NAME_CATEGORY: // one or more
      projectData = project.properties.category;
      vals = projectData.toLowerCase().split(';');
      if (vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    case FILTER_NAME_STATUS: // number
      if (filter.value == project.properties.status)
        return true;
      break;
    case FILTER_NAME_MODE: // one or more
      projectData = project.properties.mode;
      vals = projectData.toLowerCase().split(';');
      if (vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    case FILTER_NAME_DISTRICT: // one or more
      projectData = project.properties.district;
      vals = projectData.toLowerCase().split(';');
      if (vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    default:
      break;
  }
  return false;
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
