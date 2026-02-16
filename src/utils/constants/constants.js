export const CONSTANTS = {
    PORT: 8080,
    BASEURL: `http://localhost:8080`,
    DIR_URL_PRODUCTS: '/api/products',
    DIR_URL_CARTS: '/api/carts',
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PURCHASE_NOT_FOUND: 'Compra no encontrada.',
    PRODUCT_CREATE_ALLOWED_FIELDS: [
        "id",
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock",
        "code",
        "status"
    ],
    PRODUCT_EDIT_ALLOWED_FIELDS: [
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock",
        "code",
        "status"
    ],
    PRODUCT_FIELDS_SCHEMA: {
        id: "string",
        title: "string",
        price: "number",
        category: "string",
        thumbnails: "array:string",
        description: "string",
        stock: "integer",
        code: "string",
        status: "boolean"
    },
    CART_CREATE_ALLOWED_FIELDS: [
        "productId",
        "quantity"
    ],
    CART_EDIT_ALLOWED_FIELDS: [
        "quantity"
    ],
    CART_FIELDS_SCHEMA: {
        productId: "string",
        quantity: "number"
    }
}