import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Carousel, Col, Container, Row, Form, Button, Card, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import './ItemViewPage.css'
import axios from 'axios';

export const ItemViewPage = () => {
    const { itemId } = useParams();
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [message, setMessage] = useState('');
    const [answers, setAnswers] = useState({});
    const [item, setItem] = useState(null);
    const [userItems, setUserItems] = useState(null);
    const [viewerId, setViewerId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isPastEndTime, setIsPastEndTime] = useState(true);
    const [isUserParticipating, setIsUserParticipating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`api/item/getItem/${itemId}`);
                setItem(response.data);
                
                setInterval(() => {
                    setCurrentTime(new Date());
                }, 1000);

            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchItem();
    }, [itemId]);

    useEffect(() => {
        if (item) {
            setIsPastEndTime(currentTime.getTime() > new Date(item.endDateTime).getTime());
        }
    }, [item, currentTime]);
    
    useEffect(() => {
        if (item && item.type === 'Keitimas') {
            const fetchUserItems = async () => {
                try {
                    const response = await axios.get('api/item/getUserItems');
                    setUserItems(response.data);
                } catch (error) {
                    //toast('Įvyko klaida, susisiekite su administratoriumi!');
                }
            };
            fetchUserItems();
        }
        else if (item && item.type === 'Loterija') {
            const fetchIsUserParticipating = async () => {
                try {
                    const response = await axios.get(`api/item/isUserParticipatingInLottery/${itemId}`);
                    setIsUserParticipating(response.data);
                } catch (error) {
                    //toast('Įvyko klaida, susisiekite su administratoriumi!');
                }
            };
            fetchIsUserParticipating();
        }
    }, [item]);

    useEffect(() => {
        const fetchViewerId = async () => {
            try {
                const response = await axios.get('api/user/getCurrentUserId');
                setViewerId(response.data);
            } catch (error) {
                //toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };
        fetchViewerId();
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

    const handleSubmit = (event, isParticipating) => {
        event.preventDefault();

        if (item.type === 'Keitimas' && !selectedItem) {
            toast('Pasirinkite skelbimą, kurį norite pasiūlyti keitimui.');
            return;
        }
        else if (item.type === 'Klausimynas') {
            const unansweredQuestions = item.questions.filter(q => !answers[q.id]);

            if (unansweredQuestions.length > 0) {
                toast('Atsakykite į visus klausimus.');
                return;
            }
        }

        const data = {
            selectedItem,
            message,
            ...(item.type === 'Klausimynas' && { answers })
        };

        if (item.type === 'Loterija') {
            if (isParticipating) {
                axios.post(`api/item/enterLottery/${itemId}`, data)
                    .then(response => {
                        if (response.data) {
                            toast('Sėkmingai prisijungėte prie loterijos!');
                            
                            setIsUserParticipating(true);
                            setItem({
                                ...item,
                                participants: item.participants + 1,
                            });
                        }
                        else {
                            toast('Įvyko klaida, susisiekite su administratoriumi!');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        toast('Įvyko klaida, susisiekite su administratoriumi!');
                    });
            }
            else {
                axios.post(`api/item/leaveLottery/${itemId}`, data)
                    .then(response => {
                        if (response.data) {
                            toast('Sėkmingai nebedalyvaujate loterijoje!');
                            
                            setIsUserParticipating(false);
                            setItem({
                                ...item,
                                participants: item.participants - 1,
                            });
                        }
                        else {
                            toast('Įvyko klaida, susisiekite su administratoriumi!');
                        }
                    })
                    .catch(error => {
                        toast('Įvyko klaida, susisiekite su administratoriumi!');
                    });
            }
        }
    };


    const handleDelete = async (itemId) => {
        await axios.delete(`/api/item/delete/${itemId}`);
        setItems(items.filter((item) => item.id !== itemId));
        navigate(`/`);
    };

    return item ? (
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
                                {item.status != "Sukurta" ? (
                                    <Card.Text>Šis skelbimas nebegalioja.</Card.Text>
                                ) : null}
                                <Card.Text>{item.description}</Card.Text>
                                {item.userId === viewerId && (
                        <button className="delete" onClick={() => handleDelete(item.id)}>Ištrinti</button>
                        )}
                        {item.userId === viewerId && (
                        <Link to={`/skelbimas/redaguoti/${item.id}`}>
                        <button className="update" onClick={() => ''}>Redaguoti</button>
                        </Link>
                        )}
                                <hr className="mb-2" />
                                {item.type === 'Keitimas' && (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label>Pasirinkite savo prietaisą, kurį norite pasiūlyti:</Form.Label>
                                            <Form.Control as="select" onChange={handleItemSelect}>
                                                <option value="">Pasirinkti skelbimą</option>
                                                {userItems && userItems.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Žinutė:</Form.Label>
                                            <Form.Control as="textarea" rows={3} onChange={handleMessageChange} />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" disabled={isPastEndTime || !selectedItem || item.userId === viewerId}>Siūlyti</Button>
                                    </Form>
                                )}
                                {item.type === 'Klausimynas' && (
                                    <Form onSubmit={handleSubmit}>
                                        {item.questions.map((question) => (
                                            <Form.Group key={question.id}>
                                                <Form.Label>{question.question}</Form.Label>
                                                <Form.Control type="text" onChange={(event) => handleAnswerChange(event, question.id)} />
                                            </Form.Group>
                                        ))}
                                        <Button variant="primary" type="submit" disabled={isPastEndTime || item.userId === viewerId}>Atsakyti</Button>
                                    </Form>
                                )}
                                {item.type === 'Loterija' && (
                                    <Form onSubmit={handleSubmit}>
                                        <p>Dalyvių skaičius: {item.participants}</p>
                                        <p>Laimėtojas bus išrinktas {new Date(item.endDateTime).toLocaleString('lt-LT')}</p>
                                        {!isUserParticipating ? (
                                            <Button variant="primary" type="submit" disabled={isPastEndTime || item.userId === viewerId} onClick={(event) => handleSubmit(event, true)}>Dalyvauti</Button>
                                        ) : (
                                            <Button variant="primary" type="submit" disabled={isPastEndTime || item.userId === viewerId} onClick={(event) => handleSubmit(event, false)}>Nebedalyvauti</Button>
                                        )}
                                    </Form>
                                )}
                            </Card.Body>
                            <Card.Footer>{item.location} | {new Date(item.creationDateTime).toLocaleString('lt-LT')}</Card.Footer>
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