"use client";

import React, { useState } from "react";
import { useStateContext } from "@/context/StateContext";
import {
  AiFillStar,
  AiOutlineStar,
  AiOutlinePlus,
  AiOutlineMinus,
} from "react-icons/ai";
import { urlFor } from "../lib/client";

const ProductDetailDisplay = ({ productData }) => {
  const { name, price, image, details } = productData;

  const [index, setIndex] = useState(0); // Manage image carousel state
  const [quantity, setQuantity] = useState(1); // Manage quantity state

  // const handleDecrease = () => setQuantity((prev) => Math.max(prev - 1, 1));
  // const handleIncrease = () => setQuantity((prev) => prev + 1);
  const { decQty, incQty, qty, onAdd } = useStateContext();

  return (
    <div className="product-detail-container">
      <div>
        <div className="image-container">
          {/* Render the selected image */}
          <img
            src={urlFor(image && image[index]).url()}
            alt={name}
            className="product-detail-image"
          />
        </div>
        <div className="small-images-container">
          {image?.length > 0 ? (
            image.map((img, i) => {
              const imgUrl = urlFor(img).url(); // Resolve the image URL
              return (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Thumbnail ${i}`}
                  className={
                    i === index ? "small-image selected-image" : "small-image"
                  }
                  onMouseEnter={() => setIndex(i)} // Set the selected image index
                />
              );
            })
          ) : (
            <p>No additional images available</p>
          )}
        </div>
      </div>
      <div className="product-detail-desc">
        <h1>{name}</h1>
        <div className="reviews">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiOutlineStar />
          <p>(50 reviews)</p>
        </div>
        <h4>Details:</h4>
        <p>{details}</p>
        <p className="price">${price}</p>
        <div className="quantity">
          <h3>Quantity:</h3>
          <p className="quantity-desc">
            <span className="minus" onClick={decQty}>
              <AiOutlineMinus />
            </span>
            <span className="num">{qty}</span>
            <span className="plus" onClick={incQty}>
              <AiOutlinePlus />
            </span>
          </p>
        </div>
        <div className="buttons">
          <button
            type="button"
            className="add-to-cart"
            onClick={() => onAdd(productData, qty)}
          >
            Add to Cart
          </button>
          <button type="button" className="buy-now">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailDisplay;
