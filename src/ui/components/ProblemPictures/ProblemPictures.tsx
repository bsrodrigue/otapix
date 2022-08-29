const PICTURE_DIMENSION = '100%';
const PICTURE_WIDTH = PICTURE_DIMENSION;

interface Props {
  pictures: string[];
}

export default function ProblemPictures(props: Props) {
  const { pictures } = props;
  return (
    <div className="wrapper" style={{ maxWidth: '40em' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          gap: '1em',
        }}
      >
        {pictures.map((picture) => (
          <img className="picture" width={PICTURE_WIDTH} style={{ aspectRatio: '1/1' }} src={picture} />
        ))}
      </div>
    </div>
  );
}
