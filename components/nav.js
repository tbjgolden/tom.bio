import Link from "@/components/link";
import Container from "./container";

export default function Nav({ menuItems }) {
  return (
    <nav className="pal30 par30">
      <Container className="pat20 pab20 bob2B">
        <div className="malN10 marN10">
          {menuItems.map(({ name, href }, i) => (
            <Link href={href} key={i} className="dIB ma10 fowB">
              {name}
            </Link>
          ))}
        </div>
      </Container>
    </nav>
  );
}
