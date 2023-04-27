import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './HomePage.css';


function HomePage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const [viewerId, setViewerId] = useState(null);

    useEffect(() => {
        const fetchViewerId = async () => {
            try {
                const response = await axios.get('api/user/getCurrentUserId');
                setViewerId(response.data);
            } catch (error) {
                //toast('Įvyko klaida, susisiekite su administratoriumi!');
                // TODO - an error still shows up in the console when logged out.
            }
        };
        fetchViewerId();
    }, []);


    useEffect(() => {
        async function fetchItems() {
            const response = await axios.get('/api/item/getItems');
            setItems(response.data);
        }

        fetchItems();
    }, []);

    const handleOpen = (itemId) => {
        navigate(`/skelbimas/${itemId}`);
    }

    return (
        <Container className="home">
            <h3>Naujausi prietaisų skelbimai</h3>
            <Row>
                {items.map((item) => (
                    <Col sm={4} key={item.id}>
                        <Card className="mb-4">
                            <Carousel>
                                {item.images && item.images.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <img
                                            className="d-block w-100"
                                            src={`data:image/png;base64,${image.data}`}
                                            alt={item.name}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <Button variant="primary" onClick={() => handleOpen(item.id)}>Peržiūrėti</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
export default HomePage;