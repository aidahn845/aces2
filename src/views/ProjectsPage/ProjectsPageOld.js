import React, {Component} from "react";
import {render} from 'react-dom';
import MapGL, { Source, Layer } from "react-map-gl";

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

const MAPBOX_TOKEN = "pk.eyJ1IjoieWh1YW5nNyIsImEiOiJjazJocjliaWEwdnd6M2hxZ2FnNHM3cDkwIn0.UQxOTkmbQTAv-e9El4zLKQ";
//const MAPBOX_TOKEN = "";

const useStyles = makeStyles(styles);

function ProjectsPage_old(props) {

  const { ...rest } = props;

  // 28.094113 (u+), -83.105280 (r+)
  /*const [viewport, setViewport] = React.useState({
    latitude: 28.15,
    longitude: -82.5,
    zoom: 6,
    bearing: 0,
    pitch: 0
  });*/

  const [viewport, setViewport] = React.useState({
    latitude: 28.15,
    longitude: -82.5,
    zoom: 6,
    bearing: 0,
    pitch: 0
  });

  /*state = {
    viewport: {
      latitude: 40.67,
      longitude: -103.59,
      zoom: 3,
      bearing: 0,
      pitch: 0
    }
  };*/

  const sourceRef = React.createRef();

  //_onViewportChange = viewport => this.setState({viewport});

  const handleMapClick = event => {
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;

    const mapboxSource = sourceRef.current.getSource();

    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      this.setViewport({
        ...this.state.viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  };

  //const {viewport} = this.state;


  const { container } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };


  const drawer = (
    <div>
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box>
      <div style={{
        position: 'relative', width: '100%', height: "65px", overflow: 'hidden', boxShadow:
          "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
      }}>
        <Header
          color="dark"
          fixed
          brand="FL ACES"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
      </div>
      <div>
        <Box display="flex" p={0}>
          <Box p={0} style={{ width: '100%', height: 'calc(100vh - 65px)' }}>
            {/*             <MapGL
              {...viewport}
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onViewportChange={setViewport}
              mapboxApiAccessToken={MAPBOX_TOKEN}

            />
 */}
            <MapGL
              {...viewport}
              width="100%"
              height="100%"
              mapStyle="mapbox://styles/mapbox/dark-v9"
              onViewportChange={setViewport}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              interactiveLayerIds={[clusterLayer.id]}
              onClick={handleMapClick}
            >
              <Source
                type="geojson"
                data="json/earthquakes.geojson"
                cluster={true}
                clusterMaxZoom={14}
                clusterRadius={50}
                ref={sourceRef}
              >
                <Layer {...clusterLayer} />
                <Layer {...clusterCountLayer} />
                <Layer {...unclusteredPointLayer} />
              </Source>

            </MapGL>

          </Box>
          <Box flexShrink={0} p={0} bgcolor="white" style={{
            width: '20vw',
            boxShadow: "-4px 0px 10px 0px #888888", position: 'relative', display: 'none'
          }}>
            projects list
          </Box>
        </Box>


        <Hidden smDown>
          <Paper color={lightBlue} style={{ position: 'absolute', top: '100px' }}><SearchIcon />larger screen</Paper>
        </Hidden>
        <Hidden smUp>
          <Paper color={pink} style={{ position: 'absolute', top: '100px' }}><SearchIcon />smaller screen</Paper>
        </Hidden>


      </div>


    </Box>
  );
}
