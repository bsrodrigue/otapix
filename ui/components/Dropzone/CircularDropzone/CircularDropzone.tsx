import { ChangeEvent, useRef } from 'react';
import { setImagePreviewFromInput } from '../../../../lib/utils';
import style from './CircularDropzone.module.css';

interface CircularDropzoneProps {
    name?: string;
    label?: string;
}

export default function CircularDropzone({ name, label }: CircularDropzoneProps) {
    const inputRef = useRef<any>();
    const imageRef = useRef<any>();

    console.log(inputRef.current);

    return (
        <label className={style.circular_dropzone} htmlFor={`dropzone-${name}`}>
            {label}
            <img
                ref={imageRef}
                className={style.image_preview}
            />
            <input
                id={`dropzone-${name}`}
                ref={inputRef}
                name={name}
                type="file"
                accept="image/*"
                hidden

                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setImagePreviewFromInput(inputRef.current, imageRef.current);
                }}
            />
        </label>
    )

}
