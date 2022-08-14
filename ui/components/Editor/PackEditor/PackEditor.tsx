import { CircularDropzone } from '../../Dropzone/CircularDropzone';
import style from './PackEditor.module.css';

export default function PackEditor() {


    return (

        <div className={style.container}>
            <p>Couverture</p>
            <CircularDropzone />

            <p>Titre</p>
            <input type="text" />


            <p>Difficulte</p>
            <small>Veuillez choisir une difficulte pour votre pack</small>
        </div>
    );
}