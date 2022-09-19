import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { readFileAsDataURL, setImagePreviewFromInput } from "../../../../lib/utils";
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
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

const CircularDropzone = React.forwardRef(
  ({ name, label, onChange, src, isSquare, className, ...rest }: CircularDropzoneProps, ref: any) => {
    const [imageSrc, setImageSrc] = useState<string>("");
    const { setValue } = useFormContext();
    const previewRef = useRef<any>();

    useEffect(() => {
      async function setUpImage() {
        if (!src) {
          setImageSrc("");
          return;
        }
        if (typeof src === "string") setImageSrc(src);
        else if (src instanceof FileList) {
          if (src.length === 0) {
            setImageSrc("");
            return;
          }
          src = src[0];
          const dataURL = (await readFileAsDataURL(src)) as string;
          setImageSrc(dataURL);
        }
      }
      setUpImage();
    }, [name, src]);

    return (
      <label className={`${style.circular_dropzone} ${isSquare && style.is_square} ${className}`} htmlFor={`dropzone-${name}`}>
        {label}
        {imageSrc ? (
          <img ref={previewRef} className={`${style.image_preview} ${isSquare && style.is_square}`} src={imageSrc} />
        ) : (
          <img ref={previewRef} className={`${style.image_preview} ${isSquare && style.is_square}`} />
        )}
        <input
          id={`dropzone-${name}`}
          name={name}
          type="file"
          accept="image/*"
          hidden
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setImagePreviewFromInput(e.target, previewRef.current);

            const pictures = Array.from(e.target.files || []);
            if (pictures?.length && pictures.length > 1) {
              for (let j = 0; j < pictures.length; j++) {
                const dT = new DataTransfer();
                dT.items.add(new File([pictures[j]], `puzzle-pic-${j}`));
                setValue(`puzzle-pic-${j + 1}`, dT.files);
              }
              if (!(pictures?.length && pictures.length < 4))
                return;
            }

            onChange?.(e);
          }}
          ref={ref}
          {...rest}
        />
      </label>
    );
  },
);

CircularDropzone.displayName = "CircularDropzone";
export default CircularDropzone;
