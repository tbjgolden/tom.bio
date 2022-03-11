import Link from "components/link";
import Card from "components/card";

export default function Experiments(): JSX.Element {
  return (
    <section>
      <Card>
        <ul className="m">
          <li className="m-sm">
            <Link href="/experiments/recruiters">100 Days of Recruiters</Link>
          </li>
          <li className="m-sm">
            <Link href="/experiments/evolution-of-football">
              Evolution of Football
            </Link>
          </li>
          <li className="m-sm">
            <Link href="/experiments/recruiters-uk">Recruiters (UK)</Link>
          </li>
          <li className="m-sm">
            <Link href="/experiments/recruiters-us">Recruiters (US)</Link>
          </li>
        </ul>
      </Card>
    </section>
  );
}
