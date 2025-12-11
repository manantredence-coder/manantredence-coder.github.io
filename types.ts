/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Product {
  id: string;
  name: string;
  size: string; // e.g. "250g", "1kg"
  price: number;
  description: string;
  accentColor: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 'home' | 'shop' | 'about';
