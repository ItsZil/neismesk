import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Form, Button, Card } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './ProfilePage.css'

const ProfilePage = () => {

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
        address: "123 Main St, Anytown USA"
    });

    const [image, setImage] = useState([]);

    function checkFields() {
        if (user.name === '' || user.surname === '' || user.email === '') {
            toast('Reikia užpildyti visus laukus!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        else {
            return true;
        }
    }

    /*
     sita reikia pakoreguoti, cia ostino, mums reikes tik 1 nuotraukos (ir nebutina aisku keisti)
    useEffect(() => {
        if (images.length < 1) return;
        if (images.length > 6) {
            toast("Negalima įkelti daugiau nei 6 nuotraukų!", {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return;
        }
        const newImageUrls = [];
        images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
        setImageUrls(newImageUrls);
    }, [images]);
    */

    const handleSave = () => {
        if (checkFields()) {
            try {
                const formData = new FormData();
                formData.append('name', user.name);
                formData.append('surname', user.surname);
                formData.append('email', user.email);
                formData.append('id', 1); // todo
                formData.append('fk_category', 2); // todo
                //formData.append('image', imageURLs)

                // TODO: check if avatar was changed?
                
                axios.post("", formData)
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
                            <Image className="avatar" src="https://randomuser.me/api/portraits/men/75.jpg" alt="User avatar" />
                            <Form>
                                <Form.Group>
                                    <Form.Label><strong>Nuotrauka:</strong></Form.Label>
                                    <Form.Control type="file" accept="image/png, image/jpeg" custom onChange={(e) => setImage([...e.target.files])} />
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
                                        <Form.Control type="password" id="old_password" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label><strong>Naujas slaptažodis:</strong></Form.Label>
                                        <Form.Control type="password" id="new_password" />
                                    </Form.Group>
                                    <Button className="save-button" onClick={handleSave} type='submit'>Išsaugoti</Button>
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