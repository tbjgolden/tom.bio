import ReactFlow, { Position } from "react-flow-renderer";

const Event = ({
  bg,
  place,
  time,
  event,
}: {
  bg?: string;
  place: string;
  time: string;
  event: string;
}) => {
  return (
    <div>
      {bg ? (
        <div
          style={{
            backgroundColor: bg,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            zIndex: -1,
          }}
        />
      ) : null}
      <div style={{ fontWeight: "bold", fontVariationSettings: '"wght" 700' }}>
        {place}
      </div>
      {time ? <div>({time})</div> : null}
      <div style={{ fontWeight: "bold", fontVariationSettings: '"wght" 600' }}>
        {event}
      </div>
    </div>
  );
};

const History = () => (
  <div>
    <style
      dangerouslySetInnerHTML={{
        __html: ["2", "3"]
          .map(
            (id) =>
              `.react-flow__nodes [data-id="${id}"] .react-flow__handle{display:none}`
          )
          .join(""),
      }}
    />
    <div>
      <div style={{
        width: 240,
        margin: "20px auto",
        "padding": "10px",
        "borderRadius": "3px",
        "fontSize": "12px",
        "color": "#222",
        "textAlign": "center",
        "borderWidth": "1px",
        "borderStyle": "solid"
      }}>
        <div style={{
          background: "rgb(249, 249, 249)",
          position: "absolute",
          zIndex: -1
        }} />
        <div style={{
          textAlign: 'left'
        }}>
          <div style={{
            fontWeight: "bold",
            fontVariationSettings: '"wght" 700',
            fontSize: "130%"
          }}>The evolution of football</div>
          <div style={{
            marginTop: 4,
            fontWeight: "bold",
            fontVariationSettings: '"wght" 700'
          }}>Legend:</div>
          <div style={{
              lineHeight: 1 }}>
          <div style={{ display: "flex", alignItems: 'center', marginTop: 4 }}>
            <div style={{
              display: "inline-block",
              height: "1em",
              width: "1em",
              marginRight: 4,
              background: "#fdd",
              flexShrink: 0
            }} />
            Popular today
          </div>
          <div style={{ display: "flex", alignItems: 'center', marginTop: 4 }}>
            <div style={{
              display: "inline-block",
              height: "1em",
              width: "1em",
              marginRight: 4,
              background: "#faa",
              flexShrink: 0
            }} />
            Association football (soccer)
          </div>
          </div>
        </div>
      </div>
    </div>
    <div
      style={{
        position: "relative",
        width: 310,
        height: 1475,
        margin: "20px auto"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <ReactFlow
          defaultZoom={1}
          minZoom={1}
          maxZoom={1}
          elements={[
            {
              id: "2",
              data: {
                label: (
                  <Event
                    bg="#f9f9f9"
                    place="China, Korea, Japan, Vietnam"
                    time="220 BCE"
                    event="Cuju - a game very similar to modern soccer - was played until about 1600. Players used air-filled balls, could not use their hands and some matches used goal posts with a net. There is no known connection to medieval football"
                  />
                ),
              },
              position: { x: 160, y: 0 },
            },
            {
              id: "3",
              data: {
                label: (
                  <Event
                    bg="#eee"
                    place="Greeks, Romans, Turks, Native Americans, Indigenous Australians, Maori"
                    time=""
                    event="Many cultures derived football-like games independently"
                  />
                ),
              },
              position: { x: 0, y: 0 },
            },
            {
              id: "4",
              targetPosition: Position.Bottom,
              data: {
                label: (
                  <Event
                    place="Northwestern Europe"
                    time="828 - 1800"
                    event="Medieval football - the common root of 'football' - a violent game with few rules"
                  />
                ),
              },
              position: { x: 0, y: 180 },
            },
            { id: "e4-5a", source: "4", target: "5a", animated: true },
            {
              id: "e4-5b",
              source: "4",
              target: "5b",
              animated: true,
            },
            {
              id: "5a",
              sourcePosition: Position.Top,
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="Ireland"
                    time="1887 - current"
                    event="The Gaelic Athletic Association published the rules to Gaelic football"
                  />
                ),
              },
              position: { x: 160, y: 325 },
            },
            {
              id: "5b",
              data: {
                label: (
                  <Event
                    place="England"
                    time="1800 - 1863"
                    event="Many English schools during this time played various forms of 'football' - but rules varied drastically"
                  />
                ),
              },
              position: { x: 80, y: 465 },
            },
            { id: "e4-6", source: "4", target: "6", animated: true },
            { id: "e5b-6", source: "5b", target: "6", animated: true },
            {
              id: "6",
              sourcePosition: Position.Top,
              data: {
                label: (
                  <Event
                    bg="#faa"
                    place="England"
                    time="1863 - current"
                    event="Standardised rules were needed - Cambridge University students, and the newly formed Football Association would create a compromise set of rules for the game. These rules would become 'association football' (soccer)."
                  />
                ),
              },
              position: { x: 0, y: 630 },
            },
            { id: "e5b-7", source: "5b", target: "7", animated: true },
            {
              id: "7",
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="England"
                    time="1871 - current"
                    event="Rugby football - is officially formed by the Rugby Football Union - derived from the game played at 'Rugby School' (Rugby union)"
                  />
                ),
              },
              position: { x: 80, y: 920 },
            },
            { id: "e7-8a", source: "7", target: "8a", animated: true },
            {
              id: "8a",
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="United States"
                    time="1880 - current"
                    event="A Yale player modifies the rules of a rugby-like game to replace the scrum with the snap. (American football)"
                  />
                ),
              },
              position: { x: 0, y: 1120 },
            },
            { id: "e7-8b", source: "7", target: "8b", animated: true },
            {
              id: "8b",
              sourcePosition: Position.Top,
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="Northern England"
                    time="1895 - current"
                    event="When the Rugby Football Union banned professionals, northern clubs formed a new 'code' of laws. (Rugby league)"
                  />
                ),
              },
              position: { x: 160, y: 1130 },
            },
            { id: "e7-9", source: "7", target: "9", animated: true },
            { id: "e8-9", source: "8a", target: "9", animated: true },
            {
              id: "9",
              sourcePosition: Position.Top,
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="Canada"
                    time="1903 - current"
                    event="The Burnside rules transformed a rugby-oriented game towards an American football style game. (Canadian football)"
                  />
                ),
              },
              position: { x: 80, y: 1300 },
            },
            {
              id: "e5b-10",
              source: "5b",
              target: "10",
              animated: true,
            },
            {
              id: "10",
              sourcePosition: Position.Top,
              data: {
                label: (
                  <Event
                    bg="#fdd"
                    place="Australia"
                    time="1859 - current"
                    event="Derived by an Australian upon return from Rugby School in England. Uses a huge oval-shaped field (i.e. a cricket pitch). (Australian rules football)"
                  />
                ),
              },
              position: { x: 160, y: 630 },
            }
          ]}
          paneMoveable={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        />
      </div>
    </div>
  </div>
);

export default History;
