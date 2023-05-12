import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner, Collapse } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './RepairShopCreationPage.css'

const RepairShopCreationPage = () => {
    const [name, setName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    function checkFields() {
        const phoneRegex = /^(86|\+3706)/;
        if (name === '' || phone_number === '' || email === '' || address === '' || city === '' ) {
            toast.error('Reikia užpildyti visus laukus!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Įveskite teisingą el. paštą!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        else if (!phoneRegex.test(phone_number) || phone_number.length >= 14)
        {
            toast.error('Įveskite teisingą telefono numerį!', {
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

    const handleCreate = (event) => {
        event.preventDefault();
        if (checkFields()) {
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone_number', phone_number);
                formData.append('email', email);
                formData.append('address', address);
                formData.append('city', city);
                axios.post("api/repairshop/create", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast.success('Sėkmingai užregistravote reklamą, su Jumis susisieks administracija dėl sekančių žingsnių!', {
                                style: {
                                    backgroundColor: 'rgb(14, 160, 14)',
                                    color: 'white',
                                },
                            });
                            navigate(`/`)
                        }
                        else {
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                        }
                    })
                    .catch(error => {                   
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                    })
            }
            catch (error) {
                toast.error("Įvyko klaida, susisiekite su administratoriumi!");
            }
        }
    }

    const handleCancel = () => {
        navigate("/");
    }

    return (
        <div className='outerBoxWrapper'>
        <Card>
        <Toaster/>
        <Card.Header className='header d-flex justify-content-between align-items-center'>
        <div>Reklamos registracija</div>
        <div>
        <Button
        onClick={() => setOpen(!open)}
        aria-controls='collapse-content'
        aria-expanded={open}
      >
        {open ? 'Sumažinti': 'Daugiau informacijos apie reklamą'}
      </Button>
        </div>
</Card.Header>
          <Collapse in={open}>
            <div id='collapse-content'>
              <Card.Body>
                Sėkmingai užregistravus reklamą, su Jumis susisieks administracija dėl reklamavimo kainos. Suderinus reklamą, jūsų reklama būtų rodoma laimėtojam derinant elektroninio prietaiso atsiėmimą.
              </Card.Body>
            </div>
          </Collapse>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Pavadinimas</Form.Label>
                <Form.Control type="text" className='input' placeholder="Įveskite pavadinimą" value={name} onChange={(event) => setName(event.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Telefono numeris</Form.Label>
                <Form.Control type="text" className='input' placeholder="Įveskite telefono numerį" value={phone_number} onChange={(event) => setPhoneNumber(event.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>El. paštas</Form.Label>
                <Form.Control type="email" className='input' placeholder="Įveskite el. paštą" value={email} onChange={(event) => setEmail(event.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Adresas</Form.Label>
                <Form.Control type="text" className='input' placeholder="Įveskite adresą" value={address} onChange={(event) => setAddress(event.target.value)} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Miestas</Form.Label>
                <Form.Control type="text" className='input' placeholder="Įveskite miestą" value={city} onChange={(event) => setCity(event.target.value)} />
              </Form.Group>
              <div className='d-flex justify-content-between'>
                <Button variant="primary" type="submit" onClick={(event) => handleCreate(event)}>Užregistruoti</Button>
                <Button variant="secondary" onClick={() => handleCancel()}>Atšaukti</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
      
    )
}
export default RepairShopCreationPage