const apiUrl = process.env.REACT_APP_API_URL;

export const fetchProducts = async () => {
    const response = await fetch(`${apiUrl}/products`);
    const data = await response.json();
    return data;
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${apiUrl}/products/${id}`);
    const data = await response.json();
    return data;
};
