import { useEffect, useRef, useState } from "preact/hooks";
import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import {
  schema,
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { exampleSetup } from "prosemirror-example-setup";

class MarkdownView {
  textarea: HTMLElement & { value: string };

  constructor(target: HTMLElement, content: string) {
    const el = document.createElement("textarea");
    el.setAttribute("class", "plaintext-editor");
    target.appendChild(el);
    const textarea: HTMLElement & { value: string } = el;
    textarea.value = content;
    this.textarea = textarea;
  }

  get content() {
    return this.textarea.value;
  }
  focus() {
    this.textarea.focus();
  }
  destroy() {
    this.textarea.remove();
  }
}

class ProseMirrorView {
  view: EditorView;

  constructor(target: HTMLElement, content: string) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content),
        plugins: exampleSetup({ schema }),
      }),
    });
  }

  get content() {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }
  focus() {
    this.view.focus();
  }
  destroy() {
    this.view.destroy();
  }
}

export default function ({
  initialValue,
  name,
  type,
}: {
  initialValue: string;
  name: string;
  type: string;
}) {
  const viewRef = useRef<MarkdownView | ProseMirrorView | undefined>();
  const valueRef = useRef(initialValue);
  const wrapperElRef = useRef<HTMLDivElement>();
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const wrapperEl = wrapperElRef.current;
    if (wrapperEl !== undefined) {
      const View = isMarkdown ? MarkdownView : ProseMirrorView;
      viewRef.current = new View(wrapperEl, valueRef.current);
      viewRef.current.focus();
    }

    return () => {
      if (viewRef.current !== undefined) {
        valueRef.current = viewRef.current.content;
        viewRef.current.destroy();
      }
    };
  }, [wrapperElRef.current, isMarkdown]);

  return (
    <div className="rm-margin">
      <div ref={wrapperElRef} />
      <div style="display:flex;justify-content:space-between;background:#000">
        <button
          style="padding:2px 8px;border-radius:0;border:0;background:#000;color:#aaa"
          onClick={() => {
            setIsMarkdown(!isMarkdown);
          }}
        >
          {isMarkdown
            ? "Switch to visual editor"
            : "Switch to plain text editor"}
        </button>
        <button
          style="padding:2px 8px;border-radius:0;border:0;background:#000;color:#fff;font-weight:bold"
          onClick={() => {
            globalThis
              .plz(`/${type}/${name}`, {
                markdown: viewRef?.current?.content ?? initialValue,
              })
              .then((response) => {
                if (response.ok) {
                  setSuccessMessage("updated");
                  setErrorMessage("");
                }
              })
              .catch((error) => {
                setSuccessMessage("");
                setErrorMessage(error.message);
              });
          }}
        >
          Save
        </button>
      </div>
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      {successMessage ? (
        <p className="success-message">{successMessage}</p>
      ) : null}
    </div>
  );
}
