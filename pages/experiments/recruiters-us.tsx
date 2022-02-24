import { PieSvgProps, ResponsivePie } from "@nivo/pie";
import Link from "next/link";

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => (
  <>
    <text
      x={centerX}
      y={centerY - 10}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 32,
      }}
    >
      {dataWithArc.reduce((a, b) => a + b.value, 0)}
    </text>
    <text
      x={centerX}
      y={centerY + 15}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 16,
      }}
    >
      total
    </text>
  </>
);

const Pie = ({
  data,
  ...props
}: {
  data: Array<{
    id: string;
    value: number;
    color: string;
  }>;
} & Omit<
  PieSvgProps<{ id: string; value: number; color: string }>,
  "height" | "width"
>) => {
  return (
    <div className="pie-outer">
      <div className="pie-inner">
        <ResponsivePie
          margin={{
            top: 40,
            right: 60,
            bottom: 40,
            left: 60,
          }}
          data={data}
          activeOuterRadiusOffset={8}
          innerRadius={0.5}
          padAngle={1}
          cornerRadius={5}
          arcLinkLabelsDiagonalLength={8}
          arcLinkLabelsStraightLength={4}
          arcLinkLabelsColor={{
            from: "color",
          }}
          arcLinkLabelsThickness={3}
          arcLinkLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 1.2]],
          }}
          arcLabelsTextColor="#fff"
          colors={{ datum: "data.color" }}
          {...props}
        />
      </div>
      <style jsx>{`
        .pie-outer {
          position: relative;
          width: 100%;
          padding: 90% 0 0;
        }

        .pie-inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default function Recruiters(): JSX.Element {
  return (
    <section>
      <div id="calendar">
        <h1 className="h1 m-sm">100 Days of Recruiters (US Edition)</h1>
        <p className="m">
          Like many software engineers, my inboxes are full of spam from
          recruiters.
          <br />
          Here{"'"}s the highlights from the last 100 days.
        </p>
        <p className="m">
          <Link href="/experiments/recruiters-uk">
            Click here for the newer (UK-based) version
          </Link>
        </p>
        <Pie
          data={[
            { id: "Text", value: 1, color: "#000" },
            { id: "LinkedIn", value: 60, color: "#333" },
            { id: "Email", value: 3, color: "#222" },
            { id: "Phone", value: 2, color: "#111" },
          ]}
          layers={[
            "arcs",
            "arcLabels",
            "arcLinkLabels",
            "legends",
            CenteredMetric,
          ]}
        />
        <h2 className="h2 m-sm">Bullshit Score</h2>
        <p>
          At first, I tried to count the occurrences of specific buzzwords...
          but there were just too many to choose from. Instead, I gave{" "}
          <strong className="b">each message a Bullshit Score&trade;</strong>.
        </p>
        <Pie
          data={[
            { id: "Low", value: 26, color: "#060" },
            { id: "Moderate", value: 15, color: "#f90" },
            { id: "High", value: 15, color: "#c00" },
            { id: "No Bullshit", value: 10, color: "#090" },
          ]}
        />
        <h2 className="h2 m-sm">In-House Recruiters</h2>
        <p>
          23% of the recruiters were in-house recruiters, the rest were external
          recruiters.
        </p>
        <Pie
          data={[
            { id: "External", value: 51, color: "#c00" },
            { id: "Internal", value: 15, color: "#090" },
          ]}
        />
        <p>
          Only 25% <strong className="b">of the external recruiters</strong>{" "}
          were upfront with the company they were hiring for.
        </p>
        <Pie
          data={[
            { id: "Did name", value: 13, color: "#090" },
            { id: "Didn't name", value: 38, color: "#c00" },
          ]}
        />
        <h2 className="h2 m-sm">Copy Paste</h2>
        <p>Only 1 recruiter actually looked at this website.</p>
        <Pie
          data={[
            { id: "Full copy-paste", value: 62, color: "#c00" },
            { id: "Mostly copy-paste", value: 4, color: "#060" },
          ]}
        />
        <h2 className="h2 m">Silliest Quotes</h2>
        <p className="m">There was flattery...</p>
        <blockquote className="quote border p m-sm">
          Hey There Rock Star
        </blockquote>
        <blockquote className="quote border p m">
          It{"'"}s like finding a unicorn in the wild!
        </blockquote>
        <p className="m">...and sympathy...</p>
        <blockquote className="quote border p m-sm">
          Hi Tom,
          <br />I hope you and your loved ones are safe and healthy currently.
        </blockquote>
        <blockquote className="quote border p m">
          Hey Tom,
          <br />
          Good Morning!
          <br />I hope you and your loved ones are safe, healthy and prospering.
        </blockquote>
        <p className="m">Some really sold their socks off</p>
        <blockquote className="quote border p m-sm">
          incredible perks
        </blockquote>
        <blockquote className="quote border p m">
          Indigo was #3 on CNBC’s 2020 Top Disruptor List
        </blockquote>
        <p className="m">Others were seemingly looking to hire a murderer</p>
        <blockquote className="quote border p m-sm">
          Killer background
        </blockquote>
        <blockquote className="quote border p m">
          terrific opportunity for aggressive career advancement
        </blockquote>
        <p className="m">And some didn{"'"}t do their homework</p>
        <blockquote className="quote border clown p m-sm">
          I know you are with a great organization
          <div className="aside">If by organization you mean unemployed</div>
        </blockquote>
        <blockquote className="quote border clown p m">
          i have a react js developer and location CA, client looking for
          10+years
          <div className="aside">React has only been around for 8 years</div>
        </blockquote>
        <h2 className="h2 m-sm">Companies</h2>
        <p className="m-sm">
          Finally, here's the full list of the companies that were named:
        </p>
        <ul>
          {[
            { id: "Amazon", value: 2, color: "#111" },
            { id: "Apple", value: 1, color: "#111" },
            { id: "Beachbody", value: 1, color: "#111" },
            { id: "Vinli", value: 1, color: "#111" },
            { id: "Spiff", value: 1, color: "#111" },
            { id: "Copy.AI", value: 1, color: "#111" },
            { id: "Rocket Loans", value: 1, color: "#111" },
            { id: "Bevy", value: 1, color: "#111" },
            { id: "Graphiant", value: 1, color: "#111" },
            { id: "Ticketmaster", value: 1, color: "#111" },
            { id: "ZURB", value: 1, color: "#111" },
            { id: "EPAM", value: 1, color: "#111" },
            { id: "Adobe", value: 1, color: "#111" },
            { id: "Collibra", value: 1, color: "#111" },
            { id: "Postscript.io", value: 1, color: "#111" },
            { id: "Reggora", value: 1, color: "#111" },
            { id: "Thirty Madison", value: 1, color: "#111" },
            { id: "Walmart", value: 1, color: "#111" },
            { id: "Checkr", value: 1, color: "#111" },
            { id: "Virtasant", value: 1, color: "#777" },
            { id: "Bank of America", value: 1, color: "#666" },
            { id: "Northwestern Mutual", value: 1, color: "#555" },
            { id: "HIMSS", value: 1, color: "#444" },
            { id: "IndigoAg", value: 1, color: "#333" },
            { id: "FastRadius", value: 1, color: "#222" },
            { id: "AlphaSights", value: 1, color: "#111" },
            { id: "Metaview", value: 1, color: "#000" },
          ].map(({ id, value }) => (
            <li key={id}>
              {id}
              {value === 2 ? ` (twice)` : ""}
            </li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        h1 {
          font-size: 2em;
        }

        .aside {
          color: #666;
          padding-left: 1em;
          margin-top: 0.5em;
          font-style: italic;
          font-family: "Manrope VF", Manrope, -apple-system, BlinkMacSystemFont,
            Roboto, "Helvetica Neue", sans-serif;
        }

        blockquote {
          font-family: Arial, Arimo, Helvetica, sans-serif;
          line-height: 1.3;
        }

        ul {
          list-style: circle inside;
        }
      `}</style>
    </section>
  );
}
