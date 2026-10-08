import {
    Check,
    RotateCcw
} from "lucide-react";


import "../../styles/products.css";



function ProductFilters({

    categories = [],

    selectedCategory,

    categoryCounts = {},

    totalProducts = 0,

    onCategoryChange,

    onClear,

    hasActiveFilters

}) {


    return (

        <div
            className="
                product-filters
            "
        >


            <div
                className="
                    product-filters__heading
                "
            >

                <div>

                    <span>
                        SHOP
                    </span>

                    <h2>
                        Categories
                    </h2>

                </div>

            </div>



            <div
                className="
                    product-filters__list
                "
            >


                {/* ALL */}

                <button
                    type="button"
                    className={
                        `
                        product-filter-item
                        ${
                            selectedCategory === "all"
                                ? "is-active"
                                : ""
                        }
                        `
                    }
                    onClick={() =>
                        onCategoryChange(
                            "all"
                        )
                    }
                >

                    <span>
                        All Products
                    </span>


                    <small>
                        {totalProducts}
                    </small>


                    {
                        selectedCategory ===
                        "all" &&

                        <Check
                            size={15}
                        />
                    }

                </button>



                {/* CATEGORIES */}

                {
                    categories.map(
                        category => (

                            <button
                                key={
                                    category.id
                                }
                                type="button"
                                className={
                                    `
                                    product-filter-item
                                    ${
                                        selectedCategory ===
                                        category.id
                                            ? "is-active"
                                            : ""
                                    }
                                    `
                                }
                                onClick={() =>
                                    onCategoryChange(
                                        category.id
                                    )
                                }
                            >

                                <span>
                                    {
                                        category.name
                                    }
                                </span>


                                <small>
                                    {
                                        categoryCounts[
                                            category.id
                                        ] || 0
                                    }
                                </small>


                                {
                                    selectedCategory ===
                                    category.id &&

                                    <Check
                                        size={15}
                                    />
                                }

                            </button>

                        )
                    )

                }

            </div>



            {
                hasActiveFilters &&

                <button
                    type="button"
                    className="
                        product-filters__clear
                    "
                    onClick={
                        onClear
                    }
                >

                    <RotateCcw
                        size={14}
                    />

                    Reset Filters

                </button>

            }

        </div>

    );

}


export default ProductFilters;