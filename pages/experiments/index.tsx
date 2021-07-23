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
            <Link href="/experiments/days-until">Days Until</Link>
          </li>
        </ul>
      </Card>
    </section>
  );
}
