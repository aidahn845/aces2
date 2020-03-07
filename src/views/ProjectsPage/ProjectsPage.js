import React, { Component } from "react";
import { render } from 'react-dom';
import MapGL, { Source, Layer } from "react-map-gl";
import { useParams } from "react-router-dom";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/projectsPage.js";

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import { pink, red, lightBlue, grey, lightGreen, blueGrey } from "@material-ui/core/colors";
import SearchIcon from '@material-ui/icons/Search';
import Box from '@material-ui/core/Box';
import FilterPanel from "./FilterPanel";

import { Store } from "../../store/store"
import { fetchProjectsData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject, setViewport } from "../../store/actions"
import { ArrowBack } from "@material-ui/icons";
import DetailsPanel from "./DetailsPanel";
import ResultsPanel from "./ResultsPanel";

import { ROOT_URL, MAPBOX_TOKEN, HEADER_TITLE, STATUS_COLORS, STATUS_PLAN, STATUS_DESIGN, STATUS_IMPLEMENT, 
STATUS_LIVE, STATUS_ARCHIVE } from "../../constants"


const useStyles = makeStyles(styles);

export default function ProjectsPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { state, dispatch } = React.useContext(Store);

  let params = useParams();
  let projectId = 0;

  if (params.id != undefined && state.projects.length > 0) {
    projectId = parseInt(params.id);
    if (projectId > 0 && (state.project == null || state.project.properties.id != projectId)) {
      console.log("show project details: " + projectId);
      viewOneProject(projectId, state, dispatch);
    }
  }

  if (projectId == 0 && state.project != null) {
    viewProjects(state, dispatch);
  }

  const filtersProps = {
    projects: state.projects,
    visibleProjects: state.visibleProjects,
    projectFilters: state.projectFilters,
    state: { state, dispatch },
    toggleProjectFilters
  };
  const detailsProps = {
    state: { state, dispatch },
    viewProjects
  };
  const resultsProps = {
    projects: state.projects,
    visibleProjects: state.visibleProjects,
    state: { state, dispatch },
    viewOneProject,
    ...rest
  };

  const [_viewport, _setViewport] = React.useState(state.viewport);

  React.useEffect(
    () => {
      state.projects.length === 0 && fetchProjectsData(dispatch) 
      /*&& fetchProjectsGeom(dispatch)*/;
    },
    [state]
  );

  const sourceRef = React.useRef();

  const handleMapClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    if (!feature.properties.cluster) {
      // clicked on project
      console.log('view project ' + feature.properties.id);

      // change only if not current project
      if (projectId == 0)
        props.history.push(ROOT_URL + "projects/" + feature.properties.id);
      return;
    }

    const clusterId = feature.properties.cluster_id;

    const mapboxSource = sourceRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      let vp = {
        ..._viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom: zoom + 1,
        transitionDuration: 500
      };

      setViewport(vp, state, dispatch);
    });
  };

  const _onViewportChange = vp => {
    setViewport(vp, state, dispatch);
  }

  return (
    <Box>
      <div style={{
        position: 'relative', width: '100%', height: "65px", overflow: 'hidden', boxShadow:
          "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
      }}>
        <Header
          color="dark"
          fixed
          brand="FL A&middot;C&middot;E&middot;S"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
      </div>
      <div>
        <Box display="flex" p={0} style={{ width: '100%' }}>
          <Box p={0} style={{ width: state.project != null ? '50vw' : '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
            <MapGL
              {...state.viewport}
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onViewportChange={_onViewportChange}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
              onClick={handleMapClick}
            >
              <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.visibleProjects
                }}
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
                ref={sourceRef}
              >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
              </Source>

{/*               <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.visibleProjectGeoms
                }} 
                ref={sourceRef}
              >
                 <Layer {...geomLineLayer} />
                 <Layer {...geomPoingLayer} />
                 <Layer {...geomPolygonLayer} />
              </Source>
 */}
            </MapGL>
          </Box>
          <DetailsPanel {...detailsProps} />
        </Box>

        <ResultsPanel {...resultsProps} />
        <FilterPanel {...filtersProps} />


      </div>


    </Box>

  );

}


const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'projectdata',
  filter: ['has', 'point_count'],
  paint: {
    //'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 15, '#f28cb1'],
    'circle-color': '#9ABFC2',
    'circle-radius': ['step', ['get', 'point_count'], 25, 10, 40, 20, 50],
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'projectdata',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 16
  }
};

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'projectdata',
  filter: ['!', ['has', 'point_count']],
  layout: {
    //'text-field': 'name',
    //'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    //'text-size': 14
  },
  paint: {
    'circle-color': [
      'match',
      ['get', 'status'],
      STATUS_PLAN, STATUS_COLORS[STATUS_PLAN],
      STATUS_DESIGN, STATUS_COLORS[STATUS_DESIGN],
      STATUS_IMPLEMENT, STATUS_COLORS[STATUS_IMPLEMENT],
      STATUS_LIVE, STATUS_COLORS[STATUS_LIVE],
      STATUS_ARCHIVE, STATUS_COLORS[STATUS_ARCHIVE],
      /* other */ STATUS_COLORS[0]
    ],
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

const geomPolygonLayer = {
  id: 'geoms-polygon',
  type: 'fill',
  source: 'projectgeom',
  filter: ["==", ["geometry-type"], "Polygon"],
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#3288bd'],
        [1, '#66c2a5'],
        [2, '#abdda4'],
        [3, '#e6f598'],
        [4, '#ffffbf'],
        [5, '#fee08b'],
        [6, '#fdae61'],
        [7, '#f46d43'],
        [8, '#d53e4f']
      ]
    },
    'fill-opacity': 0.8
  }
};
const geomPointLayer = {
  id: 'geoms-point',
  type: 'circle',
  source: 'projectgeom',
  filter: ["==", ["geometry-type"], "Point"],
  paint: {
    'circle-color': 'red',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};
const geomLineLayer = {
  id: 'geoms-line',
  source: 'projectgeom',
  type: 'line',
  filter: ["==", ["geometry-type"], "LineString"],
  paint: {
    'line-width': 5,
    'line-color': '#0080ef'
  }
};