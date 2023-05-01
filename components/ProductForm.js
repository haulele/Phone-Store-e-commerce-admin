import { useEffect, useState } from "react"
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinners";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm (
    {_id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assignedProperties}) {
    const [title, setTitle] = useState( existingTitle || '');
    const [description, setDescription] = useState( existingDescription ||'');
    const [category,setCategory] = useState( assignedCategory || '');
    const [productProperties, setProductProperties] = useState( assignedProperties || {});
    const [images, setImages] = useState( existingImages || []);
    const [isUploading, setIsUploading] = useState(false);
    const [price, setPrice] = useState( existingPrice || '');
    const [goToProducts, setGotoProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const router = useRouter();

    useEffect(() =>{
        axios.get('/api/categoriesAPI').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price, images, category,
                    properties: productProperties};
        if (_id) {
            await axios.put('/api/productsAPI', {...data, _id}); 
            
        } else {
            await axios.post('/api/productsAPI', data);
            
        }
        setGotoProducts(true);
    }

    if(goToProducts){
        router.push('/products');   
    }

    async function uploadImages(ev){
        const files = ev.target?.files;
        if (files?.length > 0){
            setIsUploading(true);
            const data = new FormData();
            for(const file of files){ 
                data.append('file', file);
            }
            const res = await axios.post('/api/uploadAPI', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }
    function updateImagesOrder(images){
        setImages(images);
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);   
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text"
            placeholder="add product name here"
            value={title}
            onChange={ev => setTitle(ev.target.value)}>    
            </input>
            <label>Category</label>
            <select value={category}
            onChange={ev => setCategory(ev.target.value)}>
                <option value="">
                    Uncategorized
                </option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="flex gap-1">
                    <div>{p.name}</div>
                    <select
                        value = {productProperties[p.name]} 
                        onChange={ev => setProductProp(p.name, ev.target.value)}>
                        {p.values.map(v => (
                            <option value={v} >
                                {v}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable list={images}
                setList={updateImagesOrder}
                className="flex flex-wrap gap-1">
                    {!!images?.length && images.map(link =>(
                        <div key={link} className="h-24 "> 
                            <img src={link} alt="" className="rounded-lg"></img>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner></Spinner>
                    </div>
                    )
                }
                <label className="cursor-pointer w-24 h-24 text-center flex items-center
                justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" className="hidden" onChange={uploadImages}></input>
                </label>
            </div>
            <label>Description</label>
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