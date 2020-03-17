import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import MaterialTable from "material-table";
import ImageUploader from 'react-images-upload';
import MapGL, { Source, Layer, NavigationControl, ScaleControl } from "react-map-gl";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import {
  List, ListItem, Box, Paper, Button, Divider, ListItemIcon, ListItemText,
  Stepper, Step, StepLabel, Typography, Grid, TextField, FormControl, FormGroup, FormLabel, FormControlLabel,
  Checkbox, Switch, Fab
} from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@material-ui/icons';
import { NavLink, Link } from "react-router-dom";
import * as Constants from "../../constants"
import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";
import { Store } from "../../store/store"
import { dashboardProjects, dashboardUsers } from "./data"
import DashboardNav from "./DashboardNav"
import GridItem from "components/Grid/GridItem";

//const useStyles = makeStyles(styles);


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Basic Information', 'Location', 'Team Members', 'Data Files'];
}


export default function UserView(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin } = useUserState();
  const userDispatch = useUserDispatch();

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const user = dashboardUsers.find(function (element) {
    return element.id == props.userId;
  });

  const isNewUser = user == undefined;

  return (
    <Box style={{ width: '100%', overflow: 'auto', padding: '10px 20px 20px 20px', minHeight: 'calc(100vh - 150px)' }} >

      <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>
        {user ? user.name : 'User Profile'}
      </div>

      <div>
        
      </div>

      

    </Box>
  );
}
