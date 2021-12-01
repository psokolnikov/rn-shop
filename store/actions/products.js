export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';

export const createProduct = (title, description, imageUrl, price) => {
    return { type: CREATE_PRODUCT, productData: { title, description, imageUrl, price }};
};

export const updateProduct = (productId, title, description, imageUrl) => {
    return { type: UPDATE_PRODUCT, productData: { productId, title, description, imageUrl }};
};

export const deleteProduct = (productId) => {
    return { type: DELETE_PRODUCT, productId };
};