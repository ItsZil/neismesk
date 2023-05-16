import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Form, Button, Card, Spinner } from 'react-bootstrap';
import toast, { Toaster } from 'react-hot-toast';
import './AdminRepairShopListPage.css'
import axios from 'axios';

export const AdminRepairShopListPage = () => {
    const [canAccess, setCanAccess] = useState(null);
    const [repairShopList, setRepairShopList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCanAccess = async () => {
            try {
                const response = await axios.get('api/user/isLoggedIn/1');

                if (response.status === 200) {
                    setCanAccess(true);
                } else {
                    toast('Neturite prieigos prie šio puslapio!')
                    navigate('/');
                }
            } catch (error) {
                if (error.response.status === 401) {
                    navigate('/prisijungimas');
                    toast('Turite būti prisijungęs!');
                }
                else {
                    navigate('/index');
                    toast('Įvyko klaida, susisiekite su administratoriumi!');
                }
            }
        };
        fetchCanAccess();
    });

    useEffect(() => {
        const fetchRepairShops = async () => {
            try {
                const response = await axios.get('api/repairshop/getRepairShops');
                setRepairShopList(response.data);
                console.log(response.data);
            } catch (error) {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };
        fetchRepairShops();
    }, [canAccess]);

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('api/item/submitWinnerDetails')
            .then(response => {
                if (response.data) {
                    toast('Sėkmingai išsiųstas pranešimas skelbėjui!');
                }
                else {
                    toast('Įvyko klaida, susisiekite su administratoriumi!');
                }
            })
            .catch(error => {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
            });
    };

    return canAccess && repairShopList ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <Container className="my-5">
                
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