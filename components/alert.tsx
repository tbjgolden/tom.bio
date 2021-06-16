import Container from "./container";

export default function Alert(): JSX.Element {
  return (
    <div>
      <Container>
        <div>
          This is page is a preview. <a href="/api/exit-preview">Click here</a>{" "}
          to exit preview mode.
        </div>
      </Container>
    </div>
  );
}
