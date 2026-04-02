export const CONSTANTS = {
    PORT: 8080,
    BASEURL: `http://localhost:8080`,
    DIR_URL_ROOT: '/api',
    DIR_URL_PRODUCTS: '/products',
    DIR_URL_CARTS: '/carts',
    PRODUCT_NOT_FOUND: 'Producto no encontrado.',
    PURCHASE_NOT_FOUND: 'Compra no encontrada.',
    PRODUCT_CREATE_ALLOWED_FIELDS: [
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock"
    ],
    PRODUCT_EDIT_ALLOWED_FIELDS: [
        "title",
        "price",
        "category",
        "thumbnails",
        "description",
        "stock",
        "status"
    ],
    PRODUCT_FIELDS_SCHEMA: {
        title: "string",
        price: "number",
        category: "string",
        thumbnails: "array:string",
        description: "string",
        stock: "integer",
        status: "boolean"
    },
    CART_CREATE_ALLOWED_FIELDS: [
        "productId",
        "quantity"
    ],
    CART_FIELDS_SCHEMA: {
        productId: "string",
        quantity: "number"
    }
}