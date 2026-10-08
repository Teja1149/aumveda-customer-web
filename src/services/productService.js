import api from "./api";



// ============================================================
// GET ALL PRODUCTS
// ============================================================

export async function getProducts(params = {}) {

    try {

        const response = await api.get(
            "/products",
            {
                params
            }
        );

        return Array.isArray(response)
            ? response
            : response?.data || [];

    } catch (error) {

        console.error(
            "Get products API failed:",
            error
        );

        throw error;

    }

}



// ============================================================
// GET CATEGORIES
// ============================================================

export async function getCategories() {

    try {

        const response = await api.get(
            "/products/categories"
        );

        return Array.isArray(response)
            ? response
            : response?.data || [];

    } catch (error) {

        console.error(
            "Get categories API failed:",
            error
        );

        throw error;

    }

}



// ============================================================
// GET PRODUCT BY SLUG
// ============================================================

export async function getProductBySlug(
    slug
) {

    if (!slug) {

        throw new Error(
            "Product slug is required"
        );

    }


    try {

        const response = await api.get(
            `/products/${slug}`
        );

        return Array.isArray(response)
            ? response[0]
            : response?.data || response;

    } catch (error) {

        console.error(
            "Get product details failed:",
            error
        );

        throw error;

    }

}