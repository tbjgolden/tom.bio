import { useEffect, useRef } from "react";
import { Button, KIND } from "baseui/button";

export default function CV(): JSX.Element {
  const iframeEl = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const el = iframeEl.current
    const onMessage = (event) => {
      if (event.origin === globalThis.location.origin) {
        el.style.height = `${event.data}px`;
      }
    }
    globalThis.addEventListener("message", onMessage)
    return () => {
      globalThis.removeEventListener("message", onMessage)
    }
  }, [iframeEl])

  return (
    <section>
      <div className="outer">
        <div className="inner">
          <div className="buttons">
          
            <span className="mr">
              <Button
                size="compact"
                kind={KIND.secondary}
                onClick={() => {
                  window.location.href = "https://www.youtube.com/watch?v=O91DT1pR1ew";
                }}
              >
                Do a barrel roll
              </Button>
            </span>
            <Button
              size="compact"
              onClick={() => {
                window.location.href = "/resume/index.html";
              }}
            >
              Print or Save as PDF
            </Button>
          </div>
          <iframe
            ref={iframeEl}
            scrolling="no"
            frameBorder="0"
            src="/resume/index.html"
          />
        </div>
      </div>
      <style jsx>{`
        iframe {
          display: block;
          width: 100%;
          height: 100vh;
          border: 1px solid #ccc;
        }
        .outer {
          display: block;
          width: 100%;
        }
        .inner {
          max-width: 21cm;
          margin: 0 auto;
        }
        .buttons {
          text-align: right;
          margin-bottom: 16px;
        }
        .mr {
          margin-right: 8px;
        }
      `}</style>
    </section>
  );
}
