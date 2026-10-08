import {
    ArrowDownUp
} from "lucide-react";


import "../../styles/products.css";



function ProductSort({
    value,
    onChange
}) {


    return (

        <label
            className="
                product-sort
            "
        >

            <ArrowDownUp
                size={16}
            />


            <span>
                Sort
            </span>


            <select
                value={value}
                onChange={
                    event =>
                        onChange(
                            event.target.value
                        )
                }
                aria-label="Sort products"
            >

                <option value="popular">
                    Popularity
                </option>

                <option value="rating">
                    Highest Rated
                </option>

                <option value="price_low">
                    Price: Low to High
                </option>

                <option value="price_high">
                    Price: High to Low
                </option>

                <option value="name">
                    Name: A–Z
                </option>

            </select>

        </label>

    );

}


export default ProductSort;