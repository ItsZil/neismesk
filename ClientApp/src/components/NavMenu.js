import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, NavbarText } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        console.log('Click happened');
    }

    render() {
        return (
            <>
                <header>
                    <Navbar className="header" expand="md">
                        <NavbarBrand tag={Link} to="/">
                            <img alt="logo" src="./images/logo.png"/>
                        </NavbarBrand>
                        <NavbarText>Atiduok. Iškeisk. Laimėk</NavbarText>
                        <NavItem className="profileContainer">
                            <img alt="profilis" src="./images/profile.png" />
                        </NavItem>
                    </Navbar>
                </header>
                <footer>
                    <div className="links">
                        <NavLink tag={Link} to="/help">Pagalba</NavLink>
                        <NavLink tag={Link} className="links" to="/">Populiariausi klausimai</NavLink>
                        <NavLink tag={Link} className="links" to="/about-us">Apie mus</NavLink>
                        <NavLink tag={Link} className="links" to="/">Privatumo politika</NavLink>
                    </div>
                </footer>
            </>
        );
    }
}
