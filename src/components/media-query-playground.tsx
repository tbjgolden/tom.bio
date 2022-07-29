import { useEffect, useState } from "preact/hooks";
import { compileQuery, matches, toEnglishString } from "media-query-fns";

const DEFAULT_MQ = "(min-width: 1000px)";
const ENVS: Record<string, Parameters<typeof matches>[1]> = {
  "Fairphone 4": {
    widthPx: 540,
    heightPx: 1170,
    deviceWidthPx: 540,
    deviceHeightPx: 1170,
    dppx: 2,
    anyHover: "none",
    hover: "none",
    anyPointer: "coarse",
    pointer: "coarse",
  },
  "Kindle Paperwhite": {
    widthPx: 1072,
    heightPx: 1448,
    deviceWidthPx: 1072,
    deviceHeightPx: 1448,
    dppx: 1,
    anyHover: "none",
    hover: "none",
    anyPointer: "coarse",
    pointer: "coarse",
    update: "slow",
    monochromeBits: 4,
    colorGamut: "not-srgb",
    colorBits: 0,
  },
  "iPhone 12 mini": {
    widthPx: 375,
    heightPx: 812,
    deviceWidthPx: 375,
    deviceHeightPx: 812,
    dppx: 3,
    anyHover: "none",
    hover: "none",
    anyPointer: "coarse",
    pointer: "coarse",
  },
  "M1 MacBook Air": {
    widthPx: 1440,
    heightPx: 900,
    deviceWidthPx: 1440,
    deviceHeightPx: 900,
    dppx: 1.77778,
    colorGamut: "p3-but-not-rec2020",
  },
};

const CheckIcon = () => {
  return (
    <svg
      class="check icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="display:inline-block;height:1em;width:auto"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};
const CrossIcon = () => {
  return (
    <svg
      class="cross icon"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      style="display:inline-block;height:1em;width:auto"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
};

export default function MediaQueryPlayground() {
  const [value, setValue] = useState(DEFAULT_MQ);

  useEffect(() => {
    if (value.slice(0, 7) === "@media ") {
      setValue(value.slice(7));
    }
  }, [value]);

  useEffect(() => {
    if (value.slice(-1) === "@media ") {
      setValue(value.slice(0, -1));
    }
  }, [value]);

  useEffect(() => {
    const params = new URLSearchParams(globalThis.location.search);
    const initQuery = params.get("q");
    if (initQuery !== null) {
      setValue(initQuery);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let nextUrl = globalThis.location.pathname;
      if (value !== DEFAULT_MQ) {
        nextUrl += "?q=" + encodeURIComponent(value);
      }
      history.replaceState(null, "", nextUrl);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  let isValid = true;
  let isNever = false;
  let english = "(Invalid media query)";

  let matchesFairphone4 = false;
  let matchesKindlePaperwhite = false;
  let matchesiPhone12mini = false;
  let matchesM1MacBookAir = false;

  try {
    const query = compileQuery(value);
    english = toEnglishString(query);
    isNever = english === "never";
    matchesFairphone4 = matches(query, ENVS["Fairphone 4"]);
    matchesKindlePaperwhite = matches(query, ENVS["Kindle Paperwhite"]);
    matchesiPhone12mini = matches(query, ENVS["iPhone 12 mini"]);
    matchesM1MacBookAir = matches(query, ENVS["M1 MacBook Air"]);
  } catch (error) {
    isValid = false;
  }

  return (
    <div style="font-size:18px;">
      <samp style="display:flex;white-space:pre;align-items:center;font-weight:bold;margin-top:24px;font-size:20px">
        <span>@media </span>
        <input
          class="media-query-input"
          value={value}
          style={`flex:1 1 1px;border:0;padding:8px;border:2px solid currentcolor;background:#eee;color:${
            isValid ? (isNever ? "#c60" : "#090") : "#900"
          }`}
          onInput={(event) => {
            setValue(event.target.value);
          }}
          onBlur={() => {
            const trimmed = value.trim();
            setValue(trimmed === "" ? DEFAULT_MQ : trimmed);
          }}
        />
        <span>{" { …"}</span>
      </samp>
      <div style="margin-top:16px;font-weight:bold;">
        <span style="display:inline-block;border:2px dashed #f4be00;padding:8px 12px;">
          {english}
        </span>
      </div>

      <div style="margin-top:16px" class="matches">
        <div class="match">
          {matchesFairphone4 ? <CheckIcon /> : <CrossIcon />}
          <span class="label">Matches Fairphone 4</span>{" "}
        </div>
        <div class="match">
          {matchesKindlePaperwhite ? <CheckIcon /> : <CrossIcon />}
          <span class="label">Matches Kindle Paperwhite</span>{" "}
        </div>
        <div class="match">
          {matchesiPhone12mini ? <CheckIcon /> : <CrossIcon />}
          <span class="label">Matches iPhone 12 mini</span>{" "}
        </div>
        <div class="match">
          {matchesM1MacBookAir ? <CheckIcon /> : <CrossIcon />}
          <span class="label">Matches M1 MacBook Air</span>{" "}
        </div>
      </div>
    </div>
  );
}
