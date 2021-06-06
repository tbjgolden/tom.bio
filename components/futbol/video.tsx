const Video = ({
  src,
  aspectRatio = [16, 9]
}: {
  src: string,
  aspectRatio: [number, number]
}) => {
  return (
    <div>
      <div style={{ padding: `${(aspectRatio[1] * 100 / aspectRatio[0]).toFixed(3)}% 0 0`, position: "relative" }}>
        <div style={{ top: 0, left: 0, right: 0, bottom: 0, position: "absolute" }}>
          <video controls loop height="220" width="390" style={{ height: "100%", width: "100%" }}>
            <source
              src={src}
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  )
}

export default Video
