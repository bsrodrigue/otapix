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
}

const CircularDropzone = React.forwardRef(({ name, label, onChange, ...rest }: CircularDropzoneProps, ref: any) => {
    const [inputElement, setInputElement] = useState<HTMLInputElement>();
    const imageRef = useRef<any>();

    useEffect(() => {
        const element = document?.querySelector?.(`#dropzone-${name}`) as HTMLInputElement;
        document && element && setInputElement(element);
    }, [name]);

    return (
        <label className={style.circular_dropzone} htmlFor={`dropzone-${name}`}>
            {label}
            <img
                ref={imageRef}
                className={style.image_preview}
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