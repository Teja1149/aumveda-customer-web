import ProductCard
    from "./ProductCard";


import "../../styles/products-grid.css";


function ProductGrid({

    products = [],

}) {

    return (

        <div
            className="products-grid"
        >

            {
                products.map(
                    product => (

                        <ProductCard
                            key={
                                product.id
                            }

                            product={
                                product
                            }
                        />

                    )
                )
            }

        </div>

    );

}


export default ProductGrid;