import React from "react";
import { Product, FooterBanner, HeroBanner } from "../components";
import { urlFor } from "../lib/client";
import { client } from "../lib/client";

// export async function getStaticProps() {
//   try {
//     const query = '*[_type == "product"]'; // Replace with your query
//     const products = await client.fetch(query);

//     return {
//       props: { products },
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       props: { products: [] },
//     };
//   }
// }

// const Home = ({ products }) => {
//   return (
//     <div>
//       {products?.length > 0 ? (
//         products.map((product) => (
//           <div key={product._id}>
//             <h2>{product.name}</h2>
//             <img
//               src={urlFor(product.image).url()} // Assuming `product.image` exists
//               alt={product.name}
//             />
//           </div>
//         ))
//       ) : (
//         <p>No products available.</p>
//       )}
//     </div>
//   );
// };

// export default Home;

export default async function Home() {
  const query = '*[_type == "product"]'; // Replace with your query
  const products = await client.fetch(query); // Fetch products from Sanity
  console.log(products);
  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);
  console.log("Fetched banner data:", bannerData);

  return (
    <div>
      <HeroBanner heroBanner={bannerData?.length ? bannerData[0] : null} />
      <div className="products-heading">
        <h1>Best Selling products</h1>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {/* {console.log(bannerData)} */}
        {products?.length > 0 ? (
          products.map(
            (product) => <Product key={product._id} product={product} />
            /* <img
              src={product.image ? urlFor(product.image).url() : ""}
              alt={product.name}
            /> */
          )
        ) : (
          <p>No products available.</p>
        )}
      </div>

      <FooterBanner footerBanner={bannerData?.length ? bannerData[0] : null} />
    </div>
  );
}
