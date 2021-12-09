class Product {
    constructor(id, ownerId, ownerPushToken, title, imageUrl, description, price) {
        this.id = id;
        this.ownerId = ownerId;
        this.ownerPushToken = ownerPushToken;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
}

export default Product;