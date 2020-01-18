import React from "react";
import "./Gallery.scss";
import FruitBookPro from "./images/fruitbookpro.png";

// 1 is 1x, 2 is 2x
const IMAGE_QUALITY = window.devicePixelRatio || 2;

const Gallery = ({ children, className, ...props }) => (
  <div className={`Gallery ${className || ""}`} {...props}>
    {children}
  </div>
);

export default Gallery;
export const GalleryRow = ({ children, className, ...props }) => (
  <div className={`Gallery-row ${className || ""}`} {...props}>
    {children}
  </div>
);
export const GalleryItem = ({ children, className, ...props }) => (
  <div className={`Gallery-item ${className || ""}`} {...props}>
    {children}
  </div>
);
export const GalleryImage = ({
  src,
  className,
  bgProps,
  doubleWidth,
  ...props
}) => (
  <div className={`Gallery-image-container ${className || ""}`} {...props}>
    <div className="Gallery-image-background-container">
      <img
        className="Gallery-image-background"
        src={FruitBookPro}
        alt="fruitbookpro"
        style={{
          top: "-5%",
          left: "-15%",
          width: "130%",
          maxWidth: "none"
        }}
      />
    </div>
    <div className="Gallery-image-wrapper">
      <img
        className="Gallery-image"
        alt={altify(src)}
        src={src}
        srcSet={srcsetify(src)}
        sizes={
          doubleWidth
            ? `(max-width: 960px) 100vw, 960px`
            : `(max-width: 576px) 100vw, (max-width: 735px) 576px, (max-width: 1200px) 50vw, 576px`
        }
      />
    </div>
  </div>
);
export const GalleryText = ({ children }) => (
  <div className="Gallery-text">{children}</div>
);

function altify(src) {
  return ((src || "").split("images/")[1] || `${src}.`)
    .split(".")
    .reverse()
    .slice(1)
    .reverse()
    .join(".");
}

function srcsetify(src) {
  const frags = src.split(".");
  const name = frags.slice(0, frags.length - 1).join(".");
  const ext = frags[frags.length - 1];
  let srcset = [];
  for (var i = 0; i < 3; i++) {
    srcset.push(
      name +
        (i ? `.x${i + 1}` : "") +
        `.${ext} ${(i + 1) * (1120 / IMAGE_QUALITY)}w`
    );
  }
  return srcset.join(", ");
}
