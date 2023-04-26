import { useState } from "react"
import axios from "axios";
import { useRouter } from "next/router";


export default function ProductForm (
    {title: existingTitle,
    description: existingDescription,
    price: existingPrice}) {
    const [title, setTitle] = useState( existingTitle || '');
    const [description, setDescription] = useState( existingDescription ||'');
    const [price, setPrice] = useState( existingPrice || '');
    const [goToProducts, setGotoProducts] = useState(false);
    const router = useRouter();


    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price};
        await axios.post('/api/productsAPI', data);
        setGotoProducts(true);
    }

    if(goToProducts){
        router.push('/products');   
    }

    return (
        <form onSubmit={createProduct}> 
            <h1>New Product</h1>
            <label>Product name</label>
            <input type="text"
            placeholder="add product name here"
            value={title}
            onChange={ev => setTitle(ev.target.value)}>
            </input>
            <textarea placeholder="description" 
            value = {description}
            onChange={ev => setDescription(ev.target.value)}
            ></textarea>
            <label>Price (in VND)</label>
            <input type="text"
            placeholder="price"
            value = {price}
            onChange={ev => setPrice(ev.target.value)}></input>
            <button type="Submit"
            className="btn-primary sub-btn">Save</button>
        </form>
    )   
}