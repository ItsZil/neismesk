import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, ListGroupItem, Button, Spinner } from "react-bootstrap";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './DetailedItemInfoPage.css';

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


    const handleSubmit = (event) => {
        event.preventDefault();

    };

    /* Palieku kaip atskirus, bet gal bekuriant endpointus iseis kazkaip apjungt ar kaip tik reiks ju daugiau?
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
        <div className="my-div" style={{ marginTop: "100px" }}>
            {item.type === 'Keitimas' && (
                <div style={{ textAlign: 'center' }}> <h2>Siūlomi daiktai mainams</h2>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {/* {itemOffers.offers.map((item) => (
                            <Col>
                                <Card key={item.id}>
                                    <Card.Img className="d-block mx-auto" src={item.imageUrl} style={{ height: "300px", width: "200px" }} />
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>{item.description}</Card.Text>
                                        <Button variant="primary" type="submit">Mainyti</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))} */}
                        <Col>
                            <Card>
                                <Card.Img className="d-block mx-auto" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                    <Button variant="primary">Mainyti</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img className="d-block mx-auto" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                    <Button variant="primary">Mainyti</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img className="d-block mx-auto" src="./images/phone.png" style={{ height: "300px", width: "200px" }} />
                                <Card.Body>
                                    <Card.Title>Samsungas</Card.Title>
                                    <Card.Text>
                                        Biski padauzytas, siek tiek ekranas neveikia, gali sprogt
                                    </Card.Text>
                                    <Button variant="primary">Mainyti</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                </div>
            )}
            {item.type === 'Klausimynas' && (

                <ListGroup>
                    {/* 
                    {itemQuestions_Answers.questionnaires.map((questionnaire) => ( 
                        <Button type="submit" style={{ height: "40px", width: "90px" }} variant="primary">Atiduoti</Button>
                        <ListGroupItem variant="info"> Klausimyno atsakymai : {questionnaire.user} </ListGroupItem>
                        {questionnaire.questions.map((question) => (
                          <ListGroupItem key={question.id}> {question.question} </ListGroupItem>
                          <ListGroupItem key={question.id}> {question.answer} </ListGroupItem>
                        ))}

                    ))} */}  

                    <Button style={{ height: "40px", width: "90px" }} variant="primary">Atiduoti</Button>
                    <ListGroupItem variant="info"> Klausimyno atsakymai : Justas Andriusis </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr1.1 </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 2 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr2.1 </ListGroupItem>

                    <Button style={{ height: "40px", width: "90px" }} variant="primary">Atiduoti</Button>
                    <ListGroupItem variant="info"> Klausimyno atsakymai : Justas Andriusis </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr1.1 </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 2 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr2.1 </ListGroupItem>

                    <Button style={{ height: "40px", width: "90px" }} variant="primary">Atiduoti</Button>
                    <ListGroupItem variant="info"> Klausimyno atsakymai : Justas Andriusis </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 1 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr1.1 </ListGroupItem>
                    <ListGroupItem variant="primary"> Klausimas nr 2 </ListGroupItem>
                    <ListGroupItem> Atsakymas Nr2.1 </ListGroupItem>
                </ListGroup>

            )}
            {item.type === 'Loterija' && (
                <ListGroup>
                    <ListGroupItem variant="primary"> Loterijos dalyviai </ListGroupItem>
                    {/* 
                    {itemLotteryParticipants.users.map((user) => ( 
                        <ListGroupItem key={user.id}> {user.name} {user.surname} </ListGroupItem>
                    ))} */}      
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