import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";


const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const { isLoggedIn } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);


     const fetchCart = async () => {

        if (!isLoggedIn) {

            setCart(null);

            return;
        }


        try {

            setLoading(true);

            const response = await api.get(
                "/cart"
            );

            setCart(
                response.data.cart
            );

        } catch (error) {

            console.error(
                "Failed to fetch cart:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


     useEffect(() => {

        fetchCart();

    }, [isLoggedIn]);


     const addToCart = async (
        productId,
        quantity = 1
    ) => {

        const response = await api.post(
            "/cart/add",
            {
                productId,
                quantity
            }
        );


        setCart(
            response.data.cart
        );


        return response.data;
    };


     const updateQuantity = async (
        productId,
        quantity
    ) => {

        const response = await api.patch(
            `/cart/update/${productId}`,
            {
                quantity
            }
        );


        setCart(
            response.data.cart
        );


        return response.data;
    };


     const removeFromCart = async (
        productId
    ) => {

        const response = await api.delete(
            `/cart/remove/${productId}`
        );


        setCart(
            response.data.cart
        );


        return response.data;
    };


     const clearCart = async () => {

        const response = await api.delete(
            "/cart/clear"
        );


        setCart(
            response.data.cart
        );


        return response.data;
    };


     return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};


 export const useCart = () => {

    return useContext(CartContext);

};