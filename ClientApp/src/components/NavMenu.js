import { useState, React, Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavItem, NavLink, Button, Nav, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { withRouter } from './withRouter';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './NavMenu.css';

const testLogout = () => {
    fetch("api/user/logout", { method: "GET" })
        .then(response => {
            if (response.status === 200) { // 200 - Ok
                // Hack to make the NavMenu update the user avatar.
                window.location.reload();
            }
        });
}



export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            isClicked: false,
            isLogged: false,
            isLoggedIn: false, // Assume the user is not logged in by default
            dropdownOpen: false,
            selectedCategory: 'Kategorijos',
            userAvatar: './images/profile.png',
            categories: [],
            items: [],
            allItems: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.getUserAvatar();
        this.getCategories();
    }

    getUserAvatar() {
        axios.get('api/user/getUserAvatar')
            .then(response => {
                if (response.data.avatar !== undefined) {
                    this.setState({
                        userAvatar: response.data.avatar
                    });
                }
            })
            .catch(error => console.error(error));
    }
    
    getCategories()
    {
        axios.get("api/item/getCategories")
        .then(response => { this.setState({
            categories : response.data
        })
        })
        .catch(error => {
            console.log(error);
            toast("Įvyko klaida, susisiekite su administratoriumi!");
        })
    }
    

    handleClick() {
        this.setState({
            isClicked: !this.state.isClicked
        });
    };
    handleSearchInputChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    };
    handleSearch = () => {
        if (!this.state.searchQuery) {
            toast.error('Negalite ieškoti skelbimų nieko neįvedę paieškos lange')
            return;
          }
        
  axios.get('/api/item/search', {
    params: {
      searchWord: this.state.searchQuery
    }
  })
  .then((response) => {
    this.props.navigate(`/search/${this.state.searchQuery}`, { state: { searchResults: response.data, searchQuery: this.state.searchQuery } });
  })
  .catch((error) => {
    console.error(error);
  });
};
      
getItemsByCategory(categoryId) {
        this.props.navigate(`/search/category/${categoryId}`);
  }
  getAllItems = () => {
    this.setState({
        allItems: true
    });
    this.props.navigate(`/search/category/0`);
};
      
    handleLoginClick = () => {
        this.setState({
            isClicked: !this.state.isClicked
        });
        fetch("api/user/isloggedin/0", { method: "GET" })
        .then(response => {
            if (response.status == 200) { // 200 - Ok, we are logged in.
                this.setState({ isLogged: true});
            }
        })
    };

    handleLogoutClick = () => {
        fetch("api/user/logout", { method: "GET" })
        .then(response => {
            if (response.status === 200) { // 200 - Ok
                toast('Logged out');
                this.setState({ isLogged: false});
            }
            else if (response.status === 401) { // 401 - Unauthorized
                alert('Already logged out');
            }
            else { // 500 - Internal server error
                alert('Unexpected response, check console logs');
            }
        })
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
        const { userAvatar } = this.state;
        const avatar = userAvatar.length < 100 ? userAvatar : `data:image/jpeg;base64,${userAvatar}`;
        const maxCategoryLength = 15; // Maximum number of characters to display in dropdown toggle

        let displayCategory = this.state.selectedCategory;
        if (displayCategory.length > maxCategoryLength) {
            displayCategory = displayCategory.substring(0, maxCategoryLength) + '...';
        }
        const toolbar = this.state.isLoggedIn ? (
            <Collapse isOpen={this.state.isClicked}  className="toolbar" style={{ flexDirection: 'column' }}>
                <ul className="no-bullets">
                    <li><Button tag={Link} to="/dashboard" color="primary" onClick={this.handleClick} className="mb-2">Profilis</Button></li>
                    <li><Button tag={Link} to="/settings" color="primary" onClick={this.handleClick} className="mb-2">Atsijungti</Button></li>
                </ul>
            </Collapse>
        ) : (
            <Collapse isOpen={this.state.isClicked} className="toolbar" style={{ flexDirection: 'column' }}>
                <ul className="no-bullets">
                    {!this.state.isLogged && (
                    <li><Button tag={Link} to="/prisijungimas" color="primary" onClick={this.handleClick} className="mb-2">Prisijungti</Button></li>
                    )}
                    {!this.state.isLogged && (
                    <li><Button tag={Link} to="/registracija" color="primary" onClick={this.handleClick} className="mb-2">Registruotis</Button></li>
                    )}
                    {this.state.isLogged && (
                    <li><Button tag={Link} to="/prisijungimas" color="primary" onClick={() => {this.handleLogoutClick()}} className="mb-2">Atsijungti</Button></li>
                    )
                    }
                </ul>
            </Collapse>
        );

        return (
            <>
                <header>
                <Toaster></Toaster>
                    <Navbar className="header" expand="md">
                        <NavbarBrand tag={Link} to="/">
                            <img alt="logo" src="./images/logo.png" />
                        </NavbarBrand>
                        <div className="d-flex align-items-center">
                        <div className="search-container">
                        <Input
                        type="search"
                        placeholder="Ieškoti"
                        style={{ width: '350px' }}
                        value={this.state.searchQuery}
                        onChange={this.handleSearchInputChange}
                        />
                        <Nav navbar>
                            <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                                        <DropdownToggle nav caret className="categories">{displayCategory}</DropdownToggle>
                                <DropdownMenu>
                                <DropdownItem onClick={() => this.getAllItems()}>Visi</DropdownItem>
                                {this.state.categories.map(category => (
                                <DropdownItem key={category.id} onClick={() => this.getItemsByCategory(category.id)}>{category.name}</DropdownItem>
            ))}
                                </DropdownMenu>
                            </Dropdown>
                            </Nav>
                        </div>    
                            <Button className="buttonsearch" onClick={this.handleSearch}>Ieškoti</Button>
                        </div>
                        <NavLink tag={Link} className="buttongive" to="/skelbimas/naujas">Dovanoti!</NavLink>
                        <NavItem className="profileContainer">
                            <img alt="Profilio nuotrauka" src={avatar} onClick={this.handleLoginClick}/>
                            {toolbar}
                        </NavItem>
                    </Navbar>
                </header>
                <footer>
                    <div className="links">
                        <NavLink tag={Link} to="/pagalba">
                            Pagalba
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/">
                            Populiariausi klausimai
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/apie-mus">
                            Apie mus
                        </NavLink>
                        <NavLink tag={Link} className="links" to="/">
                            Privatumo politika
                        </NavLink>
                        <NavLink tag={Link} to="https://www.sandbox.paypal.com/donate/?hosted_button_id=CSYYU9CP8BSG6" className="links">Parama</NavLink>
                    </div>
                </footer>
            </>
        );
    }
}

export function Redirection(props)
{
    const navigate = useNavigate();
    return (<NavMenu navigate={navigate}></NavMenu>)
}

export default withRouter(NavMenu)
