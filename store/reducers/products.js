import Product from '../../models/product';
import {
	CREATE_PRODUCT,
	UPDATE_PRODUCT,
	DELETE_PRODUCT,
	SET_PRODUCTS,
} from '../actions/products';

const initialState = {
	availableProducts: [],
	userProducts: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_PRODUCTS:
			return {
				availableProducts: action.products,
				userProducts: action.userProducts
			}
		case CREATE_PRODUCT:
			const newProduct = new Product(
				action.productData.productId,
				action.productData.ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				action.productData.price
			);

			return {
				...state,
				availableProducts: state.availableProducts.concat(newProduct),
				userProducts: state.userProducts.concat(newProduct),
			};
		case UPDATE_PRODUCT:
			const userProductIndex = state.userProducts.findIndex(
				(prod) => prod.id === action.productData.productId
			);
			const updatedProduct = new Product(
				action.productData.productId,
				state.userProducts[userProductIndex].ownerId,
				action.productData.title,
				action.productData.imageUrl,
				action.productData.description,
				state.userProducts[userProductIndex].price
			);
			const updatedUserProducts = [...state.userProducts];
			updatedUserProducts[userProductIndex] = updatedProduct;

			const availableProductIndex = state.availableProducts.findIndex(
				(prod) => prod.id === action.productData.productId
			);
			const updatedAvailableProducts = [...state.availableProducts];
			updatedAvailableProducts[availableProductIndex] = updatedProduct;
			return {
				...state,
				availableProducts: updatedAvailableProducts,
				userProducts: updatedUserProducts,
			};
		case DELETE_PRODUCT:
			const deletingProductId = action.productId;

			return {
				...state,
				availableProducts: state.availableProducts.filter(
					(product) => product.id != deletingProductId
				),
				userProducts: state.userProducts.filter(
					(product) => product.id != deletingProductId
				),
			};
		default:
			return state;
	}
};
