import { notFound } from "next/navigation";
import api from "@/api/api";
import MenuItemDetails from '../MenuItemDetails';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    available: boolean;
}

async function fetchMenuItem(id: string): Promise<MenuItem | null> {
    const response = await api.get(`http://localhost:3000/menu/${id}`);

    if (!response) {
        return null;
    }

    return response.data;
}

export default async function MenuItem({params,}: { params: { id: string }; }) {
    const { id } = params;

    if (!id) {
        notFound();
    }

    const menuItem = await fetchMenuItem(id);

    if (!menuItem) {
        notFound();
    }

    return (
        <>
            <Navbar />
            <div className="mx-auto w-2/3">
                <MenuItemDetails menuItem={menuItem} />
            </div>
            <Footer />
        </>

    );
}
