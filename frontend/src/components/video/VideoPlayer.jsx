import ReactPlayer from 'react-player';

export default function VideoPlayer({ url }) {
  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="100%"
        playing={false}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
    </div>
  );
}