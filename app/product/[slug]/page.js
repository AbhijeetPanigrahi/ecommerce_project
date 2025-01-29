import { client } from "../../../lib/client";
import ProductDetailDisplay from "../../../components/ProductDetailDisplay";
import Product from "../../../components/product";
import { useStateContext } from "../../../context/StateContext";

const ProductDetails = async ({ params }) => {
  const { slug } = params;

  // Updated Query
  // const query = `*[_type == "product" && slug.current == "${slug}"][0] {
  //   name,
  //   price,
  //   details,
  //   image // Fetch all images from the image array
  // }`;

  // In ProductDetails.js, update the query to fetch all images
  const query = `*[_type == "product" && slug.current == "${slug}"][0] {
  name,
  price,
  details,
  image[] // Ensure you fetch the entire image array
}`;

  const productData = await client.fetch(query);

  // Debugging: Log the fetched data
  console.log("Fetched Product Data:", productData);
  console.log("Fetched Images:", productData.image);

  if (!productData) {
    return <div>Product not found.</div>;
  }

  const relatedProductsQuery = `*[_type == "product" && slug.current != "${slug}"]`;
  const relatedProducts = await client.fetch(relatedProductsQuery);

  return (
    <div>
      <ProductDetailDisplay productData={productData} />
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="maylike-products-container track">
          {relatedProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
