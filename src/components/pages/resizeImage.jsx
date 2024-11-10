import React, { useState, useCallback } from "react";
import Resizer from "react-image-file-resizer";

const ResizeImage = () => {
  const [newImage, setNewImage] = useState("");

  // Function to resize the image with canvas
  const resizeImageWithCanvas = (image, width, height) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Draw the image with high quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const aspectRatio = image.width / image.height;
    let sWidth, sHeight, sx, sy;

    if (aspectRatio > width / height) {
      sWidth = image.height * (width / height);
      sHeight = image.height;
      sx = (image.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = image.width;
      sHeight = image.width * (height / width);
      sx = 0;
      sy = (image.height - sHeight) / 2;
    }

    ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 1);
  };

  // Callback function to handle file change event
  const fileChangedHandler = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        Resizer.imageFileResizer(
          file,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            const img = new Image();
            img.src = uri;
            img.onload = async () => {
              const bitmap = await createImageBitmap(img);
              const exactResizedImageUri = resizeImageWithCanvas(
                bitmap,
                400,
                300
              );
              setNewImage(exactResizedImageUri);
            };
          },
          "base64"
        );
      } catch (err) {
        // console.log(err);
      }
    }
  }, []);

  return (
    <div className="App">
      <input type="file" onChange={fileChangedHandler} />
      {newImage && <img src={newImage} alt="Resized" />}
    </div>
  );
};

export default ResizeImage;
