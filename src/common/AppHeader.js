import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import winquirylogo from "../images/winquirylogo.svg";
import ButtonLink from "../components/ButtonLink";
import twitterIcon from '../twitter.svg';



const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [

            <Menu.Item key="/">
              <Link to="/">
                <Icon type="home" className="nav-icon" />
              </Link>
            </Menu.Item>,
            <Menu.Item key="/poll/new">
            <Link to="/poll/new">
              <img src={pollIcon} alt="poll" className="poll-icon" />
              {/* <Icon type="home" className="nav-icon" /> */}
            </Link>
          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>,
            <Menu.Item key="/tweets" className="tweet-icon">
                <Link to="/tweets">
                <img src={twitterIcon} alt="twitter icon" className="twitter-icon" />
        

             
            </Link>

              </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              {/* <Link to="/login" className='navButton'><span>Login</span></Link> */}

              {/* .....Import buttonlink component to use buttonlink styling for buttons..... */}
              <ButtonLink name="Login" page="login"className="nav-link"></ButtonLink>
            </Menu.Item>,

            <Menu.Item key="/signup">
              {/* <Link to="/signup">Signup</Link> */}
              <ButtonLink name="Signup" page="signup"className="nav-link"></ButtonLink>
            </Menu.Item>                  
          ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >

                {/* Wintor logo */}
                <img className='logo' src={winquirylogo} alt="Winquiry Logo" />
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '45px'}} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        {/* <Link to={`/users/${props.currentUser.username}`}>Profile</Link> */}
        <ButtonLink name="Profile"page={`users/${props.currentUser.username}`}></ButtonLink>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
      <ButtonLink name="Logout" page="logout"className="nav-link"></ButtonLink>
      </Menu.Item>
      
    </Menu>
    
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
    
  );
}


export default withRouter(AppHeader);