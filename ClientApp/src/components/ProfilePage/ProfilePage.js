﻿import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Form, Button, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './ProfilePage.css'

const ProfilePage = () => {
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            try {
                await axios.get("api/user/getProfileDetails").then(response => {
                    const data = response.data;
                    setUser({ ...data, new_password: '', old_password: '', avatar: data.avatar });
                });    
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/prisijungimas');
                }
            };
        }
        fetchUser();
    }, []);

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setAvatar(e.target.files[0]);
        setUser({ ...user, avatar: null })
    };

    const onNewPasswordChange = (e) => {
        let password = e.target.value;
        setUser({ ...user, new_password: password })
        if (password.length >= 8 && /^(?=.*\d)(?=.*[!@#$%^&*+\-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
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

    function checkFields(formData) {
        const name = formData.get('name');
        const surname = formData.get('surname');
        const email = formData.get('email');
        const old_password = formData.get('old_password');
        const new_password = formData.get('new_password');

        if ((name === '' || surname === '' || email === '') && new_password === '' && old_password === '') {
            toast.error('Vardas, pavardė arba el. paštas negali būti tušti!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        else if ((new_password !== '' && old_password === '') || old_password !== '' && new_password === '') {
            toast.error('Visi lauktai turi būti užpildyti norint keisti slaptažodi!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        return true;
    }

    const handleSubmit = event => {
        event.preventDefault();
        
        if (message !== '' || (message !== '' && user.old_password === '' && user.new_password === '')) {
            return;
        }

        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('surname', user.surname);
        formData.append('email', user.email);
        formData.append('old_password', user.old_password);
        formData.append('new_password', user.new_password);
        formData.append('avatar', avatar);

        if (checkFields(formData)) {
            axios.post("api/user/updateProfileDetails", formData)
            .then(response => {
                if (response.status === 200) {
                    toast.success('Duomenys sėkmingai išsaugoti!', {
                        style: {
                            backgroundColor: 'rgb(14, 160, 14)',
                            color: 'white',
                        },
                    });
                }
                else {
                    toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                }
            })
            .catch(error => {
                if (error.response.data) {
                    toast.error(error.response.data);
                }
                else {
                    toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                }
            });
        }
    }

    return user ? (
        <Container className="profile">
        <Toaster></Toaster>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Image className="avatar" src={user.avatar ? `data:image/jpeg;base64,${user.avatar}` : image || './images/profile.png'} style={{ maxWidth: "128px", maxHeight: "128px" }} alt="Profilio nuotrauka" />
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
                                        <Form.Control type="password" id="old_password" onChange={(e) => setUser({ ...user, old_password: e.target.value })} />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><strong>Naujas slaptažodis:</strong></Form.Label>
                                        <Form.Control type="password" id="new_password" onChange={onNewPasswordChange} />
                                    </Form.Group>
                                    <div className="d-flex flex-column">
                                        <Form.Text className="text-danger">{message}</Form.Text>
                                        <Button className="save-button mt-3" onClick={(e) => handleSubmit(e)} type='submit'>Išsaugoti</Button>
                                    </div>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    ) : (
        <Container className="my-5">
            <div className='outerBoxWrapper d-flex justify-content-center'>
                <Spinner animation="border" role="status" />
            </div>
        </Container>
    );
};
export default ProfilePage;