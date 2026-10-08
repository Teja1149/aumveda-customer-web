import { api } from "./api";


// ============================================================
// HOME HERO
// ============================================================

export async function getHomeHero() {

    const response =
        await api.get(
            "/home/hero"
        );

    return response.data;

}


// ============================================================
// HOME CATEGORIES
// ============================================================

export async function getHomeCategories() {

    const response =
        await api.get(
            "/home/categories"
        );

    return response.data;

}