import React, { useState } from 'react';
import './ForgotPasswordPage.css'
import toast, { Toaster } from 'react-hot-toast';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function checkFields() {
        if (email === '') {
            toast.error('Reikia užpildyti visus laukus!');
            return false;
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Įveskite teisingą el. paštą!');
            return false;
        }
        else {
            return true;
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (checkFields()) {
            setIsSubmitting(true);
            const requestData = { email };
            axios
                .post('api/user/forgotPassword', requestData)
                .then((response) => {
                    setIsSubmitting(false);
                    if (response.status === 200) {
                        toast.success('Nuoroda į slaptažodžio pakeitimą sėkmingai išsiųsta.');
                    }
                    else {
                        toast.error('Įvyko klaida, susisiekite su administratoriumi!');
                    }
                })
                .catch((error) => {
                    setIsSubmitting(false);
                    if (error.response.status === 404) {
                        toast.error('Nerastas vartotojas su pateiktais duomenimis!');
                    }
                    else if (error.response.status === 401) {
                        toast.error('Klaida išsiunčiant pakeitimo žinutę. Bandykite dar kartą.');
                    }
                    else {
                        toast.error('Įvyko klaida, susisiekite su administratoriumi!');   
                    }
                });
        }
    };

    return (
        <div className='outerBoxWrapper'>
            <Card>
                <Toaster />
                <Card.Header className='header d-flex justify-content-between align-items-center'>
                    <div>Įveskite savo el. pašto adresą, kurį naudojate prisijungimui:</div>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="email">
                            <Form.Control type="email" placeholder="El. paštas" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Button className='submitForgotPasswordButton' type="submit" disabled={isSubmitting} onClick={(event) => handleSubmit(event)}>
                            Patvirtinti
                        </Button>
                        <div className="returnToLogin">
                            <a href="/prisijungimas" className="returnToLoginButton">Grįžti į prisijungimą</a>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div> 
    );
}
export default ForgotPasswordPage