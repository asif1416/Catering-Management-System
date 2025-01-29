'use client';
import {useEffect} from 'react';
import Home from './home/page';
import {useAuthStore} from "@/store/auth-store";
import {useCartStore} from "@/store/cart-store";

const App = () => {
    const {checkAuth} = useAuthStore();
    const { initializeCart } = useCartStore();

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const authenticated = await checkAuth();
                if(authenticated){
                    await initializeCart()
                }
            } catch (err: any) {
                console.error("Failed to initialize", err);
            }
        };

        initializeApp();
    }, [checkAuth]);


    return (
        <div>
            <Home/>
        </div>
    );
};

export default App;