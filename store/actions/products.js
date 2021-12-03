import Product from '../../models/product';

export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
	return async (dispatch) => {
		try {
			const response = await fetch(
				'https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products.json',
				{
					method: 'GET',
				}
			);

            if (!response.ok) {
                throw new Error('Something went wrong!')
            }

			const responseData = await response.json();

			const loadedProducts = [];

			for (const key in responseData) {
				loadedProducts.push(
					new Product(
						key,
						'u1',
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
			});
		} catch(error) {
            // send to custom analytics server
            throw error;
        }
	};
};

export const createProduct = (title, description, imageUrl, price) => {
	return async (dispatch) => {
		const response = await fetch(
			'https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products.json',
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
				}),
			}
		);

        if (!response.ok) {
            throw new Error('Something went wrong!')
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
			},
		});
	};
};

export const updateProduct = (productId, title, description, imageUrl) => {
    return async dispatch => {
		const response = await fetch(
			`https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json`,
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
    }
};

export const deleteProduct = (productId) => {
    return async dispatch => {
        const response = await fetch(
			`https://rn-complete-guide-37303-default-rtdb.europe-west1.firebasedatabase.app/products/${productId}.json`,
			{
				method: 'DELETE'
			}
        );
        
        if (!response.ok) {
            throw new Error('Something went wrong!!!');
        }

        dispatch({ type: DELETE_PRODUCT, productId });
    }
};
