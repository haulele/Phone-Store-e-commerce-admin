import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const [productInfo, setProductinfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() =>{
        if(!id) {
            return;
        }
        axios.get('/api/productsAPI?id=' +id).then(response => {
            setProductinfo(response.data);
            // console.log(response.data);
        });
    }, [id]);
    return (
        <Layout>
            <h1>Edit Product</h1>
            {productInfo && (
            <ProductForm {...productInfo}></ProductForm>)}
        </Layout>
    );
}