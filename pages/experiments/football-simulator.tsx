import MatchDemo from "components/futbol/match-demo";

const FootballSimulator = (): JSX.Element => <div>
  <p style={{ marginBottom: 16, fontSize: "90%" }}>
    Different football competitions have different rules on how to determine a winner. This tool allows you to simulate scorelines in a specific competition and round - so you work out which team needs to score and how many!</p>
  <MatchDemo />
</div>;

export default FootballSimulator;
