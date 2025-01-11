import Image from 'next/image';
import { StaticImageData } from "next/image";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface FoodCardsProps {
  cards: MenuItem[];
  images: { src: string | StaticImageData; alt: string }[];

}


export default function MenuCards
({ cards, images }: FoodCardsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto"
        style={{ maxHeight: '820px' }} 
      >
        {cards.map((card, index) => (  
          <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={images[index]?.src || '/placeholder.svg'}  
                alt={images[index]?.alt || "Menu Item Image"} 
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
              <p className="text-gray-600 mb-2">{card.description}</p>
              <p className="text-primary font-bold">${card.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Category: {card.category}</p>
              <p className={`text-sm ${card.available ? 'text-green-500' : 'text-red-500'} mt-1`}>
                {card.available ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
