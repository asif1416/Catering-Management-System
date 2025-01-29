'use client';
import { useEffect } from 'react';
import Home from './home/page';
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

const App = () => {
    const { initializeCart } = useCartStore();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const initializeApp = async () => {
            await checkAuth();
            await initializeCart();
        };

        initializeApp().then(r => r);
    }, [checkAuth, initializeCart]);

    return (
        <div>
            <Home />
        </div>
    );
};

export default App;