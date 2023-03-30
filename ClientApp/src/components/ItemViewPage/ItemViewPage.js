import React, { useState } from 'react';
import { Carousel, Col, Container, Row, Form, Button, Card } from 'react-bootstrap';

export const ItemViewPage = () => {
    const [photoIndex, setPhotoIndex] = useState(0);
    const [selectedPosting, setSelectedPosting] = useState(null);
    const [message, setMessage] = useState('');

    const handlePhotoSelect = (selectedIndex) => {
        setPhotoIndex(selectedIndex);
    };

    const handlePostingSelect = (event) => {
        setSelectedPosting(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // todo
    };

    // Hardcoded temporary
    const posting = {
        title: 'Pavadinimas',
        description: 'Aprasymas',
        type: 'exchange',
        location: 'Vilnius',
        category: 'Stambi buitinė technika',
        date: '2023-03-30',
        photos: [
            {
                id: 1,
                url: 'https://picsum.photos/200/300',
            },
            {
                id: 2,
                url: 'https://picsum.photos/200/300',
            }
        ],
        questions: [],
    };

    return (
        <div className='outerBoxWrapper'>
            <Container className="my-5">
                <Row>
                    <Col md={6}>
                        <Carousel activeIndex={photoIndex} onSelect={handlePhotoSelect}>
                            {posting.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <img className="d-block w-100" src={photo.url} alt={`Photo ${index + 1}`} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Header>{posting.category}</Card.Header>
                            <Card.Body>
                                <Card.Title>{posting.title}</Card.Title>
                                <Card.Text>{posting.description}</Card.Text>
                                {posting.type === 'exchange' && (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Pasirinkite savo prietaisą, kurį norite pasiūlyti:</Form.Label>
                                            <Form.Control as="select" onChange={handlePostingSelect}>
                                                <option value="">Pasirinkti skelbimą</option>
                                                <option value="posting1">Samsung Galaxy S23</option>
                                                <option value="posting2">Apple Macbook Pro 2019</option>
                                                <option value="posting3">Dell XPS 9310</option>
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Žinutė:</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={handleMessageChange} />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">Siūlyti</Button>
                                    </Form>
                                )}
                            </Card.Body>
                            <Card.Footer>{posting.location} | {posting.date}</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
