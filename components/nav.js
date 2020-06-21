import Link from "next/link";
import Container from "./container";

export default function Nav({ menuItems }) {
  return (
    <nav className="pa20 bob1B">
      <Container>
        {menuItems.map(({ name, href }, i) => (
          <Link href={href} key={i}>
            <a className="dIB pa20">{name}</a>
          </Link>
        ))}
      </Container>
    </nav>
  );
}
