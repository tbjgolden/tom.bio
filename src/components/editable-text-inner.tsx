import { useEffect, useRef, useState } from "preact/hooks";

export default function EditableText({
  initialValue,
  name,
  type,
  key,
}: {
  initialValue: string;
  name: string;
  type: string;
  key: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  return (
    <div className="rm-margin">
      <input
        type="text"
        placeholder={key}
        value={value}
        onInput={(event) => {
          const newValue = event.target.value;
          setValue(newValue);

          clearTimeout(debounceRef.current);
          setSuccessMessage("");
          setErrorMessage("");

          debounceRef.current = setTimeout(() => {
            fetch(`/api/${type}/${name}`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                [key]: newValue,
              }),
            })
              .then((response) => {
                if (response.ok) {
                  setSuccessMessage("updated");
                } else {
                  setErrorMessage(response.status + ": " + response.statusText);
                }
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }, 300);
        }}
      />
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      {successMessage ? (
        <p className="success-message">{successMessage}</p>
      ) : null}
    </div>
  );
}
