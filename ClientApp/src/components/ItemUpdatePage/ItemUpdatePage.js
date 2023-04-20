import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ItemUpdatePage.css';

function ItemUpdatePage() {
  const { itemId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pasirinkite kategoriją');
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get("api/item/getCategories")
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.log(error);
            toast("Įvyko klaida, susisiekite su administratoriumi!");
        })
}, []);

  useEffect(() => {
    async function fetchItem() {
      const response = await axios.get(`/api/item/getItem/${itemId}`);
      setItem(response.data);
    }
    fetchItem();
  }, [itemId]);
  
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const data = { name: name || item.name, description: description || item.description, fk_Category: category || category};
      await axios.put(`/api/item/update/${itemId}`, data);
      toast.success('Item updated successfully!');
      setName('');
      setDescription('');
      setCategory('');
    } catch (error) {
      console.log(error);
      toast('Ivyko klaida, susisiekite su administratoriumi!');
    }
  };

  const getAllCategories = () => {
    try {
        return categories.map((category) => {
            return <option value={category.id}>{category.name}</option>;
        });
    }
    catch (error) {
        toast("Įvyko klaida, susisiekite su administratoriumi!");
        console.log(error);
    }
}

  if (!item || !categories) {
      return <div><Spinner>Loading...</Spinner></div>;
  }

  return (
    <div className='itemOuterBox'>
    <Toaster />
    <div className='itemInnerBox'>
        <h2 className='itemBoxLabel'>Skelbimo atnaujinimas</h2>
        <form onSubmit={handleSubmit}>
        <div className='itemInputWrapper'>
            <input type='text' name='name' id='name' defaultValue= {item.name} placeholder='Pavadinimas' onChange={(event) => setName(event.target.value)}></input>
        </div>
        <div className='itemInputWrapper'>
            <textarea name='description' id='description' defaultValue={item.description} placeholder='Aprašymas' onChange={(event) => setDescription(event.target.value)} ></textarea>
        </div>
        <div className='itemInputWrapper'>
        <select value={category}  onChange={(event) => setCategory(event.target.value)} >
                        <option value="">Pasirinkite kategoriją</option>
                        {getAllCategories()}
                    </select>
        </div>
        <div style={{ display: 'flex', paddingTop: '20px' }}>
        <button type="submit" onClick={(event) => handleSubmit(event)}>Update Item</button>
        </div>
        </form>
    </div>
</div>
  );
}

export default ItemUpdatePage;