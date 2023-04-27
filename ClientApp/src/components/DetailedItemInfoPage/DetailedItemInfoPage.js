import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, ListGroupItem, Button, Spinner } from "react-bootstrap";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export const DetailedItemInfoPage = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [itemQuestions_Answers, setItemQuestions_Answers] = useState(null);
    const [itemOffers, setItemOffers] = useState(null);
    const [itemLotteryParticipants, setItemLotteryParticipants] = useState(null);

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
    }, [itemId]);

    /* Palieku kaip atskirus, bet gal bekuriant endpointus iseis kazkaip apjungt?
    useEffect(() => {
        const fetchItemQuestions_Answers = async () => {
            try {
                const response = await axios.get('api/item/endpointas_klausimynui_ir_atsakymams');
                setItemQuestions_Answers(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchItemQuestions_Answers();
    }, []);

    useEffect(() => {
        const fetchItemOffers = async () => {
            try { 
                const response = await axios.get('api/item/endpointas_mainams'); 
                setItemOffers(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchItemOffers();
    }, []);

    useEffect(() => {
        const fetchItemLotteryParticipants = async () => {
            try {
                const response = await axios.get('api/item/endpointas_loterijos_dalyviams');
                setItemLotteryParticipants(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };

        fetchItemLotteryParticipants();
    }, []);
    */


    return item ? (
        <div style={{ marginTop: "100px" }}>
            {item.type === 'Keitimas' && (
                <div style={{ textAlign: 'center' }}> <h2>Siūlomi daiktai mainams</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-4">

                        {/* Get all items who are being offered for trading
                {itemOffers.offers.map((item) => (
                    <Col>
                        <Card>
                            <Card.Img variant="top" src={item.imageUrl} style={{ height: "300px", width: "200px" }} />
                            <Card.Body> 
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text>{item.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}*/}

                        <Col>
                            <Card>
                                <Card.Img variant="top" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img variant="top" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img variant="top" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                </div>
            )}
            {item.type === 'Klausimynas' && (

                <ListGroup>
                    <ListGroupItem variant="info"> Klausimyno atsakymai </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr1.1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr1.2 </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 2 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr2.1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr2.2 </ListGroupItem>
                </ListGroup>


                /* Get Questions and all answers to those questions
                 {itemQuestions_Answers.questions.map((question) => (
                     <Card>                                          
                         <Card.Header>{question.question}</Card.Header>
                          Get users answers which are participating in this Questionnare
                         <ListGroup>         
                             {itemQuestions_Answers.answers.map((answer) => (
                                 <ListGroupItem>{answer}</ListGroupItem>
                         ))}
                         </ListGroup>
                     </Card>
                 ))}*/

            )}
            {item.type === 'Loterija' && (
                <ListGroup>{/* 
              Get Users that are participating in this Lottery  
                {itemLotteryParticipants.users.map((user) => (
                <ListGroupItem>
                {user.name} {user.surname}
                </ListGroupItem>
                ))}*/}
                    <ListGroupItem variant="primary"> Loterijos dalyviai </ListGroupItem>
                    <ListGroupItem> Jonas Jonauskas </ListGroupItem>
                    <ListGroupItem> Jonas Jonauskas </ListGroupItem>
                </ListGroup>
            )}
        </div>
    ) : (
        <Container className="my-5">
            <div className='outerBoxWrapper d-flex justify-content-center'>
                <Spinner animation="border" role="status" />
            </div>
        </Container>
    );
}