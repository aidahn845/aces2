/*eslint-disable*/
import React, { Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import {
  Box, Checkbox, FormGroup, FormControlLabel, FormControl, Paper, Divider,
  LinearProgress, ListSubheader, ListItemIcon, Grid, FormLabel, Chip
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//import { Store } from "../../store/store"
//import { toggleProjectFilters, viewProject } from "../../store/actions"

import * as Constants from "../../constants"

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

import ChartistGraph from "react-chartist";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "../../variables/charts.js";


import {
  defaultFont,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor
} from "assets/jss/material-kit-react.js";

const detailsPanelStyle = {
  defaultFontStyle: {
    ...defaultFont,
    fontSize: "14px"
  },
  defaultHeaderMargins: {
    marginTop: "20px",
    marginBottom: "10px"
  },
  quote: {
    padding: "10px 20px",
    margin: "0 0 20px",
    fontSize: "17.5px",
    borderLeft: "5px solid #eee"
  },
  quoteText: {
    margin: "0 0 10px",
    fontStyle: "italic"
  },
  quoteAuthor: {
    display: "block",
    fontSize: "80%",
    lineHeight: "1.42857143",
    color: "#777"
  },
  mutedText: {
    color: "#777"
  },
  primaryText: {
    color: primaryColor
  },
  infoText: {
    color: infoColor
  },
  successText: {
    color: successColor
  },
  warningText: {
    color: warningColor
  },
  dangerText: {
    color: dangerColor
  },
  smallText: {
    fontSize: "65%",
    fontWeight: "400",
    lineHeight: "1",
    color: "#777"
  },

  chipLabel: {
    margin: '0 8px 2px 0',
    //color: 'red'
  },

  successText: {
    //color: successColor[0]
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    //color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    //color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    //color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    //color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      //color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: 'white',
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      //color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};


const useStyles = makeStyles(detailsPanelStyle);

export default function DetailsPanel(props) {
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );

  const { state } = props;

  if (state.state.project == null)
    return null;
  
  let pprops = state.state.project ? state.state.project.properties : null;

  if (!pprops) return null;

  const getStatusLabel = status => {
    switch (status) {
      case Constants.STATUS_PLAN:
        return "Planning"
      case Constants.STATUS_DESIGN:
      case Constants.STATUS_IMPLEMENT:
        return "Implementation"
      case Constants.STATUS_LIVE:
        return "Live"
      case Constants.STATUS_ARCHIVE:
        return "Archived"
    }
    return '';
  }
  const getCategoryLabel = category => {
    switch (category) {
      case 'a':
        return "Autonomous";
      case 'c':
        return "Connected";
      case 'e':
        return "Electric";
      case 's':
        return "Shared";
    }
    return null;
  }
  const getModeLabel = mode => {
    switch (mode) {
      case 'a':
        return "Auto";
      case 't':
        return "Transit";
      case 'b':
        return "Bike";
    }
    return null;
  }

  let pcategories = pprops.category.toLowerCase().split(';');

  let pmodes = pprops.mode.toLowerCase().split(';');



  return (
    <Paper style={{
      width: '50vw', height: 'calc(100vh - 65px)', overflow: 'auto', padding: '0px 15px 50px 15px',
      boxShadow: '-5px 0px 5px 0px #888888'
    }} >
      <h3 className={classes.title} style={{ fontWeight: 'bold' }}>{pprops ? pprops.name : ''}</h3>

      <Box display="flex" p={0} style={{ width: '100%', padding: '5px' }}>
        <Box flexWrap="nowrap" style={{ width: '70%' }}>
          {
            pcategories.map((category) => {
              return (getCategoryLabel(category) &&
                <Chip size="small" color="primary" label={getCategoryLabel(category)} className={classes.chipLabel}></Chip>
              );
            })
          }
          &nbsp;&nbsp;&nbsp;
          {
            pmodes.map((mode) => {
              return (getModeLabel(mode) &&
                <Chip size="small" color="secondary" label={getModeLabel(mode)} className={classes.chipLabel}></Chip>
              );
            })
          }
        </Box>
        <Box flexWrap="nowrap" style={{ width: '30%', textAlign: 'right' }}>
          <svg height="16" width="16" style={{ verticalAlign: 'middle' }}>
            <circle cx="8" cy="8" r="8" stroke="white" stroke-width="0" fill={Constants.STATUS_COLORS[pprops.status]} />
          </svg>
          <FormLabel style={{ paddingLeft: '10px', verticalAlign: 'middle' }}>
            {getStatusLabel(pprops.status)}
          </FormLabel>
        </Box>
      </Box>

      <div style={{ margin: '30px 0 0 0' }}>{pprops.desc_text}</div>

      <div style={{ margin: '20px 5px 0 10px' }}>
        {
          pprops && <img src={pprops.desc_photo} style={{ width: '100%' }} />
        }
      </div>

      <h4 style={{ margin: '30px 0px 0 0px', fontWeight: 'bold' }}>Project Team</h4>

      <Grid container>
        {
          pprops.people.map((person) => {
            return (
              <Grid item xs={12} sm={12} md={6}>
                <Box display="flex" p={2} style={{ width: '100%' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={Constants.STATIC_ROOT_URL + 'images/user' + person.id + '.jpg'} width="80px" />
                  </div>
                  <div style={{ padding: '10px 10px', verticalAlign: 'middle' }}>
                    <FormLabel style={{ fontWeight: 'bold', color: 'black' }}>{person.name}</FormLabel>
                    <div style={{ paddingTop: '10px' }}>
                      <i className={"far fa-envelope"} style={{ margin: '4px', padding: '0' }} />
                      <i className={"fab fa-linkedin"} style={{ margin: '4px', padding: '0' }} />
                      <i className={"fab fa-twitter"} style={{ margin: '4px', padding: '0' }} />
                      <i className={"fab fa-facebook"} style={{ margin: '4px', padding: '0' }} />
                    </div>
                  </div>
                </Box>
              </Grid>
            );
          })
        }


      </Grid>


      <h4 style={{ margin: '30px 0px 20px 0px', fontWeight: 'bold' }}>Project Data</h4>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={pprops.datasets[0]}
                type="Line"
                options={dailySalesChart.options}
                //listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Data Set 1</h4>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={pprops.datasets[1]}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                //listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Data Set 2</h4>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

    </Paper>
  );
}

