import { useRef, useState } from "preact/hooks";

export default function EditableText({
  initialValue,
  name,
  type,
  objKey,
}: {
  initialValue: string;
  name: string;
  type: string;
  objKey: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  return (
    <div className="rm-margin">
      <input
        type="text"
        placeholder={objKey}
        value={value}
        onInput={(event) => {
          const newValue = event.target.value;
          setValue(newValue);

          clearTimeout(debounceRef.current);
          setSuccessMessage("");
          setErrorMessage("");

          debounceRef.current = setTimeout(() => {
            globalThis
              .plz(`/${type}/${name}`, {
                [objKey]: newValue,
              })
              .then(() => {
                setSuccessMessage("updated");
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }, 1000);
        }}
      />
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      {successMessage ? (
        <p className="success-message">{successMessage}</p>
      ) : null}
    </div>
  );
}
