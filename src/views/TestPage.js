import React, { Fragment } from "react";
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
import { List, ListItem, Button } from '@material-ui/core';
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

import { Store } from "../store/store"
import { fetchProjectsData, toggleProjectFilters, viewProjects, viewOneProject, setViewport } from "../store/actions"
import { ArrowBack } from "@material-ui/icons";
import DetailsPanel from "./ProjectsPage/DetailsPanel";

import {
  MAPBOX_TOKEN, HEADER_TITLE, STATUS_COLORS, STATUS_PLAN, STATUS_DESIGN, STATUS_IMPLEMENT,
  STATUS_LIVE, STATUS_ARCHIVE
} from "../constants"


const useStyles = makeStyles(styles);

export default function TestPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { state, dispatch } = React.useContext(Store);

  React.useEffect(
    () => {
      state.projects.length === 0 && fetchProjectsData(dispatch);
    },
    [state]
  );

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

  const handleProjectClick = (project) => {
    //console.log('view project ' + project.properties.id);
    //props.history.push("/projects/" + feature.properties.projectid);
    //viewProject(project, state, dispatch);
    viewOneProject(project.properties.id, state, dispatch);
  };

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
      <Box display="flex">
{/*           <List style={{ boxShadow: '0', padding: '0', margin: '5px 0 0 0', width: '200px' }}>
            {
              state.projects.map((proj, index) => {
                return (
                  <Fragment>
                    {index > 0 ? <Divider /> : ''}
                    <ListItem style={{ boxShadow: '0', padding: '5px 10px', margin: '0' }} key={proj.properties.id}>
                      <Button onClick={() => handleProjectClick(proj)}>
                        {proj.properties.id} - {proj.properties.name}
                      </Button>
                    </ListItem>
                  </Fragment>
                );
              })
            }
          </List>
 */}          <DetailsPanel {...detailsProps} />
      </Box>
    </Box>
  );
}

