import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import './ItemWinnerViewPage.css'
import axios from 'axios';

export const ItemWinnerViewPage = () => {
    const { itemId } = useParams();
    const [viewerId, setViewerId] = useState(null);
    const [canAccess, setCanAccess] = useState(null);
    const [message, setMessage] = useState('');
    const [item, setItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`api/item/getItem/${itemId}`);
                setItem(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };
        fetchItem();
    }, [itemId, canAccess]);

    useEffect(() => {
        const fetchViewerId = async () => {
            try {
                const response = await axios.get('api/user/getCurrentUserId');
                setViewerId(response.data);
                if (response.data === item?.winnerId) {
                    setCanAccess(true);
                }
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    navigate('/login');
                    toast('Turite būti prisijungęs!');
                }
                else {
                    navigate('/index');
                    toast('Įvyko klaida, susisiekite su administratoriumi!');
                }
            }
        };
        fetchViewerId();
    }, [item]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return item && viewerId && canAccess ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <Container className="my-5">
                <Row>
                    <Col md={4}>
                        <Carousel>
                            {item.images && item.images.length > 0 && (
                                <Carousel>
                                    {item.images.map((image, index) => (
                                        <Carousel.Item key={index}>
                                            <img className="d-block w-100" 
                                            src={`data:image/png;base64,${image.data}`}
                                            alt={`Image ${index + 1}`}
                                            height="320"
                                            style={{ border: '1px solid white' }}
                                             />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}
                        </Carousel>
                    </Col>
                    <Col md={8}>
                        <Card>
                            <Card.Header>{item.category}</Card.Header>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <hr className="mb-2" />
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Žinutė:</Form.Label>
                                        <Form.Control as="textarea" rows={3} onChange={handleMessageChange} />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">Siųsti</Button>
                                </Form>
                            </Card.Body>
                            <Card.Footer>{item.location}</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    ) : (
        <Container className="my-5">
            <div className='outerBoxWrapper d-flex justify-content-center'>
                <Spinner animation="border" role="status" />
            </div>
        </Container>
    );
}