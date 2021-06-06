const VideoEmbed = ({
  yt,
  aspectRatio = [16, 9]
}: {
  yt: string,
  aspectRatio: [number, number]
}) => {
  return (
    <div>
      <div style={{ padding: `${(aspectRatio[1] * 100 / aspectRatio[0]).toFixed(3)}% 0 0`, position: "relative" }}>
        <div style={{ top: 0, left: 0, right: 0, bottom: 0, position: "absolute" }}>
          <iframe
            style={{ height: "100%", width: "100%" }}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${yt}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export default VideoEmbed
