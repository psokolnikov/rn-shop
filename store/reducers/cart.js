import CartItem from '../../models/cart-item';
import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
	items: {},
	totalAmount: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const prodPrice = addedProduct.price;
			const prodTitle = addedProduct.title;
			const pushToken = addedProduct.ownerPushToken;

			let updatedOrNewCartItem;

			if (state.items[addedProduct.id]) {
				updatedOrNewCartItem = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					prodPrice,
					prodTitle,
					pushToken,
					state.items[addedProduct.id].sum + prodPrice
				);
			} else {
				updatedOrNewCartItem = new CartItem(1, prodPrice, prodTitle, pushToken, prodPrice);
			}

			return {
				...state,
				items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
				totalAmount: state.totalAmount + prodPrice,
			};

		case REMOVE_FROM_CART:
			const selectedCartItem = state.items[action.productId];

			if (!selectedCartItem) return state;

			let updatedCartItems;
			if (selectedCartItem.quantity > 1) {
				const updatedCartItem = new CartItem(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.pushToken,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
	
				updatedCartItems = {...state.items, [action.productId]: updatedCartItem };
			} else {
				updatedCartItems = {...state.items};
				delete updatedCartItems[action.productId];
			}

			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice
			};
		case ADD_ORDER:
			return initialState;
		case DELETE_PRODUCT:
			const deletingProductId = action.productId;
			if (!state.items[deletingProductId]) {
				return state;
			}

			const updatedItems = {...state.items};
			const itemTotal = state.items[deletingProductId].sum;
			delete updatedItems[deletingProductId];
			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal
			};
		default:
			return state;
	}
};
