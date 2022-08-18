import { Dispatch, SetStateAction } from 'react';
import { RectangularDropzone } from '../../Dropzone';
import style from './PuzzleEditor.module.css';

interface PuzzleEditorProps {
  isOpen?: boolean;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function PuzzleEditor({ isOpen, setIsOpen }: PuzzleEditorProps) {

  return (
    <>
      {
        isOpen ? (
          <div className={style.container}>
            <div className={style.editor}>
              <p>Images</p>
              <small>Placez les images d&apos;indices</small>
              <div className={style.picture_fields}>
                {
                  [1, 2, 3, 4].map((value, key) => (
                    <RectangularDropzone
                      key={key}
                      name={`puzzle-pic-${value}`}
                      isSquare
                    />
                  ))
                }
              </div>

              <p>Nom a deviner</p>
              <input
                className={style.title_input}
                type="text"
                placeholder='Entrez le nom que les joueurs doivent deviner...'
              />
              {/* <button className={`${style.action} success`}>Ajouter</button> */}
              <button onClick={() => {
                setIsOpen?.(false)
                document.getElementById("puzzle-grid-container")?.scrollIntoView({ behavior: 'smooth' });
              }} className={`${style.action} danger`}>Annuler</button>
            </div>
          </div>
        ) : (
          <>
          </>
        )
      }
    </>
  )
}
