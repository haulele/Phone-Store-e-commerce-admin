import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const [productInfo, setProductinfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    console.log(id);
    useEffect(() =>{
        if(!id) {
            return;
        }
        axios.get('/api/productsAPI?id=' +id).then(response => {
            // setProductinfo(response.data);
            console.log(response.data);
        });
    }, [id]);
    return (
        <Layout>
            <ProductForm {...productInfo}></ProductForm>
        </Layout>
    )
}