import { useState, React, Component } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Collapse } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { withRouter } from './withRouter';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './NavMenu.css';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            isClicked: false,
            isLogged: false,
            isLoggedIn: false, // Assume the user is not logged in by default
            isLoggedInAsAdmin: false,
            dropdownOpen: false,
            selectedCategory: 'Filtras',
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
        this.handleLoginClick();
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
            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
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

        axios.get('api/user/isLoggedIn/1')
            .then(response => {
                if (response.status === 200) {
                    this.setState({ isLoggedInAsAdmin: true });
                }
            }
        )
    };

    handleLogoutClick = () => {
        fetch("api/user/logout", { method: "GET" })
        .then(response => {
            if (response.status === 200) { // 200 - Ok
                this.setState({ isLogged: false});
            }
            else if (response.status === 401) { // 401 - Unauthorized
                toast.error('Jūs jau esate atsijungę!');
            }
            else { // 500 - Internal server error
                toast.error('Įvyko klaida, susisiekite su administratoriumi!');
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
        const maxCategoryLength = 20; // Maximum number of characters to display in dropdown toggle

        let displayCategory = this.state.selectedCategory;
        if (displayCategory.length > maxCategoryLength) {
            displayCategory = displayCategory.substring(0, maxCategoryLength) + '...';
        }

        return (
            <>
                <Toaster></Toaster>
                <Navbar style={{ backgroundColor: '#3183ab', height: '95px' }} expand="lg" sticky="top">
                    <Navbar.Brand href="/">
                        <img
                            src="./images/logo.png"
                            height="100"
                            className="d-inline-block align-top"
                            alt="logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: '#3183ab' }}>
                        <Form inline className="d-flex">
                            <FormControl style={{ width: '250px', height: '50px', margin: '5px 0px 0px 0px' }} type="text" placeholder="Įveskite..." value={this.state.searchQuery} onChange={this.handleSearchInputChange} />
                            <Button className="buttonsearch" variant="primary" onClick={this.handleSearch} >Ieškoti</Button>
                        </Form>
                        <Nav className="ms-auto">
                            <NavDropdown title={displayCategory} className="categories">
                                {this.state.categories.map(category => (
                                    <NavDropdown.Item key={category.id} onClick={() => this.getItemsByCategory(category.id)}>{category.name}</NavDropdown.Item>
                                ))}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={() => this.getAllItems()}>Visi</NavDropdown.Item>
                            </NavDropdown>
                            <div className="d-inline-block align-middle">
                                <Button className="buttoncreate" variant="primary" size="sm" href="/skelbimas/naujas">Dovanoti!</Button>
                            </div>

                            {this.state.isLogged ? (
                                <NavDropdown title={<Image alt="Profilio nuotrauka" src={avatar} roundedCircle style={{ height: '75px', width: '75px' }} />} onClick={this.handleLoginClick}>
                                    <NavDropdown.Item href="/profile" onClick={this.handleClick}>Profilis</NavDropdown.Item>
                                    {this.state.isLoggedInAsAdmin ? (
                                        <NavDropdown.Item href="/admin/taisyklos" onClick={this.handleClick}>Taisyklos</NavDropdown.Item>
                                    ) : null}
                                    <NavDropdown.Item href="/prisijungimas" onClick={() => { this.handleLogoutClick() }}>Atsijungti</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <NavDropdown className="custom-dropdown" title={<Image alt="Profilio nuotrauka" src={avatar} roundedCircle style={{ height: '75px', width: '75px' }} />} onClick={this.handleLoginClick}>
                                    <NavDropdown.Item href="/prisijungimas" onClick={this.handleClick}>Prisijungti</NavDropdown.Item>
                                    <NavDropdown.Item href="/registracija" onClick={this.handleClick}>Registruotis</NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <footer>
                    <div className="links">
                        <Link tag={Link} to="/help">
                            Pagalba
                        </Link>
                        <Link tag={Link} className="links" to="/">
                            Populiariausi klausimai
                        </Link>
                        <Link tag={Link} className="links" to="/about-us">
                            Apie mus
                        </Link>
                        <Link tag={Link} className="links" to="/">
                            Privatumo politika
                        </Link>
                        <Link tag={Link} to="https://www.sandbox.paypal.com/donate/?hosted_button_id=CSYYU9CP8BSG6" className="links">Parama</Link>
                        <Link tag={Link} className="links" to="/taisykla/nauja">
                            Reklamos registracija
                        </Link>
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
