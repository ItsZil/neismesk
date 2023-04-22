import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './ProfilePage.css'

const ProfilePage = () => {

    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [avatar, setAvatar] = useState(null);

    /*
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch("ProfilePageEndpointasCia");
            const data = await response.json();
            setUser(data);
        }
        fetchUser();
    }, []);
    */

    // Šita informacija statinė ir vėliau ją reiktų ištrint bei atkomentuot viską aukščiau
    const [user, setUser] = useState({
        name: "John",
        surname: "Smith",
        email: "john.smith@example.com",
        address: "123 Main St, Anytown USA",
        old_password: '',
        new_password: ''
    });

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setAvatar(e.target.files[0]);
    };

    const onNewPasswordChange = (e) => {
        let password = e.target.value;
        setUser({ ...user, new_password: password })
        if (password.length >= 8 && /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            if (password === user.old_password) {
                setMessage("Naujas slaptažodis negali sutapti su senuoju!");
            }
            else {
                setMessage("");   
            }
        }
        else {
            setMessage("Naujas slaptažodis turi turėti mažąsias, didžiąsias raides, skaičius, spec. simbolius ir būti bent 8 simbolių ilgio!");
        }
    }

    function checkFields() {
        if (user.name === '' || user.surname === '' || user.email === '' || user.new_password !== '' && user.old_password === '') {
            toast('Reikia užpildyti visus laukus!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        return true;
    }

    const handleSave = () => {
        if (checkFields()) {
            try {
                const formData = new FormData();
                formData.append('name', user.name);
                formData.append('surname', user.surname);
                formData.append('email', user.email);
                formData.append('old_password', user.old_password);
                formData.append('new_password', user.new_password);
                formData.append('avatar', avatar);

                axios.post("api/user/updateProfileDetails", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast('Duomenys sėkmingai išsaugoti!', {
                                style: {
                                    backgroundColor: 'rgb(14, 160, 14)',
                                    color: 'white',
                                },
                            });
                        }
                        else {
                            toast("Įvyko klaida, susisiekite su administratoriumi!");
                        }
                    })
            }
            catch (error) {
                toast("Įvyko klaida, susisiekite su administratoriumi!");
            }
        }
    }

    return (
        <Container className="profile">
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Image className="avatar" src={image || 'https://randomuser.me/api/portraits/men/75.jpg'} style={{ maxWidth: "128px", maxHeight: "128px" }} alt="User avatar" />
                            <Form>
                                <Form.Group>
                                    <Form.Label><strong>Nuotrauka:</strong></Form.Label>
                                    <Form.Control type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <div className="info">
                                <Form>
                                    <Form.Group>
                                        <Form.Label><strong>Vardas:</strong></Form.Label>
                                        <Form.Control type="text" id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><strong>Pavardė:</strong></Form.Label>
                                        <Form.Control type="text" id="surname" value={user.surname} onChange={(e) => setUser({ ...user, surname: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><strong>El. paštas:</strong></Form.Label>
                                        <Form.Control type="email" id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                                    </Form.Group>
                                    <div className="my-5"></div>
                                    <Form.Group>
                                        <Form.Label><strong>Senas slaptažodis:</strong></Form.Label>
                                        <Form.Control type="password" id="old_password" value={user.old_password} onChange={(e) => setUser({ ...user, old_password: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><strong>Naujas slaptažodis:</strong></Form.Label>
                                        <Form.Control type="password" id="new_password" value={user.new_password} onChange={onNewPasswordChange} />
                                    </Form.Group>
                                    <div className="d-flex flex-column">
                                        <Form.Text className="text-danger">{message}</Form.Text>
                                        <Button className="save-button mt-3" onClick={handleSave} type='submit'>Išsaugoti</Button>
                                    </div>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};
export default ProfilePage;