import React, { Component } from 'react';
import {
    Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, NavbarText, Button, Nav, InputGroup, InputGroupAddon, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';


export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.state = {
            isClicked: false,
            isLoggedIn: false, // Assume the user is not logged in by default
            dropdownOpen: false,
            selectedCategory: 'Kategorijos',
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            isClicked: !this.state.isClicked
        });

    }

    selectCategory = category => {
        this.setState({
            selectedCategory: category,
        });
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen,
        }));
    };


    render() {
        const maxCategoryLength = 15; // Maximum number of characters to display in dropdown toggle

        let displayCategory = this.state.selectedCategory;
        if (displayCategory.length > maxCategoryLength) {
            displayCategory = displayCategory.substring(0, maxCategoryLength) + '...';
        }
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
                        <div className="d-flex align-items-center">
                        <div class="search-container">
                        <Input type="search" placeholder="Ieškoti" style={{ width: '350px' }} />
                        <Nav navbar>
                            <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                        <DropdownToggle nav caret className="categories">{displayCategory}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => this.selectCategory('Telefonai')}>Telefonai</DropdownItem>
                                    <DropdownItem onClick={() => this.selectCategory('Kompiuteriai')}>Kompiuteriai</DropdownItem>
                                    <DropdownItem onClick={() => this.selectCategory('Stambi buitinė technika')}>Stambi buitinė technika</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            </Nav>
                        </div>    
                            <Button className="buttonsearch" >Ieškoti</Button>
                        </div>
                        <Button className="buttongive">Dovanoti!</Button>
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