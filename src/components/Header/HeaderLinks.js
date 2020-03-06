/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link, NavLink } from "react-router-dom";

import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { List, ListItem, Avatar } from "@material-ui/core";

// @material-ui/icons
import { Apps, CloudDownload, AccountCircle, Person } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import {Button} from "components/CustomButtons/Button";

import { ROOT_URL } from "../../constants"


import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

const useStyles2 = makeStyles(theme => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

export default function HeaderLinks(props) {
  const classes = useStyles();
  const classes2 = useStyles2();

  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };


  const handleAvatarClick = () => {
    props.history.push(ROOT_URL + "login");
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        {/*         <Button component={Link} to="/vision" variant="contained"
          color="transparent"
          className={classes.navLink}
        >
          Vision
        </Button> */}
        <NavLink to={ROOT_URL + "vision"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>Vision</NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        {/*         <Button component={Link} to="/projects" variant="contained"
          color="transparent"
          className={classes.navLink}
        >
          Projects
        </Button>
 */}        <NavLink to={ROOT_URL + "projects"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>Projects</NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        {/*         <Button component={Link} to="/people" variant="contained"
          color="transparent"
          className={classes.navLink}
        >
          People
        </Button>
 */}        <NavLink to={ROOT_URL + "people"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>People</NavLink>
      </ListItem>

      <ListItem className={classes.listItem}>
        <NavLink to={ROOT_URL + "login"}>
        <IconButton style={{padding: '0', margin: '7px 0 10px 30px'}}>
          <Avatar className={classes2.small}>
            <Person />
          </Avatar>
        </IconButton>
        </NavLink>
        {/*         <CustomDropdown
          noLiPadding
          buttonText=""
          buttonProps={{
            className: classes.navLink,
            color: "transparent"
          }}
          buttonIcon={AccountIcon}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              My Profile
            </Link>,
            <Link to="/" className={classes.dropdownLink}>
              My Projects
            </Link>
          ]}
        /> */}
      </ListItem>


    </List>
  );
}
