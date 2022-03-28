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
        <h1 className="h1 m-sm">100 Days of Recruiters (UK Edition)</h1>
        <p className="m">
          Like many software engineers, my inboxes are full of spam from
          recruiters.
          <br />
          During these 100 days, my LinkedIn status was {"'"}Open to
          Opportunities{"'"}.
          <br />
          Here{"'"}s the stats from the last 100 days of messages.
        </p>
        <p className="m">
          <Link href="/experiments/recruiters-us">
            Click here for the original (US-based) version
          </Link>
        </p>
        <Pie
          data={[
            { id: "LinkedIn", value: 268, color: "#333" },
            { id: "Email", value: 30, color: "#222" },
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
            { id: "Low", value: 48, color: "#060" },
            { id: "Moderate", value: 113, color: "#f90" },
            { id: "High", value: 124, color: "#c00" },
            { id: "No Bullshit", value: 15, color: "#090" },
          ]}
        />
        <h2 className="h2 m-sm">In-House Recruiters</h2>
        <p>
          15% of the recruiters were in-house recruiters, the rest were external
          recruiters.
        </p>
        <Pie
          data={[
            { id: "External", value: 256, color: "#c00" },
            { id: "Internal", value: 44, color: "#090" },
          ]}
        />
        <p>
          Only 31% <strong className="b">of the external recruiters</strong>{" "}
          were upfront with the company they were hiring for.
        </p>
        <Pie
          data={[
            { id: "Did name", value: 67, color: "#090" },
            { id: "Didn't name", value: 149, color: "#c00" },
          ]}
        />
        <h2 className="h2 m-sm">Copy Paste</h2>
        <p>
          You do know that software engineers can tell if a message written by a
          basic algorithm. Don{"'"}t try and outsmart us... 😆
        </p>
        <Pie
          data={[
            { id: "Full copy-paste", value: 292, color: "#c00" },
            { id: "Mostly copy-paste", value: 8, color: "#060" },
          ]}
        />
        <p className="m">
          I make a point to reply to each message that was actually written - at
          least in part - by a human.
        </p>
        <h2 className="h2 m-sm">You Had One Job</h2>
        <p className="m">
          Somehow I{"'"}m not even surprised when recruiters forget to list the
          key languages or tech I{"'"}ll be working on.
        </p>
        <p>
          The surprise this time was that some{" "}
          <strong className="b">
            also forgot to specify whether a role was Front-End, Back-End or
            Full Stack...
          </strong>{" "}
          In this chart, incomplete means not specifying the job role.
        </p>
        <Pie
          data={[
            { id: "Didn't try to list job", value: 42, color: "#fc0" },
            { id: "Adequate job listing", value: 253, color: "#090" },
            { id: "Incomplete job listing", value: 5, color: "#c00" },
          ]}
        />
        <h2 className="h2 m">Weak Sauce Quotes</h2>
        <p className="m">
          Unlike their American counterparts, there were far less wacky attempts
          at recruiter clickbait.
        </p>
        <p className="m">
          Instead, I received some pathetic attempts at apologies for spamming.
        </p>
        <blockquote className="quote border p m-sm">
          I appreciate you probably get bombarded with messages from people like
          me
        </blockquote>
        <blockquote className="quote border p m-sm">
          I can only imagine how flooded your inbox is with recruiter{"'"}s
          messages
        </blockquote>
        <blockquote className="quote border p m-sm">
          I imagine you{"'"}ve had a million messages (this is the 3rd alone
          from me!)
        </blockquote>
        <blockquote className="quote border p m">
          I appreciate you probably get bombarded with messages from people like
          me
          <div className="aside">
            oh it{"'"}s you from yesterday, same again tomorrow?
          </div>
        </blockquote>
        <p className="m">
          ...so why do these folks keep spamming if they know it{"'"}s annoying?
          If only they would explain...
        </p>
        <blockquote className="quote border p m-sm">
          Apologies for the double messaging, I can imagine your inbox is full
          of similar messages, so I wanted to make sure you got this one!
          <div className="aside">
            i.e. I{"'"}m sorry everyone else is messaging you LOL
          </div>
        </blockquote>
        <blockquote className="quote border p m">
          I thought I{"'"}d send you a follow up as I know you must get tons of
          messages / irrelevant spam and I wanted to stand out
          <div className="aside">at least you{"'"}re honest</div>
        </blockquote>
        <p className="m">Some really believed their own hype...</p>
        <blockquote className="quote border p m">
          I have just taken on a Full Stack Developer role within a company I
          {"'"}d consider modern-day Eco heroes.
          <div className="aside">
            <video width="249" height="139" loop autoPlay preload="none">
              <source src="/bullshit.mp4" type="video/mp4" />
            </video>
          </div>
        </blockquote>
        <blockquote className="quote border p m">
          Your role is more than a Software Engineer
          <div className="aside">Press X To Doubt</div>
        </blockquote>
        <blockquote className="quote border p m">
          Yats are self-sovereign emoji usernames... Creators use our
          custom-designed emojis to compose beautiful works of art with deep,
          human messages.
          <div className="aside">
            A simple {'"'}Please join our NFT fraud scheme{'"'} would suffice
          </div>
        </blockquote>
        <blockquote className="quote border p m">
          Hi Tom, Let{"'"}s talk about Intuit, the 2nd best tech company to work
          for in the UK
          <div className="aside">
            2nd best? Another company bribed the judges more?
          </div>
        </blockquote>
        <p className="m">
          And of course, there was a sprinkle of weird clickbait
        </p>
        <blockquote className="quote border p m-sm">
          Well, I can tell you that Cristiano Ronaldo{"'"}s legs are insured for
          €100 million
        </blockquote>
        <blockquote className="quote border p m">
          The company could be described as a combination of Amazon, TikTok and
          QVC.
          <div className="aside">My bets on Wish.com</div>
        </blockquote>
        <h2 className="h2 m-sm">Companies</h2>
        <p className="m-sm">
          Finally, here{"'"}s the full list of the companies that were named:
        </p>
        <ul>
          {[
            { id: "Hyperexponential", value: 7 },
            { id: "Ecologi", value: 3 },
            { id: "Virgin Media", value: 3 },
            { id: "Freetrade", value: 2 },
            { id: "Twilio", value: 2 },
            { id: "Cazoo", value: 2 },
            { id: "Multiverse", value: 2 },
            { id: "By Miles", value: 2 },
            { id: "Facebook", value: 2 },
            { id: "Improbable", value: 2 },
            { id: "Zapp", value: 2 },
            { id: "Gener8", value: 2 },
            { id: "Capco", value: 2 },
            { id: "Ticketmaster", value: 2 },
            { id: "Scouty", value: 1 },
            { id: "Plum Guide", value: 1 },
            { id: "PPC Protect", value: 1 },
            { id: "Eigen Tech", value: 1 },
            { id: "Pollen", value: 1 },
            { id: "Vestaire Collective", value: 1 },
            { id: "Flawless", value: 1 },
            { id: "Grail", value: 1 },
            { id: "Kaluza", value: 1 },
            { id: "Robin AI", value: 1 },
            { id: "Luminovo", value: 1 },
            { id: "Coremont", value: 1 },
            { id: "Riskcare", value: 1 },
            { id: "Onthebeach", value: 1 },
            { id: "Mphasis", value: 1 },
            { id: "Privitar", value: 1 },
            { id: "Hedgehog", value: 1 },
            { id: "LoyaltyLion", value: 1 },
            { id: "Shares", value: 1 },
            { id: "Xe", value: 1 },
            { id: "NHS Scotland", value: 1 },
            { id: "Lenses.io", value: 1 },
            { id: "QBE Insurance", value: 1 },
            { id: "The Spectator", value: 1 },
            { id: "William Hill", value: 1 },
            { id: "GSR", value: 1 },
            { id: "Dunelm", value: 1 },
            { id: "Confluence", value: 1 },
            { id: "Let's Do This", value: 1 },
            { id: "Oja", value: 1 },
            { id: "YuLife", value: 1 },
            { id: "Habito", value: 1 },
            { id: "JP Morgan", value: 1 },
            { id: "Converge.io", value: 1 },
            { id: "Intuit", value: 1 },
            { id: "Bother", value: 1 },
            { id: "Nous", value: 1 },
            { id: "Zen Educate", value: 1 },
            { id: "Vortexa", value: 1 },
            { id: "Brit Insurance", value: 1 },
            { id: "News UK", value: 1 },
            { id: "Red Ant", value: 1 },
            { id: "Truepill", value: 1 },
            { id: "Tari Labs", value: 1 },
            { id: "Komi", value: 1 },
            { id: "Prima UK", value: 1 },
            { id: "Ki Insurance", value: 1 },
            { id: "PassFort", value: 1 },
            { id: "Amazon", value: 1 },
            { id: "Nomo Bank", value: 1 },
            { id: "Finimize", value: 1 },
            { id: "FutureOn", value: 1 },
            { id: "BAE Systems", value: 1 },
            { id: "Global Relay", value: 1 },
            { id: "WeGift", value: 1 },
            { id: "Signal AI", value: 1 },
            { id: "Elder", value: 1 },
            { id: "Pubgenius", value: 1 },
            { id: "Unboxed", value: 1 },
            { id: "Foolproof", value: 1 },
            { id: "Neural Alpha", value: 1 },
            { id: "Hudson River Trading", value: 1 },
            { id: "iProov", value: 1 },
            { id: "Fast Break Labs", value: 1 },
            { id: "Beamery", value: 1 },
            { id: "Labelbox", value: 1 },
            { id: "Pearl Health", value: 1 },
            { id: "Miter", value: 1 },
            { id: "Cabinet", value: 1 },
            { id: "Guideline", value: 1 },
            { id: "Boost", value: 1 },
            { id: "Quit Genius", value: 1 },
            { id: "The Nerdery", value: 1 },
            { id: "Switchboard", value: 1 },
          ].map(({ id, value }) => (
            <li key={id}>
              {id}
              {value > 1 ? ` (${value} times)` : ""}
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
