import type { Category, MenuItem, OrderPlatform } from '@/types';

export const bestSellers: MenuItem[] = [
  {
    id: 'popcorn-l',
    name: 'Chicken Popcorn L',
    price: 120,
    category: 'bestseller',
    image: '/chicken-popcorn.jpg',
  },
  {
    id: 'chicken-burger',
    name: 'Chicken Burger',
    price: 60,
    category: 'bestseller',
    image: '/chicken-burger.jpg',
  },
  {
    id: 'combo-1',
    name: 'Combo 1',
    price: 230,
    category: 'bestseller',
    image: '/combo-meal.jpg',
    description: 'Chicken Popcorn M, Chicken Pakora (2 pcs), Strips (2 pcs), Chicken Burger (1 pc)',
  },
];

export const menuCategories: Category[] = [
  {
    id: 'boneless',
    name: 'Boneless',
    items: [
      { id: 'strips-3', name: 'Strips (3 pcs)', price: 70, category: 'boneless' },
      { id: 'strips-5', name: 'Strips (5 pcs)', price: 100, category: 'boneless' },
      { id: 'strips-8', name: 'Strips (8 pcs)', price: 150, category: 'boneless' },
      { id: 'popcorn-m', name: 'Chicken Popcorn M', price: 80, category: 'boneless' },
      { id: 'popcorn-l', name: 'Chicken Popcorn L', price: 120, category: 'boneless' },
      { id: 'fish-finger-3', name: 'Fish Finger (3 pcs)', price: 80, category: 'boneless' },
      { id: 'fish-finger-5', name: 'Fish Finger (5 pcs)', price: 130, category: 'boneless' },
      { id: 'fish-finger-8', name: 'Fish Finger (8 pcs)', price: 200, category: 'boneless' },
      { id: 'veg-finger', name: 'Veg Finger (8 pcs)', price: 130, category: 'boneless' },
      { id: 'fish-cutlet', name: 'Fish Cutlet', price: 30, category: 'boneless' },
      { id: 'french-fries', name: 'French Fries', price: 80, category: 'boneless' },
      { id: 'maggi-popcorn', name: 'Maggi Popcorn', price: 90, category: 'boneless' },
      { id: 'cheese-popcorn', name: 'Cheese Popcorn', price: 210, category: 'boneless' },
    ],
  },
  {
    id: 'with-bone',
    name: 'With Bone',
    items: [
      { id: 'chicken-pakora', name: 'Chicken Pakora', price: 30, category: 'with-bone' },
      { id: 'leg-piece', name: 'Leg Piece', price: 70, category: 'with-bone' },
      { id: 'chest-piece', name: 'Chest Piece', price: 80, category: 'with-bone' },
      { id: 'hot-wings', name: 'Hot Wings', price: 40, category: 'with-bone' },
      { id: 'full-leg-double', name: 'Full Leg Piece Double', price: 299, category: 'with-bone' },
      { id: 'chicken-1006', name: 'Chicken 1006 (6 pcs)', price: 299, category: 'with-bone' },
      { id: 'chicken-thai', name: 'Chicken Thai Piece (2 pcs)', price: 80, category: 'with-bone' },
    ],
  },
  {
    id: 'pizza',
    name: 'Pizza',
    items: [
      { id: 'chicken-pizza', name: 'Chicken Pizza', price: 180, category: 'pizza' },
      { id: 'veg-pizza', name: 'Veg Pizza', price: 160, category: 'pizza' },
      { id: 'paneer-pizza', name: 'Paneer Pizza', price: 180, category: 'pizza' },
    ],
  },
  {
    id: 'combo-pack',
    name: 'Combo Pack',
    items: [
      { 
        id: 'combo-1', 
        name: 'Combo 1', 
        price: 230, 
        category: 'combo-pack',
        description: 'Chicken Popcorn M, Chicken Pakora (2 pcs), Strips (2 pcs), Chicken Burger (1 pc)',
      },
      { 
        id: 'combo-2', 
        name: 'Combo 2', 
        price: 330, 
        category: 'combo-pack',
        description: 'Strips (6 pcs), Leg Piece (2 pcs), Chest Piece (2 pcs)',
      },
      { 
        id: 'combo-3', 
        name: 'Combo 3', 
        price: 550, 
        category: 'combo-pack',
        description: 'Hot Wings (4 pcs), Leg Piece (2 pcs), Popcorn L, Chicken Burger (2 pcs), Egg Burger (2 pcs)',
      },
    ],
  },
  {
    id: 'burger',
    name: 'Burger',
    items: [
      { id: 'potato-burger', name: 'Potato Burger', price: 50, category: 'burger' },
      { id: 'potato-cheese-burger', name: 'Potato Cheese Burger', price: 65, category: 'burger' },
      { id: 'veg-burger', name: 'Veg Burger', price: 50, category: 'burger' },
      { id: 'chicken-burger', name: 'Chicken Burger', price: 60, category: 'burger' },
      { id: 'chicken-cheese-burger', name: 'Chicken Cheese Burger', price: 70, category: 'burger' },
      { id: 'chicken-hot-spice', name: 'Chicken Hot & Spice Burger', price: 70, category: 'burger' },
      { id: 'egg-burger', name: 'Egg Burger', price: 50, category: 'burger' },
      { id: 'egg-chicken-burger', name: 'Egg with Chicken Burger', price: 75, category: 'burger' },
    ],
  },
  {
    id: 'drinks-others',
    name: 'Drinks & Others',
    items: [
      { id: 'lassi', name: 'Lassi', price: 40, category: 'drinks-others' },
      { id: 'masala-coke', name: 'Masala Coke', price: 45, category: 'drinks-others' },
      { id: 'tea', name: 'Tea', price: 15, category: 'drinks-others' },
      { id: 'coffee', name: 'Coffee', price: 20, category: 'drinks-others' },
      { id: 'extra-cheese', name: 'Extra Cheese', price: 20, category: 'drinks-others' },
      { id: 'extra-egg', name: 'Extra Egg', price: 20, category: 'drinks-others' },
      { id: 'bbq-chicken', name: 'BBQ Chicken (8 pcs)', price: 450, category: 'drinks-others' },
    ],
  },
];

export const orderPlatforms: OrderPlatform[] = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    description: 'Order via Swiggy',
    icon: 'swiggy',
    url: 'https://www.swiggy.com/menu/577227?source=sharing',
    color: '#fc8019',
  },
  {
    id: 'zomato',
    name: 'Zomato',
    description: 'Order via Zomato',
    icon: 'zomato',
    url: 'https://www.zomato.com/uluberia/sfc-spezia-fried-chicken-uluberia-locality/order?v=o2',
    color: '#cb202d',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Direct chat & order',
    icon: 'whatsapp',
    url: 'https://wa.me/918961186552',
    color: '#25d366',
  },
];

export const businessInfo = {
  name: 'SFC – Spezia Fried Chicken',
  location: 'Uluberia, Howrah',
  address: 'Road, Bazarpura, Uluberia, Howrah, West Bengal 711316',
  phone: '89611 86552',
  whatsapp: '918961186552',
  hours: '3 PM – 10 PM',
  rating: 4.3,
  reviews: 64,
  since: 2022,
  mapUrl: 'https://maps.app.goo.gl/nk7aygqWqXXiuAfL9',
};
