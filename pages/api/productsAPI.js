import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/productsModel";

export default async function handle (req, res) {
    const {method} = req; // This mean get the method property from req and assign it into method
    await mongooseConnect();
    
    if(method === 'GET'){
        res.json(await Product.find());
    }

    if(method === 'POST'){
        const {title, description, price} = req.body;
        const ProductDoc  = await Product.create({
            title,description,price,    
        })
        res.json(ProductDoc);
    }   
}