import {ProductForm} from "../../components/product/ProductForm.jsx";
import {useProduct} from "../../hooks/product/useProduct.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export const RegisterProductPage = () => {
    const {initialProductForm, products = []} = useProduct();
    const [productSelected, setProductSelected] = useState(initialProductForm);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            const productId = parseInt(id);
            const product = products.find(product => product.id === productId);
            if (product) {
                setProductSelected(product);
            }
        }
    }, [id, products])

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <ProductForm productSelected={productSelected}/>
            </div>
        </div>
    );
}
