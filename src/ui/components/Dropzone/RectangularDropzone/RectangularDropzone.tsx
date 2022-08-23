import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { setImagePreviewFromInput } from '../../../../lib/utils';
import style from './RectangularDropzone.module.css';

interface CircularDropzoneProps {
    name?: string;
    label?: string;
    onChange?: any;
    onBlur?: any;
    ref?: any;
    value?: any;
    src?: string;
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
    const imageRef = useRef<any>();

    useEffect(() => {
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
                src={src}
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