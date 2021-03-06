// import EmbedCSS from "components/embed-css";
import History from "components/futbol/history";
// import Video from "components/futbol/video";
// import VideoEmbed from "components/futbol/video-embed";
import Markdown from "components/markdown";
import Details from "components/details";
import fs from "fs/promises";
import path from "path";
import { markdownToHtml } from "lib/markdown";
import { GetStaticProps } from "next";

const Football = ({ htmls }: { htmls: string[] }): JSX.Element => {
  return (
    <div>
      <div>
        <div className="markdown">
          <p>
            {'"'}Football{'"'} is the shared name for many distinct sports.
          </p>
          <p>
            Association football (soccer), rugby football, American football,
            Australian rules football, Canadian football and Gaelic football are
            all commonly played versions of the game -{" "}
            <strong>though their rules are all vastly different</strong>.
          </p>
          <p>They share a rich common history - here it is:</p>
        </div>
      </div>
      <History />
      <div>
        <div className="markdown">
          <Markdown>{htmls[0]}</Markdown>
          <Details summary="Learn about small sided games">
            <Markdown>{htmls[1]}</Markdown>
          </Details>
        </div>
      </div>
    </div>
  );
};

export default Football;

export const getStaticProps: GetStaticProps = async () => {
  const base = path.join(process.cwd(), "components/futbol/markdown");
  const files = (await fs.readdir(base))
    .filter((name) => name.endsWith(".md"))
    .sort((a, b) => (a > b ? 1 : -1));
  const htmls = await Promise.all(
    files.map((file) =>
      fs.readFile(path.join(base, file), "utf8").then(markdownToHtml)
    )
  );
  return {
    props: {
      htmls,
    },
  };
};

/*

By contrast, **11-a-side is by far the most popular to watch**, as it was the original form of the sport -
rules which have largely stayed consistent since 1863.

**The remainder of this guide is about 11-a-side soccer.**

---

Soccer is played at a professional level all over the world. **Millions of people regularly go to soccer stadiums** to
follow their favourite teams, while **billions (!) watch the game on television or on the internet**. According to a
survey, **over 240 million people from more than 200 countries regularly play soccer**. Soccer has the highest global
television audience in sport.

In many parts of the world soccer evokes great passions and plays an important role in the life of individual fans,
local communities, and even nations.

**Even the most polite, modest, and humble fans fall easily into rage when playing or watching soccer.** Actual wars
have been both started and ended as a result of soccer. **The cultural influence of soccer, soccer teams and soccer
players cannot be overstated.** Make fun of soccer, teams, players and fans at your peril.

---

## Rules overview

**The core rules are simple enough for anyone to understand.**

- **Can't use your arms or hands to touch the ball**
  - **Each team has 1 goalkeeper - the only players with special rules - they can touch the ball with their arms and hands -
    only near their own goal**
- **You score a 'goal' if the ball enters the other team's goal**
- **The game lasts for 2 halves of 45 minutes, for a total of 90 minutes**
- **Most goals by the end wins**
- **When both score the same number of goals at the end, it either (depending on the competition's rules):**
  - **continues to a series of tiebreakers**
  - **is declared a draw (_tie_)**

**All the other rules exist to either encourage fairness or entertainment, and to punish or disincentivise
unfair or boring play.** Apart from these guiding principles, the rule makers of soccer are very conservative with rule
changes.

**The other 10 players aside from the goalkeeper all are subject to the same rules.** Teams will often play with
completely different positions, styles and formations to give their 11 players the best chance of a good result.

These other rules are shown with examples later.

## Common reasons people don't watch soccer

There's a lot of misinformation about soccer.

<details open>
  <summary>The game is too slow</summary>

Many new to the sport find that when people watch a match **it can seem like the players are just passing the ball to each other in slow motion**.

It's important to realise that **the size of the pitch is MUCH larger.**

> ![](https://www.datocms-assets.com/29488/1620510111-mixed.svg)
>
> A size comparison of the typical football pitch and a basketball court.

Additionally, **players are active for longer and have less breaks in play to physically recover in.**

| League                   | Duration | excl. breaks | Live play | Single player distance covered | 'Average' Speed |
| :----------------------- | -------: | -----------: | --------: | -----------------------------: | --------------: |
| NFL                      | 192 mins |      60 mins |   11 mins |                      1.2 miles |         0.38mph |
| NBA                      | 131 mins |      48 mins |   48 mins |                      2.8 miles |          1.2mph |
| NHL                      | 140 mins |      60 mins |   60 mins |                      2.9 miles |          1.2mph |
| (English) Premier League | 111 mins |      90 mins |   56 mins |                      7.0 miles |          3.8mph |
| (Italian) Serie A        | 111 mins |      90 mins |   60 mins |                      6.7 miles |          3.6mph |

It's sometimes difficult to fully realise how far these players are running until you've played a match on a full-sized pitch; it is physically exhausting even for elite athletes!

Ultimately, players cannot sprint for 60 minutes, and even if they could it would affecting their technical skills and decision making.

Often when the game slows down, it's because the team with the ball is trying to catch their breath, or trying to tire out the other team.

</details>

<details>
  <summary>The players <em>flop</em> (dive) all the time</summary>

Another common stereotype of footballers is that they **dive** (_flop_), **fake injuries** and **stay on the floor for ages**.

It's important to understand that **falling on the floor is not considered diving**. In fact, **about 90-95% of the time
the player is doing the "right thing" by falling on the floor.**

Here, USA star Christian Pulisic falls to the floor to win a penalty kick, which leads to a goal.

<Video src="/futbol/penalty.mp4" aspectRatio={[1.79, 1]} />

But in this nearly identical example, a player does not fall, and does not win a penalty.

<Video src="/futbol/poveda.mp4" aspectRatio={[1.79, 1]} />

---

**Diving is a very ambiguous term** - some use it to refer to any fall on the floor, some to any avoidable fall, and some to a complete fake fall. Typically when die-hard fans call something a **dive** they are calling it a complete fake fall. When casual fans, or non-fans call something a **dive** they normally mean any avoidable fall; but as you have now seen, avoidable falls are not necessarily a thing to complain about (at least, until referees enforce the rules consistently).

By rolling, screaming, faking/exaggerating injuries and begging the referee, they can often convince the referee that a collision deserved a greater punishment, such as a yellow card or a red card. **This is generally not considered acceptable by any fans** (except perhaps by spineless fans of the player's team), but some (usually Spanish-speaking) players will do it to give their team the best possible chance of winning.

**It is against the rules to simulate a fall without cause**. This is generally referred to as **simulation**; or colloquially a **complete dive** or **total dive**.

Annoyingly, referees do not currently penalise players unless it's clear and obvious; meaning that players follow the 'if in doubt, fall over' principle.

</details>

<details>
  <summary>There aren't enough goals</summary>

When compared to American football, the difference is not especially dramatic.

**An average elite soccer match** has an average of 2.72 goals and takes 1 hours and 50 minutes. **(1.48\* goals per hour)**

> \* **A proposed change to the offside rule that is currently being trialled will increase the number of goals per game.**

**The average NFL game** has an average of 4.92 touchdowns and takes 3 hours and 12 minutes. **(1.54 touchdowns per hour)**

It is likely that the points system subconsciously causes people to think more is happening.

</details>

<details>
  <summary>My country is bad at it</summary>

Soccer fans pride themselves on supporting their team in bad times as well as good.

Essentially, you sign up to the emotional roller-coaster - and fans who started supporting their team when they were
less successful are held in much higher regard than those who only support winning teams.

In that sense, there's probably no better time to get behind the US Men's National Team.

</details>

<details>
  <summary>Often the better team doesn't win</summary>

That's probably a good thing! Importantly this makes supporting underdogs very rewarding - and basically every team has at least some games during the season when they are the underdog.

A low scoring game gives a chance for even the small underdogs to have a chance even against much stronger teams... which produces iconic scenes:

<VideoEmbed yt="fOoXsZBwSUg" aspectRatio={[4, 3]} />

</details>

<details>
  <summary>Soccer players are small and fragile</summary>

Football is unusually accessible for players of all dimensions.

Sometimes it is advantageous to be tall:
<VideoEmbed yt="M1zGwCvaza4" />

Sometimes it is advantageous to be short:
<VideoEmbed yt="coXmcbshuJ0" />

And sometimes it is advantageous to be strong:
<Video src="/futbol/strength.mp4" aspectRatio={[1.7, 1]} />

In general, the size of the pitch makes **game intelligence and fitness far more important than explosive athleticism**.
This is why the average player is not much taller than the average person.

</details>

<details>
  <summary>"Americans can't stand a <em>tie</em>" (draw)</summary>


Interestingly, I've never ever heard an international fan complain about this. This really is an American thing!

Many of the games you will watch, such as **cup** (knock-out) **competitions**, cannot end in a draw.

But league games do end in **draws**, and for American fans who are used to other sports, this is a shock to the system.

Long-time fans don't really think of them as "ties". Leagues are seen as a competition over the whole season; and **the actual 90 minute game is just a fragment of that season's story**. But within the league table which determines the champions there are no draws. And given that a league's winner is the team at the top at the end - no playoffs - **a draw can often a bigger story than a win**.

> MLS does decide the winner by a play-off. Clubs from other countries will compete in both the league and other knockout competitions; but these competitions are functionally separate. A team can win a **cup** (knock-out) **competition** and still perform badly in their league, for instance.

### So how can a draw be a bigger story than a win?

The league table scoring system works like this:

- **The team that wins gains 3 points.**

- **The team that loses gets 0 points.**

- **And if there is a draw, both teams get just 1 point.**

For a team to win the league, they must have the most points by the end of the season.

So for teams that are near the top of the league, a draw is often a very bad result. They see this as 2 points lost (compared to their target of 3 points) and therefore draws are very damaging to their total point score at the end of the season.

---

Imagine that you are **a supporter of** (_root for_) an imaginary team called 'Real Murica', and they are trying to win the league.

Real Murica is 1-1 against their long-time rivals 'FC Canucks' and there's only 10 minutes left. If the game ends like this, both teams receive 1 point.

If Murica scores and wins 2-1, they would get **3 points instead of 1**. However, if Canucks score and win 1-2, Murica would get **0 points instead of 1**.

**The bonus for winning** (for both teams) **is twice the punishment of losing**. This means that both teams will often do everything they can to win towards the end of the game (taking gradually bigger and bigger risks); and is why draws are by far the least common outcome of a game.

</details>

<details>
  <summary>The referee makes bad/confusing <em>calls</em> (decisions)</summary>

Some referee decisions are bad because they make an incorrect decision.

Many matches now use VAR - Video Assistant Referee - a person who alerts the referee to "clear and obvious" mistakes
using the television footage. This has, so far, reduced the frequency of errors significantly but has had many unpopular
side-effects.

---

And some rules can be seemingly complex or unintuitive to new fans (famously the offside rule) that it seems like a bad decision.

Learning the precise boundaries of the rules helps to understand how decisions are made - and these are covered in this guide.

</details>

<details>
  <summary>It's hard to get into it when I don't know the teams or players</summary>

I've found that most new fans find a team through a player that resonates with them.

Many players have amazing origin stories and learning about them can be a good way to find a team through them.

</details>

<details>
  <summary>I don't have a team to support</summary>

This guide includes an interactive tool to pick a team that matches well with your ideals!

</details>

---



## The match

**Matches** last for approximately **90 minutes** of play (called **normal time** or **regulation time**). The clock is a _running clock_ and does not stop, except at **half time**, where the game pauses for **15 minutes** and the two teams **change ends** (_swap sides_).

**If both teams end up with the same number of goals**, either:

- If a winner needs to be determined - often because the match is a **knockout fixture** (_elimination game_, e.g. a playoff game) - then they go to (\*) **extra time and a penalty shootout**.
- (\*) In **league matches** (_regular season games_) the game immediately ends and is declared a **draw** (_tie_)

**Extra time** (_overtime_) is an additional 30 minutes at the end of the game. This 30 minutes is split into two 15 minutes periods (again, they **change ends**).

**A penalty shootout** (**penalties**, _penalty kicks (PKs)_) happen **if after extra time the score is level** (_tied_). Each team takes **5 penalties** each and if the number of scored penalties taken is still equal, they continue with sudden death.

<details>
  <summary>Penalty shootout example</summary>

  <VideoEmbed yt="t_dCOkETvu0" />

  <hr />

  <p>
    Note: when a team has an unassailable lead in a penalty shootout, they are
    declared the winner and no more penalties are taken - e.g. after 3 penalties
    each, if one team leads 3-0 then they win, as the other team only have 2
    penalties left.
  </p>
</details>

**Injury time** (also called **added time**, **stoppage time**) is time added to the end of **each half** to **compensate for lost time**. All you need to know is it's **at the discretion of the referee**, the number represents **a minimum time in minutes**. [More detail here.](https://www.football-stadiums.co.uk/articles/injury-time/)

## The teams

Each team has **11 players**.

One player, the **goalkeeper** (_goaltender_) is the only player who is allowed to use their arms or hands to touch the ball. They are also only allowed to do this within their own **penalty area** (_the 18_, an area near the goal that the goalkeeper is expected to protect). They wear a different coloured **shirt** (_jersey_) to their teammates.

---

## Each match is **a story within a story within a story**

Approximately 100 million Americans saw at least 20 minutes of the FIFA World Cup in 2010; an indication of a broad, and rising, support of their national team.

In 2018 the **USMNT** - astonishingly - [failed to qualify for the World Cup](https://sports.yahoo.com/u-s-loses-trinidad-fails-qualify-2018-world-cup-015400543.html).

**The first story** is how they managed to lose a game to Trinidad and Tobago - an island country with just 1 person for every 242 in the United States - and one whose national sport is cricket, not football.

**The second story** is the table - and how other matches had led to them not being ranked highly enough to qualify for the World Cup.

And **the last story** is the one almost every American knows; how the US men's team sucks and simultaneously the US women's team has been the most successful over the same period.

---

**The more context you have** about the game you are watching, **the more you will understand and enjoy** the drama that is unfolding!

---

# The fabric of a football club

Historically, **football clubs** (_football teams_) were born with a small group of (often working class) people who wanted to start a team. Grassroots football has a lot of parallels with grassroots basketball in the US.

For example, **Manchester United** were originally founded by the Carriage and Wagon department of the Lancashire and Yorkshire Railway in 1878.

In 1886, 16 munitions workers named their team after their workshop - as such **Arsenal** were born.

**Barcelona** were founded by a Swiss man who posted an advertisement for players in a newspaper in 1899.

**Chelsea** were born in 1905 at a pub called "The Rising Sun".

The overwhelming majority of clubs - being so old - were born from very humble ambitions. Even the most famous ones!

If you choose to become a fan of a team it's worth learning about the club's rich histories!

---

Football clubs - even the biggest ones - often have strong ties to their local communities and fans.

Football clubs **gain fans** when they frequently play entertaining games, have good/popular players, win games, act in the benefit of the fans (especially **matchday** (_game day_) fans), and when they look like they are set to have a great future.

They **lose fans** when they frequently play less entertaining games, or lose so many games they get **relegated** (when the weakest teams from a higher league being replaced by the strongest teams from a lower league).

**However**, many fans are **lifelong fans** - fans that follow their team even if their team plays badly. It is extremely unusual for these people to stop supporting their team. When it does happen it is usually because those who run the club betray the history of it, or those who support it.

A large proportion of fans are loyal lifelong fans and they treat their club much like a partner - with near-unconditional loyalty to one. Teams with a larger and louder fanbase tend to also do better on the **pitch** (_field_).

<details>
  <summary>Some extraordinary fans</summary>

  <p>A very dedicated fan:
  <br /><iframe width="400" height="200" src="https://www.youtube.com/embed/WzjjmQ_B-zM" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></p>

  <p>What happens when those who run the club betray the fans:
  <br /><iframe width="400" height="200" src="https://www.youtube.com/embed/Anu0yyrhQzs" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></p>
</details>

These fans are why attending a match is so great - the atmosphere is more of the attraction than the spectacle itself.

# Meritocracy

William Browning aptly captured America's attitude to competition when asked "Is competition a good thing?" on debate.org.

> Competition, especially in a free market economy, is a good thing for Americans.

Why he felt the need to answer in the context of America when the question had nothing to do with America - well, I'm not sure - but he does point out that **the United States does highly value competition** within free-market capitalism.

However, **the American sports franchise model** (where owners can simply purchase a place within a league) **harms competition as it guarantees the owners a profit** regardless of sporting performance.

This is very different in football (_soccer_) as **the structure of football is a free-market meritocracy.**

## How does this structure promote strong competition?

- **No player draft system** - No incentive to lose
- **Promotion and relegation** - Creates huge incentives to win
  - **Imagine if...**
    1. **the bottom 4 teams after the regular MLB season were dropped to the minors**
    2. they were replaced by the top 4 teams from the minors
    3. this would happen after every regular season
    4. everyone with the club - players and coaches - would move with the team
  - To balance this, **top leagues give money to lower leagues to help promoted teams stay competitive**
  - This process makes it possible for small local teams to grow and compete for the biggest trophies and keeps the competition fresh each year.
- European clubs are subject to **FFP** rules (Financial Fair Play)
  - a club **must not be in significant loss** over a period of time, or **they are banned from the most prestigious competitions**
  - this also limits how much money the club's owners can spend on their team, preventing crazy billionaires from spending their life savings on building a monopoly of the world's best players
- A club's revenue is primarily from TV coverage and prize money, which means...
  - **the more a club wins** and appears in big competitions, **the more money they have to buy players**
  - as clubs cannot be in significant loss, underperforming teams are further punished as they can't afford to sign the best players (and overperforming teams can spend their profits to improve their team)

# Matches

The game of football strikes **a balance of teamwork and individual ability**.

With 11 players on your team, you cannot rely just on skill. Teams work together to help their team to score more goals and the other team less goals. Yet - as many games are won and lost by a single goal - there are plenty of opportunities for an individual to "make the difference" through a moment of magic.

> An epic finish to a game with an amazing team goal
>
> <iframe
>   width="400"
>   height="200"
>   src="https://www.youtube.com/embed/6TnKvlQ2h7s"
>   title="YouTube video player"
>   frameBorder="0"
>   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
>   allowFullScreen
> />

> An equally amazing "individual goal"
>
> <iframe
>   width="400"
>   height="200"
>   src="https://www.youtube.com/embed/RM_5tJncHww"
>   title="YouTube video player"
>   frameBorder="0"
>   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
>   allowFullScreen
> />

There are **4 types of positions**:

- **Goalkeeper** (keeper, goalie, _goaltender_)
- **Defenders** (_Defensemen_) - between 3 and 5 of them
  - This includes **center-backs** and **full-backs**
  - Primary responsibility is to **defend their goal**
- **Midfielders** - (\*) between 3 and 5 of them
  - This includes **central midfielders** and **wingers**
  - Primary responsibility is to **support** the defenders when the team does not have the ball, and to support the attackers when the team does have the ball
- **Attackers** (Forwards) - (\*) between 1 and 3 of them
  - This includes **strikers** (a.k.a. **center-forwards**) and **inside-forwards** (a.k.a **second-strikers**)

![](https://www.datocms-assets.com/29488/1620658834-formation.svg)

You can learn a lot about a team's tactics from how many of each of these types of players are in a team's **formation**. Formations are often named by counting the number of players in these areas.

For example, the above formation with 1 goalkeeper, 4 defenders, 3 midfielders and 3 attackers would be called a `4-3-3` (verbally "a four three three"). This order always goes from defenders to attackers, and always adds up to 10.

> Common formations include:
>
> - `4-3-3`
> - `4-4-2`
> - `4-5-1` (often similar to `4-3-3`)
> - `4-6-0`
> - `5-2-3` ≡ `3-4-3` (!)
> - `5-3-2` ≡ `3-5-2` (!)
> - `5-4-1` ≡ `3-6-1` (!)
>
> (!) The 2 extra wing backs in a back 5 are interchangeably classified as defenders and midfielders, which is why the defenders count drops by 2 as midfielders count increases by 2.
>
> ---
>
> In recent decades, formations have increased the number of midfielders, so **many formation names now have 4 numbers**, splitting the midfielders count into **defensive midfielders** and **attacking midfielders**:
>
> For instance, a `4-5-1` might be described as:
>
> - `4-3-2-1`
> - `4-2-3-1`
> - `4-1-4-1`
>
> Next time you watch a game - see if you can work out which formations each team is using!

### What the referee is doing

The referee is in charge of determining **when a player or team breaks the rules**, as well as **what their punishment will be** and **what should be awarded to the other team**.

A **foul** is declared (\*) when a player wins the ball unfairly, or uses excessive aggression. In these cases:

- A **free-kick** is awarded to the other team...
- ...unless the foul occurred inside the **penalty area** - in this case the free-kick is "upgraded" to a **penalty kick** (often simply abbreviated to **penalty**, _PK_)
- for dangerous or tactical fouls, **yellow cards** and **red cards** may be shown as an **additional punishment**

**A yellow card** (sometimes called **a warning**) is shown (people often say "given" or "received" to mean shown) to a player who (\*) produces a reckless tackle, or for excessive fouling (quantity), or for simulation. **Tactical fouls** (**professional fouls**) - fouls where the aim was primarily to prevent a player from getting past them (typically to stop a big chance of a goal).

A yellow card is not a meaningful punishment - but **if a player is shown 2 yellow cards in a match, they are also shown a red card**.

**A red card** (**a sending off**) is shown to players who (\*) **endanger an opponent** (either intentionally or by gross negligence), or for **violent conduct**, or for intentionally **unfairly denying the other team a clear goalscoring opportunity**.

Players who are "given" a **red card** must leave the pitch and their team continues playing with 1 less player (the team cannot ).

## The three main tactical styles

The three main tactical styles you will see are:

- A fluid **attacking** style
  - "fluid" meaning players are **encouraged to swap positions** and to **use their creativity** and skill to score
  - a pure spontaneous attacking style is not common today as coaches demand greater tactical discipline
  - examples include **Real Madrid** in the early 2000s and the **Brazil** team that won the 2002 World Cup, and most local **"kickabouts"** (_pick-up games_)
- A rigid **tactical** style
  - "rigid" meaning the **players must fit the tactics** and must all play their tactical roles for it to work
  - relies on players knowing exactly where others are going to be, and giving players specific responsibilities
  - nowadays a necessity for a successful team
- A fast **counter-attacking** style
  - a counter-attacking team typically is **well disciplined defensively**, avoid risks
  - aim to steal the ball from the other team's mistake and **sprint to the other end and score**
  - for big underdogs it is often their best strategy to win

Teams typically play with some mix of these strategies.

> **Attacking**
>
> <iframe
>   width="400"
>   height="200"
>   src="https://www.youtube.com/embed/7UJp1kOjkg4"
>   title="YouTube video player"
>   frameBorder="0"
>   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
>   allowFullScreen
> />
>
> **Tactical**
>
> Here the final pass by Pelé was planned which is how he knows where Carlos Alberto is:<br />
>
> <iframe
>   width="400"
>   height="200"
>   src="https://www.youtube.com/embed/M5HbmeNKino"
>   title="YouTube video player"
>   frameBorder="0"
>   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
>   allowFullScreen
> />
>
> **Counter Attacking**
>
> <iframe
>   width="400"
>   height="200"
>   src="https://www.youtube.com/embed/pEvePJdQVz8"
>   title="YouTube video player"
>   frameBorder="0"
>   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
>   allowFullScreen
> />

## Other things to look out for

There are also some common **situational strategies** during a match that can lead to some dramatic moments.

The most common ones are:

- Defending a lead at the end of a match
- Last-minute attacking

Attack at all costs

Long ball and Set-piece experts

> #### Substitutes
>
> **sub** is short for **substitute**, **subbed** is short for **substituted**
>
> Each team is allowed (\*) **3 substitutions** during the game.
>
> These can happen at almost any time during the game after the ball goes **out of play** (_out of bounds_)...
>
> ...including: **normal time**, **half time**, **injury time**, **extra time**
>
> ...**but excluding** the break before penalties (!), and after the team is announced but before the game has actually started
>
> (!) Anyone on **the bench** (substitutes that have not yet been **substituted on**, or players have been **substituted off**) at the end of a game are **not allowed to take penalties**.

<!--
so i've been wanting to start following soccer for a while now but as an american i always found it complicated not like how they play most three-year-olds can kind of understand more or less how it works i just mean how everything kind of works in europe you know i followed the world cup and i grew for the united states if they made it and then i'd root for iceland because clearly they've all been practicing that clapping and they're really good at it but that only happens once every four years so i turn on my tv and it would be a like a random game like parma versus bologna and first i'd make sure that i wasn't watching the food network but then i had no frame of reference for this game like are these teams good you know is this a big game which one of these guys is pele you know i i didn't know and i had all these other questions you know why why are teams getting kicked out of leagues why are they all rolling around on the ground so much how are guys getting traded to different countries and why why does everybody in the stands have a scarf so a few months ago i tried to start figuring it all out and i started watching some matches that's the first thing they aren't soccer games they are football matches and i bought fifa for my xbox and i bought a scarf and a vuvuzela because that's like the rules or something so anyway this is all the info that i wish i'd known a year ago this is my crash course of translating soccer into american i'm going to assume that you kind of know the rules the biggest difference between american sports is how offsides works and the clock lots of people get upset about the clock it goes up instead of down get over yourself it doesn't really matter americans also get mad because the clock doesn't stop and games pretty much end whenever the ref feels like it and you actually adjust to this pretty quickly the game's an hour and a half long you'll have your chances to score and if you can't score then it's not the clock's fault some people and when i say people i'm referring both to discussions i've had with other americans as well as like myself six years ago so people think soccer is too slow and when americans look at a soccer field something in our minds we think that it's like playing hockey or playing basketball just on a big grass field and in those sports guys like go full tilt a lot like most of the game so when two players are just standing there passing the ball back and forth we wonder like why aren't they trying to move forward just go and on the other side we expect the defenders to be attacking the guy with the ball rather than just standing five feet back and letting him do what he's doing the key difference is that soccer fields are much sorry football pitches are much larger than basketball courts and hockey rinks and if you tried a full court press for the whole soccer game you would be exhausted and you would probably lose see the the pace of a soccer game is actually much closer to baseball most of the game is going to consist of guys just slowly passing the ball around real peaceful and then it's going to be all of a sudden followed by these short bursts of extremely fast action basketball players it's estimated run an average two and a half miles during a game soccer players can run seven if not ten miles during one game and remember you only get three subs games but most of these players will be playing the whole game one thing americans will appreciate is that other than halftime there are no commercials so it's like the anti-nfl which is great it also means that no matter where the ball is both teams are always potentially about 30 seconds away from scoring which creates this kind of constant tension it also creates a scenario where you can't ever really run to the bathroom or get a drink soccer players seem to have a reputation for being lazy in the u.s because they don't always pop right back up after going to ground and get right back in the play certainly some players do embellish things and some go over the top but i don't really think that on the whole it's quite the issue that people make it out to be so they get made fun of in europe too so here's a fun experiment to try the next time you have a few minutes go to like a local field and then quickly draw a glass around that field for like 10 minutes and then suddenly sprint down the middle of the field as fast as you can and when you're halfway up the field while you're still sprinting have one of your friends to shove you over onto the ground and if you can pop right back up and keep sprinting then you can keep complaining about those guys a lot of the time they're just taking a little rest they never want to either just keep playing around them or both teams will be a little tired so who cares it's not a matthew riley novel out there the other reason for guys slowly passing the ball around is that one of the strategies currently employed by most teams is to just to maintain possession as much as possible obviously this is no different in american football or why russia is really good at hockey the other team can't score when you have the ball so teams will just pass the ball back and forth and even pass it back to their own goalie because it's better to go backwards with the ball than to maybe make a risky pass and let the other team have the ball on occasion you'll see a team make like 50 passes without the other team touching the ball which can take a really long time but then they'll go down and they'll score and that's like as good as it gets it's all about waiting for the precise moment for things to align and then all going together at the right moment in terms of like positioning and formations you'll usually have three or four numbers like four four two or four three three or four two three one these numbers will always add up to ten and then the goalie is just assumed different positions include the center backs who would just stay as defenders and then the full backs are both the left and the right back who will defend but then they'll also usually join the attack as well and then we have midfielders like a center midfielder who can go both ways a center attacking midfielder or a center defending midfielder and then up front we have like a left wing and right wing sometimes a center forward and a striker up front who will it's his job to just score goals one thing i'll mention that makes it easy to kind of get into soccer is that you can watch legally watch some old matches on youtube um this is unlike american sports like why isn't there a website that i can go to to watch any game like in itunes for sports it's like i can pay two dollars to watch any game in history like all these games are on tape somewhere they exist but i can't watch a game in the 1986 world series unless an international pandemic shuts down the world there's no sports and i just happen to put it on nbc or something like come on so anyway um so keeping the ball and attacking is referred to as positive football you're always trying to move forward this is what most teams do this is what people like to watch a little more it's kind of exciting it's more exciting to watch that way but of course there's always a yin to the yang so begin is this guy named jose mourinho and he basically says i don't want the ball i'm going to stand back with my players in front of my goal and you're not going to score and then every once in a while when you're falling asleep and all your players are up in my zone we're going to steal the ball and we're going to run down and score which sounds a little bit risky except that it actually does work if you do it well jose is considered one of the best managers there is and he has the trophies to back it up he's won plenty of big tournaments with teams then i'm told if you tried to have that team keep the ball the whole time like most coaches would they would have been destroyed they were too old and they just would have got worn out and wiped out but but by playing this negative defensive strategy they were able to win and despite this teams that employ the strategy seem to get a bad rap for playing negative as opposed to positive football because keeping the ball seems to be the end thing right now so obviously there's more thought that goes into into it than i've described here like diego simeone and athletic madrid have been using this negative strategy for years and they've been successful with it on the flip side the guys who've risen to the top playing possession football were also widely sought after two of the most well-known coaches right now are jurgen klopp and pep guardiola and i highly recommend watching the series all or nothing about manchester city on amazon prime it's about guardiola's team a few years ago and it's quite clear from interviews with these guys that they're you know quite thoughtful and well traveled i couldn't name a single baseball manager who can speak three languages so speaking of manchester city they play in england their four main football countries in europe there's england spain germany and italy england has the premier league spain has la liga germany has the bundesliga and italy has syria so to take one country they're all the same but to take one country england the premier league consists of 20 teams every team plays every other team once at home and once away and these leagues don't have playoffs you get three points for win one for a tie the team with the most points at the end of the season wins and this can and has come down to the final day of the season before in the us our leagues pretty much have the same teams every year so if you suck and even if you start to lose on purpose you actually get rewarded with the top draft pick the next year if you finish in last place in one of these leagues they literally kick you out of the league but they call it relegation because that's a nicer sounding word before we keep going here's a quick aside on the mls major league soccer is the top league in the united states it's different in many ways than the european leagues there's no relegation so the teams do stay the same from year to year and there is a salary cap talent wise i guess globally speaking it seems to be an okay league but certainly not on par with any of the european leagues so under the premier league which is at the top under them is a league called the english football league championship the three teams who finish at the bottom of the premier league are relegated to the championship for the next season and replaced by three teams from the championship the bottom three teams in championship are relegated to league one the bottom three in league one are really gated to league two whose losers go to the national league whose losers are um nobody really cares about them except their moms at this part but you get the idea unless you really get into soccer you'll never hear about anything below the premier league again but just so you're aware of what's happening down there this system does a few things first off just because you're near the bottom of the standings your games can still be extremely important they still count because you're not trying to win the league anymore but now you're trying to literally stay in the league and the higher the league you're in the higher the track you get from tv contracts so it's kind of a big deal it also creates this kind of theoretical meritocracy where you could start a team with a bunch of guys anywhere in the country get into a kind of a tiny league and then ultimately work your way up to the premier league in reality that'd be like trying to take a single a baseball team and work your way up to the majors while the other better teams with bigger pocketbooks are trying to buy all your best players the whole way but for the teams at the top just winning the premier league sounds pretty easy you're playing maybe one game a week but that's the catch there's other things going on here so there's also the carabao cup which is a tournament open to the top four leagues in england and then there's the fa cup which has been going on since like forever that it's literally open to every like team in england so over 700 teams entered this one tournament last year like imagine if every major and minor league baseball team had one giant tournament so could any team win yes they could will the small teams upset the bigger teams at some point maybe a few will but is it likely that a non-premier league team is going to win no probably not so more fun to think about in theory than practically i guess the final tournament is the the big one like what if we could find the best team in europe and i don't mean like each country gets a team that's the european championship that happens every four years this i'm talking about the league clubs so the best teams in from all over europe from 55 different countries battle it out each year this is the uefa champions league so as a side note on these acronyms here fifa is the organization that runs like big international tournaments like the world cup and they help to coordinate things across different regions if you're an american you probably heard a fifa because somebody on sportscenter mentioned somebody that was involved with some kind of corruption investigation or something anyway within fifa the world is divided into six different regions uefa is europe that's where like the best players go concacaf you may have heard of because that's what the us is in the confederation of north central american and caribbean association football which is short and sweet and then there's like the rest of the world and each one of these groups has tournaments with national teams and their league clubs like the concacaf champions league and the uefa champions league and these are called like the champions league but really it's just a tournament so the uefa champions league is played in conjunction with the uefa europa league which is kind of like the ncaa and nit basketball tournaments but with a bit of a twist they play the qualifying rounds for the champions league first so if you get knocked out of the big boy tournament but you finish high enough you can just move down into the europa league and try to win that and i won't get into the qualifying but typically you're going to have teams that you may have heard of as a as an american like manchester city liverpool manchester united tottenham hotspur from spain they'd probably be barcelona and atletico madrid and real madrid syria from italy we'll have juventus and inter and roma and atlanta germany is pretty much dominated by brucia dortmund and bayern munich and then there's other popular teams like perry saint germain from france and leone from france and iacs from the netherlands and then you throw in a few russian teams and you're ready to party so back to the premier league you remember how your team's playing that kind of standard 38 game schedule so now also at the same time you're competing in the premier league the carabao cop the fa cup and the champions league and there's like a bunch of other small one-off games happening too so even if you have the best team you're still probably not going to win all these tournaments just because of the wear and tear if you can win three trophies in a year that's like special that's called a treble if you win four that's called a quadruple but that's pretty rare and so the biggest payday is for winning your league although i for some reason find the champions league is hard to beat for excitement so even though you can soccer teams tend to trade players less than they do in the us rather teams will just buy players from their current club so a contract is going to include your salary obviously but also something called a release clause which is a fee that would go to the current club for that player so while any team could negotiate a transfer fee with a player's current club a release clause takes that current team just out of negotiations altogether so a baseball player unhappy with the situation he could demand a trade and they might trade him and he'd be happy but if they refuse to trade him then he's kind of stuck whereas a soccer player could just find another team willing to pay that release clause and once a team agrees to pay the clause then they can just negotiate directly with that player obviously the better player the higher the fee is going to be so the current club can go out and find a reasonable replacement another big difference is that while most sports in the us have a trade deadline and that's followed by a few weeks afterward where players cannot move to another team soccer is kind of the opposite so most of the time you cannot move to another team there are two periods a year called transfer windows that you can move during so usually before and then halfway through the season and you could sign a new contract for another team whenever but you can't actually start playing for them until that next transfer window and the last thing in terms of contracts is that in the u.s most leagues have a draft but soccer is pretty much like the wild west so teams will sign players or as you say kids like into their youth academy very young like 10 8 years old and smaller teams who find a really good player could also include something called a sell-on clause when selling a player to a larger team that says if the team buying that player turns around and sells the player again to an even bigger club then that original team will get a percentage of that secondary sale all right so if you're still here at this point you probably want more so what's next they're like an unlimited number of top or best goal compilations on youtube which are kind of interesting in the sense that you can actually show new people to soccer the potential that the game has lots of americans exposure to soccer is like the women's world cup and obviously we have a great team there but you never really get to see that what different strategies look like like look up barcelona tiki taka videos you won't regret that they make grown men look like children as i mentioned the all or nothing series on man city is great if you have amazon prime and obviously just watching games is good fifa tv has a youtube channel that has lots of international matches or just look on youtube for full football matches you're smart you'll find them uefa tv has old champions league matches i think you might have to register but it's free you'll probably want to follow br's football channel on youtube they have a lot of good stuff including this very funny series called the champions which i'd probably wait a little bit until you learn a little more about the top players before watching that one place i always turn to when trying to learn a new sport is video games so fifa would probably help although the big caveat there is that it has horrible reviews that said if you're just trying to learn the rules like basic tactics and which players are on which teams and who plays where i would say it's been pretty helpful for me most of the negativity toward the game is the for the online the fifa ultimate team mode where you end up paying for players for your team but if you just avoid that and then like stick to playing against the ai then you should be okay the only thing i hesitate to do is play as barcelona because you could control leo messi and like who am i to tell god what to do so i usually avoid that part the alternative here it would be a game called pez which i've heard good things about although it doesn't have licensing from any of the teams so jerseys will look different and team names will be slightly off which i guess might be confusing to someone new and i think fifa's player faces are a bit more recognizable too newswise there's coverage like everywhere of soccer although i do enjoy the site1football.com which brings us to the sponsor of today's video which is there's no sponsor for today's video um i just make these videos to push the boundaries of powerpoint and see how mad i can make myself anyway hopefully that helps somewhat you're now ready to venture off beyond the coasts of the united states and become an even bigger soccer fan just if you if you're leaving the us call it football they get mad if you call it soccer anyway good luck thanks for watching
-->

<EmbedCSS>{`
  .markdown em {
    color: #f66;
    font-weight: 600;
    font-variation-settings: 'wght' 600;
    font-style: normal;
  }
`}</EmbedCSS>

*/
