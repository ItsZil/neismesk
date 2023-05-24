import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ItemUpdatePage.css';

function ItemUpdatePage() {
  const { itemId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [viewerId, setViewerId] = useState(null);
  const [category, setCategory] = useState('Pasirinkite kategoriją');
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [item, setItem] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [isLoggedInAsAdmin, setIsLoggedInAsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("api/item/getCategories")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.log(error);
        toast.error("Įvyko klaida, susisiekite su administratoriumi!");
      })
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('api/user/isloggedin/1');
        if (response.status == 200) {
          setIsLoggedInAsAdmin(true);
        }
      } catch (error) {
        if (error.response.status === 401) {
          setIsLoggedInAsAdmin(false);
        }
        else {
          toast.error('Įvyko klaida, susisiekite su administratoriumi!');
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    async function fetchItem() {
      const response = await axios.get(`/api/item/getItem/${itemId}`);
      setItem(response.data);
      setName(response.data.name);
      setDescription(response.data.description);
      setCategory(response.data.fk_Category);
    }
    fetchItem();
  }, [itemId]);

  useEffect(() => {
    const fetchViewerId = async () => {
      try {
        const response = await axios.get('api/user/getCurrentUserId');
        setViewerId(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          navigate('/prisijungimas');
          toast.error('Turite būti prisijungęs!');
        }
        else {
          toast.error('Įvyko klaida, susisiekite su administratoriumi!');
        }
      }
    };
    fetchViewerId();
  }, []);




  if (!isLoggedInAsAdmin) {
    if (item && viewerId && item.userId !== viewerId) {
      navigate('/');
      toast.error('Jūs nesate šio skelbimo savininkas');
    }
  }


  const handleSubmit = async (event) => {

    try {
      event.preventDefault();
      const data = new FormData();
      data.append('name', name || item.name);
      data.append('description', description || item.description);
      data.append('fk_Category', category || item.fk_Category);
      if (item.images.length === 0 && images.length === 0) {
        toast.error('Negalite palikti skelbimo be nuotraukos');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
        return;
      }
      if (name === '' || description === '' || category === undefined) {
        toast.error('Užpildykite visus laukus!');
        return;
      }
      if (images.length > 6 || images.length + item.images.length > 6) {
        toast.error('Daugiausiai galite įkelti 6 nuotraukas');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
        return;
      }

      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }

      for (let i = 0; i < imagesToDelete.length; i++) {
        data.append('imagesToDelete', imagesToDelete[i]);
      }

      await axios.put(`/api/item/update/${itemId}`, data);
      toast.success('Item updated successfully!');
      setName('');
      setDescription('');
      setCategory('');
      setImages([]);
      setImagesToDelete([]);
      navigate(`/skelbimas/${itemId}`);
    } catch (error) {
      console.log(error);
      toast.error('Ivyko klaida, susisiekite su administratoriumi!');
    }
  };


  const getAllImages = () => {
    if (images.length > 0) {
      return images.map((image) => {
        const imageUrl = URL.createObjectURL(image);
        return <img src={imageUrl} style={{ width: '128px', height: 'auto', marginRight: '15px', border: '1px solid white' }}></img>;
      })
    }
  }


  function getExistingImages() {
    return (
      <div className="d-flex flex-wrap">
        {item.images.map((image, index) => (
          <Form.Group key={index} className="d-inline-block mr-3" style={{ width: '128px', marginRight: '10px' }}>
            <img
              className="image-preview"
              src={`data:image/png;base64,${image.data}`}
              alt={`Image ${index + 1}`}
              height="320"
              style={{ border: '1px solid white' }}
            />
            <div>
              <Button
                variant="secondary"
                onClick={() => handleDeleteImage(image.id)}
              >
                Pašalinti
              </Button>
            </div>
          </Form.Group>
        ))}
      </div>
    );
  }
  

  function handleDeleteImage(id) {
    // Add image ID to the list of images to delete
    setImagesToDelete((prevImagesToDelete) => [...prevImagesToDelete, id]);
    setShowMessage(true);
    // Remove image from the client view
    setItem((prevItem) => ({
      ...prevItem,
      images: prevItem.images.filter((image) => image.id !== id),
    }));
  }

  const getAllCategories = () => {
    try {
      return categories.map((category) => {
        return <option value={category.id}>{category.name}</option>;
      });
    }
    catch (error) {
      toast.error("Įvyko klaida, susisiekite su administratoriumi!");
      console.log(error);
    }
  }
  const handleCancel = () => {
    navigate(`/skelbimas/${itemId}`);
  }

  if (!item || !categories) {
    return <div><Spinner>Loading...</Spinner></div>;
  }

  return (
    <div className='page-container'>
      <div className='outerBoxWrapper'>
        <Card className='custom-card'>
          <Toaster />
          <Card.Header className='header d-flex justify-content-between align-items-center'>
            <div className='text-center'>Skelbimo atnaujinimas</div>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group>
                {getExistingImages()}
              </Form.Group>
              <Form.Group className='mb-3 mt-3'>
                <Form.Control
                  type='file'
                  name='images'
                  multiple accept='image/*'
                  onChange={(e) => setImages([...e.target.files])} />
              </Form.Group>
              <Form.Group>
                {getAllImages()}
              </Form.Group>
              <Form.Group className='text-center mt-3'>
                <Form.Control
                  className='input'
                  type='text'
                  name='name'
                  id='name'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder='Pavadinimas'
                />
              </Form.Group>
              <Form.Group className='text-center form-control-description mb-3'>
                <Form.Control
                  as='textarea'
                  name='description'
                  id='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Aprašymas' />
              </Form.Group>
              <Form.Group className='text-center mb-3'>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Pasirinkite kategoriją</option>
                  {getAllCategories()}
                </Form.Select>
              </Form.Group>
              <div className='d-flex justify-content-between'>
                <Button onClick={(event) => handleSubmit(event)} type='submit'>Atnaujinti</Button>
                <Button onClick={(event) => handleCancel(event)} type='submit'>Atšaukti</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
    //<div className='itemOuterBox'>
    //  <Toaster />
    //  <div className='itemInnerBox'>
    //    <h2 className='itemBoxLabel'>Skelbimo atnaujinimas</h2>
    //    <div className='itemInputWrapper'>
    //      {getExistingImages()}
    //    </div>
    //    <div className='itemInputWrapper'>
    //      <input type='file' name='images' multiple accept='image/*' onChange={(e) => setImages([...e.target.files])}></input>
    //    </div>
    //    <form onSubmit={handleSubmit}>
    //      <div className='itemInputWrapper'>
    //        {getAllImages()}
    //      </div>
    //      <div className='itemInputWrapper'>
    //        <input type='text' name='name' id='name' defaultValue={item.name} placeholder='Pavadinimas' onChange={(event) => setName(event.target.value)}></input>
    //      </div>
    //      <div className='itemInputWrapper'>
    //        <textarea name='description' id='description' defaultValue={item.description} placeholder='Aprašymas' onChange={(event) => setDescription(event.target.value)} ></textarea>
    //      </div>
    //      <div className='itemInputWrapper'>
    //        <select value={category} onChange={(event) => setCategory(event.target.value)} >
    //          <option value="">Pasirinkite kategoriją</option>
    //          {getAllCategories()}
    //        </select>
    //      </div>
    //
    //      {showMessage &&
    //        <><h1 className='Message'>Paspauskite atnaujinti mygtuką, kad išsisaugotų pašalintos nuotraukos</h1></>
    //      }
    //      <div style={{ display: 'flex', paddingTop: '20px' }}>
    //        <div className='submitButton'>
    //        </div>
    //        <div className='cancelButton'>
    //        </div>
    //      </div>
    //    </form>
    //  </div>
    //</div>
  );
}

export default ItemUpdatePage;