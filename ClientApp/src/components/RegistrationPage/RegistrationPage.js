import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './RegistrationPage.css'
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner, Collapse } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const RegistrationPage = () => {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [matchMessage, setMatchMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserLogin = async () => {
            try {
                const response = await axios.get('api/user/isloggedin/0');
                if (response.status == 200)
                {
                  toast.error("Jūs jau esate prisijungęs!")
                  navigate('/');
                }
            } catch (error) {
              if (error.response.status === 401) {
                return true;
              }
              else
              {
                toast.error('Įvyko klaida, susisiekite su administratoriumi!');
              }
            }
        };
        fetchUserLogin();
      }, []);

    const onChange = (e) => {
        let password = e.target.value;
        setPassword(password);
        if (password.length >= 8 && /^(?=.*\d)(?=.*[!@#$%^&*+\-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            setMessage("");
        }
        else {
            setMessage("Slaptažodis turi turėti mažąsias, didžiąsias raides, skaičius, spec. simbolius ir būti bent 8 simbolių ilgio!");
        }
    }

    function checkFields() {
        if (password === confirmPassword) {
            if (name === '' || surname === '' || email === '') {
                setMessage('Reikia užpildyti visus laukus!');
                return false;
            }
            else if (password.length >= 8 && /^(?=.*\d)(?=.*[!@#$%^&*+\-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))
            {
                if  (!/\S+@\S+\.\S+/.test(email))
                {
                    setMatchMessage("Neteisingai įvestas el. paštas");
                    return false;
                }
            setMatchMessage("");
            setMessage("");
            return true;
            }
        }
        else {
            setMatchMessage("Slaptažodiai turi sutapti!");
            return false;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (checkFields()) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    password: password,
                    email: email,
                }),
            };
            fetch("api/user/register", requestOptions)
                .then(response => {
                    if (response.status === 200) {
                        toast.success('Sėkmingai prisiregistravote. Elektroninio pašto patvirtinimas išsiųstas.');
                        navigate("/prisijungimas");
                    }
                    else if (response.status === 401) {
                        toast.error("Nepavyko išsiųsti patvirtinimo laiško! Susisiekite su administratoriumi.", {
                            style: {
                                backgroundColor: 'red',
                                color: 'white',
                            },
                        });
                    }
                    else {
                        toast.error("Įvyko klaida, susisiekite su administratoriumi!", {
                            style: {
                                backgroundColor: 'red',
                                color: 'white',
                            },
                        });
                    }
                })

        }
    }

    return (
        <div className='page-container'>
        <div className='outerBoxWrapper'>
          <Card className='custom-card'>
            <Toaster />
            <Card.Header className='header d-flex justify-content-between align-items-center'>
              <div className='text-center'>Registracija</div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className='text-center'>
                  <Form.Control
                    className='input'
                    type='text'
                    name='name'
                    id='name'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Vardas'
                  />
                </Form.Group>
                <Form.Group className='text-center'>
                  <Form.Control
                    className='input'
                    type='text'
                    name='surname'
                    id='surname'
                    value={surname}
                    onChange={(event) => setSurname(event.target.value)}
                    placeholder='Pavardė'
                  />
                </Form.Group>
                <Form.Group className='text-center'>
                  <Form.Control
                    className='input'
                    type='email'
                    name='email'
                    id='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='El. paštas'
                  />
                </Form.Group>
                <Form.Group className='text-center'>
                  <Form.Control
                    className='input'
                    type='password'
                    name='password'
                    id='password'
                    value={password}
                    onChange={onChange}
                    placeholder='Slaptažodis'
                  />
                </Form.Group>
                <Form.Group className='text-center'>
                  <Form.Control
                    className='input'
                    type='password'
                    name='confirmPassword'
                    id='confirmPassword'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder='Pakartokite slaptažodį'
                  />
                </Form.Group>
                <Form.Label className='warningText'>{message}</Form.Label>
                <Form.Label className='warningText'>{matchMessage}</Form.Label>
                <div className='text-center'>
                  <Button className='btn btn-primary' onClick={(event) => handleSubmit(event)} type='submit'>
                    Registruotis
                  </Button>
                </div>
                <hr/>
                <div className='returnToLogin text-center'>
                  <a href='/prisijungimas' className='returnToLoginButton'>
                    Grįžti į prisijungimą
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
}
export default RegistrationPage