import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import Product from '../../models/product';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
	return async (dispatch, getState) => {
		const userId = getState().auth.userId;
		try {
			const response = await fetch(
				'https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products.json',
				{
					method: 'GET',
				}
			);

			if (!response.ok) {
				throw new Error('Something went wrong!');
			}

			const responseData = await response.json();

			const loadedProducts = [];

			for (const key in responseData) {
				loadedProducts.push(
					new Product(
						key,
						responseData[key].ownerId,
						responseData[key].ownerPushToken,
						responseData[key].title,
						responseData[key].imageUrl,
						responseData[key].description,
						responseData[key].price
					)
				);
			}

			dispatch({
				type: SET_PRODUCTS,
				products: loadedProducts,
				userProducts: loadedProducts.filter((p) => p.ownerId === userId),
			});
		} catch (error) {
			// send to custom analytics server
			throw error;
		}
	};
};

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return token;
}

export const createProduct = (title, description, imageUrl, price) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const userId = getState().auth.userId;
		const pushToken = await registerForPushNotificationsAsync();
		const response = await fetch(
			`https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products.json?auth=${token}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description,
					imageUrl,
					price,
					ownerId: userId,
					ownerPushToken: pushToken
				}),
			}
		);

		if (!response.ok) {
			throw new Error('Something went wrong!');
		}

		const responseData = await response.json();

		dispatch({
			type: CREATE_PRODUCT,
			productData: {
				productId: responseData.name,
				title,
				description,
				imageUrl,
				price,
				ownerId: userId,
				ownerPushToken: pushToken
			},
		});
	};
};

export const updateProduct = (productId, title, description, imageUrl) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const response = await fetch(
			`https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					description,
					imageUrl,
				}),
			}
		);

		if (!response.ok) {
			throw new Error('Something went wrong!');
		}

		dispatch({
			type: UPDATE_PRODUCT,
			productData: { productId, title, description, imageUrl },
		});
	};
};

export const deleteProduct = (productId) => {
	return async (dispatch, getState) => {
		const token = getState().auth.token;
		const response = await fetch(
			`https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json?auth=${token}`,
			{
				method: 'DELETE',
			}
		);

		if (!response.ok) {
			throw new Error('Something went wrong!!!');
		}

		dispatch({ type: DELETE_PRODUCT, productId });
	};
};
