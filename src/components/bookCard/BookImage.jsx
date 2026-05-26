import { useState } from "react";
import defaultBookImage from "../../assets/default.png";
import "./BookImageStyle.css";

function BookImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src || defaultBookImage);

  return (
    <div className="book-image-wrapper">
      <img
        src={imageSrc}
        alt={alt || "기본 책 이미지"}
        className="book-image"
        onError={() => setImageSrc(defaultBookImage)}
      />
    </div>
  );
}

export default BookImage;
