export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface OrderPlatform {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  color: string;
}
