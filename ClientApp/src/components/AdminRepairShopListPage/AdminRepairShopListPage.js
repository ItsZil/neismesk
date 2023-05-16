import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Container, Spinner, Button } from 'react-bootstrap';
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
                    toast.error('Neturite prieigos prie šio puslapio!')
                    navigate('/');
                }
            } catch (error) {
                if (error.response.status === 401) {
                    navigate('/prisijungimas');
                    toast.error('Turite būti prisijungęs!');
                }
                else {
                    navigate('/index');
                    toast.error('Įvyko klaida, susisiekite su administratoriumi!');
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
            } catch (error) {
                toast.error('Įvyko klaida, susisiekite su administratoriumi!');
            }
        };
        fetchRepairShops();
    }, [canAccess]);

    const handleSubmit = (event, index) => {
        event.preventDefault();

        const updatedShop = { ...repairShopList[index] };

        axios.post('api/repairshop/changeApproval', updatedShop)
            .then(response => {
                if (response.data) {
                    updatedShop.approved = !updatedShop.approved;
                    
                    const updatedList = [...repairShopList];
                    updatedList[index] = updatedShop;
                    setRepairShopList(updatedList);

                    toast.success('Sėkmingai patvirtinta taisykla!');
                } else {
                    const updatedList = repairShopList.filter((_, i) => i !== index);
                    setRepairShopList(updatedList);

                    toast.success('Sėkmingai ištrinta taisykla!');
                }
            })
            .catch(error => {
                toast.error('Įvyko klaida, susisiekite su administratoriumi!');
            });
    };

    return canAccess && repairShopList ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <Container className='my-5'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pavadinimas</th>
                            <th>Telefono numeris</th>
                            <th>El. paštas</th>
                            <th>Adresas</th>
                            <th>Miestas</th>
                            <th>Patvirtinta</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairShopList.map((shop, index) => (
                            <tr key={index}>
                                <td>{shop.name}</td>
                                <td>{shop.phone_number}</td>
                                <td>{shop.email}</td>
                                <td>{shop.address}</td>
                                <td>{shop.city}</td>
                                <td>{shop.approved ? 'Taip' : 'Ne'}</td>
                                <td>
                                    <Button
                                        variant={shop.approved ? 'danger' : 'success'}
                                        onClick={(event) => handleSubmit(event, index)}>
                                        {shop.approved ? 'Ištrinti' : 'Patvirtinti'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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