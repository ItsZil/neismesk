import  { React, Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavItem, NavLink, NavbarText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { withRouter } from './withRouter';
import toast from 'react-hot-toast';
import './NavMenu.css';


const testLogout = () => {
    const requestOptions = {
        method: "GET"
    };
    

    fetch("api/login/logout", requestOptions)
        .then(response => {
            if (response.status === 200) { // 200 - Ok
                toast('Logged out');
            }
            else if (response.status === 401) { // 401 - Unauthorized
                alert('Already logged out');
            }
            else { // 500 - Internal server error
                alert('Unexpected response, check console logs');
            }
        })
}

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.state = {
            isClicked: false,
            isLoggedIn: false
        };
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick() {
        this.setState({
            isClicked: !this.state.isClicked
        });
    }

    render() {
        const toolbar = this.state.isLoggedIn ? (
            <Collapse isOpen={this.state.isClicked} className="toolbar" style={{ flexDirection: 'column' }}>
                <ul className="no-bullets">
                    <li><Button tag={Link} to="/dashboard" color="primary" onClick={this.handleClick} className="mb-2">Profilis</Button></li>
                    <li><Button tag={Link} to="/settings" color="primary" onClick={this.handleClick} className="mb-2">Atsijungti</Button></li>
                </ul>
            </Collapse>
        ) : (
            <Collapse isOpen={this.state.isClicked} className="toolbar" style={{ flexDirection: 'column' }}>
                <ul className="no-bullets">
                    <li><Button tag={Link} to="/login" color="primary" onClick={this.handleClick} className="mb-2">Prisijungti</Button></li>
                    <li><Button tag={Link} to="/registration" color="primary" onClick={this.handleClick} className="mb-2">Registruotis</Button></li>
                    <li><Button tag={Link} to="/login" color="primary" onClick={() => {testLogout(); this.handleClick()}} className="mb-2">Atsijungti</Button></li>
                </ul>
            </Collapse>
        );

        return (
            <>
                <header>
                    <Navbar className="header" expand="md">
                        <NavbarBrand tag={Link} to="/">
                            <img alt="logo" src="./images/logo.png" />
                        </NavbarBrand>
                        <NavbarText>Atiduok. Iškeisk. Laimėk</NavbarText>
                        <NavItem className="profileContainer">
                            <img alt="profilis" src="./images/profile.png" onClick={this.handleClick} />
                            {toolbar}
                        </NavItem>
                    </Navbar>
                </header>
                <footer>
                    <div className="links">
                        <NavLink tag={Link} to="/help">
                            Pagalba
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/">
                            Populiariausi klausimai
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/about-us">
                            Apie mus
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/">
                            Privatumo politika
                        </NavLink>
                    </div>
                </footer>
            </>
        );
    }
}
export default withRouter(NavMenu)