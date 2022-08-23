import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { readFileAsDataURL, setImagePreviewFromInput } from '../../../../lib/utils';
import style from './RectangularDropzone.module.css';

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

const CircularDropzone = React.forwardRef(({
  name,
  label,
  onChange,
  src,
  isSquare,
  ...rest
}: CircularDropzoneProps, ref: any) => {
  const [inputElement, setInputElement] = useState<HTMLInputElement>();
  const [imageSrc, setImageSrc] = useState<string>("");
  const imageRef = useRef<any>();

  useEffect(() => {
    async function setUpImage() {
      if (!src) return;
      if (typeof src === "string") setImageSrc(src);
      else {
        const dataURL = await readFileAsDataURL(src) as string;
        setImageSrc(dataURL)
      }
    }
    setUpImage();
    const element = document?.querySelector?.(`#dropzone-${name}`) as HTMLInputElement;
    setInputElement(element);
    element.value = '';
  }, [name, src]);

  return (
    <label className={`${style.circular_dropzone} ${isSquare && style.is_square}`} htmlFor={`dropzone-${name}`}>
      {label}
      <img
        ref={imageRef}
        className={`${style.image_preview} ${isSquare && style.is_square}`}
        src={imageSrc}
      />
      <input
        id={`dropzone-${name}`}
        name={name}
        type="file"
        accept="image/*"
        hidden
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          inputElement && setImagePreviewFromInput(inputElement, imageRef.current);
          onChange?.(e);
        }}
        ref={ref}
        {...rest}
      />
    </label>
  )
});

CircularDropzone.displayName = "CircularDropzone";
export default CircularDropzone;
