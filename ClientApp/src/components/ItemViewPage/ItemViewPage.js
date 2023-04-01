import React, { useState, useEffect } from 'react';
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export const ItemViewPage = () => {;
    const [selectedPosting, setSelectedPosting] = useState(null);
    const [message, setMessage] = useState('');
    const [answers, setAnswers] = useState({});
    //const [posting, setPosting] = useState(null);

    /*useEffect(() => {
        const fetchPosting = async () => {
            try {
                const response = await axios.get('api/item/endpoint');
                setPosting(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosting();
    }, []);*/

    const handlePostingSelect = (event) => {
        setSelectedPosting(event.target.value);
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleAnswerChange = (event, questionId) => {
        setAnswers({
            ...answers,
            [questionId]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (posting.type === 'exchange' && !selectedPosting) {
            toast('Pasirinkite skelbimą, kurį norite pasiūlyti keitimui.');
            return;
        }
        else if (posting.type === 'questionnaire') {
            const unansweredQuestions = posting.questions.filter(q => !answers[q.id]);
            console.log(unansweredQuestions.length)
            if (unansweredQuestions.length > 0) {
                toast('Atsakykite į visus klausimus.');
                return;
            }
        }

        const data = {
            selectedPosting,
            message,
            ...(posting.type === 'questionnaire' && { answers })
        };

        axios.post('api/item/endpoint', data)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    };

    // Hardcoded temporary
    const posting = {
        title: 'Pavadinimas',
        description: 'Aprasymas',
        type: 'lottery',
        participants: 53,
        location: 'Vilnius',
        category: 'Stambi buitinė technika',
        creation_date: '2023-03-30',
        end_datetime: '2023-04-05 12:50',
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
        questions: [
            {  
                id: 1,
                question: 'Koks jūsų vardas?',
            },
            {
                id: 2,
                question: 'Kiek jums metų?',
            }
        ],
    };

    return posting ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <Container className="my-5">
                <Row>
                    <Col md={6}>
                        <Carousel>
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
                                <hr className="mb-2" />
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
                                {posting.type === 'questionnaire' && (
                                    <Form onSubmit={handleSubmit}>
                                        {posting.questions.map((question) => (
                                            <Form.Group key={question.id}>
                                                <Form.Label>{question.question}</Form.Label>
                                                <Form.Control type="text" onChange={(event) => handleAnswerChange(event, question.id)} />
                                            </Form.Group>
                                        ))}
                                        <Button variant="primary" type="submit">Atsakyti</Button>
                                    </Form>
                                )}
                                {posting.type === 'lottery' && (
                                    <Form onSubmit={handleSubmit}>
                                        <p>Dalyvių skaičius: {posting.participants}</p>
                                        <p>Laimėtojas bus išrinktas {posting.end_datetime}</p>
                                        <Button variant="primary" type="submit">Dalyvauti</Button>
                                    </Form>
                                )}
                            </Card.Body>
                            <Card.Footer>{posting.location} | {posting.creation_date}</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    ) : <Container className="my-5"><div className='outerBoxWrapper d-flex justify-content-center'> <Spinner animation="border" role="status" /> </div></Container>
};
