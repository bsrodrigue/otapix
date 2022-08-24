import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  readFileAsDataURL,
  setImagePreviewFromInput,
} from "../../../../lib/utils";
import style from "./RectangularDropzone.module.css";

interface CircularDropzoneProps {
  name?: string;
  label?: string;
  onChange?: any;
  onBlur?: any;
  ref?: any;
  value?: any;
  src?: string | File;
  isSquare?: boolean;
}

const CircularDropzone = React.forwardRef(
  (
    { name, label, onChange, src, isSquare, ...rest }: CircularDropzoneProps,
    ref: any
  ) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const previewRef = useRef<any>();

    useEffect(() => {
      async function setUpImage() {
        if (!src) {
          setImageSrc("");
          return;
        }
        if (typeof src === "string") setImageSrc(src);
        else {
          if (src instanceof FileList) {
            src = src[0];
          }
          const dataURL = (await readFileAsDataURL(src)) as string;
          setImageSrc(dataURL);
        }
      }
      setUpImage();
    }, [name, src]);

    return (
      <label
        className={`${style.circular_dropzone} ${isSquare && style.is_square}`}
        htmlFor={`dropzone-${name}`}
      >
        {label}
        {imageSrc ? (
          <img
            ref={previewRef}
            className={`${style.image_preview} ${isSquare && style.is_square}`}
            src={imageSrc}
          />
        ) : (
          <img
            ref={previewRef}
            className={`${style.image_preview} ${isSquare && style.is_square}`}
          />
        )}
        <input
          id={`dropzone-${name}`}
          name={name}
          type="file"
          accept="image/*"
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setImagePreviewFromInput(e.target, previewRef.current);
            onChange?.(e);
          }}
          ref={ref}
          {...rest}
        />
      </label>
    );
  }
);

CircularDropzone.displayName = "CircularDropzone";
export default CircularDropzone;
