import { ChangeEvent, useMemo, useState } from "react";
import {
  compileQuery,
  toEnglishString,
  matches,
  EvaluateResult,
} from "media-query-fns";
import { Check, Delete } from "baseui/icon";
import { Notification, KIND } from "baseui/notification";
import { Input, SIZE } from "baseui/input";

const Status = ({
  compiled,
  device,
}: {
  device: string;
  compiled: EvaluateResult | null;
}): JSX.Element => {
  const checked = compiled === null ? false : matches(compiled, ENVS[device]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: checked ? "green" : "red",
      }}
    >
      {checked ? <Check size={24} /> : <Delete size={24} />}
      <span style={{ marginLeft: 4, color: "#000" }}>Matches {device}</span>
    </div>
  );
};

const fontFamily =
  'Menlo, Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace';

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

export const MediaQueryPlayground = (): JSX.Element => {
  const [input, setIsInput] = useState("(min-width: 1000px)");

  const { errors, warnings, compiled } = useMemo(() => {
    let errors = "";
    let warnings = "";
    let compiled: EvaluateResult | null = null;
    try {
      compiled = compileQuery(input);
    } catch (err) {
      if (err instanceof Error) {
        errors = err.message;
      }
    }
    if (compiled !== null) {
      if (compiled.invalidFeatures.length > 0) {
        errors = (
          `This following features are invalid: ${compiled.invalidFeatures.join(
            ", "
          )}\n` + errors
        ).trim();
      }
      if (compiled.simplePerms.length === 0) {
        errors = ("This query will never match a device\n" + errors).trim();
      }
      if (compiled.falseFeatures.length > 0) {
        warnings = (
          `This following features prevent some permutations from being matched: ${compiled.falseFeatures.join(
            ", "
          )}\n` + errors
        ).trim();
      }

      if (compiled.simplePerms.some((perm) => JSON.stringify(perm) === "{}")) {
        warnings = (
          `This query will always match every device\n` + errors
        ).trim();
      }
    }
    return {
      errors,
      warnings,
      compiled,
    };
  }, [input]);

  return (
    <div className="mq-playground">
      <div className="input-wrapper">
        <Input
          startEnhancer="@media"
          endEnhancer={
            <>
              &nbsp;{"{"}&nbsp;{"..."}
            </>
          }
          size={SIZE.compact}
          value={input}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            setIsInput(ev.target.value);
          }}
          overrides={{
            StartEnhancer: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
                color: "#666",
                fontFamily,
              },
            },
            EndEnhancer: {
              style: {
                paddingLeft: 0,
                paddingRight: 0,
                color: "#666",
                fontFamily,
              },
            },
            Input: {
              style: { padding: "14px 8px", fontFamily, fontWeight: 700 },
            },
          }}
          positive={errors === ""}
          error={errors !== ""}
        />
      </div>

      <div>
        <div className="matches">
          <strong>
            {compiled === null ? "never" : toEnglishString(compiled)}
          </strong>
        </div>
      </div>

      {errors.length > 0 ? (
        <Notification
          overrides={{
            Body: { style: { display: "inline-block", width: "auto" } },
          }}
          kind={KIND.negative}
        >
          {() => (
            <ul>
              {errors
                .split("\n")
                .filter((str) => str.trim().length > 0)
                .map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
            </ul>
          )}
        </Notification>
      ) : null}

      {warnings.length > 0 ? (
        <Notification
          overrides={{
            Body: { style: { display: "inline-block", width: "auto" } },
          }}
          kind={KIND.warning}
        >
          {() => (
            <ul>
              {warnings
                .split("\n")
                .filter((str) => str.trim().length > 0)
                .map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
            </ul>
          )}
        </Notification>
      ) : null}

      <Status compiled={compiled} device="Fairphone 4" />
      <Status compiled={compiled} device="Kindle Paperwhite" />
      <Status compiled={compiled} device="iPhone 12 mini" />
      <Status compiled={compiled} device="M1 MacBook Air" />

      <p className="about">
        This tool is built with{" "}
        <a
          href="https://github.com/tbjgolden/media-query-fns"
          target="_blank"
          rel="noreferrer"
        >
          media-query-fns
        </a>
        , a library which parses and interprets media queries in a spec
        compliant way.
      </p>

      <style>{`
        .mq-playground strong {
          font-weight: bold;
          font-variation-settings: "wght" 700;
        }
        .mq-playground .matches {
          display: inline-block;
          padding: 8px 12px;
          margin: 16px 0 8px;
          border: 1px dashed black;
        }
        .mq-playground ul {
          list-style: disc inside;
        }
        .mq-playground li:not(:first-child) {
          margin-top: 6px;
        }
        .mq-playground .about {
          margin: 12px 0;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MediaQueryPlayground;
