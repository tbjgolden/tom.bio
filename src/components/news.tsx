import { useEffect, useRef, useState } from "preact/hooks";
import { createPopper } from "@popperjs/core";

const months = "an,eb,ar,pr,ay,un,ul,ug,ep,ct,ov,ec".split(",");
function convertToDate(date: string): Date {
  const [y, m, d] = date.split("_");
  return new Date(
    Number.parseInt(y, 10),
    months.indexOf(m.slice(1, 3)),
    Number.parseInt(d, 10)
  );
}

const sandboxEl = globalThis?.document?.getElementById?.("sandbox");
const poppersEl = globalThis?.document?.getElementById?.("poppers");
const dateFormatter = new Intl.DateTimeFormat([], {
  weekday: "long",
  month: "short",
  day: "numeric",
});

type Subsection = { title: Fragment[][]; list: Array<Subsection | Fragment[]> };
type Section = { title: Fragment[]; list: Array<Subsection | Fragment[]> };
type NewsData = {
  date: Date;
  sections: Section[];
}[];

const imgRegex = /<img.*?>/g;
async function htmlToNewsData(html: string): Promise<NewsData> {
  sandboxEl.innerHTML = html.replace(imgRegex, "");
  const dailySummaries = [
    ...sandboxEl.querySelectorAll(
      ".p-current-events-events .current-events-content"
    ),
  ].map((el) => {
    const sections: Section[] = [];
    let currentSection: Section | null = null;

    for (const node of el.children) {
      if (node.tagName === "P") {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: getTextFor(node),
          list: [],
        };
      } else if (node.tagName === "UL") {
        if (currentSection) {
          currentSection.list = readList(node as HTMLUListElement);
        }
      }
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    return {
      date: convertToDate(el.parentElement.getAttribute("id")),
      sections,
    };
  });

  sandboxEl.innerHTML = "";
  return dailySummaries.slice(0, 2);
}

type TextFragment = {
  type: "text";
  value: string;
};
type LinkFragment = {
  type: "link";
  value: string;
  url: string;
};
type Fragment = TextFragment | LinkFragment;

function getTextContent(element: Element, maxDepth = 1): Fragment[] {
  const fragments: Fragment[] = [];
  for (const childNode of element.childNodes) {
    if (childNode.nodeType === 1) {
      const el = childNode as Element;
      if (el.tagName === "A") {
        const href = el.getAttribute("href");
        if (href) {
          if (href.startsWith("/") && !href.includes("redlink=1")) {
            fragments.push({
              type: "link",
              value: el.textContent,
              url: href,
            });
          }
          continue;
        }
      }
      if (maxDepth > 0) {
        fragments.push(...getTextContent(el, maxDepth - 1));
      }
    } else if (childNode.nodeType === 3) {
      const textNode = childNode as Text;
      fragments.push({
        type: "text",
        value: textNode.textContent,
      });
    }
  }
  return fragments;
}

function getTextFor(element: Element, maxDepth = 1): Fragment[] {
  const fragments = getTextContent(element, maxDepth);
  if (fragments.length > 0) {
    fragments[0].value = fragments[0].value.trimStart();
    fragments[fragments.length - 1].value =
      fragments[fragments.length - 1].value.trimEnd();
  }
  return fragments;
}

function readList(ulNode: HTMLUListElement): Array<Subsection | Fragment[]> {
  const list: Array<Subsection | Fragment[]> = [];
  for (const childEl of ulNode.children) {
    if (childEl.tagName === "LI") {
      const ulNode_ = [...childEl.children].find(
        (child) => child.tagName === "UL"
      ) as HTMLUListElement | undefined;
      if (ulNode_) {
        list.push({
          title: [getTextFor(childEl)],
          list: readList(ulNode_),
        });
      } else {
        list.push(getTextFor(childEl));
      }
    }
  }

  // flatten where possible
  for (const item of list) {
    if (!Array.isArray(item)) {
      if (item.list.length === 1) {
        const loneGrandchild = item.list[0];
        if (!Array.isArray(loneGrandchild)) {
          item.title.push(...loneGrandchild.title);
          item.list = loneGrandchild.list;
        }
      }
    }
  }

  return list;
}

export default function News() {
  const [newsData, setNewsData] = useState<NewsData>();
  let ref = { isMounted: true };

  useEffect(() => {
    fetch(`/api/x/news`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.text();
      })
      .then((html) => htmlToNewsData(html))
      .then((newsData) => {
        if (ref.isMounted) {
          setNewsData(newsData);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      ref.isMounted = false;
    };
  }, []);

  return newsData ? (
    <div style="font-size:18px">
      {newsData.map(({ date, sections }, i) => {
        const misc = sections.flatMap(
          (section) =>
            section.list.filter((subsection) =>
              Array.isArray(subsection)
            ) as Fragment[][]
        );

        return (
          <div>
            <h3 class="day" style={`margin-top:${i === 0 ? "16px" : "64px"}`}>
              {dateFormatter.format(date).toLocaleLowerCase()}
            </h3>
            {sections.map((section) => {
              return (
                <>
                  {section.list.length > 0 ? (
                    <ul style="list-style:none;padding:0">
                      {section.list.map((subsection) => {
                        return Array.isArray(subsection) ? null : (
                          <Subsection subsection={subsection} />
                        );
                      })}
                    </ul>
                  ) : null}
                </>
              );
            })}
            {misc.length > 0 ? (
              <>
                <h2>... and in other news</h2>
                {misc.map((fragments) => (
                  <p>
                    <TextFragment fragments={fragments} />
                  </p>
                ))}
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
}

const TextFragment = ({ fragments }: { fragments: Fragment[] }) => {
  return (
    <>
      {fragments.map((fragment) => {
        if (fragment.type === "text") {
          return fragment.value;
        } else {
          return <PageRef fragment={fragment} />;
        }
      })}
    </>
  );
};

const PageRef = ({ fragment }: { fragment: LinkFragment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const spanElRef = useRef<HTMLSpanElement>();
  const poppersElRef = useRef<HTMLElement>();
  const delayRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      if (spanElRef.current) {
        if (poppersElRef.current) {
          poppersElRef.current.style.display = "block";
        } else {
          poppersElRef.current = document.createElement("DIV");
          poppersElRef.current.className = "tooltip";
          //
          const innerEl = document.createElement("DIV");
          innerEl.className = "tooltip-inner";
          window
            .fetch(`/api/x/news/summary/${fragment.url.slice(6)}`)
            .then((response) => {
              if (!response.ok) {
                throw new Error();
              }
              return response.json();
            })
            .then((json) => {
              if (json.thumbnail) {
                const { width, height, source } = json.thumbnail;
                if (source.startsWith("https://upload.wikimedia.org/")) {
                  innerEl.classList.add("has-thumbnail");
                  innerEl.innerHTML =
                    '<img class="thumbnail" style="aspect-ratio:' +
                    width +
                    "/" +
                    height +
                    '" src="' +
                    "/api/x/news/img/" +
                    source.slice(29) +
                    '">';
                }
              }
              innerEl.innerHTML += json.extract_html;
              poppersElRef.current.appendChild(innerEl);
              poppersEl.appendChild(poppersElRef.current);
              createPopper(spanElRef.current, poppersElRef.current, {
                placement: "top",
              });
              innerEl.onmouseleave = () => {
                setIsOpen(false);
              };
              innerEl.onmouseout = () => {
                setIsOpen(false);
              };
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }
    } else {
      if (poppersElRef.current) {
        poppersElRef.current.style.display = "none";
      }
    }
  }, [isOpen]);

  const turnOn = () => {
    clearTimeout(delayRef.current);
    delayRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 150);
  };
  const turnOff = () => {
    clearTimeout(delayRef.current);
    setIsOpen(false);
  };

  return (
    <span
      ref={spanElRef}
      class="pageref"
      tabIndex={0}
      onFocus={turnOn}
      onMouseEnter={turnOn}
      onMouseOver={turnOn}
      onMouseLeave={turnOff}
      onMouseOut={turnOff}
      onBlur={turnOff}
    >
      {fragment.value}
    </span>
  );
};

const Subsection = ({
  subsection,
  level = 3,
}: {
  subsection: Subsection;
  level?: number;
}) => {
  return (
    <>
      <li>
        <SubsectionTitle title={subsection.title} level={level} />
      </li>
      <ul style="list-style:none;padding:0">
        {subsection.list.map((item) =>
          Array.isArray(item) ? (
            <p>
              <TextFragment fragments={item} />
            </p>
          ) : (
            <li>
              <Subsection subsection={item} level={level + 1} />
            </li>
          )
        )}
      </ul>
    </>
  );
};

const sectionTitleStyle = "margin-top:0";
// const transientSectionTitleStyle = "font-size:12px;margin:0";

const SubsectionTitle = ({
  title,
  level,
}: {
  title: Fragment[][];
  level: number;
}) => {
  // const transientSectionTitles = title.slice(0, -1);

  let lastSectionWrappedTitle;
  let lastSectionTitle = <TextFragment fragments={title[title.length - 1]} />;
  if (level === 3) {
    lastSectionWrappedTitle = (
      <h3 style={sectionTitleStyle}>{lastSectionTitle}</h3>
    );
  } else if (level === 4) {
    lastSectionWrappedTitle = (
      <h4 style={sectionTitleStyle}>{lastSectionTitle}</h4>
    );
  } else if (level === 5) {
    lastSectionWrappedTitle = (
      <h5 style={sectionTitleStyle}>{lastSectionTitle}</h5>
    );
  } else {
    lastSectionWrappedTitle = (
      <h6 style={sectionTitleStyle}>{lastSectionTitle}</h6>
    );
  }

  return (
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-top:8px;">
      {/* {transientSectionTitles.length > 0 ? (
        <div style="display:flex;width:100%;flex-wrap:wrap;justify-content:center;gap:4px 12px">
          {transientSectionTitles.map((title) => {
            if (level === 3) {
              return <h3 style={transientSectionTitleStyle}>{title}</h3>;
            } else if (level === 4) {
              return <h4 style={transientSectionTitleStyle}>{title}</h4>;
            } else if (level === 5) {
              return <h5 style={transientSectionTitleStyle}>{title}</h5>;
            } else {
              return <h6 style={transientSectionTitleStyle}>{title}</h6>;
            }
          })}
        </div>
      ) : null} */}
      {lastSectionWrappedTitle}
    </div>
  );
};
