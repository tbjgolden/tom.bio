export default function ImagePacking() {
  const defaultImages = [[300, 160], [123, 67], [400, 400], [1600, 900], [50, 150], [800, 600]];

  return (
    <div className="pa40">
      <div className="bot1PRIMARY bob1PRIMARY bol1PRIMARY bor1PRIMARY mab40" style={{ width: 700, height: 700, background: "#eee" }} />
      {
        defaultImages.map(([w, h], i) => (
          <div key={i} className="pat30">
          <div className="dFL aiC jcC cW taC" style={{ width: w, height: h, background: `#${i}${i}${i}` }}>
            {w}px x {h}px
          </div>
          </div>
        ))
      }
    </div>
  );
};
