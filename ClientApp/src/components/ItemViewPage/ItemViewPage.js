import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export const ItemViewPage = () => {
    const { itemId } = useParams();
    const [selectedItem, setSelectedItem] = useState(null);
    const [message, setMessage] = useState('');
    const [answers, setAnswers] = useState({});
    const [item, setItem] = useState(null);
    const [userItems, setUserItems] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPastEndTime, setIsPastEndTime] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                console.log(itemId);
                const response = await axios.get('api/item/endpoint');
                setItem(response.data);

                setInterval(() => {
                    setCurrentTime(new Date());
                }, 1000);
                setIsPastEndTime(currentTime.getTime() > new Date(item.end_datetime).getTime());
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchItem();
    }, [itemId]);

    useEffect(() => {
        const fetchUserItems = async () => {
            try {
                const response = await axios.get('api/item/endpoint');
                setUserItems(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchUserItems();
    }, []);

    const handleItemSelect = (event) => {
        setSelectedItem(event.target.value);
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

        if (item.type === 'exchange' && !selectedItem) {
            toast('Pasirinkite skelbimą, kurį norite pasiūlyti keitimui.');
            return;
        }
        else if (item.type === 'questionnaire') {
            const unansweredQuestions = item.questions.filter(q => !answers[q.id]);
            console.log(unansweredQuestions.length)
            if (unansweredQuestions.length > 0) {
                toast('Atsakykite į visus klausimus.');
                return;
            }
        }

        const data = {
            selectedItem,
            message,
            ...(item.type === 'questionnaire' && { answers })
        };

        axios.post('api/item/endpoint', data)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            });
    };

    /* Hardcoded temporary
    const item = {
        title: 'Pavadinimas',
        description: 'Aprasymas',
        type: 'exchange',
        participants: 53,
        location: 'Vilnius',
        category: 'Stambi buitinė technika',
        creation_date: '2023-03-30',
        end_datetime: '2023-04-04 12:50',
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
    };*/

    return item && userItems ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <Container className="my-5">
                <Row>
                    <Col md={6}>
                        <Carousel>
                            {item.photos.map((photo, index) => (
                                <Carousel.Item key={index}>
                                    <img className="d-block w-100" src={photo.url} alt={`Photo ${index + 1}`} />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col md={6}>
                        <Card>
                            <Card.Header>{item.category}</Card.Header>
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                                <hr className="mb-2" />
                                {item.type === 'exchange' && (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Pasirinkite savo prietaisą, kurį norite pasiūlyti:</Form.Label>
                                            <Form.Control as="select" onChange={handleItemSelect}>
                                                <option value="">Pasirinkti skelbimą</option>
                                                {userItems && userItems.map(item => (
                                                    <option key={item.id} value={item.id}>{item.title}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Žinutė:</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={handleMessageChange} />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={isPastEndTime}>Siūlyti</Button>
                                    </Form>
                                )}
                                {item.type === 'questionnaire' && (
                                    <Form onSubmit={handleSubmit}>
                                        {item.questions.map((question) => (
                                            <Form.Group key={question.id}>
                                                <Form.Label>{question.question}</Form.Label>
                                                <Form.Control type="text" onChange={(event) => handleAnswerChange(event, question.id)} />
                                            </Form.Group>
                                        ))}
                                        <Button variant="primary" type="submit" disabled={isPastEndTime}>Atsakyti</Button>
                                    </Form>
                                )}
                                {item.type === 'lottery' && (
                                    <Form onSubmit={handleSubmit}>
                                        <p>Dalyvių skaičius: {item.participants}</p>
                                        <p>Laimėtojas bus išrinktas {item.end_datetime}</p>
                                        <Button variant="primary" type="submit" disabled={isPastEndTime}>Dalyvauti</Button>
                                    </Form>
                                )}
                            </Card.Body>
                            <Card.Footer>{item.location} | {item.creation_date}</Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    ) : <Container className="my-5"><div className='outerBoxWrapper d-flex justify-content-center'> <Spinner animation="border" role="status" /> </div></Container>
};
