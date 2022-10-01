import { useEffect, useState } from "preact/hooks";

const months = "an,eb,ar,pr,ay,un,ul,ug,ep,ct,ov,ec".split(",");
function convertToDate(date: string): Date {
  const [y, m, d] = date.split("_");
  return new Date(
    Number.parseInt(y, 10),
    months.indexOf(m.slice(1, 3)),
    Number.parseInt(d, 10)
  );
}

const sandboxEl = globalThis?.document?.getElementById?.("sandbox");
const dateFormatter = new Intl.DateTimeFormat([], {
  weekday: "long",
  month: "short",
  day: "numeric",
});

type Section = Array<string | Section>;
type NewsData = {
  headlines: string[];
  dailySummaries: {
    date: Date;
    sections: Section[];
  }[];
};
async function htmlToNewsData(html: string): Promise<NewsData> {
  sandboxEl.innerHTML = html;

  const headlines = [
    ...sandboxEl.querySelectorAll(".p-current-events-headlines > ul > li"),
  ].map((el) => el.textContent.replaceAll(" (pictured)", ""));
  const dailySummaries = [
    ...sandboxEl.querySelectorAll(
      ".p-current-events-events .current-events-content"
    ),
  ].map((el) => {
    const sections: Section[] = [];

    let currentSection: Section | null = null;
    for (const node of el.children) {
      if (node.tagName === "P") {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = [node.textContent.trim()];
      } else if (node.tagName === "UL") {
        if (currentSection) {
          currentSection[1] = readList(node as HTMLUListElement);
        }
      }
    }
    if (currentSection) {
      sections.push(currentSection);
    }

    return {
      date: convertToDate(el.parentElement.getAttribute("id")),
      sections,
    };
  });

  sandboxEl.innerHTML = "";
  return {
    headlines,
    dailySummaries,
  };
}

function readList(ulNode: HTMLUListElement) {
  const list = [];
  for (const childEl of ulNode.children) {
    if (childEl.tagName === "LI") {
      const ulNode_ = [...childEl.children].find(
        (child) => child.tagName === "UL"
      ) as HTMLUListElement | undefined;
      if (ulNode_) {
        const title =
          [...childEl.children].find((child) => child.tagName !== "UL")
            ?.textContent ?? "";
        list.push([title.trim(), readList(ulNode_)]);
      } else {
        list.push(childEl.textContent.replace(/( \([^\)]*?\))+$/g, "").trim());
      }
    } else if (childEl.tagName === "UL") {
      list.push(readList(childEl as HTMLUListElement));
    }
  }
  return list;
}

export default function News() {
  const [newsData, setNewsData] = useState<NewsData>();
  let ref = { isMounted: true };

  useEffect(() => {
    fetch(`/api/x/news`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.text();
      })
      .catch(() => testData)
      .then((html) => htmlToNewsData(html))
      .then((newsData) => {
        if (ref.isMounted) {
          setNewsData(newsData);
        }
      });

    return () => {
      ref.isMounted = false;
    };
  }, []);

  return newsData ? (
    <div style="font-size:18px;">
      {newsData.dailySummaries.slice(0, 2).map(({ date, sections }) => {
        return (
          <div>
            <h3>{dateFormatter.format(date).toLocaleLowerCase()}</h3>
            {sections.map((x) => {
              return <p>{JSON.stringify(x)}</p>;
            })}
          </div>
        );
      })}
    </div>
  ) : (
    <></>
  );
}

const testData = `
<div class="mw-parser-output"><style data-mw-deduplicate="TemplateStyles:r1054047429">.mw-parser-output .p-current-events-main{display:flex;flex-flow:row wrap;margin:0 -5px}.mw-parser-output .p-current-events-events{flex:100 1 200px;margin:0 5px}.mw-parser-output .p-current-events-calside{flex:1 100 250px;margin:0 5px}</style><div class="p-current-events"><div class="portal-maintenance-status" style="display:none;">
<style data-mw-deduplicate="TemplateStyles:r1097619167">.mw-parser-output .ombox{margin:4px 0;border-collapse:collapse;border:1px solid #a2a9b1;background-color:#f8f9fa;box-sizing:border-box}.mw-parser-output .ombox.mbox-small{font-size:88%;line-height:1.25em}.mw-parser-output .ombox-speedy{border:2px solid #b32424;background-color:#fee7e6}.mw-parser-output .ombox-delete{border:2px solid #b32424}.mw-parser-output .ombox-content{border:1px solid #f28500}.mw-parser-output .ombox-style{border:1px solid #fc3}.mw-parser-output .ombox-move{border:1px solid #9932cc}.mw-parser-output .ombox-protection{border:2px solid #a2a9b1}.mw-parser-output .ombox .mbox-text{border:none;padding:0.25em 0.9em;width:100%}.mw-parser-output .ombox .mbox-image{border:none;padding:2px 0 2px 0.9em;text-align:center}.mw-parser-output .ombox .mbox-imageright{border:none;padding:2px 0.9em 2px 0;text-align:center}.mw-parser-output .ombox .mbox-empty-cell{border:none;padding:0;width:1px}.mw-parser-output .ombox .mbox-invalid-type{text-align:center}@media(min-width:720px){.mw-parser-output .ombox{margin:4px 10%}.mw-parser-output .ombox.mbox-small{clear:right;float:right;margin:4px 0 4px 1em;width:238px}}</style><table class="plainlinks ombox ombox-notice" role="presentation"><tbody><tr><td class="mbox-image"><a href="/wiki/File:Darkgreen_flag_waving.svg" class="image"><img alt="Darkgreen flag waving.svg" src="//upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Darkgreen_flag_waving.svg/30px-Darkgreen_flag_waving.svg.png" decoding="async" width="30" height="32" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Darkgreen_flag_waving.svg/45px-Darkgreen_flag_waving.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Darkgreen_flag_waving.svg/60px-Darkgreen_flag_waving.svg.png 2x" data-file-width="249" data-file-height="268" /></a></td><td class="mbox-text"><span style="font-size:108%;"><b>Portal maintenance status:</b></span> <small>(October 2020)</small>
<ul><li>This portal's <a href="/wiki/Special:PrefixIndex/Portal:Current_events/" title="Special:PrefixIndex/Portal:Current events/">subpages</a> <b>have been checked</b> by an editor, and are needed.</li></ul>
<span style="font-size:90%;">Please <a href="/wiki/Wikipedia:CAREFUL" class="mw-redirect" title="Wikipedia:CAREFUL">take care</a> when editing, especially if using <a href="/wiki/Wikipedia:ASSISTED" class="mw-redirect" title="Wikipedia:ASSISTED">automated editing software</a>.&#32;Learn how to <a href="/wiki/Template:Portal_maintenance_status#How_to_update_the_maintenance_information_for_a_portal" title="Template:Portal maintenance status">update the maintenance information here</a>.</span></td></tr></tbody></table></div>
<style data-mw-deduplicate="TemplateStyles:r888483065">.mw-parser-output .portal-column-left{float:left;width:50%}.mw-parser-output .portal-column-right{float:right;width:49%}.mw-parser-output .portal-column-left-wide{float:left;width:60%}.mw-parser-output .portal-column-right-narrow{float:right;width:39%}.mw-parser-output .portal-column-left-extra-wide{float:left;width:70%}.mw-parser-output .portal-column-right-extra-narrow{float:right;width:29%}@media only screen and (max-width:800px){.mw-parser-output .portal-column-left,.mw-parser-output .portal-column-right,.mw-parser-output .portal-column-left-wide,.mw-parser-output .portal-column-right-narrow,.mw-parser-output .portal-column-left-extra-wide,.mw-parser-output .portal-column-right-extra-narrow{float:inherit;width:inherit}}</style><div class="shortdescription nomobile noexcerpt noprint searchaux" style="display:none">Wikipedia portal for content related to Current events</div>
<p><span id="coordinates" class="noprint"><a href="/wiki/Portal:Current_events/Edit_instructions" title="Portal:Current events/Edit instructions">Edit instructions</a></span>
</p>
<style data-mw-deduplicate="TemplateStyles:r1053305899">.mw-parser-output .p-current-events-news-browser{display:flex;font-size:98%;box-sizing:border-box;margin-bottom:0.5em;border:1px solid #cedff2;padding:7px;background-color:#f5faff;align-items:center}.mw-parser-output .p-current-events-news-browser img{min-width:32px}.mw-parser-output .p-current-events-news-browser ul{text-align:center;flex:1}@media all and (min-width:360px){.mw-parser-output .p-current-events-news-browser ul a{white-space:nowrap}}</style><div class="p-current-events-news-browser noprint hlist">
<div><a href="/wiki/File:Ambox_globe.svg" class="image"><img alt="Globe icon" src="//upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ambox_globe.svg/32px-Ambox_globe.svg.png" decoding="async" width="32" height="32" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ambox_globe.svg/48px-Ambox_globe.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ambox_globe.svg/64px-Ambox_globe.svg.png 2x" data-file-width="512" data-file-height="512" /></a></div>
<ul><li><a class="mw-selflink selflink">Worldwide current events</a></li>
<li><a href="/wiki/Portal:Current_events/Sports" title="Portal:Current events/Sports">Sports events</a></li>
<li><a href="/wiki/Deaths_in_2022" title="Deaths in 2022">Recent deaths</a></li>
<li><a href="/wiki/Wikipedia:Top_25" class="mw-redirect" title="Wikipedia:Top 25">Entry views by week list</a></li></ul>
</div>
<style data-mw-deduplicate="TemplateStyles:r1053345128">.mw-parser-output .p-current-events-headlines{margin-bottom:0.5em;border:1px solid #cedff2;padding:0.4em;background-color:#f5faff}.mw-parser-output .p-current-events-headlines h2{display:block;margin:-0.1em -0.1em 0.4em;border:none;padding:0.3em;background-color:#cedff2;font-size:12pt;line-height:inherit;font-family:inherit;font-weight:bold;color:inherit}.mw-parser-output .p-current-events-headlines h2::after{border:none}.mw-parser-output .p-current-events-headlines::after{clear:both;content:"";display:table}</style>
<div class="p-current-events-headlines" role="region" aria-labelledby="Topics_in_the_news"><h2><span class="mw-headline" id="Topics_in_the_news">Topics in the news</span></h2><style data-mw-deduplicate="TemplateStyles:r1053378754">.mw-parser-output .itn-img{float:right;margin-left:0.5em;margin-top:0.2em}</style><div role="figure" class="itn-img">
<div class="thumbinner mp-thumb" style="background: transparent; border: none; padding: 0; max-width: 187px;">
<a href="/wiki/File:Sanibel-causeway-destruction.webp" class="image" title="Collapsed Sanibel Causeway in Florida"><img alt="Collapsed Sanibel Causeway in Florida" src="//upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sanibel-causeway-destruction.webp/187px-Sanibel-causeway-destruction.webp.png" decoding="async" width="187" height="105" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sanibel-causeway-destruction.webp/281px-Sanibel-causeway-destruction.webp.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sanibel-causeway-destruction.webp/374px-Sanibel-causeway-destruction.webp.png 2x" data-file-width="932" data-file-height="524" /></a><div class="thumbcaption" style="padding: 0.25em 0; word-wrap: break-word; text-align: left;">Collapsed <a href="/wiki/Sanibel_Causeway" title="Sanibel Causeway">Sanibel Causeway</a> in Florida</div></div>
</div>
<ul><li>Russia <b><a href="/wiki/Annexation_of_Southern_and_Eastern_Ukraine" title="Annexation of Southern and Eastern Ukraine">annexes</a></b> the partially occupied Ukrainian <a href="/wiki/Oblasts_of_Ukraine" title="Oblasts of Ukraine">oblasts</a> of <a href="/wiki/Luhansk_People%27s_Republic" title="Luhansk People&#39;s Republic">Luhansk</a>, <a href="/wiki/Donetsk_People%27s_Republic" title="Donetsk People&#39;s Republic">Donetsk</a>, <a href="/wiki/Russian_occupation_of_Zaporizhzhia_Oblast" title="Russian occupation of Zaporizhzhia Oblast">Zaporizhzhia</a> and <a href="/wiki/Russian_occupation_of_Kherson_Oblast" title="Russian occupation of Kherson Oblast">Kherson</a> after <b><a href="/wiki/2022_annexation_referendums_in_Russian-occupied_Ukraine" title="2022 annexation referendums in Russian-occupied Ukraine">widely condemned referendums</a></b>.</li>
<li><b><a href="/wiki/Hurricane_Ian" title="Hurricane Ian">Hurricane Ian</a></b> causes at least 23 deaths and leaves millions without power in Cuba and the United States <i>(example damage pictured)</i>.</li>
<li><a href="/wiki/NASA" title="NASA">NASA</a>'s <b><a href="/wiki/Double_Asteroid_Redirection_Test" title="Double Asteroid Redirection Test">Double Asteroid Redirection Test</a></b> spacecraft deliberately collides with the asteroid <a href="/wiki/Dimorphos" title="Dimorphos">Dimorphos</a> in a demonstration of <a href="/wiki/Asteroid_impact_avoidance" title="Asteroid impact avoidance">asteroid deflection</a>.</li>
<li>Kenyan <b><a href="/wiki/Eliud_Kipchoge" title="Eliud Kipchoge">Eliud Kipchoge</a></b> sets a <a href="/wiki/Marathon_world_record_progression" title="Marathon world record progression">new world record</a> at <a href="/wiki/2022_Berlin_Marathon" title="2022 Berlin Marathon">the Berlin Marathon</a>.</li></ul>
<div class="itn-footer" style="margin-top: 0.5em;">
<div><b><a class="mw-selflink selflink">Ongoing</a></b>: <div class="hlist hlist-separated inline">
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">Russian invasion of Ukraine</a></li></ul></div></div>
<div><b><a href="/wiki/Deaths_in_2022" title="Deaths in 2022">Recent deaths</a></b>&#58; <div class="hlist hlist-separated inline">
<ul><li><a href="/wiki/Bill_Plante" title="Bill Plante">Bill Plante</a></li>
<li><a href="/wiki/Nikolai_Kirtok" title="Nikolai Kirtok">Nikolai Kirtok</a></li>
<li><a href="/wiki/Coolio" title="Coolio">Coolio</a></li>
<li><a href="/wiki/Sue_Mingus" title="Sue Mingus">Sue Mingus</a></li>
<li><a href="/wiki/James_Florio" title="James Florio">James Florio</a></li>
<li><span class="nowrap"><a href="/wiki/Jonathan_Beaulieu-Richard" title="Jonathan Beaulieu-Richard">Jonathan Beaulieu-Richard</a></span></li></ul></div></div></div>
<div class="hlist hlist-separated itn-footer noprint" style="text-align:right;">
<ul><li><b><a href="/wiki/Wikipedia:In_the_news/Candidates" title="Wikipedia:In the news/Candidates">Nominate an article</a></b></li></ul>
</div>
</div>
<div class="p-current-events-main">
<div class="p-current-events-events">
<style data-mw-deduplicate="TemplateStyles:r1099481097">.mw-parser-output .current-events-main{margin:0.5em 0;padding:0.3em;background-color:white;border:1px #cef2e0 solid}.mw-parser-output .current-events-heading{background-color:#cef2e0;font-weight:bold}.mw-parser-output .current-events-title{padding:0.4em}.mw-parser-output .current-events-navbar{list-style:none;margin:0;font-size:small}.mw-parser-output .current-events-navbar li{display:inline-block;padding:0 0.4em}.mw-parser-output .current-events-content{padding:0 0.3em}.mw-parser-output .current-events-content-heading{margin-top:0.3em;font-weight:bold}.mw-parser-output .current-events-more{border-width:2px;font-size:10pt;font-weight:bold;padding:0.3em 0.6em}.mw-parser-output .current-events-nav{margin:auto;text-align:center;line-height:1.2}.mw-parser-output .current-events-nav a{display:inline-block;margin:0.5em;padding:0.5em;background-color:#f4f4f4}.mw-parser-output .current-events-nav a>div{font-weight:bold}@media all and (min-width:480px){.mw-parser-output .current-events-heading{position:relative;padding-right:12em}.mw-parser-output .current-events-navbar{width:12em;position:absolute;top:50%;right:0.4em;margin-top:-0.8em;text-align:right;white-space:nowrap}.mw-parser-output .current-events-nav{max-width:22em}.mw-parser-output .current-events-nav a{width:9em}}</style><div class="current-events"><div id="2022_October_01"></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 30" id="2022_September_30" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;30,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-30</span>)</span> (Friday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_30&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_30&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_30&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/War_crimes_in_the_2022_Russian_invasion_of_Ukraine" title="War crimes in the 2022 Russian invasion of Ukraine">War crimes in the 2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Attacks_on_civilians_in_the_2022_Russian_invasion_of_Ukraine" title="Attacks on civilians in the 2022 Russian invasion of Ukraine">Attacks on civilians in the 2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Russian_attack_on_civilian_convoy_in_Zaporizhzhia" title="Russian attack on civilian convoy in Zaporizhzhia">Russian attack on civilian convoy in Zaporizhzhia</a>
<ul><li><a href="/wiki/Russian_Armed_Forces" title="Russian Armed Forces">Russian forces</a> launch 16 missiles at areas near the city of <a href="/wiki/Zaporizhzhia" title="Zaporizhzhia">Zaporizhzhia</a>, including a gathering point for <a href="/wiki/Civilian" title="Civilian">civilians</a> preparing to cross into <a href="/wiki/Russian_occupation_of_Zaporizhzhia_Oblast" title="Russian occupation of Zaporizhzhia Oblast">Russian-occupied territory</a>, where at least 25 people are killed and 50 others are injured. <a rel="nofollow" class="external text" href="https://www.wsj.com/articles/russian-attack-kills-dozens-of-civilians-in-ukraine-hours-before-planned-annexations-11664531345">(<i>The Wall Street Journal</i>)</a></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/Ukraine%E2%80%93NATO_relations" title="Ukraine–NATO relations">Ukraine–NATO relations</a>
<ul><li><a href="/wiki/President_of_Ukraine" title="President of Ukraine">Ukrainian President</a> <a href="/wiki/Volodymyr_Zelenskyy" title="Volodymyr Zelenskyy">Volodymyr Zelenskyy</a> requests fast-track <a href="/wiki/NATO" title="NATO">NATO</a> membership following the <a href="/wiki/Russian_annexation_of_Southern_and_Eastern_Ukraine" class="mw-redirect" title="Russian annexation of Southern and Eastern Ukraine">Russian annexation of Southern and Eastern Ukraine</a>. <a rel="nofollow" class="external text" href="https://www.bbc.co.uk/news/live/world-63077272">(BBC News)</a></li></ul></li>
<li><a href="/wiki/2022_Russian_mobilization" title="2022 Russian mobilization">2022 Russian mobilization</a>
<ul><li><a href="/wiki/Uzbekistan" title="Uzbekistan">Uzbekistan</a> says that it will not deport <a href="/wiki/Russians" title="Russians">Russians</a> fleeing <a href="/wiki/Conscription" title="Conscription">conscription</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/asia-pacific/uzbekistan-says-wont-deport-russians-fleeing-conscription-2022-09-30/">(Reuters)</a></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/Afghanistan_conflict_(1978%E2%80%93present)" title="Afghanistan conflict (1978–present)">Afghanistan conflict</a>
<ul><li><a href="/wiki/September_2022_Kabul_school_bombing" title="September 2022 Kabul school bombing">September 2022 Kabul school bombing</a>
<ul><li>Nineteen people are killed and 27 others are injured by a <a href="/wiki/Suicide_bomber" class="mw-redirect" title="Suicide bomber">suicide bomber</a> at a school in <a href="/wiki/Dashte_Barchi" title="Dashte Barchi">Dashte Barchi</a>, <a href="/wiki/Kabul" title="Kabul">Kabul</a>, <a href="/wiki/Afghanistan" title="Afghanistan">Afghanistan</a>. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/30/at-least-19-killed-in-kabul-blast-authorities">(Al Jazeera)</a></li></ul></li></ul></li>
<li><a href="/wiki/Papua_conflict" title="Papua conflict">Papua conflict</a>
<ul><li>Four people are killed when armed rebels open fire on civilians in <a href="/wiki/West_Papua_(province)" title="West Papua (province)">West Papua</a>, <a href="/wiki/Indonesia" title="Indonesia">Indonesia</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/asia-pacific/four-shot-dead-indonesias-restive-papua-region-police-2022-09-30/">(Reuters)</a></li></ul></li>
<li><a href="/wiki/September_2022_Burkina_Faso_coup_d%27%C3%A9tat" title="September 2022 Burkina Faso coup d&#39;état">September 2022 Burkina Faso coup d'état</a>
<ul><li>Junta leader <a href="/wiki/Paul-Henri_Sandaogo_Damiba" title="Paul-Henri Sandaogo Damiba">Paul-Henri Sandaogo Damiba</a> is removed from office in a <a href="/wiki/Coup_d%27%C3%A9tat" title="Coup d&#39;état">coup d'état</a> after gunfire occurs in the <a href="/wiki/Burkina_Faso" title="Burkina Faso">Burkinabé</a> capital of <a href="/wiki/Ouagadougou" title="Ouagadougou">Ouagadougou</a>. Coup leader <a href="/wiki/Ibrahim_Traore" title="Ibrahim Traore">Ibrahim Traore</a> imposes a curfew, suspends all political civil society activities as well as the Constitution, and closes all land and air borders. <a rel="nofollow" class="external text" href="https://apnews.com/article/united-nations-general-assembly-ouagadougou-africa-west-e50ee2eb815152a594a2b441304f4868">(AP)</a> <a rel="nofollow" class="external text" href="https://www.france24.com/en/africa/20220930-shots-fired-near-burkina-faso-s-presidential-palace-in-ouagadougou">(France24)</a></li></ul></li></ul>
<p><b>Business and economy</b>
</p>
<ul><li><a href="/wiki/2021%E2%80%932022_inflation_surge" title="2021–2022 inflation surge">2021–2022 inflation surge</a>, <a href="/wiki/Economy_of_the_Netherlands" title="Economy of the Netherlands">Economy of the Netherlands</a>
<ul><li><a href="/wiki/Inflation" title="Inflation">Inflation</a> in the <a href="/wiki/Netherlands" title="Netherlands">Netherlands</a> increases to 17% amid a substantial increase in energy and fuel prices. <a rel="nofollow" class="external text" href="https://www.reuters.com/markets/europe/dutch-inflation-leaps-17-boosted-by-high-energy-prices-2022-09-30/">(Reuters)</a></li></ul></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li><a href="/wiki/2022_Atlantic_hurricane_season" title="2022 Atlantic hurricane season">2022 Atlantic hurricane season</a>
<ul><li><a href="/wiki/Hurricane_Ian" title="Hurricane Ian">Hurricane Ian</a> makes its fourth landfall in <a href="/wiki/South_Carolina" title="South Carolina">South Carolina</a>, after devastating portions of <a href="/wiki/Florida" title="Florida">Florida</a> and <a href="/wiki/Cuba" title="Cuba">Cuba</a>. <a rel="nofollow" class="external text" href="https://www.nhc.noaa.gov/archive/2022/al09/al092022.update.09301814.shtml">(National Hurricane Center)</a></li></ul></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/Russian_annexation_of_Southern_and_Eastern_Ukraine" class="mw-redirect" title="Russian annexation of Southern and Eastern Ukraine">Russian annexation of Southern and Eastern Ukraine</a>
<ul><li><a href="/wiki/Russian_president" class="mw-redirect" title="Russian president">Russian president</a> <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a> signs accession treaties to annex the <a href="/wiki/Occupied_territories_of_Ukraine" class="mw-redirect" title="Occupied territories of Ukraine">occupied Ukrainian territories</a> to Russia. The new subjects are the Donetsk People's Republic, the <a href="/wiki/Lugansk_People%27s_Republic_(Russia)" title="Lugansk People&#39;s Republic (Russia)">Lugansk People's Republic</a>, <a href="/wiki/Kherson_Oblast_(Russia)" title="Kherson Oblast (Russia)">Kherson Oblast</a> and <a href="/wiki/Zaporozhye_Oblast_(Russia)" title="Zaporozhye Oblast (Russia)">Zaporozhye Oblast</a>. However, the accession treaties must be ratified by both houses of the <a href="/wiki/Russian_Duma" class="mw-redirect" title="Russian Duma">Russian Duma</a> before becoming effective under <a href="/wiki/Russian_law" class="mw-redirect" title="Russian law">Russian law</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/putin-declare-annexation-ukrainian-lands-major-escalation-war-2022-09-29/">(Reuters)</a> <a rel="nofollow" class="external text" href="https://www.msn.com/en-gb/news/world/factbox-russias-annexation-plan-in-ukraine-kremlin-signing-ceremony/ar-AA12nYnk">(Reuters 2)</a></li></ul></li>
<li><a href="/wiki/Mexican_president" class="mw-redirect" title="Mexican president">Mexican president</a> <a href="/wiki/Andr%C3%A9s_Manuel_L%C3%B3pez_Obrador" title="Andrés Manuel López Obrador">Andrés Manuel López Obrador</a> confirms that the Mexican <a href="/wiki/Secretariat_of_National_Defense" class="mw-redirect" title="Secretariat of National Defense">Secretariat of National Defense</a> was hacked and that leaked data included information about the president's health issues and other national security issues. <a rel="nofollow" class="external text" href="https://www.proceso.com.mx/nacional/2022/9/30/amlo-admite-hackeo-de-grupo-guacamaya-la-sedena-que-esta-enfermo-294305.html">(Proceso)</a></li></ul></div></div></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 29" id="2022_September_29" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;29,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-29</span>)</span> (Thursday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_29&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_29&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_29&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/War_crimes_in_the_2022_Russian_invasion_of_Ukraine" title="War crimes in the 2022 Russian invasion of Ukraine">War crimes in the 2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Attacks_on_civilians_in_the_2022_Russian_invasion_of_Ukraine" title="Attacks on civilians in the 2022 Russian invasion of Ukraine">Attacks on civilians in the 2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Russian_Armed_Forces" title="Russian Armed Forces">Russian forces</a> strike a residential neighborhood in <a href="/wiki/Dnipro" title="Dnipro">Dnipro</a> with a <a href="/wiki/Cruise_missile" title="Cruise missile">cruise missile</a>, killing a family of four, including two children, and injuring 18 other <a href="/wiki/Civilian" title="Civilian">civilians</a>, according to local authorities. <a rel="nofollow" class="external text" href="https://www.ukrinform.net/rubric-ato/3582160-four-killed-18-injured-in-enemy-strike-on-dnipro.html">(Ukrinform)</a> <a rel="nofollow" class="external text" href="https://www.pravda.com.ua/eng/news/2022/09/29/7369625/">(Ukrainska Pravda)</a></li>
<li>Three people are killed and 12 others are injured by a <a href="/wiki/Russia" title="Russia">Russian</a> <a href="/wiki/Cluster_munition" title="Cluster munition">cluster munition</a> attack on a bus stop in <a href="/wiki/Mykolaiv" title="Mykolaiv">Mykolaiv</a>, according to mayor Oleksandr Sienkievych. <a rel="nofollow" class="external text" href="https://www.pravda.com.ua/eng/news/2022/09/29/7369681/">(Ukrainska Pravda)</a></li></ul></li></ul></li>
<li><a href="/wiki/Russian_emigration_following_the_2022_invasion_of_Ukraine" title="Russian emigration following the 2022 invasion of Ukraine">Russian emigration following the 2022 invasion of Ukraine</a>
<ul><li><a href="/wiki/Finland" title="Finland">Finland</a> announces that it will deny entry to Russian <a href="/wiki/Tourism_in_Finland" title="Tourism in Finland">tourists</a> beginning on Thursday night, thereby cutting off the last direct link between Russia and the <a href="/wiki/European_Union" title="European Union">European Union</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/finland-will-shut-border-russian-tourists-midnight-2022-09-29/">(Reuters)</a></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/Kurdish_separatism_in_Iran" title="Kurdish separatism in Iran">Kurdish–Iranian conflict</a>
<ul><li><a href="/wiki/Iran" title="Iran">Iran</a>'s <a href="/wiki/Islamic_Revolutionary_Guard_Corps" title="Islamic Revolutionary Guard Corps">Islamic Revolutionary Guard Corps</a> launches <a href="/wiki/Ballistic_missile" title="Ballistic missile">ballistic missiles</a> at <a href="/wiki/Erbil" title="Erbil">Erbil</a>, the capital of <a href="/wiki/Iraq" title="Iraq">Iraq</a>'s <a href="/wiki/Kurdistan_Region" title="Kurdistan Region">Kurdistan Region</a>, killing nine civilians and injuring 32 others. The <a href="/wiki/Minister_of_Foreign_Affairs_(Iraq)" title="Minister of Foreign Affairs (Iraq)">Iraqi Foreign Ministry</a> says that it will summon the Iranian ambassador in response to the attacks. <a rel="nofollow" class="external text" href="https://www.rferl.org/a/iran-iraq-kurds-shelling/32058062.html">(RFE/RL)</a></li></ul></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li><a href="/wiki/2022_Atlantic_hurricane_season" title="2022 Atlantic hurricane season">2022 Atlantic hurricane season</a>
<ul><li><a href="/wiki/Hurricane_Ian" title="Hurricane Ian">Hurricane Ian</a>
<ul><li>A section of the <a href="/wiki/Sanibel_Causeway" title="Sanibel Causeway">Sanibel Causeway</a> in <a href="/wiki/Florida" title="Florida">Florida</a>, <a href="/wiki/United_States" title="United States">United States</a>, collapses following damage from Ian, blocking access to the islands of <a href="/wiki/Sanibel,_Florida" title="Sanibel, Florida">Sanibel</a> and <a href="/wiki/Captiva,_Florida" title="Captiva, Florida">Captiva</a>. <a rel="nofollow" class="external text" href="https://www.tampabay.com/hurricane/2022/09/29/it-was-just-blasting-us-hours-cape-coral-fort-myers-flooded-by-ian/">(<i>Tampa Bay Times</i>)</a> <a rel="nofollow" class="external text" href="https://www.nbcmiami.com/news/local/portion-of-sanibel-causeway-collapses-after-ian-makes-landfall-on-southwest-florida/2870986/">(WTVJ-TV)</a></li>
<li><a href="/wiki/Governor_of_Florida" class="mw-redirect" title="Governor of Florida">Florida Governor</a> <a href="/wiki/Ron_DeSantis" title="Ron DeSantis">Ron DeSantis</a> announces that <a href="/wiki/Florida" title="Florida">the state</a> has launched efforts to rescue people stranded from their homes by flooding from Ian. Additionally, <a href="/wiki/President_of_the_United_States" title="President of the United States">President</a> <a href="/wiki/Joe_Biden" title="Joe Biden">Joe Biden</a> declares Ian a major disaster. <a rel="nofollow" class="external text" href="https://www.politico.com/news/2022/09/29/biden-ian-disaster-declaration-00059447">(Politico)</a></li>
<li>The death toll from the hurricane increases to at least 17. <a rel="nofollow" class="external text" href="https://www.cnn.com/2022/09/29/weather/hurricane-ian-florida-path-thursday/index.html">(CNN)</a></li></ul></li></ul></li>
<li><a href="/wiki/2022_Nord_Stream_gas_leaks" title="2022 Nord Stream gas leaks">2022 Nord Stream gas leaks</a>
<ul><li><a href="/wiki/Sweden" title="Sweden">Swedish</a> authorities report a fourth gas leak from the Nord Stream pipelines. <a rel="nofollow" class="external text" href="https://news.sky.com/story/fourth-leak-reportedly-found-on-nord-stream-pipeline-12707280?">(Sky News)</a></li>
<li><a href="/wiki/Russian_President" class="mw-redirect" title="Russian President">Russian President</a> <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a> calls the Nord Stream gas leaks "an unprecedented act of <a href="/wiki/International_terrorism" class="mw-redirect" title="International terrorism">international terrorism</a>". <a rel="nofollow" class="external text" href="https://www.rbc.ru/politics/29/09/2022/6335db879a79479dee2e775c">(RBK)</a></li></ul></li>
<li>One person is dead after a fire breaks out at an election agency in <a href="/wiki/Asunci%C3%B3n" title="Asunción">Asunción</a>, <a href="/wiki/Paraguay" title="Paraguay">Paraguay</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/americas/fire-paraguays-electoral-headquarters-throws-coming-votes-into-question-2022-09-29/">(Reuters)</a></li></ul>
<p><b>Health and environment</b>
</p>
<ul><li><a href="/wiki/COVID-19_pandemic" title="COVID-19 pandemic">COVID-19 pandemic</a>
<ul><li><a href="/wiki/COVID-19_pandemic_in_Asia" title="COVID-19 pandemic in Asia">COVID-19 pandemic in Asia</a>
<ul><li><a href="/wiki/COVID-19_pandemic_in_Indonesia" title="COVID-19 pandemic in Indonesia">COVID-19 pandemic in Indonesia</a>
<ul><li><a href="/wiki/COVID-19_vaccination_in_Indonesia" title="COVID-19 vaccination in Indonesia">COVID-19 vaccination in Indonesia</a>
<ul><li><a href="/wiki/Indonesia" title="Indonesia">Indonesia</a> grants approval for the first Chinese <a href="/wiki/MRNA_vaccine" title="MRNA vaccine">mRNA vaccine</a> against <a href="/wiki/COVID-19" title="COVID-19">COVID-19</a>, the <a href="/wiki/Walvax_COVID-19_vaccine" title="Walvax COVID-19 vaccine">Walvax COVID-19 vaccine</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/business/healthcare-pharmaceuticals/indonesia-drug-agency-approves-chinas-walvax-mrna-vaccine-emergency-use-2022-09-29/">(Reuters)</a></li></ul></li></ul></li>
<li><a href="/wiki/COVID-19_pandemic_in_Taiwan" title="COVID-19 pandemic in Taiwan">COVID-19 pandemic in Taiwan</a>
<ul><li><a href="/wiki/Taiwan" title="Taiwan">Taiwan</a> announces that it will end the mandatory <a href="/wiki/Quarantine" title="Quarantine">quarantine</a> of visitors on October 13 and will also restore temporarily suspended <a href="/wiki/Travel_visa" title="Travel visa">visa</a>-free travel for countries that had a relevant agreement with the island. <a rel="nofollow" class="external text" href="https://www.straitstimes.com/asia/east-asia/taiwan-to-end-covid-19-quarantine-for-arrivals-welcome-back-tourists">(<i>The Straits Times</i>)</a></li></ul></li></ul></li></ul></li></ul>
<p><b>International relations</b>
</p>
<ul><li><a href="/wiki/Foreign_relations_of_Nicaragua" title="Foreign relations of Nicaragua">Foreign relations of Nicaragua</a>
<ul><li>Bettina Muscheidt, the <a href="/wiki/European_Union" title="European Union">European Union</a> <a href="/wiki/Ambassador" title="Ambassador">ambassador</a> to Nicaragua, is declared <i><a href="/wiki/Persona_non_grata" title="Persona non grata">persona non grata</a></i>, presumably due to her criticism of undemocratic policies of <a href="/wiki/President_of_Nicaragua" title="President of Nicaragua">President</a> <a href="/wiki/Daniel_Ortega" title="Daniel Ortega">Daniel Ortega</a>. <a rel="nofollow" class="external text" href="https://www.euractiv.com/section/global-europe/news/nicaragua-declares-the-eu-ambassador-persona-non-grata/">(Euractiv)</a></li></ul></li>
<li><a href="/wiki/Montenegro%E2%80%93Russia_relations" title="Montenegro–Russia relations">Montenegro–Russia relations</a>
<ul><li><a href="/wiki/Montenegro" title="Montenegro">Montenegro</a> expels six <a href="/wiki/Russia" title="Russia">Russian</a> <a href="/wiki/Diplomat" title="Diplomat">diplomats</a>, whom the country accuses of spying. In response, the Russian <a href="/wiki/Embassy" class="mw-redirect" title="Embassy">embassy</a> in Montenegro announces that its consular section will suspend its services beginning on Friday and "until further notice". <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/montenegro-detains-russians-montenegrins-suspicion-spying-report-2022-09-29/">(Reuters)</a> <a rel="nofollow" class="external text" href="https://www.pobjeda.me/clanak/ambasada-rusije-zbog-neprijateljskog-cina-obustavljamo-konzularno-odjeljenje">(Pobjeda)</a></li></ul></li></ul>
<p><b>Law and crime</b>
</p>
<ul><li><a href="/wiki/Abortion_in_India" title="Abortion in India">Abortion in India</a>
<ul><li>The <a href="/wiki/Supreme_Court_of_India" title="Supreme Court of India">Supreme Court of India</a> strikes down a portion of the Medical Termination of Pregnancy Act that forbade unmarried women from having an <a href="/wiki/Abortion" title="Abortion">abortion</a>, thus legalising the procedure for all women until the 24th week of pregnancy. The ruling also notes that forcing a woman to carry the child could constitute <a href="/wiki/Marital_rape" title="Marital rape">marital rape</a>, which is not, however, recognised as an offence in India. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/29/all-women-have-right-to-safe-and-legal-abortion-india-top-court">(Al Jazeera)</a></li></ul></li>
<li><a href="/wiki/Aung_San_Suu_Kyi" title="Aung San Suu Kyi">Aung San Suu Kyi</a>, the ousted leader of <a href="/wiki/Myanmar" title="Myanmar">Myanmar</a>, is <a href="/wiki/Sentence_(law)" title="Sentence (law)">sentenced</a> to a further three years' imprisonment for "violating the state's secrets act". She is already serving 20 years on other <a href="/wiki/Criminal_charge" title="Criminal charge">charges</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/business-myanmar-aung-san-suu-kyi-government-and-politics-34eda95ba2f20c578a545c6742cd9eac">(AP)</a></li>
<li>The <a href="/wiki/Catholic_Church" title="Catholic Church">Catholic Church</a> reveals that it disciplined <a href="/wiki/Carlos_Filipe_Ximenes_Belo" title="Carlos Filipe Ximenes Belo">Carlos Filipe Ximenes Belo</a>, an <a href="/wiki/East_Timor" title="East Timor">East Timorese</a> minister and former <a href="/wiki/Bishop" title="Bishop">bishop</a> who was awarded the <a href="/wiki/Nobel_Peace_Prize" title="Nobel Peace Prize">Nobel Peace Prize</a> in 1996, over allegations of <a href="/wiki/Sexual_abuse" title="Sexual abuse">sexual abuse</a> of teenage boys committed in the early 1990s. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/vatican-disciplined-nobel-winning-bishop-over-alleged-abuse-minors-2022-09-29/">(Reuters)</a></li>
<li>The <a href="/wiki/International_Criminal_Tribunal_for_Rwanda" title="International Criminal Tribunal for Rwanda">International Criminal Tribunal for Rwanda</a> begins the trial of <a href="/wiki/F%C3%A9licien_Kabuga" title="Félicien Kabuga">Félicien Kabuga</a>, one of the richest Rwandan businessmen in the 1990s who is implicated in the <a href="/wiki/Rwandan_genocide" title="Rwandan genocide">Rwandan genocide</a>. Kabuga pleads not guilty and does not appear on the first day of the proceedings. <a rel="nofollow" class="external text" href="https://www.bbc.com/news/world-africa-63068598">(BBC News)</a></li>
<li>The <a href="/wiki/European_Commission" title="European Commission">European Commission</a> sues <a href="/wiki/Malta" title="Malta">Malta</a> in the <a href="/wiki/European_Court_of_Justice" title="European Court of Justice">European Court of Justice</a>, seeking to end the country's "<a href="/wiki/Golden_passport" class="mw-redirect" title="Golden passport">golden passport</a>" scheme, which is the only such scheme still active in the EU. This scheme allows large investors to be granted <a href="/w/index.php?title=Maltese_citizenship&amp;action=edit&amp;redlink=1" class="new" title="Maltese citizenship (page does not exist)">Maltese citizenship</a>, and by extension, citizenship of the European Union. <a rel="nofollow" class="external text" href="https://www.bloomberg.com/news/articles/2022-09-29/malta-taken-to-eu-s-top-court-over-lucrative-golden-passports">(Bloomberg)</a></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/Annexation_of_Southern_and_Eastern_Ukraine" title="Annexation of Southern and Eastern Ukraine">Annexation of Southern and Eastern Ukraine</a>
<ul><li><a href="/wiki/Kremlin_Press_Secretary" title="Kremlin Press Secretary">Press Secretary</a> of the <a href="/wiki/President_of_Russia" title="President of Russia">President of Russia</a> <a href="/wiki/Dmitry_Peskov" title="Dmitry Peskov">Dmitry Peskov</a> says that the <a href="/wiki/Kremlin" title="Kremlin">Kremlin</a> is scheduled to sign agreements on the annexation of the <a href="/wiki/Occupied_territories_of_Ukraine" class="mw-redirect" title="Occupied territories of Ukraine">occupied territories of Ukraine</a> by <a href="/wiki/Russia" title="Russia">Russia</a> on September 30. <a rel="nofollow" class="external text" href="https://forbes.ua/ru/news/putin-gotue-priednannya-okupovanikh-teritoriy-ukraini-do-rosii-30-veresnya-zakhid-poperedzhae-pro-sanktsii-29092022-8671">(Forbes)</a></li>
<li><a href="/wiki/President_of_Ukraine" title="President of Ukraine">President of Ukraine</a> <a href="/wiki/Volodymyr_Zelenskyy" title="Volodymyr Zelenskyy">Volodymyr Zelenskyy</a> announces that he will convene an urgent meeting of the <a href="/wiki/National_Security_and_Defense_Council_of_Ukraine" title="National Security and Defense Council of Ukraine">National Security and Defense Council of Ukraine</a> on September 30. <a rel="nofollow" class="external text" href="https://www.pravda.com.ua/rus/news/2022/09/29/7369648/">(Ukrainska Pravda)</a></li>
<li><a href="/wiki/Russian_President" class="mw-redirect" title="Russian President">Russian President</a> <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a> signs a decree recognizing the "independence" of <a href="/wiki/Kherson_Oblast" title="Kherson Oblast">Kherson</a> and <a href="/wiki/Zaporizhzhia_Oblast" title="Zaporizhzhia Oblast">Zaporizhzhia Oblasts</a>, which were proclaimed yesterday. <a rel="nofollow" class="external text" href="https://www.theguardian.com/world/2022/sep/29/putin-to-sign-treaty-annexing-territories-in-ukraine-kremlin-says">(<i>The Guardian</i>)</a> <a rel="nofollow" class="external text" href="https://ria.ru/20220930/nezavisimost-1820478173.html">(RIA Novosti)</a></li></ul></li></ul></div></div></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 28" id="2022_September_28" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;28,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-28</span>)</span> (Wednesday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_28&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_28&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_28&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Russian_emigration_following_the_2022_invasion_of_Ukraine" title="Russian emigration following the 2022 invasion of Ukraine">Russian emigration following the 2022 invasion of Ukraine</a>
<ul><li><a href="/wiki/North_Ossetia%E2%80%93Alania" title="North Ossetia–Alania">North Ossetia–Alania</a> which contains the only <a href="/wiki/Border_crossing" class="mw-redirect" title="Border crossing">border crossing</a> <a href="/wiki/Georgia-Russia_border" class="mw-redirect" title="Georgia-Russia border">between</a> <a href="/wiki/Russia" title="Russia">Russia</a> and <a href="/wiki/Georgia_(country)" title="Georgia (country)">Georgia</a>-controlled territory, bans all Russian cars that do not have the <a href="/wiki/Licence_plate" class="mw-redirect" title="Licence plate">licence plate</a> of the republic, with the exception of tourists travelling to the region. This comes as those fleeing the draft overwhelm the border. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/russian-region-limits-incoming-cars-amid-queues-georgia-border-escape-draft-2022-09-28/">(Reuters)</a></li>
<li>A mobile draft centre is built at the <a href="/wiki/Torfyanovka" title="Torfyanovka">Torfyanovka</a> <a href="/wiki/Border_checkpoint" title="Border checkpoint">checkpoint</a>, the busiest checkpoint on the <a href="/wiki/Finland%E2%80%93Russia_border" title="Finland–Russia border">Finland–Russia border</a>, in order to prevent people who are fit to serve from fleeing the country. However, as of midday, the centre is not yet open. <a rel="nofollow" class="external text" href="https://theins.ru/news/255512">(<i>The Insider</i>)</a></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/Kurdish_separatism_in_Iran" title="Kurdish separatism in Iran">Kurdish separatism in Iran</a>
<ul><li>Thirteen people are killed and 58 others are injured as <a href="/wiki/Iran" title="Iran">Iran</a> launches <a href="/wiki/Missile" title="Missile">missiles</a> and <a href="/wiki/Unmanned_combat_aerial_vehicle" title="Unmanned combat aerial vehicle">drones</a> upon the <a href="/wiki/Democratic_Party_of_Iranian_Kurdistan" title="Democratic Party of Iranian Kurdistan">Democratic Party of Iranian Kurdistan</a>'s offices in <a href="/wiki/Koy_Sanjaq" title="Koy Sanjaq">Koye</a>, <a href="/wiki/Kurdistan_Region" title="Kurdistan Region">Kurdistan Region</a>, <a href="/wiki/Iraq" title="Iraq">Iraq</a>. Iran accused the group of being involved in the <a href="/wiki/Mahsa_Amini_protests" title="Mahsa Amini protests">ongoing protests in the country</a>. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/28/iran-kurd-rebels-say-dead-in-iran-strikes-on-iraqi-kurdistan">(Al Jazeera)</a></li>
<li>An Iranian drone is claimed as shot down by <a href="/wiki/US_forces" class="mw-redirect" title="US forces">US forces</a> in <a href="/wiki/Erbil" title="Erbil">Erbil</a>, Kurdistan Region, Iraq. <a rel="nofollow" class="external text" href="https://www.centcom.mil/MEDIA/STATEMENTS/Statements-View/Article/3173389/statement-regarding-islamic-revolutionary-guard-corps-unprovoked-attack-in-iraq/">(CENTCOM)</a></li></ul></li>
<li><a href="/wiki/Israeli%E2%80%93Palestinian_conflict" title="Israeli–Palestinian conflict">Israeli–Palestinian conflict</a>
<ul><li>Four <a href="/wiki/Palestinians" title="Palestinians">Palestinians</a> are killed and 44 others are injured when <a href="/wiki/Israeli_Defense_Forces" class="mw-redirect" title="Israeli Defense Forces">Israeli soldiers</a> storm a <a href="/wiki/Refugee_camp" title="Refugee camp">refugee camp</a> in <a href="/wiki/Jenin" title="Jenin">Jenin</a>, <a href="/wiki/West_Bank" title="West Bank">West Bank</a>. The brother of the <a href="/wiki/2022_Tel_Aviv_shooting" title="2022 Tel Aviv shooting">2022 Tel Aviv shooting</a>'s perpetrator is among those killed. <a rel="nofollow" class="external text" href="https://www.ynetnews.com/article/sjqp7o11mj#autoplay">(YNetNews)</a> <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/28/israeli-forces-kill-palestinians-jenin-raid">(Al Jazeera)</a></li></ul></li>
<li><a href="/wiki/Insurgency_in_Balochistan" title="Insurgency in Balochistan">Insurgency in Balochistan</a>
<ul><li>One person is killed and two others are injured when a gunman opens fire against Chinese-Pakistani nationals at a <a href="/wiki/Dental_clinic" class="mw-redirect" title="Dental clinic">dental clinic</a> in <a href="/wiki/Karachi" title="Karachi">Karachi</a>, <a href="/wiki/Sindh" title="Sindh">Sindh</a>, <a href="/wiki/Pakistan" title="Pakistan">Pakistan</a>. All of the victims were in their 70s and had worked for the clinic for more than 40 years. <a rel="nofollow" class="external text" href="https://www.bbc.com/news/world-asia-63066745">(BBC News)</a></li></ul></li>
<li><a href="/wiki/Anglophone_crisis" class="mw-redirect" title="Anglophone crisis">Anglophone crisis</a>
<ul><li>Authorities in <a href="/wiki/Cameroon" title="Cameroon">Cameroon</a> ban "undeclared meetings and manifestations" in <a href="/wiki/Bamenda" title="Bamenda">Bamenda</a>, the capital of the <a href="/wiki/Northwest_Region_(Cameroon)" title="Northwest Region (Cameroon)">Northwest Region</a>, after <a href="/wiki/Separatist" class="mw-redirect" title="Separatist">separatists</a> announced a manifestation to commemorate the declaration of independence of <a href="/wiki/Ambazonia" title="Ambazonia">Ambazonia</a>, a <a href="/wiki/Breakaway_state" class="mw-redirect" title="Breakaway state">breakaway state</a> consisting of the <a href="/wiki/English_language" title="English language">English-speaking</a> <a href="/wiki/Regions_of_Cameroon" title="Regions of Cameroon">regions of Cameroon</a>. <a rel="nofollow" class="external text" href="https://english.news.cn/20220929/b08e44d0230743fa9141a86dc3f0a069/c.html">(Xinhua)</a></li></ul></li></ul>
<p><b>Business and economy</b>
</p>
<ul><li><a href="/wiki/Economy_of_the_United_Kingdom" title="Economy of the United Kingdom">Economy of the United Kingdom</a>
<ul><li>The <a href="/wiki/Bank_of_England" title="Bank of England">Bank of England</a> buys 65 billion pounds of <a href="/wiki/Bond_(finance)" title="Bond (finance)">bonds</a> in a bid to stabilise the <a href="/wiki/UK" class="mw-redirect" title="UK">UK</a> economy. <a rel="nofollow" class="external text" href="https://www.nbcnews.com/news/world/bank-england-uk-pound-crash-tax-cuts-rcna49549">(NBC News)</a></li></ul></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li><a href="/wiki/2022_Atlantic_hurricane_season" title="2022 Atlantic hurricane season">2022 Atlantic hurricane season</a>
<ul><li><a href="/wiki/Hurricane_Ian" title="Hurricane Ian">Hurricane Ian</a>
<ul><li>Two people are confirmed dead in <a href="/wiki/Cuba" title="Cuba">Cuba</a> because of the <a href="/wiki/Hurricane" class="mw-redirect" title="Hurricane">hurricane</a>, and the island temporarily <a href="/wiki/Power_outage" title="Power outage">loses electricity</a> from the damage caused. <a rel="nofollow" class="external text" href="https://www.cnn.com/2022/09/27/americas/hurricane-ian-cuba-blackout-intl-hnk/index.html">(CNN)</a></li>
<li>Hurricane Ian makes landfall near <a href="/wiki/Englewood,_Florida" title="Englewood, Florida">Englewood, Florida</a>, United States, as a high-end <a href="/wiki/Saffir%E2%80%93Simpson_scale" title="Saffir–Simpson scale">Category 4</a> hurricane. <a rel="nofollow" class="external text" href="https://www.cnbc.com/2022/09/28/hurricane-ian-making-landfall-near-sanibel-captiva-islands-florida.html">(CNBC)</a> <a rel="nofollow" class="external text" href="https://www.wxii12.com/article/powerful-cat-4-hurricane-ian-makes-landfall-in-florida-tracks-into-north-carolina-this-weekend/41428510">(WXII-TV)</a></li>
<li>Over 200,000 customers are left without power throughout <a href="/wiki/Florida" title="Florida">Florida</a>, U.S,  due to Hurricane Ian. <a rel="nofollow" class="external text" href="https://www.sun-sentinel.com/news/weather/hurricane/fl-ne-viz-hurricane-ian-florida-power-outages-map-20220928-btaj4xtqobfa5jmzpff3cgazdy-htmlstory.html">(<i>Sun Sentinel</i>)</a></li></ul></li></ul></li>
<li>A restaurant fire kills 17 people and injures three others in <a href="/wiki/Changchun" title="Changchun">Changchun</a>, <a href="/wiki/Jilin" title="Jilin">Jilin</a>, <a href="/wiki/China" title="China">China</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/china-fires-changchun-28f4ccf961d3537cc22321c8e62c982c">(AP)</a></li>
<li>Three people are killed and 15 others are reported missing after a bridge collapses in <a href="/wiki/Careiro" title="Careiro">Careiro</a>, <a href="/wiki/Amazonas_(Brazilian_state)" title="Amazonas (Brazilian state)">Amazonas</a>, <a href="/wiki/Brazil" title="Brazil">Brazil</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/americas/bridge-collapses-brazilian-amazon-3-killed-up-15-missing-2022-09-29/">(Reuters)</a></li>
<li>Two people are killed and 10 others are injured after a three-way <a href="/wiki/Car_crash" class="mw-redirect" title="Car crash">car crash</a> in <a href="/wiki/Uvalde,_Texas" title="Uvalde, Texas">Uvalde</a>, <a href="/wiki/Uvalde_County" class="mw-redirect" title="Uvalde County">Uvalde County</a>, <a href="/wiki/Texas" title="Texas">Texas</a>, <a href="/wiki/United_States" title="United States">United States</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/police-shootings-texas-school-accidents-4f23f687838bfae7d005dfb71f61db0a">(AP)</a></li></ul>
<p><b>Law and crime</b>
</p>
<ul><li>Former <a href="/wiki/Guinea" title="Guinea">Guinean</a> military leader <a href="/wiki/Moussa_Dadis_Camara" title="Moussa Dadis Camara">Moussa Dadis Camara</a> and ten others go on trial for their alleged involvement in a <a href="/wiki/2009_Guinean_protests" title="2009 Guinean protests">massacre of anti-government demonstrators</a> in 2009. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/28/ex-guinea-military-ruler-goes-on-trial-for-2009-stadium-massacre">(Al Jazeera)</a></li>
<li><a href="/wiki/Jonathan_Dowdall" title="Jonathan Dowdall">Jonathan Dowdall</a> and his father Patrick plead guilty to facilitating the <a href="/wiki/Killing_of_David_Byrne" title="Killing of David Byrne">Killing of David Byrne</a> in 2016. <a rel="nofollow" class="external text" href="https://www.thejournal.ie/dowdall-guilty-facilitating-david-byrne-murder-5878894-Sep2022/">(The Journal)</a></li>
<li>Six people are shot and injured near several high schools and <a href="/wiki/Alternative_school" title="Alternative school">alternative schools</a> in <a href="/wiki/Oakland,_California" title="Oakland, California">Oakland, California</a>, United States. <a rel="nofollow" class="external text" href="https://abc7news.com/amp/oakland-school-shooting-fontaine-street-sojourner-truth-independent-study-police/12276357/">(KGO-TV)</a></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/2022_annexation_referendums_in_Russian-occupied_Ukraine" title="2022 annexation referendums in Russian-occupied Ukraine">2022 annexation referendums in Russian-occupied Ukraine</a>
<ul><li>The Russian-installed heads of <a href="/wiki/Zaporizhzhia_Oblast" title="Zaporizhzhia Oblast">Zaporizhzhia</a> and <a href="/wiki/Kherson_Oblast" title="Kherson Oblast">Kherson Oblasts</a>' occupation administrations, as well as <a href="/wiki/Leonid_Pasechnik" title="Leonid Pasechnik">Leonid Pasechnik</a>, leader of the breakaway <a href="/wiki/Luhansk_People%27s_Republic" title="Luhansk People&#39;s Republic">Luhansk People's Republic</a>, officially request that they be annexed to Russia, following a <a href="/wiki/Referendum" title="Referendum">referendum</a>, widely seen as <a href="/wiki/Electoral_fraud" title="Electoral fraud">fraudulent</a>, conducted in those regions of <a href="/wiki/Ukraine" title="Ukraine">Ukraine</a>. <a href="/wiki/Donetsk_People%27s_Republic" title="Donetsk People&#39;s Republic">Donetsk People's Republic</a>'s leader <a href="/wiki/Denis_Pushilin" title="Denis Pushilin">Denis Pushilin</a> has not yet submitted such a request but has gone with Pasechnik to <a href="/wiki/Moscow" title="Moscow">Moscow</a> for talks about the annexation, and is expected to send a request shortly. <a rel="nofollow" class="external text" href="https://www.theguardian.com/world/live/2022/sep/28/russia-ukraine-war-live-news-west-rejects-referendum-results-nord-stream-sabotage-denounced">(<i>The Guardian</i>)</a> <a rel="nofollow" class="external text" href="https://www.washingtonpost.com/world/2022/09/28/kyiv-slams-staged-votes-propaganda-show-vows-punish-occupiers/">(<i>The Washington Post</i>)</a></li></ul></li>
<li><a href="/wiki/Russ_Kun" title="Russ Kun">Russ Kun</a> becomes the <a href="/wiki/President_of_Nauru" title="President of Nauru">President of Nauru</a>, succeeding <a href="/wiki/Lionel_Aingimea" title="Lionel Aingimea">Lionel Aingimea</a>. <a rel="nofollow" class="external text" href="https://www.rnz.co.nz/international/pacific-news/475656/pacific-news-in-brief-for-september-28">(RNZ)</a></li></ul></div></div></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 27" id="2022_September_27" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;27,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-27</span>)</span> (Tuesday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_27&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_27&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_27&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/2022_Russian_mobilization" title="2022 Russian mobilization">2022 Russian mobilization</a>
<ul><li><a href="/wiki/Kazakhstan" title="Kazakhstan">Kazakhstan</a> says that around 98,000 <a href="/wiki/Russia" title="Russia">Russian</a> civilians have entered the country by land and air since <a href="/wiki/President_of_Russia" title="President of Russia">Russian president</a> <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a> ordered a military <a href="/wiki/Mobilization" title="Mobilization">mobilization</a>. <a rel="nofollow" class="external text" href="https://www.huffpost.com/entry/russian-men-fleeing-putin-call-up-kazakhstan_n_63331f9fe4b0e376dbf001ec">(HuffPost)</a></li>
<li><a href="/wiki/Latvia" title="Latvia">Latvia</a> announces a state of emergency over the influx of Russian citizens fleeing mobilization. Special measures are taken in the border regions of the country and at all ports of entry. <a rel="nofollow" class="external text" href="https://news.err.ee/1608730630/latvia-declares-emergency-in-border-areas-over-russia-s-mobilization">(ERR)</a></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/2022_Nord_Stream_gas_leaks" title="2022 Nord Stream gas leaks">2022 Nord Stream gas leaks</a>
<ul><li>Three separate spills are detected in the <a href="/wiki/Baltic_Sea" title="Baltic Sea">Baltic Sea</a> following <a href="/wiki/Explosion" title="Explosion">explosions</a> in the <a href="/wiki/Nord_Stream" title="Nord Stream">Nord Stream 1</a> and <a href="/wiki/Nord_Stream_2" title="Nord Stream 2">Nord Stream 2</a> pipelines in what appear to be acts of <a href="/wiki/Sabotage" title="Sabotage">sabotage</a>. <a rel="nofollow" class="external text" href="https://www.euronews.com/my-europe/2022/09/27/denmark-and-sweden-issue-navigation-warnings-over-nord-stream-gas-leaks">(Euronews)</a></li></ul></li>
<li><a href="/wiki/Terrorism_in_Norway" title="Terrorism in Norway">Terrorism in Norway</a>
<ul><li><a href="/wiki/Norway" title="Norway">Norway</a> raises its "emergency preparedness" in response to sightings of "unidentified drones" near its offshore oil and gas facilities in the <a href="/wiki/North_Sea" title="North Sea">North Sea</a>, and is coordinating with its <a href="/wiki/Norwegian_Armed_Forces" title="Norwegian Armed Forces">armed forces</a>, police, and oil and gas industry operators, according to energy minister <a href="/wiki/Terje_Aasland" title="Terje Aasland">Terje Aasland</a>. <a rel="nofollow" class="external text" href="https://www.spglobal.com/commodityinsights/en/market-insights/latest-news/oil/092722-norway-raises-emergency-level-coordinating-with-armed-forces-over-oil-and-gas-drone-threat">(S&amp;P Global)</a></li></ul></li></ul>
<p><b>Business and economy</b>
</p>
<ul><li><a href="/wiki/Baltic_Pipe" title="Baltic Pipe">Baltic Pipe</a>
<ul><li>Leaders from <a href="/wiki/Poland" title="Poland">Poland</a>, <a href="/wiki/Norway" title="Norway">Norway</a> and <a href="/wiki/Denmark" title="Denmark">Denmark</a> hold a ceremony to open the <a href="/wiki/Baltic_Pipe" title="Baltic Pipe">Baltic Pipe</a> natural <a href="/wiki/Gas_pipeline" class="mw-redirect" title="Gas pipeline">gas pipeline</a> that will transport <a href="/wiki/Natural_gas" title="Natural gas">natural gas</a> from the <a href="/wiki/Norwegian_shelf" class="mw-redirect" title="Norwegian shelf">Norwegian shelf</a> via Denmark to Poland. <a rel="nofollow" class="external text" href="https://www.euronews.com/2022/09/27/baltic-pipe-norway-poland-gas-pipeline-opens-in-key-move-to-cut-dependency-on-russia">(Euronews)</a></li></ul></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li><a href="/wiki/2022_Atlantic_hurricane_season" title="2022 Atlantic hurricane season">2022 Atlantic hurricane season</a>
<ul><li><a href="/wiki/Hurricane_Ian" title="Hurricane Ian">Hurricane Ian</a> makes landfall in Western <a href="/wiki/Cuba" title="Cuba">Cuba</a> as a Category 3 hurricane. Residents of the <a href="/wiki/Tampa_Bay_area" title="Tampa Bay area">Tampa Bay area</a> of <a href="/wiki/Florida" title="Florida">Florida</a>, <a href="/wiki/United_States" title="United States">United States</a>, are ordered to <a href="/wiki/Emergency_evacuation" title="Emergency evacuation">evacuate</a>. <a rel="nofollow" class="external text" href="https://www.washingtonpost.com/climate-environment/2022/09/27/hurricane-ian-florida-evacuation-orders/">(<i>Washington Post</i>)</a> <a rel="nofollow" class="external text" href="https://www.reuters.com/world/americas/hurricane-ian-makes-landfall-over-western-cuba-nhc-says-2022-09-27/">(Reuters)</a></li></ul></li>
<li>Two people are killed in a fire at a <a href="/wiki/PKN_Orlen" title="PKN Orlen">PKN Orlen</a> plant in <a href="/wiki/P%C5%82ock" title="Płock">Płock</a>, <a href="/wiki/Poland" title="Poland">Poland</a>. <a rel="nofollow" class="external text" href="https://www.euronews.com/2022/09/27/fire-at-state-owned-orlen-oil-plant-in-poland-kills-two-people">(Euronews)</a></li></ul>
<p><b>Health and environment</b>
</p>
<ul><li>The Ministry of Health of the <a href="/wiki/Democratic_Republic_of_the_Congo" title="Democratic Republic of the Congo">Democratic Republic of the Congo</a> formally declares an end to the country's latest outbreak of <a href="/wiki/Ebola" title="Ebola">Ebola</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/africa/congo-declares-end-latest-ebola-outbreak-east-2022-09-27/">(Reuters)</a></li></ul>
<p><b>International relations</b>
</p>
<ul><li><a href="/wiki/Afghanistan%E2%80%93Russia_relations" title="Afghanistan–Russia relations">Afghanistan–Russia relations</a>
<ul><li><a href="/wiki/Russia" title="Russia">Russia</a> and the <a href="/wiki/Taliban" title="Taliban">Taliban</a> sign a provisional deal for Russia to supply <a href="/wiki/Afghanistan" title="Afghanistan">Afghanistan</a> with gasoline, diesel, gas and wheat. <a rel="nofollow" class="external text" href="https://www.reuters.com/markets/commodities/exclusive-afghan-taliban-sign-deal-russian-oil-products-gas-wheat-2022-09-27/">(Reuters)</a></li></ul></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/2022_annexation_referendums_in_Russian-occupied_Ukraine" title="2022 annexation referendums in Russian-occupied Ukraine">2022 annexation referendums in Russian-occupied Ukraine</a>
<ul><li>According to the results released by Russian occupation authorities in <a href="/wiki/Ukraine" title="Ukraine">Ukraine</a>, the <a href="/wiki/Donetsk_People%27s_Republic" title="Donetsk People&#39;s Republic">Donetsk People's Republic</a>, the <a href="/wiki/Luhansk_People%27s_Republic" title="Luhansk People&#39;s Republic">Luhansk People's Republic</a>, as well as occupied parts of <a href="/wiki/Zaporizhzhia_Oblast" title="Zaporizhzhia Oblast">Zaporizhzhia</a> and <a href="/wiki/Kherson_Oblast" title="Kherson Oblast">Kherson Oblasts</a> overwhelmingly vote in favor of <a href="/wiki/Annexation" title="Annexation">annexation</a>, with 99.23%, 98.42%, 93.11% and 87.05% of support, respectively. Turnout exceeded 75% in each region and exceeded 97% in Donetsk Oblast. However, the voting has been widely dismissed as a <a href="/wiki/Sham_election" class="mw-redirect" title="Sham election">sham referendum</a>. <a rel="nofollow" class="external text" href="https://ria.ru/20220927/referendum-1819941990.html">(RIA Novosti)</a> <a rel="nofollow" class="external text" href="https://apnews.com/article/russia-ukraine-kyiv-moscow-referendums-1780c30715ce49723629d05c5e2f3238">(AP)</a></li>
<li><a href="/wiki/Valentina_Matviyenko" title="Valentina Matviyenko">Valentina Matviyenko</a>, Speaker of the <a href="/wiki/Federation_Council_(Russia)" title="Federation Council (Russia)">Federation Council</a>, the upper chamber of the <a href="/wiki/Russian_parliament" class="mw-redirect" title="Russian parliament">Russian parliament</a>, expects the annexation to be formalised by October 4. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/first-partial-results-show-over-96-occupied-ukraine-regions-favour-joining-2022-09-27/">(Reuters)</a></li></ul></li>
<li>The <a href="/wiki/State_funeral" title="State funeral">state funeral</a> of <a href="/wiki/Assassination_of_Shinzo_Abe" title="Assassination of Shinzo Abe">assassinated</a> former <a href="/wiki/Prime_Minister_of_Japan" title="Prime Minister of Japan">Japanese Prime Minister</a> <a href="/wiki/Shinzo_Abe" title="Shinzo Abe">Shinzo Abe</a> is held at the <a href="/wiki/Nippon_Budokan" title="Nippon Budokan">Budokan</a> in <a href="/wiki/Tokyo" title="Tokyo">Tokyo</a>. <a rel="nofollow" class="external text" href="https://www.npr.org/2022/09/27/1125272058/japan-funeral-shinzo-abe">(NPR)</a></li></ul></div></div></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 26" id="2022_September_26" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;26,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-26</span>)</span> (Monday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_26&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_26&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_26&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/2022_Russian_mobilization" title="2022 Russian mobilization">2022 Russian mobilization</a>
<ul><li><a href="/wiki/2022_anti-war_protests_in_Russia" title="2022 anti-war protests in Russia">2022 anti-war protests in Russia</a>, <a href="/wiki/2022_North_Caucasian_protests" title="2022 North Caucasian protests">2022 North Caucasian protests</a>
<ul><li>Spontaneous protests against the <a href="/wiki/Mobilization" title="Mobilization">mobilization</a> continue in <a href="/wiki/Dagestan" title="Dagestan">Dagestan</a> and <a href="/wiki/Kabardino-Balkaria" title="Kabardino-Balkaria">Kabardino-Balkaria</a>. <a rel="nofollow" class="external text" href="https://www.kavkazr.com/a/v-dagestane-nachalisj-novye-stihiynye-mitingi-protiv-mobilizatsii/32052683.html">(Radio Liberty)</a></li></ul></li></ul></li></ul></li></ul></li>
<li><a href="/wiki/Kurdish%E2%80%93Turkish_conflict_(1978%E2%80%93present)" title="Kurdish–Turkish conflict (1978–present)">Kurdish–Turkish conflict</a>
<ul><li>A police officer is killed and another injured during a shooting and bomb attack near a police station in <a href="/wiki/Mersin" title="Mersin">Mersin</a>, <a href="/wiki/Turkey" title="Turkey">Turkey</a>. Both the attackers are killed. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/middle-east/explosion-near-police-building-turkey-kills-one-police-officer-2022-09-27/">(Reuters)</a></li></ul></li>
<li><a href="/wiki/Jihadist_insurgency_in_Burkina_Faso" title="Jihadist insurgency in Burkina Faso">Jihadist insurgency in Burkina Faso</a>
<ul><li>Eleven soldiers are killed as a 150-vehicle convoy carrying supplies to <a href="/wiki/Djibo" title="Djibo">Djibo</a> is ambushed by <a href="/wiki/Islamist" class="mw-redirect" title="Islamist">Islamist</a> <a href="/wiki/Militant" title="Militant">militants</a> in Gaskindé (Pobé-Mengao), <a href="/wiki/Soum_Province" title="Soum Province">Soum Province</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/africa/several-feared-dead-trucks-destroyed-burkina-faso-convoy-attack-2022-09-27/">(Reuters)</a></li></ul></li>
<li>Russian oligarch <a href="/wiki/Yevgeny_Prigozhin" title="Yevgeny Prigozhin">Yevgeny Prigozhin</a>, a close ally of <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a>, publicly admits for the first time that he founded the <a href="/wiki/Wagner_Group" title="Wagner Group">Wagner Group</a>, a <a href="/wiki/Private_military_company" title="Private military company">private military company</a> accused of <a href="/wiki/War_crime" title="War crime">war crimes</a> in places where they had been deployed. Prigozhin had previously denied any involvement with the organization. <a rel="nofollow" class="external text" href="https://www.theguardian.com/world/2022/sep/26/putin-ally-yevgeny-prigozhin-admits-founding-wagner-mercenary-group">(<i>The Guardian</i>)</a></li></ul>
<p><b>Business and economy</b>
</p>
<ul><li><a href="/wiki/September_2022_United_Kingdom_mini-budget" title="September 2022 United Kingdom mini-budget">September 2022 United Kingdom mini-budget</a>
<ul><li>The <a href="/wiki/Pound_sterling" title="Pound sterling">pound sterling</a> falls to its record lowest level against the <a href="/wiki/United_States_dollar" title="United States dollar">U.S. dollar</a>. <a rel="nofollow" class="external text" href="https://www.bbc.co.uk/news/business-63030208">(BBC News)</a></li></ul></li>
<li><a href="/wiki/Inter-American_Development_Bank" title="Inter-American Development Bank">Inter-American Development Bank</a> chief <a href="/wiki/Mauricio_Claver-Carone" title="Mauricio Claver-Carone">Mauricio Claver-Carone</a> is fired by the bank's board of governors after an external investigation, started because of a <a href="/wiki/Whistleblower" title="Whistleblower">whistleblower</a> complaint, found that Claver-Carone had an undisclosed intimate relationship with his subordinate and committed several ethics violations in connection with her. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/americas/exclusive-idb-governors-vote-remove-bank-president-claver-carone-after-ethics-2022-09-26/">(Reuters)</a> <a rel="nofollow" class="external text" href="https://www.ft.com/content/6745c027-457a-4cae-a7d6-7f7d0e00b009">(<i>Financial Times</i>)</a></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li><a href="/wiki/2022_Pacific_typhoon_season" title="2022 Pacific typhoon season">2022 Pacific typhoon season</a>
<ul><li>Six people are killed as <a href="/wiki/Typhoon_Noru" title="Typhoon Noru">Typhoon Noru</a> makes <a href="/wiki/Landfall" title="Landfall">landfall</a> on the island of <a href="/wiki/Luzon" title="Luzon">Luzon</a>, <a href="/wiki/Philippines" title="Philippines">Philippines</a>. <a rel="nofollow" class="external text" href="https://www.npr.org/2022/09/26/1125053969/typhoon-noru-leaves-5-rescuers-dead-in-the-northern-philippines">(NPR)</a></li></ul></li>
<li>Six <a href="/wiki/Pakistani_military" class="mw-redirect" title="Pakistani military">Pakistani military</a> personnel are killed in a helicopter crash in <a href="/wiki/Balochistan,_Pakistan" title="Balochistan, Pakistan">Balochistan</a>, <a href="/wiki/Pakistan" title="Pakistan">Pakistan</a>. <a rel="nofollow" class="external text" href="https://www.barrons.com/news/six-killed-in-second-pakistan-chopper-crash-in-over-a-month-01664172606">(<i>Barron's</i>)</a></li>
<li>Seven people are killed in a fire in a <a href="/wiki/Shopping_mall" title="Shopping mall">shopping mall</a> in <a href="/wiki/Daejeon" title="Daejeon">Daejeon</a>, <a href="/wiki/South_Korea" title="South Korea">South Korea</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/fires-seoul-south-korea-evacuations-a00790476bf541bfd30a03f79672cbc6">(AP)</a></li>
<li>Three people are killed in a <a href="/wiki/Building_collapse" class="mw-redirect" title="Building collapse">building collapse</a> in <a href="/wiki/Nairobi" title="Nairobi">Nairobi</a>, <a href="/wiki/Kenya" title="Kenya">Kenya</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/africa-accidents-kenya-nairobi-building-collapses-cae6ec3d3056f832c77272286e0b414d">(AP)</a></li>
<li>Four people are killed after a boat sinks in the <a href="/wiki/Gal%C3%A1pagos_Islands" title="Galápagos Islands">Galápagos Islands</a>, <a href="/wiki/Ecuador" title="Ecuador">Ecuador</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/ecuador-charles-darwin-galapagos-islands-221deac1c8e4af2f53351ee56ac44bc1">(AP)</a></li></ul>
<p><b>Health and environment</b>
</p>
<ul><li><a href="/wiki/COVID-19_pandemic" title="COVID-19 pandemic">COVID-19 pandemic</a>
<ul><li><a href="/wiki/COVID-19_pandemic_in_Germany" title="COVID-19 pandemic in Germany">COVID-19 pandemic in Germany</a>
<ul><li><a href="/wiki/Chancellor_of_Germany" title="Chancellor of Germany">Chancellor</a> <a href="/wiki/Olaf_Scholz" title="Olaf Scholz">Olaf Scholz</a> tests positive for <a href="/wiki/COVID-19" title="COVID-19">COVID-19</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/german-chancellor-scholz-tests-positive-coronavirus-ntv-2022-09-26/">(Reuters)</a></li></ul></li></ul></li>
<li><a href="/wiki/2022_Uganda_Ebola_outbreak" title="2022 Uganda Ebola outbreak">2022 Uganda Ebola outbreak</a>
<ul><li>The death toll from an <a href="/wiki/Zaire_ebolavirus" title="Zaire ebolavirus">Ebola virus</a> outbreak in <a href="/wiki/Mubende_District" title="Mubende District">Mubende District</a>, <a href="/wiki/Uganda" title="Uganda">Uganda</a>, increases to 23, with a total of 36 confirmed and suspected cases. <a rel="nofollow" class="external text" href="https://edition.cnn.com/2022/09/26/africa/ebola-deaths-rise-uganda-intl/index.html">(CNN)</a></li></ul></li>
<li>The death toll from the <a href="/wiki/Cholera" title="Cholera">cholera</a> outbreak in <a href="/wiki/Syria" title="Syria">Syria</a> increases to 29, with a total of 338 cases reported, the majority of whom are in <a href="/wiki/Aleppo_Governorate" title="Aleppo Governorate">Aleppo Governorate</a>. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/26/syrian-health-ministry-says-cholera-death-toll-rises-to-29">(Al Jazeera)</a></li></ul>
<p><b>International relations</b>
</p>
<ul><li><a href="/wiki/Colombia%E2%80%93Venezuela_relations" title="Colombia–Venezuela relations">Colombia–Venezuela relations</a>
<ul><li>The <a href="/wiki/Colombia%E2%80%93Venezuela_border" title="Colombia–Venezuela border">Colombia–Venezuela border</a> reopens for commerce and trade after a seven-year closure. <a rel="nofollow" class="external text" href="https://www.bloomberg.com/news/articles/2022-09-26/colombia-and-venezuela-re-open-border-after-years-of-hostility">(Bloomberg)</a></li></ul></li>
<li><a href="/wiki/Kazakhstan%E2%80%93Russia_relations" title="Kazakhstan–Russia relations">Kazakhstan–Russia relations</a>
<ul><li><a href="/wiki/Kazakhstan" title="Kazakhstan">Kazakhstan</a> says that it will not recognize the results of the <a href="/wiki/2022_annexation_referendums_in_Russian-occupied_Ukraine" title="2022 annexation referendums in Russian-occupied Ukraine">ongoing annexation referendums</a> in <a href="/wiki/Occupied_territories_of_Ukraine" class="mw-redirect" title="Occupied territories of Ukraine">Russian-occupied Ukraine</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/asia-pacific/kazakhstan-says-it-wont-recognise-referendums-eastern-ukraine-2022-09-26/">(Reuters)</a></li></ul></li></ul>
<p><b>Law and crime</b>
</p>
<ul><li><a href="/wiki/Izhevsk_school_shooting" title="Izhevsk school shooting">Izhevsk school shooting</a>
<ul><li>A man kills 17 people and injures 24 others in a <a href="/wiki/Mass_shooting" title="Mass shooting">mass shooting</a> at a school in <a href="/wiki/Izhevsk" title="Izhevsk">Izhevsk</a>, <a href="/wiki/Russia" title="Russia">Russia</a>, before <a href="/wiki/Suicide_in_Russia" title="Suicide in Russia">killing himself</a>. <a rel="nofollow" class="external text" href="https://www.bbc.com/news/world-europe-63032790">(BBC News)</a></li></ul></li>
<li><a href="/wiki/2022_California_wildfires" title="2022 California wildfires">2022 California wildfires</a>
<ul><li>The <a href="/wiki/United_States_Forest_Service" title="United States Forest Service">United States Forest Service</a> seizes equipment owned by the <a href="/wiki/Pacific_Gas_and_Electric_Company" title="Pacific Gas and Electric Company">Pacific Gas and Electric Company</a>, as part of a criminal investigation into the company's role in the <a href="/wiki/Mosquito_Fire" title="Mosquito Fire">Mosquito Fire</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/legal/forest-service-launches-criminal-probe-into-mosquito-fire-seizes-pge-equipment-2022-09-26/">(Reuters)</a></li></ul></li>
<li><a href="/wiki/Russia%E2%80%93United_States_relations" title="Russia–United States relations">Russia–United States relations</a>
<ul><li><a href="/wiki/President_of_Russia" title="President of Russia">President</a> <a href="/wiki/Vladimir_Putin" title="Vladimir Putin">Vladimir Putin</a> signs a decree granting <a href="/wiki/Russian_citizenship" class="mw-redirect" title="Russian citizenship">Russian citizenship</a> to American whistleblower <a href="/wiki/Edward_Snowden" title="Edward Snowden">Edward Snowden</a>. <a rel="nofollow" class="external text" href="https://amp.theguardian.com/us-news/2022/sep/26/putin-grants-russian-citizenship-to-us-whistleblower-edward-snowden">(<i>The Guardian</i>)</a></li></ul></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/2022_Cuban_Family_Code_referendum" title="2022 Cuban Family Code referendum">2022 Cuban Family Code referendum</a>
<ul><li>A referendum is approved in <a href="/wiki/Cuba" title="Cuba">Cuba</a>, granting, among other things, broader rights for the <a href="/wiki/LGBT_community" title="LGBT community">LGBT community</a>, including <a href="/wiki/Same-sex_marriage" title="Same-sex marriage">marriage</a>. <a rel="nofollow" class="external text" href="https://time.com/6216660/cuba-approves-same-sex-marriage/">(<i>Time</i>)</a></li></ul></li></ul>
<p><b>Science and technology</b>
</p>
<ul><li><a href="/wiki/Double_Asteroid_Redirection_Test" title="Double Asteroid Redirection Test">Double Asteroid Redirection Test</a>
<ul><li><a href="/wiki/NASA" title="NASA">NASA</a>'s DART spacecraft successfully impacts <a href="/wiki/Dimorphos" title="Dimorphos">Dimorphos</a> at 23:16 <a href="/wiki/UTC" class="mw-redirect" title="UTC">UTC</a>, becoming the first spacecraft to impact an <a href="/wiki/Asteroid" title="Asteroid">asteroid</a>. <a rel="nofollow" class="external text" href="https://edition.cnn.com/us/live-news/dart-nasa-asteroid-mission/index.html">(CNN)</a></li></ul></li></ul></div></div></div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1099481097"/><div class="current-events">
<div role="region" aria-label="September 25" id="2022_September_25" class="current-events-main vevent">
    <div class="current-events-heading plainlinks">
        <div class="current-events-title" role="heading"><span class="summary">September&#160;25,&#160;2022<span style="display:none">&#160;(<span class="bday dtstart published updated">2022-09-25</span>)</span> (Sunday)</span>
        </div>
        <ul class="current-events-navbar editlink noprint"><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_25&amp;action=edit&amp;editintro=Portal:Current_events/Edit_instructions">edit</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_25&amp;action=history">history</a></li><li><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/2022_September_25&amp;action=watch">watch</a></li>
        </ul>
    </div>
    <div class="current-events-content description">
<p><b>Armed conflicts and attacks</b>
</p>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russo-Ukrainian War</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/2022_Russian_mobilization" title="2022 Russian mobilization">2022 Russian mobilization</a>
<ul><li><a href="/wiki/2022_anti-war_protests_in_Russia" title="2022 anti-war protests in Russia">2022 anti-war protests in Russia</a>, <a href="/wiki/2022_North_Caucasian_protests" title="2022 North Caucasian protests">2022 North Caucasian protests</a>
<ul><li>Mass protests against mobilization take place in <a href="/wiki/Dagestan" title="Dagestan">Dagestan</a> with protesters clashing with police. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/police-clash-with-people-opposed-mobilisation-russias-dagestan-2022-09-25/">(Reuters)</a>, <a rel="nofollow" class="external text" href="https://www.svoboda.org/a/politsiya-razognala-miting-protiv-mobilizatsii-v-mahachkale/32051394.html">(Radio Liberty)</a></li>
<li>The number of people detained in <a href="/wiki/Anti-war_movement" title="Anti-war movement">anti-war</a> protests across <a href="/wiki/Russia" title="Russia">Russia</a> increases to more than 2,000. <a rel="nofollow" class="external text" href="https://www.bbc.co.uk/news/world-europe-63028586">(BBC News)</a></li></ul></li></ul></li>
<li><a href="/wiki/President_of_Ukraine" title="President of Ukraine">Ukrainian president</a> <a href="/wiki/Volodymyr_Zelenskyy" title="Volodymyr Zelenskyy">Volodymyr Zelenskyy</a> confirms that <a href="/wiki/Ukraine" title="Ukraine">Ukraine</a> has received <a href="/wiki/NASAMS" title="NASAMS">NASAMS</a> <a href="/wiki/Anti-aircraft_warfare" title="Anti-aircraft warfare">air defence systems</a> from the <a href="/wiki/United_States" title="United States">United States</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/europe/ukraine-receives-us-air-defence-system-2022-09-25/">(Reuters)</a></li></ul></li></ul></li>
<li><a href="/wiki/Somali_Civil_War_(2009%E2%80%93present)" title="Somali Civil War (2009–present)">Somali Civil War</a>
<ul><li>One <a href="/wiki/Somali_National_Army" title="Somali National Army">soldier</a> is killed and six others are injured in a <a href="/wiki/Suicide_bombing" class="mw-redirect" title="Suicide bombing">suicide bombing</a> in <a href="/wiki/Mogadishu" title="Mogadishu">Mogadishu</a>, <a href="/wiki/Somalia" title="Somalia">Somalia</a>. <a rel="nofollow" class="external text" href="https://www.reuters.com/world/africa/suicide-bombing-somalia-kills-one-soldier-injures-six-2022-09-25/">(Reuters)</a></li></ul></li></ul>
<p><b>Business and economy</b>
</p>
<ul><li><a href="/wiki/Economic_impact_of_the_2022_Russian_invasion_of_Ukraine" title="Economic impact of the 2022 Russian invasion of Ukraine">Economic impact of the 2022 Russian invasion of Ukraine</a>
<ul><li><a href="/wiki/Uzbekistan" title="Uzbekistan">Uzbekistan</a> suspends the use of <a href="/wiki/Russia" title="Russia">Russia</a>'s <a href="/wiki/Payment_card" title="Payment card">card payment system</a> <a href="/wiki/Mir_(payment_system)" title="Mir (payment system)">Mir</a>. The move was supposedly warranted by the need "to carry out the necessary technical procedures" and was not related to sanctions. <a rel="nofollow" class="external text" href="https://www.euronews.com/next/2022/09/24/ukraine-crisis-mir-uzbekistan">(Euronews)</a></li></ul></li></ul>
<p><b>Disasters and accidents</b>
</p>
<ul><li>A <a href="/wiki/Ferry" title="Ferry">ferry</a> carrying <a href="/wiki/Hindu" class="mw-redirect" title="Hindu">Hindu</a> <a href="/wiki/Pilgrim" title="Pilgrim">pilgrims</a> <a href="/wiki/Capsize" class="mw-redirect" title="Capsize">capsizes</a> and sinks in <a href="/wiki/Panchagarh_District" title="Panchagarh District">Panchagarh District</a>, <a href="/wiki/Bangladesh" title="Bangladesh">Bangladesh</a>, killing 66 people and leaving dozens of others missing. <a rel="nofollow" class="external text" href="https://www.aljazeera.com/news/2022/9/27/bangladesh-ferry-disaster-blamed-on-overcrowding-as-dozens-killed">(Al Jazeera)</a></li></ul>
<p><b>Health and environment</b>
</p>
<ul><li><a href="/wiki/COVID-19_pandemic" title="COVID-19 pandemic">COVID-19 pandemic</a>
<ul><li><a href="/wiki/COVID-19_pandemic_in_Spain" title="COVID-19 pandemic in Spain">COVID-19 pandemic in Spain</a>
<ul><li><a href="/wiki/Prime_Minister_of_Spain" title="Prime Minister of Spain">Prime Minister</a> <a href="/wiki/Pedro_S%C3%A1nchez" title="Pedro Sánchez">Pedro Sánchez</a> tests positive for <a href="/wiki/COVID-19" title="COVID-19">COVID-19</a>. <a rel="nofollow" class="external text" href="https://abcnews.go.com/International/wireStory/spanish-pm-snchez-covid-cancels-appearance-90467687">(ABC News)</a></li></ul></li></ul></li></ul>
<p><b>Law and crime</b>
</p>
<ul><li><a href="/wiki/Mahsa_Amini_protests" title="Mahsa Amini protests">Mahsa Amini protests</a>
<ul><li>The <a href="/wiki/Iranian_government" class="mw-redirect" title="Iranian government">Iranian government</a> announces that security forces have regained control of <a href="/wiki/Oshnavieh" title="Oshnavieh">Oshnavieh</a>, a day after protestors allegedly "took control" of the city. <a rel="nofollow" class="external text" href="https://www.bbc.com/news/world-middle-east-63021113">(BBC News)</a></li></ul></li>
<li>Eleven people are killed during an <a href="/wiki/Ambush" title="Ambush">ambush</a> by <a href="/wiki/Cattle_raiding" title="Cattle raiding">cattle rustlers</a> in <a href="/wiki/Turkana_County" title="Turkana County">Turkana County</a>, <a href="/wiki/Kenya" title="Kenya">Kenya</a>. <a rel="nofollow" class="external text" href="https://www.bbc.com/news/world-africa-63027210">(BBC)</a></li></ul>
<p><b>Politics and elections</b>
</p>
<ul><li><a href="/wiki/2022_Italian_general_election" title="2022 Italian general election">2022 Italian general election</a>
<ul><li><a href="/wiki/Italians" title="Italians">Italians</a> head to the polls to elect members of the <a href="/wiki/Parliament_of_Italy" class="mw-redirect" title="Parliament of Italy">Parliament</a>. <a rel="nofollow" class="external text" href="https://apnews.com/article/elections-voting-italy-matteo-salvini-c251832f5b73063b2e20869a21f92efe">(AP)</a></li>
<li><a href="/wiki/Exit_poll" title="Exit poll">Exit polls</a> show that the <a href="/wiki/Centre-right_coalition" class="mw-redirect" title="Centre-right coalition">centre-right coalition</a> led by <a href="/wiki/Brothers_of_Italy" title="Brothers of Italy">Brothers of Italy</a> leader <a href="/wiki/Giorgia_Meloni" title="Giorgia Meloni">Giorgia Meloni</a> has won the election with a majority of seats in the <a href="/wiki/Italian_Parliament" title="Italian Parliament">Italian Parliament</a>. <a rel="nofollow" class="external text" href="https://www.bbc.co.uk/news/world-europe-63029909">(BBC News)</a></li></ul></li>
<li><a href="/wiki/2022_Cuban_Family_Code_referendum" title="2022 Cuban Family Code referendum">2022 Cuban Family Code referendum</a>
<ul><li><a href="/wiki/Cubans" title="Cubans">Cubans</a> vote on legalizing <a href="/wiki/Same-sex_marriage" title="Same-sex marriage">same-sex marriage</a> and <a href="/wiki/Same-sex_adoption" title="Same-sex adoption">same-sex adoption</a>. The <a href="/wiki/Government_of_Cuba" class="mw-redirect" title="Government of Cuba">government</a> urges people to vote in favour of legalization while the <a href="/wiki/Catholic_Church" title="Catholic Church">Catholic Church</a> urges people to vote against legalization. <a rel="nofollow" class="external text" href="https://m.dw.com/en/cuba-holds-referendum-on-same-sex-marriage-adoption/a-63231499">(DW)</a></li></ul></li>
<li><a href="/wiki/2022_Swiss_referendums" title="2022 Swiss referendums">2022 Swiss referendums</a>
<ul><li>The <a href="/wiki/Switzerland" title="Switzerland">Swiss</a> go to the polls to decide four ballot questions. The voters agree to raise the retirement age for women to 65 and to increase the <a href="/wiki/Taxation_in_Switzerland#Value_added_tax" title="Taxation in Switzerland">value added tax</a> rates from 7.7% to 8.1%. However, voters rejected the proposal to exempt domestic bonds from taxation and to ban <a href="/wiki/Intensive_animal_farming" title="Intensive animal farming">intensive animal farming</a>. <a rel="nofollow" class="external text" href="https://www.bloomberg.com/news/articles/2022-09-25/swiss-back-plan-to-work-longer-raise-vat-to-pay-for-pensions">(Bloomberg)</a> <a rel="nofollow" class="external text" href="https://www.swissinfo.ch/fre/votations-f%C3%A9d%C3%A9rales-du-25-septembre-2022/47819160">(Swissinfo)</a></li></ul></li></ul></div></div></div>
<div class="current-events-more current-events-main noprint"><a href="/wiki/Portal:Current_events/September_2022" title="Portal:Current events/September 2022">More September 2022 events...</a>
</div>
</div>
<div class="p-current-events-calside">
<style data-mw-deduplicate="TemplateStyles:r1052974272">.mw-parser-output .p-current-events-calendar{margin:0.7em 0;border:1px solid #cedff2;padding:0.5em;background-color:#f5faff;font-size:75%;text-align:center}.mw-parser-output .p-current-events-calendar>div{padding:0.2em 0;background-color:#cedff2}.mw-parser-output .p-current-events-calendar span[role="separator"]{margin:0 0.6em}</style><div class="p-current-events-calendar"><div><b>Time</b>: 09:10 <a href="/wiki/Coordinated_Universal_Time" title="Coordinated Universal Time">UTC</a><span role="separator">|</span><b>Day</b>: <a href="/wiki/1_October" class="mw-redirect" title="1 October">1 October</a><span role="separator" class="noprint"></span>
    </div>
</div>
<style data-mw-deduplicate="TemplateStyles:r1053509144">.mw-parser-output .current-events-calendar{clear:right;max-width:350px;width:100%;margin:auto;padding:0.2em;font-size:88%;line-height:1.5;border-spacing:3px;border:1px solid #cedff2;text-align:center;background-color:#f5faff;color:black}.mw-parser-output .current-events-calendar tbody a{font-weight:bold;width:100%;display:inline-block}.mw-parser-output .current-events-calendar-archive{margin:8px 0 0 0}.mw-parser-output .current-events-calendar caption{font-weight:bold;background-color:#cedff2;line-height:1.6;padding:0.2em}.mw-parser-output .current-events-calendar caption span:first-child{float:left;width:calc(14% + 6px)}.mw-parser-output .current-events-calendar caption span:last-child{float:right;width:calc(14% + 6px)}.mw-parser-output .current-events-calendar th{width:14%}.mw-parser-output .current-events-calendar-footer td{padding-top:3px;padding-bottom:5px;text-align:right}.mw-parser-output .current-events-calendar-footer td a{font-weight:normal;width:initial}</style><table class="current-events-calendar"><caption><span class="noprint"><a href="/wiki/Portal:Current_events/September_2022" title="Portal:Current events/September 2022">◀</a></span><span><a href="/wiki/Portal:Current_events/October_2022" title="Portal:Current events/October 2022">October 2022</a></span><span class="noprint"><a href="/w/index.php?title=Portal:Current_events/November_2022&amp;action=edit&amp;redlink=1" class="new" title="Portal:Current events/November 2022 (page does not exist)">▶</a></span></caption><tbody><tr><th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td><a href="#2022_October_1">1</a></td></tr><tr><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td></tr><tr><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td></tr><tr><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td></tr><tr><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td><td>29</td></tr><tr><td>30</td><td>31</td><td></td><td></td><td></td><td></td><td></td></tr><tr class="current-events-calendar-footer noprint"><td colspan="7"><a href="/wiki/Portal:Current_events/October_2022" title="Portal:Current events/October 2022">More October 2022 events...&#160;&#160;&#160;</a></td></tr></tbody></table>
<style data-mw-deduplicate="TemplateStyles:r1053345560">.mw-parser-output .current-events-sidebar-header{clear:both;margin:0.7em 0;border:1px solid #cedff2;padding:0.5em;background-color:#f8f9fa;text-align:center;font-size:70%;font-style:italic}.mw-parser-output .current-events-sidebar{margin:1.1em 0;border:1px solid #cedff2;padding:0.4em;font-size:88%;background-color:#f5faff}.mw-parser-output .current-events-sidebar::after{content:"";clear:both;display:table}.mw-parser-output .current-events-sidebar>div:not(.mw-collapsible-content){padding:0 0.4em;background-color:#cedff2}.mw-parser-output .current-events-sidebar>div>h2{display:block;margin:0;border:none;padding:0;font-size:125%;line-height:inherit;font-family:inherit;font-weight:bold}.mw-parser-output .current-events-sidebar h3{font-size:inherit}.mw-parser-output .current-events-sidebar .editlink{font-size:85%;text-align:right}</style>
<div class="noprint" style="clear:both; margin:0.7em 0; border:1px solid #cedff2; padding:0.7em 0.5em; background-color: #f8f9fa; line-height:2; text-align:center; font-size:80%"><a href="/wiki/Wikipedia:How_the_Current_events_page_works" title="Wikipedia:How the Current events page works">About this page</a> <br /><a href="/wiki/Wikipedia:Current_events_noticeboard" title="Wikipedia:Current events noticeboard">Report a dispute</a> • <a href="/wiki/Wikipedia:Wikipedia_Signpost" title="Wikipedia:Wikipedia Signpost">News about Wikipedia</a>
</div>
<div role="region" aria-labelledby="Ongoing_events" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Ongoing_events">
Ongoing events
</span></h2>
</div>
<div class="mw-collapsible-content">
<h3><span class="mw-headline" id="Disasters">
Disasters
</span></h3>
<ul><li><a href="/wiki/Climate_crisis" title="Climate crisis">Climate crisis</a></li>
<li><a href="/wiki/COVID-19_pandemic" title="COVID-19 pandemic">COVID-19 pandemic</a></li>
<li><a href="/wiki/Opioid_epidemic" title="Opioid epidemic">Opioid epidemic</a></li>
<li><a href="/wiki/2022_monkeypox_outbreak" title="2022 monkeypox outbreak">2022 monkeypox outbreak</a></li>
<li><a href="/wiki/2022_European_drought" title="2022 European drought">2022 European drought</a></li>
<li><a href="/wiki/2020%E2%80%932022_North_American_drought" title="2020–2022 North American drought">2020–2022 North American drought</a>
<ul><li><a href="/wiki/2022_California_wildfires" title="2022 California wildfires">2022 California wildfires</a></li></ul></li>
<li><a href="/wiki/2022_Pakistan_floods" title="2022 Pakistan floods">2022 Pakistan floods</a></li>
<li><a href="/wiki/2022_Atlantic_hurricane_season" title="2022 Atlantic hurricane season">2022 Atlantic hurricane season</a></li></ul>
<h3><span class="mw-headline" id="Economics">
Economics
</span></h3>
<ul><li><a href="/wiki/2020%E2%80%93present_global_chip_shortage" title="2020–present global chip shortage">2020–present global chip shortage</a></li>
<li><a href="/wiki/2021%E2%80%93present_global_energy_crisis" title="2021–present global energy crisis">2021–present global energy crisis</a></li>
<li><a href="/wiki/2021%E2%80%932022_global_supply_chain_crisis" title="2021–2022 global supply chain crisis">2021–2022 global supply chain crisis</a></li>
<li><a href="/wiki/2021%E2%80%932022_inflation_surge" title="2021–2022 inflation surge">2021–2022 inflation surge</a></li>
<li><a href="/wiki/2022_food_crises" title="2022 food crises">2022 food crises</a></li>
<li><a href="/wiki/Lebanese_liquidity_crisis" title="Lebanese liquidity crisis">Lebanese liquidity crisis</a></li>
<li><a href="/wiki/2019%E2%80%93present_Sri_Lankan_economic_crisis" title="2019–present Sri Lankan economic crisis">Sri Lankan economic crisis</a></li>
<li><a href="/wiki/2018%E2%80%932022_Turkish_currency_and_debt_crisis" title="2018–2022 Turkish currency and debt crisis">Turkish currency and debt crisis</a></li>
<li><a href="/wiki/United_Kingdom_cost_of_living_crisis" class="mw-redirect" title="United Kingdom cost of living crisis">United Kingdom cost of living crisis</a></li></ul>
<h3><span class="mw-headline" id="Politics">
Politics
</span></h3>
<ul><li><a href="/wiki/2021%E2%80%932022_Belarus%E2%80%93European_Union_border_crisis" title="2021–2022 Belarus–European Union border crisis">Belarus−European Union border crisis</a></li>
<li><a href="/wiki/Mahsa_Amini_protests" title="Mahsa Amini protests">Iranian protests</a></li>
<li><a href="/wiki/2021%E2%80%932022_Iraqi_political_crisis" title="2021–2022 Iraqi political crisis">Iraqi political crisis</a></li>
<li><a href="/wiki/2020%E2%80%932022_Malaysian_political_crisis" title="2020–2022 Malaysian political crisis">Malaysian political crisis</a></li>
<li><a href="/wiki/2021%E2%80%932022_Myanmar_protests" title="2021–2022 Myanmar protests">Myanmar protests</a></li>
<li><a href="/wiki/2017%E2%80%93present_Peruvian_political_crisis" title="2017–present Peruvian political crisis">Peruvian political crisis</a></li>
<li><a href="/wiki/2022_Russia%E2%80%93European_Union_gas_dispute" title="2022 Russia–European Union gas dispute">Russia−European Union gas dispute</a></li>
<li><a href="/wiki/2022_Sri_Lankan_protests" title="2022 Sri Lankan protests">Sri Lankan protests</a></li>
<li><a href="/wiki/2019%E2%80%932022_Sudanese_protests" title="2019–2022 Sudanese protests">Sudanese protests</a></li>
<li><a href="/wiki/2021%E2%80%932022_Tunisian_political_crisis" title="2021–2022 Tunisian political crisis">Tunisian political crisis</a></li>
<li><a href="/wiki/2022_Ukrainian_refugee_crisis" title="2022 Ukrainian refugee crisis">Ukrainian refugee crisis</a></li>
<li><a href="/wiki/2022_abortion_protests" title="2022 abortion protests">United States abortion protests</a></li></ul>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<div role="region" aria-labelledby="Elections_and_referenda" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Elections_and_referendums">
<a href="/wiki/2022_national_electoral_calendar" title="2022 national electoral calendar">Elections and referendums</a>
</span></h2>
</div>
<div class="mw-collapsible-content">
<h3><span class="mw-headline" id="Recent">
Recent
</span></h3>
<ul><li><a href="/wiki/2022_national_electoral_calendar#September" title="2022 national electoral calendar">September</a>
<ul><li>18: <b><a href="/wiki/Elections_in_Liechtenstein" title="Elections in Liechtenstein">Liechtenstein</a></b>, <a href="/wiki/2022_Liechtenstein_referendums#September_referendum" title="2022 Liechtenstein referendums">Referendum</a></li>
<li>24: <b><a href="/wiki/Elections_in_Nauru" title="Elections in Nauru">Nauru</a></b>, <a href="/wiki/2022_Nauruan_parliamentary_election" title="2022 Nauruan parliamentary election">Parliament</a></li>
<li>23−24: <b><a href="/wiki/Elections_in_the_Czech_Republic" title="Elections in the Czech Republic">Czech Republic</a></b>, <a href="/wiki/2022_Czech_Senate_election" title="2022 Czech Senate election">Senate</a></li>
<li>25: <b><a href="/wiki/Elections_in_Cuba" title="Elections in Cuba">Cuba</a></b>, <a href="/wiki/2022_Cuban_Family_Code_referendum" title="2022 Cuban Family Code referendum">Referendum</a></li>
<li>25: <b><a href="/wiki/Elections_in_Italy" title="Elections in Italy">Italy</a></b>, <a href="/wiki/2022_Italian_general_election" title="2022 Italian general election">Chamber of Deputies, Senate</a></li>
<li>25: <b><a href="/wiki/Elections_in_S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe" title="Elections in São Tomé and Príncipe">São Tomé and Príncipe</a></b>, <a href="/wiki/2022_S%C3%A3o_Tom%C3%A9an_legislative_election" title="2022 São Toméan legislative election">National Assembly</a></li>
<li>25: <b><a href="/wiki/Voting_in_Switzerland" title="Voting in Switzerland">Switzerland</a></b>, <a href="/wiki/2022_Swiss_referendums#September_referendums" title="2022 Swiss referendums">Referendums</a></li>
<li>23−27: <i><b><a href="/wiki/Occupied_territories_of_Ukraine" class="mw-redirect" title="Occupied territories of Ukraine">Russia-occupied Ukraine</a></b>, <a href="/wiki/2022_annexation_referendums_in_Russian-occupied_Ukraine" title="2022 annexation referendums in Russian-occupied Ukraine">Annexation referendums</a></i></li>
<li>28: <b><a href="/wiki/Elections_in_Nauru" title="Elections in Nauru">Nauru</a></b>, <a href="/wiki/2022_Nauruan_presidential_election" title="2022 Nauruan presidential election">President <span style="font-size:92%;line-height:1.30em;">(indirect)</span></a></li>
<li>29: <b><a href="/wiki/Elections_in_Kuwait" title="Elections in Kuwait">Kuwait</a></b>, <a href="/wiki/2022_Kuwaiti_general_election" title="2022 Kuwaiti general election">National Assembly</a></li></ul></li></ul>
<h3><span class="mw-headline" id="Upcoming">
Upcoming
</span></h3>
<ul><li><a href="/wiki/2022_national_electoral_calendar#October" title="2022 national electoral calendar">October</a>
<ul><li>1: <b><a href="/wiki/Elections_in_Latvia" title="Elections in Latvia">Latvia</a></b>, <a href="/wiki/2022_Latvian_parliamentary_election" title="2022 Latvian parliamentary election">Saeima</a></li>
<li>2: <b><a href="/wiki/Elections_in_Bosnia_and_Herzegovina" title="Elections in Bosnia and Herzegovina">Bosnia and Herzegovina</a></b>, <a href="/wiki/2022_Bosnian_general_election" title="2022 Bosnian general election">Presidency, <br />&#160; &#8195; &#160; &#8195;House of Representatives</a></li>
<li>2: <b><a href="/wiki/Elections_in_Brazil" title="Elections in Brazil">Brazil</a></b>, <a href="/wiki/2022_Brazilian_general_election" title="2022 Brazilian general election">President, Federal Senate, Chamber of Deputies</a></li>
<li>2: <b><a href="/wiki/Elections_in_Bulgaria" title="Elections in Bulgaria">Bulgaria</a></b>, <a href="/wiki/2022_Bulgarian_parliamentary_election" title="2022 Bulgarian parliamentary election">National Assembly</a></li>
<li>7: <b><a href="/wiki/Elections_in_Lesotho" title="Elections in Lesotho">Lesotho</a></b>, <a href="/wiki/2022_Lesotho_general_election" title="2022 Lesotho general election">National Assembly</a></li>
<li>9: <b><a href="/wiki/Elections_in_Austria" title="Elections in Austria">Austria</a></b>, <a href="/wiki/2022_Austrian_presidential_election" title="2022 Austrian presidential election">President</a></li>
<li>13: <b><a href="/wiki/Elections_in_Vanuatu" title="Elections in Vanuatu">Vanuatu</a></b>, <a href="/wiki/2022_Vanuatuan_general_election" title="2022 Vanuatuan general election">Parliament</a></li></ul></li></ul>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<div role="region" aria-labelledby="Trials" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Trials">
Trials
</span></h2>
</div>
<div class="mw-collapsible-content">
<h3><span class="mw-headline" id="Recently_concluded">
Recently concluded
</span></h3>
<ul><li>China: <a href="/wiki/Fu_Zhenghua" title="Fu Zhenghua">Fu Zhenghua</a></li>
<li>Malaysia: <a href="/wiki/Rosmah_Mansor" title="Rosmah Mansor">Rosmah Mansor</a></li>
<li>Russia: <a href="/wiki/Brittney_Griner" title="Brittney Griner">Brittney Griner</a>, <a href="/wiki/Ivan_Safronov_(1990)" title="Ivan Safronov (1990)">Ivan Safronov</a></li>
<li>United States: <a href="/wiki/R._Kelly#Criminal_case_in_the_Northern_District_of_Illinois" title="R. Kelly">R. Kelly</a></li></ul>
<h3><span class="mw-headline" id="Ongoing">
Ongoing
</span></h3>
<ul><li>Armenia: <a href="/wiki/Serzh_Sargsyan#Criminal_prosecution" title="Serzh Sargsyan">Serzh Sargsyan</a></li>
<li>Guinea: <a href="/wiki/Moussa_Dadis_Camara#28_September_events_trial" title="Moussa Dadis Camara">Moussa Dadis Camara</a></li>
<li>Israel: <a href="/wiki/Trial_of_Benjamin_Netanyahu#Trial" title="Trial of Benjamin Netanyahu">Benjamin Netanyahu</a></li>
<li>Italy: <a href="/wiki/Matteo_Salvini" title="Matteo Salvini">Matteo Salvini</a></li>
<li>Kosovo: <a href="/wiki/Kosovo_Specialist_Chambers" title="Kosovo Specialist Chambers">Specialist Chambers</a></li>
<li>Kyrgyzstan: <a href="/wiki/Almazbek_Atambayev" title="Almazbek Atambayev">Almazbek Atambayev</a></li>
<li>Malta: <a href="/wiki/Yorgen_Fenech" title="Yorgen Fenech">Yorgen Fenech</a></li>
<li>Philippines: <a href="/wiki/Leila_de_Lima" title="Leila de Lima">Leila de Lima</a></li>
<li>Sudan: <a href="/wiki/Omar_al-Bashir#Post-presidency_court_cases" title="Omar al-Bashir">Omar al-Bashir</a></li>
<li>United States: <a href="/wiki/Tom_Barrack" title="Tom Barrack">Tom Barrack</a>, <a href="/wiki/Paul_Flores" class="mw-redirect" title="Paul Flores">Paul Flores</a>, <a href="/wiki/Nikolas_Cruz" class="mw-redirect" title="Nikolas Cruz">Nikolas Cruz</a></li>
<li>Vatican City: <a href="/wiki/Giovanni_Angelo_Becciu" title="Giovanni Angelo Becciu">Giovanni Angelo Becciu</a></li>
<li>ICC: <a href="/wiki/Ali_Kushayb" title="Ali Kushayb">Ali Kushayb</a></li></ul>
<h3><span class="mw-headline" id="Upcoming_2">
Upcoming
</span></h3>
<ul><li>Nigeria: <a href="/wiki/Nnamdi_Kanu#Insurgency_and_second_arrest" title="Nnamdi Kanu">Nnamdi Kanu</a></li>
<li>United States: <a href="/wiki/Harvey_Weinstein_sexual_abuse_cases#Los_Angeles_criminal_charges" title="Harvey Weinstein sexual abuse cases">Harvey Weinstein</a>, <a href="/wiki/Igor_Danchenko" title="Igor Danchenko">Igor Danchenko</a></li></ul>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<div role="region" aria-labelledby="Sport" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Sport">
<a href="/wiki/2022_in_sports" title="2022 in sports">Sport</a>
</span></h2>
</div>
<div class="mw-collapsible-content">
<ul><li><a href="/wiki/2022_in_association_football" title="2022 in association football">Association football</a>
<ul><li><a href="/wiki/2022%E2%80%9323_UEFA_Champions_League" title="2022–23 UEFA Champions League">2022–23 UEFA Champions League</a></li>
<li><a href="/wiki/2022%E2%80%9323_Premier_League" title="2022–23 Premier League">2022–23 Premier League</a></li>
<li><a href="/wiki/2022%E2%80%9323_La_Liga" title="2022–23 La Liga">2022–23 La Liga</a></li>
<li><a href="/wiki/2022%E2%80%9323_Serie_A" title="2022–23 Serie A">2022–23 Serie A</a></li>
<li><a href="/wiki/2022%E2%80%9323_Bundesliga" title="2022–23 Bundesliga">2022–23 Bundesliga</a></li>
<li><a href="/wiki/2022%E2%80%9323_Ligue_1" title="2022–23 Ligue 1">2022–23 Ligue 1</a></li>
<li><a href="/wiki/2022_Major_League_Soccer_season" title="2022 Major League Soccer season">2022 MLS season</a></li>
<li><a href="/wiki/2022_Campeonato_Brasileiro_S%C3%A9rie_A" title="2022 Campeonato Brasileiro Série A">2022 Campeonato Brasileiro Série A</a></li>
<li><a href="/wiki/2022_National_Women%27s_Soccer_League_season" title="2022 National Women&#39;s Soccer League season">2022 NWSL season</a></li></ul></li>
<li><a href="/wiki/American_football" title="American football">American football</a>
<ul><li><a href="/wiki/2022_NFL_season" title="2022 NFL season">2022 NFL Season</a></li>
<li><a href="/wiki/2022_NCAA_Division_I_FBS_football_season" title="2022 NCAA Division I FBS football season">2022 NCAA FBS College Football Season</a></li></ul></li>
<li><a href="/wiki/2022_in_baseball" title="2022 in baseball">Baseball</a>
<ul><li><a href="/wiki/2022_Major_League_Baseball_season" title="2022 Major League Baseball season">2022 MLB season</a></li></ul></li>
<li><a href="/wiki/International_cricket_in_2022" title="International cricket in 2022">International cricket</a>
<ul><li><a href="/wiki/2021%E2%80%9323_ICC_World_Test_Championship" class="mw-redirect" title="2021–23 ICC World Test Championship">2021–23 ICC World Test Championship</a></li>
<li><a href="/wiki/2020%E2%80%9323_ICC_Cricket_World_Cup_Super_League" class="mw-redirect" title="2020–23 ICC Cricket World Cup Super League">2020–23 ICC Cricket World Cup Super League</a></li>
<li><a href="/wiki/2019%E2%80%9323_ICC_Cricket_World_Cup_League_2" class="mw-redirect" title="2019–23 ICC Cricket World Cup League 2">2019–23 ICC Cricket World Cup League 2</a></li>
<li><a href="/wiki/2019%E2%80%9322_ICC_Cricket_World_Cup_Challenge_League" class="mw-redirect" title="2019–22 ICC Cricket World Cup Challenge League">2019–22 ICC Cricket World Cup Challenge League</a></li></ul></li>
<li><a href="/wiki/Canadian_football" title="Canadian football">Canadian football</a>
<ul><li><a href="/wiki/2022_CFL_season" title="2022 CFL season">2022 CFL season</a></li></ul></li>
<li><a href="/wiki/Golf" title="Golf">Golf</a>
<ul><li><a href="/wiki/2022_PGA_Tour_Champions_season" title="2022 PGA Tour Champions season">2022 PGA Tour Champions</a></li>
<li><a href="/wiki/2022_Ladies_European_Tour" title="2022 Ladies European Tour">2022 Ladies European Tour</a></li>
<li><a href="/wiki/2022_European_Tour" title="2022 European Tour">2022 European Tour</a></li>
<li><a href="/wiki/2022_LPGA_Tour" title="2022 LPGA Tour">2022 LPGA Tour</a></li></ul></li>
<li><a href="/wiki/Motorsport" title="Motorsport">Motorsport</a>
<ul><li><a href="/wiki/2022_Formula_One_World_Championship" title="2022 Formula One World Championship">2022 Formula One World Championship</a></li></ul></li>
<li><a href="/wiki/Rugby_league" title="Rugby league">Rugby league</a>
<ul><li><a href="/wiki/2022_NRL_season" title="2022 NRL season">2022 NRL season</a></li></ul></li>
<li><a href="/wiki/Rugby_union" title="Rugby union">Rugby union</a>
<ul><li><a href="/wiki/2022_Bunnings_NPC" title="2022 Bunnings NPC">2022 Bunnings NPC</a></li>
<li><a href="/wiki/2022_Rugby_Championship" title="2022 Rugby Championship">2022 Rugby Championship</a></li></ul></li>
<li><a href="/wiki/2022_in_tennis" title="2022 in tennis">Tennis</a>
<ul><li><a href="/wiki/2022_ATP_Tour" title="2022 ATP Tour">2022 ATP Tour</a></li>
<li><a href="/wiki/2022_WTA_Tour" title="2022 WTA Tour">2022 WTA Tour</a></li></ul></li>
<li>Other sports seasons
<ul><li><a href="/wiki/2022%E2%80%9323_snooker_season" title="2022–23 snooker season">2022–23 snooker season</a></li>
<li><a href="/wiki/2022%E2%80%9323_curling_season" title="2022–23 curling season">2022–23 curling season</a></li></ul></li></ul>
<div style="font-weight:bold;">More details – <a href="/wiki/Portal:Current_events/Sports" title="Portal:Current events/Sports">current sports events</a></div>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<div role="region" aria-labelledby="Recent_deaths" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Recent_deaths">
<a href="/wiki/Deaths_in_2022" title="Deaths in 2022">Recent deaths</a>
</span></h2>
</div>
<div class="mw-collapsible-content">
<h3><span id="October_.2F_September"></span><span class="mw-headline" id="October_/_September">
October / September
</span></h3>
<style data-mw-deduplicate="TemplateStyles:r1113337201">.mw-parser-output .gridlist ul{display:grid;grid-column-gap:2em;grid-template-columns:repeat(2,1fr)}</style><div class="gridlist">
<ul><li>1: <a href="/wiki/Antonio_Inoki" title="Antonio Inoki">Antonio Inoki</a></li>
<li>29: <a href="/wiki/Audrey_Evans" title="Audrey Evans">Audrey Evans</a></li>
<li>28: <a href="/wiki/Coolio" title="Coolio">Coolio</a></li>
<li>28: <a href="/wiki/Bill_Plante" title="Bill Plante">Bill Plante</a></li>
<li>26: <a href="/wiki/Venetia_Stevenson" title="Venetia Stevenson">Venetia Stevenson</a></li>
<li>26: <a href="/wiki/Yusuf_al-Qaradawi" title="Yusuf al-Qaradawi">Yusuf al-Qaradawi</a></li>
<li>26: <a href="/wiki/Hilaree_Nelson" title="Hilaree Nelson">Hilaree Nelson</a></li>
<li>25: <a href="/wiki/James_Florio" title="James Florio">James Florio</a></li>
<li>25: <a href="/wiki/Meredith_Tax" title="Meredith Tax">Meredith Tax</a></li>
<li>25: <a href="/wiki/Oleksiy_Zhuravko" title="Oleksiy Zhuravko">Oleksiy Zhuravko</a></li>
<li>24: <a href="/wiki/Rita_Gardner" title="Rita Gardner">Rita Gardner</a></li>
<li>24: <a href="/wiki/Sue_Mingus" title="Sue Mingus">Sue Mingus</a></li>
<li>24: <a href="/wiki/Kitten_Natividad" title="Kitten Natividad">Kitten Natividad</a></li>
<li>24: <a href="/wiki/Pharoah_Sanders" title="Pharoah Sanders">Pharoah Sanders</a></li>
<li>23: <a href="/wiki/Louise_Fletcher" title="Louise Fletcher">Louise Fletcher</a></li>
<li>22: <a href="/wiki/Donald_M._Blinken" title="Donald M. Blinken">Donald M. Blinken</a></li>
<li>22: <a href="/wiki/Hilary_Mantel" title="Hilary Mantel">Hilary Mantel</a></li>
<li>21: <a href="/wiki/John_Hamblin" title="John Hamblin">John Hamblin</a></li>
<li>21: <a href="/wiki/Greg_Lee_(basketball)" title="Greg Lee (basketball)">Greg Lee</a></li>
<li>21: <a href="/wiki/Raju_Srivastav" title="Raju Srivastav">Raju Srivastav</a></li>
<li>19: <a href="/wiki/David_Foreman" title="David Foreman">David Foreman</a></li>
<li>19: <a href="/wiki/Maury_Wills" title="Maury Wills">Maury Wills</a></li>
<li>18: <a href="/wiki/Nick_Holonyak" title="Nick Holonyak">Nick Holonyak</a></li>
<li>18: <a href="/wiki/Cherry_Valentine" title="Cherry Valentine">Cherry Valentine</a></li>
<li>17: <a href="/wiki/Kelsang_Gyatso" title="Kelsang Gyatso">Kelsang Gyatso</a></li>
<li>17: <a href="/wiki/Vlado_Miluni%C4%87" title="Vlado Milunić">Vlado Milunić</a></li>
<li>17: <a href="/wiki/Maarten_Schmidt" title="Maarten Schmidt">Maarten Schmidt</a></li>
<li>16: <a href="/wiki/Death_of_Mahsa_Amini" title="Death of Mahsa Amini">Mahsa Amini</a></li>
<li>15: <a href="/wiki/Eddie_Butler_(rugby_union)" title="Eddie Butler (rugby union)">Eddie Butler</a></li>
<li>15: <a href="/wiki/Saul_Kripke" title="Saul Kripke">Saul Kripke</a></li>
<li>15: <a href="/wiki/John_Stearns" title="John Stearns">John Stearns</a></li>
<li>14: <a href="/wiki/Jim_Post" title="Jim Post">Jim Post</a></li>
<li>14: <a href="/wiki/Henry_Silva" title="Henry Silva">Henry Silva</a></li>
<li>14: <a href="/wiki/Irene_Papas" title="Irene Papas">Irene Papas</a></li>
<li>14: <a href="/wiki/Asad_Rauf" title="Asad Rauf">Asad Rauf</a></li>
<li>13: <a href="/wiki/Fred_Franzia" title="Fred Franzia">Fred Franzia</a></li>
<li>13: <a href="/wiki/Jesse_Powell" title="Jesse Powell">Jesse Powell</a></li>
<li>13: <a href="/wiki/Ken_Starr" title="Ken Starr">Ken Starr</a></li>
<li>13: <a href="/wiki/Jean-Luc_Godard" title="Jean-Luc Godard">Jean-Luc Godard</a></li>
<li>13: <a href="/wiki/Jack_Charles_(actor)" class="mw-redirect" title="Jack Charles (actor)">Jack Charles</a></li>
<li>12: <a href="/wiki/Ramsey_Lewis" title="Ramsey Lewis">Ramsey Lewis</a></li>
<li>12: <a href="/wiki/Lowry_Mays" title="Lowry Mays">Lowry Mays</a></li>
<li>12: <a href="/wiki/PnB_Rock" title="PnB Rock">PnB Rock</a></li>
<li>11: <a href="/wiki/Elias_Theodorou" title="Elias Theodorou">Elias Theodorou</a></li>
<li>11: <a href="/wiki/Anthony_Varvaro" title="Anthony Varvaro">Anthony Varvaro</a></li>
<li>11: <a href="/wiki/Javier_Mar%C3%ADas" title="Javier Marías">Javier Marías</a></li>
<li>11: <a href="/wiki/Alain_Tanner" title="Alain Tanner">Alain Tanner</a></li>
<li>11: <a href="/wiki/Krishnam_Raju" title="Krishnam Raju">Krishnam Raju</a></li>
<li>10: <a href="/wiki/Frank_Cignetti_Sr." title="Frank Cignetti Sr.">Frank Cignetti Sr.</a></li>
<li>10: <a href="/wiki/William_Klein_(photographer)" title="William Klein (photographer)">William Klein</a></li>
<li>9: <a href="/wiki/Jack_Ging" title="Jack Ging">Jack Ging</a></li>
<li>8: <a href="/wiki/Mavis_Nicholson" title="Mavis Nicholson">Mavis Nicholson</a></li>
<li>8: <a href="/wiki/Gwyneth_Powell" title="Gwyneth Powell">Gwyneth Powell</a></li>
<li>8: <a href="/wiki/Elizabeth_II" title="Elizabeth II">Elizabeth II</a></li>
<li>7: <a href="/wiki/David_A._Arnold" title="David A. Arnold">David A. Arnold</a></li>
<li>7: <a href="/wiki/Anne_Garrels" title="Anne Garrels">Anne Garrels</a></li>
<li>7: <a href="/wiki/Marsha_Hunt_(actress,_born_1917)" title="Marsha Hunt (actress, born 1917)">Marsha Hunt</a></li>
<li>7: <a href="/wiki/Lance_Mackey" title="Lance Mackey">Lance Mackey</a></li>
<li>7: <a href="/wiki/Rommy_Hunt_Revson" title="Rommy Hunt Revson">Rommy Hunt Revson</a></li>
<li>7: <a href="/wiki/Bernard_Shaw_(journalist)" title="Bernard Shaw (journalist)">Bernard Shaw</a></li></ul>
</div>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<div role="region" aria-labelledby="Ongoing_conflicts" class="mw-collapsible current-events-sidebar" style="width:30em">
<div>
<h2><span class="mw-headline" id="Ongoing_conflicts">
<a href="/wiki/List_of_ongoing_armed_conflicts" title="List of ongoing armed conflicts">Ongoing conflicts</a>
</span></h2>
</div>
<div class="mw-collapsible-content">
<h3><span class="mw-headline" id="Global">
<a href="/wiki/War_on_terror" title="War on terror">Global</a>
</span></h3>
<ul><li><a href="/wiki/War_against_the_Islamic_State" title="War against the Islamic State">War against the Islamic State</a></li></ul>
<h3><span class="mw-headline" id="Africa">
Africa
</span></h3>
<ul><li>Angola
<ul><li><a href="/wiki/Cabinda_War" title="Cabinda War">Cabinda War</a></li></ul></li>
<li>Cameroon
<ul><li><a href="/wiki/Anglophone_Crisis" title="Anglophone Crisis">Anglophone Crisis</a></li></ul></li>
<li>Central African Republic
<ul><li><a href="/wiki/Central_African_Republic_Civil_War" title="Central African Republic Civil War">Civil war</a></li></ul></li>
<li>Chad
<ul><li><a href="/wiki/Insurgency_in_Northern_Chad" title="Insurgency in Northern Chad">Insurgency in Northern Chad</a></li></ul></li>
<li>Democratic Republic of the Congo</li></ul>
<style data-mw-deduplicate="TemplateStyles:r998391716">.mw-parser-output .div-col{margin-top:0.3em;column-width:30em}.mw-parser-output .div-col-small{font-size:90%}.mw-parser-output .div-col-rules{column-rule:1px solid #aaa}.mw-parser-output .div-col dl,.mw-parser-output .div-col ol,.mw-parser-output .div-col ul{margin-top:0}.mw-parser-output .div-col li,.mw-parser-output .div-col dd{page-break-inside:avoid;break-inside:avoid-column}</style><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Allied_Democratic_Forces_insurgency" title="Allied Democratic Forces insurgency">ADF insurgency</a></li>
<li><a href="/wiki/Lord%27s_Resistance_Army_insurgency" title="Lord&#39;s Resistance Army insurgency">LRA insurgency</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Kivu_conflict" title="Kivu conflict">Kivu conflict</a></li>
<li><a href="/wiki/Ituri_conflict" title="Ituri conflict">Ituri conflict</a></li></ul>
</div>
<ul><li><a href="/wiki/Ethiopian_civil_conflict_(2018%E2%80%93present)" title="Ethiopian civil conflict (2018–present)">Ethiopia</a></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Oromo_conflict" title="Oromo conflict">Oromo conflict</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Tigray_War" title="Tigray War">Tigray War</a></li></ul>
</div>
<ul><li>Mozambique
<ul><li><a href="/wiki/Insurgency_in_Cabo_Delgado" title="Insurgency in Cabo Delgado">Insurgency in Cabo Delgado</a></li></ul></li>
<li><a href="/wiki/Communal_conflicts_in_Nigeria" title="Communal conflicts in Nigeria">Nigeria</a>
<ul><li><a href="/wiki/Insurgency_in_Southeastern_Nigeria" title="Insurgency in Southeastern Nigeria">Insurgency in Southeastern Nigeria</a></li>
<li><a href="/wiki/Boko_Haram_insurgency" title="Boko Haram insurgency">Boko Haram insurgency</a></li></ul></li>
<li><a href="/wiki/Islamist_insurgency_in_the_Sahel" title="Islamist insurgency in the Sahel">Sahel</a> and <a href="/wiki/Insurgency_in_the_Maghreb_(2002%E2%80%93present)" title="Insurgency in the Maghreb (2002–present)">Maghreb</a></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><span class="nowrap"><a href="/wiki/Jihadist_insurgency_in_Burkina_Faso" title="Jihadist insurgency in Burkina Faso">Insurgency in Burkina Faso</a></span></li>
<li><a href="/wiki/Jihadist_insurgency_in_Niger" title="Jihadist insurgency in Niger">Insurgency in Niger</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Mali_War" title="Mali War">Mali War</a></li>
<li><a href="/wiki/Islamic_State_insurgency_in_Tunisia" title="Islamic State insurgency in Tunisia">Insurgency in Tunisia</a></li></ul>
</div>
<ul><li>Senegal
<ul><li><a href="/wiki/Casamance_conflict" title="Casamance conflict">Casamance conflict</a></li></ul></li>
<li><a href="/wiki/Somali_Civil_War" title="Somali Civil War">Somalia</a>
<ul><li><a href="/wiki/Somali_Civil_War_(2009%E2%80%93present)" title="Somali Civil War (2009–present)">Civil war</a></li></ul></li>
<li>Sudan</li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Sudanese_conflict_in_South_Kordofan_and_Blue_Nile" title="Sudanese conflict in South Kordofan and Blue Nile">South Kordofan conflict</a></li></ul></dd></dl>
<ul><li><a href="/wiki/War_in_Darfur" title="War in Darfur">War in Darfur</a></li></ul>
</div>
<ul><li><a href="/wiki/Western_Sahara_conflict" title="Western Sahara conflict">Western Sahara</a>
<ul><li><a href="/wiki/Western_Saharan_clashes_(2020%E2%80%93present)" title="Western Saharan clashes (2020–present)">Guerguerat crisis</a></li></ul></li></ul>
<h3><span class="mw-headline" id="Americas">
Americas
</span></h3>
<ul><li>Colombia
<ul><li><a href="/wiki/Colombian_conflict" title="Colombian conflict">Colombian conflict</a></li></ul></li>
<li>Mexico
<ul><li><a href="/wiki/Mexican_drug_war" title="Mexican drug war">Mexican drug war</a></li></ul></li>
<li>Paraguay
<ul><li><a href="/wiki/Insurgency_in_Paraguay" title="Insurgency in Paraguay">Insurgency in Paraguay</a></li></ul></li>
<li>Peru
<ul><li><a href="/wiki/Internal_conflict_in_Peru" title="Internal conflict in Peru">Internal conflict in Peru</a></li></ul></li></ul>
<h3><span class="mw-headline" id="Asia-Pacific">
Asia-Pacific
</span></h3>
<ul><li><a href="/wiki/Afghanistan_conflict_(1978%E2%80%93present)" title="Afghanistan conflict (1978–present)">Afghanistan</a>
<ul><li><a href="/wiki/Islamic_State%E2%80%93Taliban_conflict" title="Islamic State–Taliban conflict">Islamic State–Taliban conflict</a></li>
<li><a href="/wiki/Republican_insurgency_in_Afghanistan" title="Republican insurgency in Afghanistan">Republican insurgency</a></li></ul></li>
<li>India
<ul><li><a href="/wiki/Insurgency_in_Jammu_and_Kashmir" title="Insurgency in Jammu and Kashmir">Insurgency in Jammu and Kashmir</a></li>
<li><a href="/wiki/Insurgency_in_Northeast_India" title="Insurgency in Northeast India">Insurgency in Northeast India</a></li>
<li><a href="/wiki/Naxalite%E2%80%93Maoist_insurgency" title="Naxalite–Maoist insurgency">Naxalite–Maoist insurgency</a></li></ul></li>
<li>Indonesia
<ul><li><a href="/wiki/Papua_conflict" title="Papua conflict">Papua conflict</a></li></ul></li>
<li><a href="/wiki/Internal_conflict_in_Myanmar" title="Internal conflict in Myanmar">Myanmar</a></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/2021%E2%80%932022_Myanmar_insurgency" class="mw-redirect" title="2021–2022 Myanmar insurgency">Anti-coup insurgency</a></li>
<li><a href="/wiki/Kachin_conflict" title="Kachin conflict">Kachin conflict</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Rakhine_conflict_(2016%E2%80%93present)" class="mw-redirect" title="Rakhine conflict (2016–present)">Rakhine conflict</a></li>
<li><a href="/wiki/Karen_conflict" title="Karen conflict">Karen conflict</a></li></ul>
</div>
<ul><li>Pakistan
<ul><li><a href="/wiki/Insurgency_in_Khyber_Pakhtunkhwa" title="Insurgency in Khyber Pakhtunkhwa">Insurgency in Khyber Pakhtunkhwa</a></li>
<li><a href="/wiki/Insurgency_in_Balochistan" title="Insurgency in Balochistan">Insurgency in Balochistan</a></li></ul></li>
<li><a href="/wiki/Civil_conflict_in_the_Philippines" title="Civil conflict in the Philippines">Philippines</a></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Communist_rebellion_in_the_Philippines" title="Communist rebellion in the Philippines">Communist rebellion</a></li>
<li><a href="/wiki/Philippine_drug_war" title="Philippine drug war">Philippine drug war</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Moro_conflict" title="Moro conflict">Moro conflict</a></li></ul>
</div>
<ul><li>Thailand
<ul><li><a href="/wiki/South_Thailand_insurgency" title="South Thailand insurgency">South Thailand insurgency</a></li></ul></li></ul>
<h3><span class="mw-headline" id="Europe">
Europe
</span></h3>
<ul><li><a href="/wiki/Russo-Ukrainian_War" title="Russo-Ukrainian War">Russia and Ukraine</a>
<ul><li><a href="/wiki/2022_Russian_invasion_of_Ukraine" title="2022 Russian invasion of Ukraine">Russian invasion of Ukraine</a></li></ul></li></ul>
<h3><span class="mw-headline" id="Middle_East">
Middle East
</span></h3>
<ul><li><a href="/wiki/Terrorism_in_Egypt" title="Terrorism in Egypt">Egypt</a>
<ul><li><a href="/wiki/Sinai_insurgency" title="Sinai insurgency">Sinai insurgency</a></li></ul></li>
<li>Iran</li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Iran%E2%80%93PJAK_conflict" title="Iran–PJAK conflict">Iran–Kurdish conflict</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Sistan_and_Baluchestan_insurgency" title="Sistan and Baluchestan insurgency">Iran–Baloch conflict</a></li></ul>
</div>
<ul><li><a href="/wiki/Iraqi_conflict_(2003%E2%80%93present)" title="Iraqi conflict (2003–present)">Iraqi conflict</a></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><ul><li><a href="/wiki/Iranian_intervention_in_Iraq_(2014%E2%80%93present)" title="Iranian intervention in Iraq (2014–present)">Iranian intervention</a></li></ul></dd></dl>
<ul><li><a href="/wiki/Islamic_State_insurgency_in_Iraq_(2017%E2%80%93present)" title="Islamic State insurgency in Iraq (2017–present)">Islamic State insurgency</a></li></ul>
</div>
<ul><li><a href="/wiki/Israeli%E2%80%93Palestinian_conflict" title="Israeli–Palestinian conflict">Israel and Palestine</a>
<ul><li><a href="/wiki/Gaza%E2%80%93Israel_conflict" title="Gaza–Israel conflict">Gaza–Israel conflict</a></li></ul></li>
<li><a href="/wiki/Nagorno-Karabakh_conflict" title="Nagorno-Karabakh conflict">Nagorno-Karabakh</a>
<ul><li><a href="/wiki/2021%E2%80%932022_Armenia%E2%80%93Azerbaijan_border_crisis" title="2021–2022 Armenia–Azerbaijan border crisis">Armenia–Azerbaijan border crisis</a></li></ul></li>
<li><a href="/wiki/Syrian_civil_war" title="Syrian civil war">Syrian civil war</a>
<ul><li><a href="/wiki/Foreign_involvement_in_the_Syrian_civil_war" title="Foreign involvement in the Syrian civil war">Foreign involvement</a></li></ul></li></ul>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r998391716"/><div class="div-col" style="column-width: 6em;column-count:2">
<dl><dd><dl><dd><ul><li><a href="/wiki/American-led_intervention_in_the_Syrian_civil_war" title="American-led intervention in the Syrian civil war">U.S.–led</a></li>
<li><a href="/wiki/Turkish_involvement_in_the_Syrian_civil_war" title="Turkish involvement in the Syrian civil war">Turkish</a></li></ul></dd></dl></dd></dl>
<ul><li><a href="/wiki/Israel%27s_role_in_the_Syrian_civil_war" title="Israel&#39;s role in the Syrian civil war">Israeli</a></li>
<li><a href="/wiki/Iranian_involvement_in_the_Syrian_civil_war" title="Iranian involvement in the Syrian civil war">Iranian</a></li></ul>
</div>
<ul><li><a href="/wiki/Yemeni_Civil_War_(2014%E2%80%93present)" title="Yemeni Civil War (2014–present)">Yemeni civil war</a>
<ul><li><a href="/wiki/Saudi_Arabian%E2%80%93led_intervention_in_Yemen" title="Saudi Arabian–led intervention in Yemen">Saudi Arabian–led intervention</a>
<ul><li><a href="/wiki/Houthi%E2%80%93Saudi_Arabian_conflict" title="Houthi–Saudi Arabian conflict">Houthi–Saudi Arabian conflict</a></li></ul></li></ul></li></ul>
<h3><span id="See_also_.E2.80.93_List_of_ongoing_proxy_wars"></span><span class="mw-headline" id="See_also_–_List_of_ongoing_proxy_wars">
<div style="font-weight:bold;">See also – <a href="/wiki/List_of_ongoing_proxy_wars" class="mw-redirect" title="List of ongoing proxy wars">List of ongoing proxy wars</a></div>
</span></h3>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
<link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r1053345560"/>
<div role="region" aria-labelledby="Ongoing_events" class="mw-collapsible current-events-sidebar">
<div>
<h2><span class="mw-headline" id="2022_events_and_developments_by_topic">
<a href="/wiki/2022" title="2022">2022</a> events and developments by topic
</span></h2>
</div>
<div class="mw-collapsible-content">
<div>
<h3><span class="mw-headline" id="Arts">
<i><b><a href="/wiki/2022_in_art" title="2022 in art">Arts</a></b></i>
</span></h3>
<p><a href="/wiki/2022_in_animation" title="2022 in animation">Animation</a> (<a href="/wiki/2022_in_anime" title="2022 in anime">Anime</a>) – <a href="/wiki/2022_in_architecture" title="2022 in architecture">Architecture</a> – <a href="/wiki/2022_in_comics" title="2022 in comics">Comics</a> – <a href="/wiki/2022_in_film" title="2022 in film">Film</a> (<a href="/wiki/List_of_horror_films_of_2022" title="List of horror films of 2022">Horror</a>, <a href="/wiki/2022_in_science_fiction_film" class="mw-redirect" title="2022 in science fiction film">Science fiction</a>) – <a href="/w/index.php?title=2022_in_home_video&amp;action=edit&amp;redlink=1" class="new" title="2022 in home video (page does not exist)">Home video</a> – <a href="/wiki/2022_in_literature" title="2022 in literature">Literature</a> (<a href="/wiki/2022_in_poetry" title="2022 in poetry">Poetry</a>) – <a href="/wiki/2022_in_music" title="2022 in music">Music</a> (<a href="/wiki/2022_in_classical_music" title="2022 in classical music">Classical</a>, <a href="/wiki/2022_in_country_music" title="2022 in country music">Country</a>, <a href="/wiki/2022_in_hip_hop_music" title="2022 in hip hop music">Hip hop</a>, <a href="/wiki/2022_in_jazz" title="2022 in jazz">Jazz</a>, <a href="/wiki/2022_in_Latin_music" title="2022 in Latin music">Latin</a>, <a href="/wiki/2022_in_heavy_metal_music" title="2022 in heavy metal music">Metal</a>, <a href="/wiki/2022_in_rock_music" title="2022 in rock music">Rock</a>, <a href="/wiki/2022_in_British_music" title="2022 in British music">UK</a>, <a href="/wiki/2022_in_American_music" title="2022 in American music">US</a>, <a href="/wiki/2022_in_South_Korean_music" title="2022 in South Korean music">Korea</a>) – <a href="/wiki/2022_in_radio" title="2022 in radio">Radio</a> – <a href="/w/index.php?title=2022_in_photo&amp;action=edit&amp;redlink=1" class="new" title="2022 in photo (page does not exist)">Photo</a> – <a href="/wiki/2022_in_television" title="2022 in television">Television</a> (<a href="/wiki/2022_in_Australian_television" title="2022 in Australian television">Australia</a>, <a href="/w/index.php?title=2022_in_Brazilian_television&amp;action=edit&amp;redlink=1" class="new" title="2022 in Brazilian television (page does not exist)">Brazil</a>, <a href="/wiki/2022_in_Canadian_television" title="2022 in Canadian television">Canada</a>, <a href="/wiki/2022_in_Irish_television" title="2022 in Irish television">Ireland</a>, <a href="/w/index.php?title=2022_in_Italian_television&amp;action=edit&amp;redlink=1" class="new" title="2022 in Italian television (page does not exist)">Italy</a>, <a href="/wiki/2022_in_British_television" title="2022 in British television">UK</a>, <a href="/wiki/2022_in_Scottish_television" title="2022 in Scottish television">Scotland</a>, <a href="/wiki/2022_in_American_television" title="2022 in American television">US</a>) – <a href="/wiki/2022_in_video_games" title="2022 in video games">Video games</a>
</p>
<h3><span class="mw-headline" id="Politics_and_government">
<i><b><a href="/wiki/2022_in_politics_and_government" title="2022 in politics and government">Politics and government</a></b></i>
</span></h3>
<p><a href="/wiki/List_of_elections_in_2022" title="List of elections in 2022">Elections</a> – <a href="/wiki/List_of_state_leaders_in_2022" title="List of state leaders in 2022">International leaders</a> – <a href="/wiki/List_of_sovereign_states_in_2022" class="mw-redirect" title="List of sovereign states in 2022">Sovereign states</a> – <a href="/wiki/List_of_state_leaders_in_the_21st_century" title="List of state leaders in the 21st century">Sovereign state leaders</a> – <a href="/wiki/List_of_governors_of_dependent_territories_in_the_21st_century" title="List of governors of dependent territories in the 21st century">Territorial governors</a>
</p>
<h3><span class="mw-headline" id="Science_and_technology">
<i><b><a href="/wiki/2022_in_science" title="2022 in science">Science and technology</a></b></i>
</span></h3>
<p><a href="/wiki/2022_in_archaeology" title="2022 in archaeology">Archaeology</a> – <a href="/wiki/2022_in_biotechnology" class="mw-redirect" title="2022 in biotechnology">Biotechnology</a> – <a href="/wiki/2022_in_computing" class="mw-redirect" title="2022 in computing">Computing</a> – <a href="/wiki/2022_in_paleontology" title="2022 in paleontology">Palaeontology</a> – <a href="/wiki/2022_in_quantum_computing_and_communication" class="mw-redirect" title="2022 in quantum computing and communication">Quantum computing and communication</a> – <a href="/wiki/2022_in_senescence_research" class="mw-redirect" title="2022 in senescence research">Senescence research</a> – <a href="/wiki/Template:2022_in_space" title="Template:2022 in space">Space/Astronomy</a> – <a href="/wiki/2022_in_spaceflight" title="2022 in spaceflight">Spaceflight</a> – <a href="/wiki/2020s_in_sustainable_energy_research" class="mw-redirect" title="2020s in sustainable energy research">Sustainable energy research</a>
</p>
<h3><span class="mw-headline" id="Environment_and_environmental_sciences">
<i><b><a href="/wiki/2022_in_the_environment" title="2022 in the environment">Environment and environmental sciences</a></b></i>
</span></h3>
<p><a href="/wiki/2022_in_climate_change" title="2022 in climate change">Climate change</a> – <a href="/wiki/Weather_of_2022#Timeline" title="Weather of 2022">Weather</a>
</p>
<h3><span class="mw-headline" id="Transportation">
<i><b><a href="/wiki/Category:2022_in_transport" title="Category:2022 in transport">Transportation</a></b></i>
</span></h3>
<p><a href="/wiki/2022_in_aviation" title="2022 in aviation">Aviation</a> – <a href="/wiki/2022_in_rail_transport" title="2022 in rail transport">Rail transport</a> – <a href="/wiki/Timeline_of_transportation_technology#2020s" title="Timeline of transportation technology">Transportation technology</a>
</p>
<div style="margin-left:0">
<table class="mw-collapsible mw-collapsed" style="background: transparent; text-align: left; border: 0px solid Silver; margin: 0.2em auto auto; width:100%; clear: both; padding: 1px;">

<tbody><tr>
<th style="background: #f5faff; font-size:87%; padding:0.2em 0.3em; text-align:left;"><div style="font-size:115%;"><i><b><a href="/wiki/Category:2022_by_continent" title="Category:2022 by continent">By place</a></b></i></div>
</th></tr>
<tr>
<td style="border: solid 1px Silver; padding: 0.6em; background: White;">
<p><a href="/wiki/2022_in_Afghanistan" title="2022 in Afghanistan">Afghanistan</a> – <a href="/wiki/2022_in_Albania" title="2022 in Albania">Albania</a> – <a href="/wiki/2022_in_Algeria" title="2022 in Algeria">Algeria</a> – <a href="/wiki/2022_in_Andorra" title="2022 in Andorra">Andorra</a> – <a href="/wiki/2022_in_Angola" title="2022 in Angola">Angola</a> – <a href="/wiki/2022_in_Antarctica" title="2022 in Antarctica">Antarctica</a> – <a href="/wiki/2022_in_Antigua_and_Barbuda" title="2022 in Antigua and Barbuda">Antigua and Barbuda</a> – <a href="/wiki/2022_in_Argentina" title="2022 in Argentina">Argentina</a> – <a href="/wiki/2022_in_Armenia" title="2022 in Armenia">Armenia</a> – <a href="/wiki/2022_in_Australia" title="2022 in Australia">Australia</a> – <a href="/wiki/2022_in_Austria" title="2022 in Austria">Austria</a> – <a href="/wiki/2022_in_Azerbaijan" title="2022 in Azerbaijan">Azerbaijan</a> – <a href="/wiki/2022_in_Bangladesh" title="2022 in Bangladesh">Bangladesh</a> – <a href="/wiki/2022_in_the_Bahamas" title="2022 in the Bahamas">The Bahamas</a> – <a href="/wiki/2022_in_Bahrain" title="2022 in Bahrain">Bahrain</a> – <a href="/wiki/2022_in_Barbados" title="2022 in Barbados">Barbados</a> – <a href="/wiki/2022_in_Belarus" title="2022 in Belarus">Belarus</a> – <a href="/wiki/2022_in_Belgium" title="2022 in Belgium">Belgium</a>– <a href="/wiki/2022_in_Belize" title="2022 in Belize">Belize</a> – <a href="/wiki/2022_in_Benin" title="2022 in Benin">Benin</a> – <a href="/wiki/2022_in_Bhutan" title="2022 in Bhutan">Bhutan</a> – <a href="/wiki/2022_in_Bolivia" title="2022 in Bolivia">Bolivia</a> – <a href="/wiki/2022_in_Bosnia_and_Herzegovina" title="2022 in Bosnia and Herzegovina">Bosnia and Herzegovina</a> – <a href="/wiki/2022_in_Botswana" title="2022 in Botswana">Botswana</a> – <a href="/wiki/2022_in_Brazil" title="2022 in Brazil">Brazil</a> – <a href="/wiki/2022_in_Brunei" title="2022 in Brunei">Brunei</a> – <a href="/wiki/2022_in_Bulgaria" title="2022 in Bulgaria">Bulgaria</a> – <a href="/wiki/2022_in_Burkina_Faso" title="2022 in Burkina Faso">Burkina Faso</a> – <a href="/wiki/2022_in_Burundi" title="2022 in Burundi">Burundi</a> – <a href="/wiki/2022_in_Cambodia" title="2022 in Cambodia">Cambodia</a> – <a href="/wiki/2022_in_Cameroon" title="2022 in Cameroon">Cameroon</a> – <a href="/wiki/2022_in_Canada" title="2022 in Canada">Canada</a> – <a href="/wiki/2022_in_Cape_Verde" title="2022 in Cape Verde">Cape Verde</a> – <a href="/wiki/2022_in_the_Central_African_Republic" title="2022 in the Central African Republic">Central African Republic</a> – <a href="/wiki/2022_in_Chad" title="2022 in Chad">Chad</a> – <a href="/wiki/2022_in_Chile" title="2022 in Chile">Chile</a> – <a href="/wiki/2022_in_China" title="2022 in China">China</a> – <a href="/wiki/2022_in_Colombia" title="2022 in Colombia">Colombia</a> – <a href="/wiki/2022_in_Costa_Rica" title="2022 in Costa Rica">Costa Rica</a> – <a href="/wiki/2022_in_the_Comoros" title="2022 in the Comoros">Comoros</a> – <a href="/wiki/2022_in_the_Republic_of_the_Congo" title="2022 in the Republic of the Congo">Congo</a> – <a href="/wiki/2022_in_the_Democratic_Republic_of_the_Congo" title="2022 in the Democratic Republic of the Congo">D.R. Congo</a> – <a href="/wiki/2022_in_Croatia" title="2022 in Croatia">Croatia</a> – <a href="/wiki/2022_in_Cuba" title="2022 in Cuba">Cuba</a> – <a href="/wiki/2022_in_Cyprus" title="2022 in Cyprus">Cyprus</a> – <a href="/wiki/2022_in_the_Czech_Republic" title="2022 in the Czech Republic">Czech Republic</a> – <a href="/wiki/2022_in_Denmark" title="2022 in Denmark">Denmark</a> – <a href="/wiki/2022_in_Djibouti" title="2022 in Djibouti">Djibouti</a> – <a href="/wiki/2022_in_Dominica" title="2022 in Dominica">Dominica</a> – <a href="/wiki/2022_in_the_Dominican_Republic" title="2022 in the Dominican Republic">Dominican Republic</a> – <a href="/wiki/2022_in_East_Timor" title="2022 in East Timor">East Timor</a> – <a href="/wiki/2022_in_Ecuador" title="2022 in Ecuador">Ecuador</a> – <a href="/wiki/2022_in_Egypt" title="2022 in Egypt">Egypt</a> – <a href="/wiki/2022_in_El_Salvador" title="2022 in El Salvador">El Salvador</a> – <a href="/wiki/2022_in_Eritrea" title="2022 in Eritrea">Eritrea</a> – <a href="/wiki/2022_in_Estonia" title="2022 in Estonia">Estonia</a> – <a href="/wiki/2022_in_Ethiopia" title="2022 in Ethiopia">Ethiopia</a> – <a href="/wiki/2022_in_Eswatini" title="2022 in Eswatini">Eswatini</a> – <a href="/wiki/2022_in_Equatorial_Guinea" title="2022 in Equatorial Guinea">Equatorial Guinea</a> – <a href="/wiki/2022_in_Fiji" title="2022 in Fiji">Fiji</a> – <a href="/wiki/2022_in_Finland" title="2022 in Finland">Finland</a> – <a href="/wiki/2022_in_France" title="2022 in France">France</a> – <a href="/wiki/2022_in_Gabon" title="2022 in Gabon">Gabon</a> – <a href="/wiki/2022_in_The_Gambia" title="2022 in The Gambia">The Gambia</a> – <a href="/wiki/2022_in_Georgia_(country)" title="2022 in Georgia (country)">Georgia</a> – <a href="/wiki/2022_in_Germany" title="2022 in Germany">Germany</a> – <a href="/wiki/2022_in_Ghana" title="2022 in Ghana">Ghana</a> – <a href="/wiki/2022_in_Greece" title="2022 in Greece">Greece</a> – <a href="/wiki/2022_in_Grenada" title="2022 in Grenada">Grenada</a> – <a href="/wiki/2022_in_Guatemala" title="2022 in Guatemala">Guatemala</a> – <a href="/wiki/2022_in_Guinea" title="2022 in Guinea">Guinea</a> – <a href="/wiki/2022_in_Guinea-Bissau" title="2022 in Guinea-Bissau">Guinea-Bissau</a> – <a href="/wiki/2022_in_Guyana" title="2022 in Guyana">Guyana</a> – <a href="/wiki/2022_in_Haiti" title="2022 in Haiti">Haiti</a> – <a href="/wiki/2022_in_Honduras" title="2022 in Honduras">Honduras</a> – <a href="/wiki/2022_in_Hong_Kong" title="2022 in Hong Kong">Hong Kong</a> – <a href="/wiki/2022_in_Hungary" title="2022 in Hungary">Hungary</a> – <a href="/wiki/2022_in_Iceland" title="2022 in Iceland">Iceland</a> – <a href="/wiki/2022_in_India" title="2022 in India">India</a> – <a href="/wiki/2022_in_Indonesia" title="2022 in Indonesia">Indonesia</a> – <a href="/wiki/2022_in_Iran" title="2022 in Iran">Iran</a> – <a href="/wiki/2022_in_Iraq" title="2022 in Iraq">Iraq</a> – <a href="/wiki/2022_in_Ireland" title="2022 in Ireland">Ireland</a> – <a href="/wiki/2022_in_Israel" title="2022 in Israel">Israel</a> – <a href="/wiki/2022_in_Italy" title="2022 in Italy">Italy</a> – <a href="/wiki/2022_in_Ivory_Coast" title="2022 in Ivory Coast">Ivory Coast</a> – <a href="/wiki/2022_in_Jamaica" title="2022 in Jamaica">Jamaica</a> – <a href="/wiki/2022_in_Japan" title="2022 in Japan">Japan</a> – <a href="/wiki/2022_in_Jordan" title="2022 in Jordan">Jordan</a> – <a href="/wiki/2022_in_Kazakhstan" title="2022 in Kazakhstan">Kazakhstan</a> – <a href="/wiki/2022_in_Kenya" title="2022 in Kenya">Kenya</a> – <a href="/wiki/2022_in_Kiribati" title="2022 in Kiribati">Kiribati</a> – <a href="/wiki/2022_in_Kosovo" title="2022 in Kosovo">Kosovo</a> – <a href="/wiki/2022_in_Kuwait" title="2022 in Kuwait">Kuwait</a> – <a href="/wiki/2022_in_Kyrgyzstan" title="2022 in Kyrgyzstan">Kyrgyzstan</a> – <a href="/wiki/2022_in_Laos" title="2022 in Laos">Laos</a> – <a href="/wiki/2022_in_Latvia" title="2022 in Latvia">Latvia</a> – <a href="/wiki/2022_in_Lebanon" title="2022 in Lebanon">Lebanon</a> – <a href="/wiki/2022_in_Lesotho" title="2022 in Lesotho">Lesotho</a> – <a href="/wiki/2022_in_Liberia" title="2022 in Liberia">Liberia</a> – <a href="/wiki/2022_in_Liechtenstein" title="2022 in Liechtenstein"> Liechtenstein</a> – <a href="/wiki/2022_in_Libya" title="2022 in Libya">Libya</a> – <a href="/wiki/2022_in_Lithuania" title="2022 in Lithuania">Lithuania</a> – <a href="/wiki/2022_in_Luxembourg" title="2022 in Luxembourg">Luxembourg</a> – <a href="/wiki/2022_in_Macau" title="2022 in Macau">Macau</a> – <a href="/wiki/2022_in_Madagascar" title="2022 in Madagascar">Madagascar</a> – <a href="/wiki/2022_in_the_Marshall_Islands" title="2022 in the Marshall Islands">Marshall Islands</a> – <a href="/wiki/2022_in_Malawi" title="2022 in Malawi">Malawi</a> – <a href="/wiki/2022_in_Malaysia" title="2022 in Malaysia">Malaysia</a> – <a href="/wiki/2022_in_the_Maldives" title="2022 in the Maldives">Maldives</a> – <a href="/wiki/2022_in_Mali" title="2022 in Mali">Mali</a> – <a href="/wiki/2022_in_Malta" title="2022 in Malta">Malta</a> – <a href="/wiki/2022_in_Mauritania" title="2022 in Mauritania">Mauritania</a> – <a href="/wiki/2022_in_Mauritius" title="2022 in Mauritius">Mauritius</a> – <a href="/wiki/2022_in_Mexico" title="2022 in Mexico">Mexico</a> – <a href="/wiki/2022_in_the_Federated_States_of_Micronesia" title="2022 in the Federated States of Micronesia">Micronesia</a> – <a href="/wiki/2022_in_Moldova" title="2022 in Moldova">Moldova</a> – <a href="/wiki/2022_in_Monaco" title="2022 in Monaco">Monaco</a> – <a href="/wiki/2022_in_Mongolia" title="2022 in Mongolia">Mongolia</a> – <a href="/wiki/2022_in_Montenegro" title="2022 in Montenegro">Montenegro</a> – <a href="/wiki/2022_in_Morocco" title="2022 in Morocco">Morocco</a> – <a href="/wiki/2022_in_Mozambique" title="2022 in Mozambique">Mozambique</a> – <a href="/wiki/2022_in_Myanmar" title="2022 in Myanmar">Myanmar</a> – <a href="/wiki/2022_in_Nauru" title="2022 in Nauru">Nauru</a> – <a href="/wiki/2022_in_Namibia" title="2022 in Namibia">Namibia</a> – <a href="/wiki/2022_in_Nepal" title="2022 in Nepal">Nepal</a> – <a href="/wiki/2022_in_the_Netherlands" title="2022 in the Netherlands">Netherlands</a> – <a href="/wiki/2022_in_New_Zealand" title="2022 in New Zealand">New Zealand</a> – <a href="/wiki/2022_in_Nicaragua" title="2022 in Nicaragua">Nicaragua</a> – <a href="/wiki/2022_in_Niger" title="2022 in Niger">Niger</a> – <a href="/wiki/2022_in_Nigeria" title="2022 in Nigeria">Nigeria</a> – <a href="/wiki/2022_in_North_Korea" title="2022 in North Korea">North Korea</a> – <a href="/wiki/2022_in_North_Macedonia" title="2022 in North Macedonia">North Macedonia</a> – <a href="/wiki/2022_in_Norway" title="2022 in Norway">Norway</a> – <a href="/wiki/2022_in_Oman" title="2022 in Oman">Oman</a> – <a href="/wiki/2022_in_Pakistan" title="2022 in Pakistan">Pakistan</a> – <a href="/wiki/2022_in_Palau" title="2022 in Palau">Palau</a> – <a href="/wiki/2022_in_the_Palestinian_territories" title="2022 in the Palestinian territories">Palestine</a> – <a href="/wiki/2022_in_Panama" title="2022 in Panama">Panama</a> – <a href="/wiki/2022_in_Papua_New_Guinea" title="2022 in Papua New Guinea">Papua New Guinea</a> – <a href="/wiki/2022_in_Paraguay" title="2022 in Paraguay">Paraguay</a> – <a href="/wiki/2022_in_Peru" title="2022 in Peru">Peru</a> – <a href="/wiki/2022_in_the_Philippines" title="2022 in the Philippines">Philippines</a> – <a href="/wiki/2022_in_Poland" title="2022 in Poland">Poland</a> – <a href="/wiki/2022_in_Portugal" title="2022 in Portugal">Portugal</a> – <a href="/wiki/2022_in_Qatar" title="2022 in Qatar">Qatar</a> – <a href="/wiki/2022_in_Romania" title="2022 in Romania">Romania</a> – <a href="/wiki/2022_in_Russia" title="2022 in Russia">Russia</a> – <a href="/wiki/2022_in_Rwanda" title="2022 in Rwanda">Rwanda</a> – <a href="/wiki/2022_in_Saint_Kitts_and_Nevis" title="2022 in Saint Kitts and Nevis">Saint Kitts and Nevis</a> – <a href="/wiki/2022_in_Saint_Lucia" title="2022 in Saint Lucia">Saint Lucia</a> – <a href="/wiki/2022_in_Saint_Vincent_and_the_Grenadines" title="2022 in Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</a> – <a href="/wiki/2022_in_Samoa" title="2022 in Samoa">Samoa</a> – <a href="/wiki/2022_in_San_Marino" title="2022 in San Marino">San Marino</a> – <a href="/wiki/2022_in_S%C3%A3o_Tom%C3%A9_and_Pr%C3%ADncipe" title="2022 in São Tomé and Príncipe">São Tomé and Príncipe</a> – <a href="/wiki/2022_in_Saudi_Arabia" title="2022 in Saudi Arabia">Saudi Arabia</a> – <a href="/wiki/2022_in_Senegal" title="2022 in Senegal">Senegal</a> – <a href="/wiki/2022_in_Serbia" title="2022 in Serbia">Serbia</a> – <a href="/wiki/2022_in_Seychelles" title="2022 in Seychelles">Seychelles</a> – <a href="/wiki/2022_in_Sierra_Leone" title="2022 in Sierra Leone">Sierra Leone</a> – <a href="/wiki/2022_in_Singapore" title="2022 in Singapore">Singapore</a> – <a href="/wiki/2022_in_Slovakia" title="2022 in Slovakia">Slovakia</a> – <a href="/wiki/2022_in_Slovenia" title="2022 in Slovenia">Slovenia</a> – <a href="/wiki/2022_in_Somalia" title="2022 in Somalia">Somalia</a> – <a href="/wiki/2022_in_South_Africa" title="2022 in South Africa">South Africa</a> – <a href="/wiki/2022_in_the_Solomon_Islands" title="2022 in the Solomon Islands">Solomon Islands</a> – <a href="/wiki/2022_in_South_Korea" title="2022 in South Korea">South Korea</a> – <a href="/wiki/2022_in_South_Sudan" title="2022 in South Sudan">South Sudan</a> – <a href="/wiki/2022_in_Spain" title="2022 in Spain">Spain</a> – <a href="/wiki/2022_in_Sri_Lanka" title="2022 in Sri Lanka">Sri Lanka</a> – <a href="/wiki/2022_in_Sudan" title="2022 in Sudan">Sudan</a> – <a href="/wiki/2022_in_Suriname" title="2022 in Suriname">Suriname</a> – <a href="/wiki/2022_in_Sweden" title="2022 in Sweden">Sweden</a> – <a href="/wiki/2022_in_Switzerland" title="2022 in Switzerland">Switzerland</a> – <a href="/wiki/2022_in_Syria" title="2022 in Syria">Syria</a> – <a href="/wiki/2022_in_Taiwan" title="2022 in Taiwan">Taiwan</a> – <a href="/wiki/2022_in_Tajikistan" title="2022 in Tajikistan">Tajikistan</a> – <a href="/wiki/2022_in_Tanzania" title="2022 in Tanzania">Tanzania</a> – <a href="/wiki/2022_in_Thailand" title="2022 in Thailand">Thailand</a> – <a href="/wiki/2022_in_Togo" title="2022 in Togo">Togo</a> – <a href="/wiki/2022_in_Tonga" title="2022 in Tonga">Tonga</a> – <a href="/wiki/2022_in_Trinidad_and_Tobago" title="2022 in Trinidad and Tobago">Trinidad and Tobago</a> – <a href="/wiki/2022_in_Tunisia" title="2022 in Tunisia">Tunisia</a> – <a href="/wiki/2022_in_Turkey" title="2022 in Turkey">Turkey</a> – <a href="/wiki/2022_in_Turkmenistan" title="2022 in Turkmenistan">Turkmenistan</a> – <a href="/wiki/2022_in_Tuvalu" title="2022 in Tuvalu">Tuvalu</a> – <a href="/wiki/2022_in_Uganda" title="2022 in Uganda">Uganda</a> – <a href="/wiki/2022_in_Ukraine" title="2022 in Ukraine">Ukraine</a> – <a href="/wiki/2022_in_the_United_Arab_Emirates" title="2022 in the United Arab Emirates">United Arab Emirates</a> – <a href="/wiki/2022_in_the_United_Kingdom" title="2022 in the United Kingdom">United Kingdom</a> – <a href="/wiki/2022_in_the_United_States" title="2022 in the United States">United States</a> – <a href="/wiki/2022_in_Uruguay" title="2022 in Uruguay">Uruguay</a> – <a href="/wiki/2022_in_Uzbekistan" title="2022 in Uzbekistan">Uzbekistan</a> – <a href="/wiki/2022_in_Vanuatu" title="2022 in Vanuatu">Vanuatu</a> – <a href="/wiki/2022_in_Vatican_City" title="2022 in Vatican City">Vatican City</a> – <a href="/wiki/2022_in_Venezuela" title="2022 in Venezuela">Venezuela</a> – <a href="/wiki/2022_in_Vietnam" title="2022 in Vietnam">Vietnam</a> – <a href="/wiki/2022_in_Yemen" title="2022 in Yemen">Yemen</a> – <a href="/wiki/2022_in_Zambia" title="2022 in Zambia">Zambia</a> – <a href="/wiki/2022_in_Zimbabwe" title="2022 in Zimbabwe">Zimbabwe</a>
</p>
</td></tr></tbody></table></div>
<h3><span class="mw-headline" id="Establishments_and_disestablishments_categories">
<i><b>Establishments and disestablishments categories</b></i>
</span></h3>
<p><a href="/wiki/Category:2022_establishments" title="Category:2022 establishments">Establishments</a> – <a href="/wiki/Category:2022_disestablishments" title="Category:2022 disestablishments">Disestablishments</a>
</p>
<h3><span class="mw-headline" id="Works_and_introductions_categories">
<i><b>Works and introductions categories</b></i>
</span></h3>
<p><a href="/wiki/Category:2022_works" title="Category:2022 works">Works</a> – <a href="/wiki/Category:2022_introductions" title="Category:2022 introductions">Introductions</a> – <a href="/wiki/2022_in_public_domain" title="2022 in public domain">Works entering the public domain</a>
</p>
<style data-mw-deduplicate="TemplateStyles:r1097025294">.mw-parser-output .side-box{margin:4px 0;box-sizing:border-box;border:1px solid #aaa;font-size:88%;line-height:1.25em;background-color:#f9f9f9}.mw-parser-output .side-box-abovebelow,.mw-parser-output .side-box-text{padding:0.25em 0.9em}.mw-parser-output .side-box-image{padding:2px 0 2px 0.9em;text-align:center}.mw-parser-output .side-box-imageright{padding:2px 0.9em 2px 0;text-align:center}@media(min-width:500px){.mw-parser-output .side-box-flex{display:flex;align-items:center}.mw-parser-output .side-box-text{flex:1}}@media(min-width:720px){.mw-parser-output .side-box{width:238px}.mw-parser-output .side-box-right{clear:right;float:right;margin-left:1em}.mw-parser-output .side-box-left{margin-right:1em}}</style><div class="side-box side-box-right plainlinks sistersitebox">
<div class="side-box-flex">
<div class="side-box-image"><img alt="" src="//upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/30px-Commons-logo.svg.png" decoding="async" width="30" height="40" class="noviewer" srcset="//upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/45px-Commons-logo.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/59px-Commons-logo.svg.png 2x" data-file-width="1024" data-file-height="1376" /></div>
<div class="side-box-text plainlist">Wikimedia Commons has media related to <span style="font-weight: bold; font-style: italic;"><a href="https://commons.wikimedia.org/wiki/Category:2022" class="extiw" title="commons:Category:2022">2022</a></span>.</div></div>
</div>
<div class="editlink noprint plainlinks"><a href="/wiki/Category:2022" title="Category:2022">...more</a></div>
</div>
<div class="editlink noprint plainlinks"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Sidebar&amp;action=edit">edit section</a></div>
</div>
</div>
</div>
</div>
<div class="navbox-styles nomobile"><style data-mw-deduplicate="TemplateStyles:r1061467846">.mw-parser-output .navbox{box-sizing:border-box;border:1px solid #a2a9b1;width:100%;clear:both;font-size:88%;text-align:center;padding:1px;margin:1em auto 0}.mw-parser-output .navbox .navbox{margin-top:0}.mw-parser-output .navbox+.navbox,.mw-parser-output .navbox+.navbox-styles+.navbox{margin-top:-1px}.mw-parser-output .navbox-inner,.mw-parser-output .navbox-subgroup{width:100%}.mw-parser-output .navbox-group,.mw-parser-output .navbox-title,.mw-parser-output .navbox-abovebelow{padding:0.25em 1em;line-height:1.5em;text-align:center}.mw-parser-output .navbox-group{white-space:nowrap;text-align:right}.mw-parser-output .navbox,.mw-parser-output .navbox-subgroup{background-color:#fdfdfd}.mw-parser-output .navbox-list{line-height:1.5em;border-color:#fdfdfd}.mw-parser-output .navbox-list-with-group{text-align:left;border-left-width:2px;border-left-style:solid}.mw-parser-output tr+tr>.navbox-abovebelow,.mw-parser-output tr+tr>.navbox-group,.mw-parser-output tr+tr>.navbox-image,.mw-parser-output tr+tr>.navbox-list{border-top:2px solid #fdfdfd}.mw-parser-output .navbox-title{background-color:#ccf}.mw-parser-output .navbox-abovebelow,.mw-parser-output .navbox-group,.mw-parser-output .navbox-subgroup .navbox-title{background-color:#ddf}.mw-parser-output .navbox-subgroup .navbox-group,.mw-parser-output .navbox-subgroup .navbox-abovebelow{background-color:#e6e6ff}.mw-parser-output .navbox-even{background-color:#f7f7f7}.mw-parser-output .navbox-odd{background-color:transparent}.mw-parser-output .navbox .hlist td dl,.mw-parser-output .navbox .hlist td ol,.mw-parser-output .navbox .hlist td ul,.mw-parser-output .navbox td.hlist dl,.mw-parser-output .navbox td.hlist ol,.mw-parser-output .navbox td.hlist ul{padding:0.125em 0}.mw-parser-output .navbox .navbar{display:block;font-size:100%}.mw-parser-output .navbox-title .navbar{float:left;text-align:left;margin-right:0.5em}</style></div><div role="navigation" class="navbox" aria-labelledby="Current_events_by_month" style="padding:3px"><table class="nowraplinks hlist mw-collapsible mw-collapsed navbox-inner" style="border-spacing:0;background:transparent;color:inherit"><tbody><tr><th scope="col" class="navbox-title" colspan="2"><style data-mw-deduplicate="TemplateStyles:r1063604349">.mw-parser-output .navbar{display:inline;font-size:88%;font-weight:normal}.mw-parser-output .navbar-collapse{float:left;text-align:left}.mw-parser-output .navbar-boxtext{word-spacing:0}.mw-parser-output .navbar ul{display:inline-block;white-space:nowrap;line-height:inherit}.mw-parser-output .navbar-brackets::before{margin-right:-0.125em;content:"[ "}.mw-parser-output .navbar-brackets::after{margin-left:-0.125em;content:" ]"}.mw-parser-output .navbar li{word-spacing:-0.125em}.mw-parser-output .navbar a>span,.mw-parser-output .navbar a>abbr{text-decoration:inherit}.mw-parser-output .navbar-mini abbr{font-variant:small-caps;border-bottom:none;text-decoration:none;cursor:inherit}.mw-parser-output .navbar-ct-full{font-size:114%;margin:0 7em}.mw-parser-output .navbar-ct-mini{font-size:114%;margin:0 4em}</style><div class="navbar plainlinks hlist navbar-mini"><ul><li class="nv-view"><a href="/wiki/Portal:Current_events/Events_by_month" title="Portal:Current events/Events by month"><abbr title="View this template" style=";;background:none transparent;border:none;box-shadow:none;padding:0;">v</abbr></a></li><li class="nv-talk"><a href="/wiki/Portal_talk:Current_events/Events_by_month" title="Portal talk:Current events/Events by month"><abbr title="Discuss this template" style=";;background:none transparent;border:none;box-shadow:none;padding:0;">t</abbr></a></li><li class="nv-edit"><a class="external text" href="https://en.wikipedia.org/w/index.php?title=Portal:Current_events/Events_by_month&amp;action=edit"><abbr title="Edit this template" style=";;background:none transparent;border:none;box-shadow:none;padding:0;">e</abbr></a></li></ul></div><div id="Current_events_by_month" style="font-size:114%;margin:0 4em">Current events by month</div></th></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2022" title="2022">2022</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2022" title="Portal:Current events/January 2022">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2022" title="Portal:Current events/February 2022">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2022" title="Portal:Current events/March 2022">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2022" title="Portal:Current events/April 2022">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2022" title="Portal:Current events/May 2022">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2022" title="Portal:Current events/June 2022">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2022" title="Portal:Current events/July 2022">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2022" title="Portal:Current events/August 2022">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2022" title="Portal:Current events/September 2022">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2022" title="Portal:Current events/October 2022">October</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2021" title="2021">2021</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2021" title="Portal:Current events/January 2021">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2021" title="Portal:Current events/February 2021">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2021" title="Portal:Current events/March 2021">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2021" title="Portal:Current events/April 2021">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2021" title="Portal:Current events/May 2021">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2021" title="Portal:Current events/June 2021">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2021" title="Portal:Current events/July 2021">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2021" title="Portal:Current events/August 2021">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2021" title="Portal:Current events/September 2021">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2021" title="Portal:Current events/October 2021">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2021" title="Portal:Current events/November 2021">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2021" title="Portal:Current events/December 2021">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2020" title="2020">2020</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2020" title="Portal:Current events/January 2020">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2020" title="Portal:Current events/February 2020">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2020" title="Portal:Current events/March 2020">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2020" title="Portal:Current events/April 2020">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2020" title="Portal:Current events/May 2020">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2020" title="Portal:Current events/June 2020">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2020" title="Portal:Current events/July 2020">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2020" title="Portal:Current events/August 2020">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2020" title="Portal:Current events/September 2020">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2020" title="Portal:Current events/October 2020">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2020" title="Portal:Current events/November 2020">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2020" title="Portal:Current events/December 2020">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2019" title="2019">2019</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2019" title="Portal:Current events/January 2019">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2019" title="Portal:Current events/February 2019">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2019" title="Portal:Current events/March 2019">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2019" title="Portal:Current events/April 2019">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2019" title="Portal:Current events/May 2019">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2019" title="Portal:Current events/June 2019">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2019" title="Portal:Current events/July 2019">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2019" title="Portal:Current events/August 2019">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2019" title="Portal:Current events/September 2019">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2019" title="Portal:Current events/October 2019">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2019" title="Portal:Current events/November 2019">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2019" title="Portal:Current events/December 2019">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2018" title="2018">2018</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2018" title="Portal:Current events/January 2018">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2018" title="Portal:Current events/February 2018">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2018" title="Portal:Current events/March 2018">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2018" title="Portal:Current events/April 2018">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2018" title="Portal:Current events/May 2018">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2018" title="Portal:Current events/June 2018">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2018" title="Portal:Current events/July 2018">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2018" title="Portal:Current events/August 2018">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2018" title="Portal:Current events/September 2018">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2018" title="Portal:Current events/October 2018">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2018" title="Portal:Current events/November 2018">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2018" title="Portal:Current events/December 2018">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2017" title="2017">2017</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2017" title="Portal:Current events/January 2017">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2017" title="Portal:Current events/February 2017">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2017" title="Portal:Current events/March 2017">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2017" title="Portal:Current events/April 2017">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2017" title="Portal:Current events/May 2017">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2017" title="Portal:Current events/June 2017">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2017" title="Portal:Current events/July 2017">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2017" title="Portal:Current events/August 2017">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2017" title="Portal:Current events/September 2017">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2017" title="Portal:Current events/October 2017">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2017" title="Portal:Current events/November 2017">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2017" title="Portal:Current events/December 2017">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2016" title="2016">2016</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2016" title="Portal:Current events/January 2016">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2016" title="Portal:Current events/February 2016">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2016" title="Portal:Current events/March 2016">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2016" title="Portal:Current events/April 2016">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2016" title="Portal:Current events/May 2016">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2016" title="Portal:Current events/June 2016">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2016" title="Portal:Current events/July 2016">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2016" title="Portal:Current events/August 2016">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2016" title="Portal:Current events/September 2016">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2016" title="Portal:Current events/October 2016">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2016" title="Portal:Current events/November 2016">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2016" title="Portal:Current events/December 2016">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2015" title="2015">2015</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2015" title="Portal:Current events/January 2015">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2015" title="Portal:Current events/February 2015">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2015" title="Portal:Current events/March 2015">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2015" title="Portal:Current events/April 2015">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2015" title="Portal:Current events/May 2015">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2015" title="Portal:Current events/June 2015">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2015" title="Portal:Current events/July 2015">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2015" title="Portal:Current events/August 2015">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2015" title="Portal:Current events/September 2015">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2015" title="Portal:Current events/October 2015">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2015" title="Portal:Current events/November 2015">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2015" title="Portal:Current events/December 2015">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2014" title="2014">2014</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2014" title="Portal:Current events/January 2014">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2014" title="Portal:Current events/February 2014">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2014" title="Portal:Current events/March 2014">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2014" title="Portal:Current events/April 2014">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2014" title="Portal:Current events/May 2014">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2014" title="Portal:Current events/June 2014">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2014" title="Portal:Current events/July 2014">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2014" title="Portal:Current events/August 2014">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2014" title="Portal:Current events/September 2014">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2014" title="Portal:Current events/October 2014">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2014" title="Portal:Current events/November 2014">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2014" title="Portal:Current events/December 2014">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2013" title="2013">2013</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2013" title="Portal:Current events/January 2013">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2013" title="Portal:Current events/February 2013">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2013" title="Portal:Current events/March 2013">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2013" title="Portal:Current events/April 2013">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2013" title="Portal:Current events/May 2013">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2013" title="Portal:Current events/June 2013">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2013" title="Portal:Current events/July 2013">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2013" title="Portal:Current events/August 2013">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2013" title="Portal:Current events/September 2013">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2013" title="Portal:Current events/October 2013">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2013" title="Portal:Current events/November 2013">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2013" title="Portal:Current events/December 2013">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2012" title="2012">2012</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2012" title="Portal:Current events/January 2012">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2012" title="Portal:Current events/February 2012">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2012" title="Portal:Current events/March 2012">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2012" title="Portal:Current events/April 2012">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2012" title="Portal:Current events/May 2012">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2012" title="Portal:Current events/June 2012">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2012" title="Portal:Current events/July 2012">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2012" title="Portal:Current events/August 2012">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2012" title="Portal:Current events/September 2012">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2012" title="Portal:Current events/October 2012">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2012" title="Portal:Current events/November 2012">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2012" title="Portal:Current events/December 2012">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2011" title="2011">2011</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2011" title="Portal:Current events/January 2011">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2011" title="Portal:Current events/February 2011">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2011" title="Portal:Current events/March 2011">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2011" title="Portal:Current events/April 2011">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2011" title="Portal:Current events/May 2011">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2011" title="Portal:Current events/June 2011">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2011" title="Portal:Current events/July 2011">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2011" title="Portal:Current events/August 2011">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2011" title="Portal:Current events/September 2011">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2011" title="Portal:Current events/October 2011">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2011" title="Portal:Current events/November 2011">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2011" title="Portal:Current events/December 2011">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2010" title="2010">2010</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2010" title="Portal:Current events/January 2010">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2010" title="Portal:Current events/February 2010">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2010" title="Portal:Current events/March 2010">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2010" title="Portal:Current events/April 2010">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2010" title="Portal:Current events/May 2010">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2010" title="Portal:Current events/June 2010">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2010" title="Portal:Current events/July 2010">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2010" title="Portal:Current events/August 2010">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2010" title="Portal:Current events/September 2010">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2010" title="Portal:Current events/October 2010">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2010" title="Portal:Current events/November 2010">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2010" title="Portal:Current events/December 2010">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2009" title="2009">2009</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2009" title="Portal:Current events/January 2009">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2009" title="Portal:Current events/February 2009">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2009" title="Portal:Current events/March 2009">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2009" title="Portal:Current events/April 2009">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2009" title="Portal:Current events/May 2009">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2009" title="Portal:Current events/June 2009">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2009" title="Portal:Current events/July 2009">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2009" title="Portal:Current events/August 2009">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2009" title="Portal:Current events/September 2009">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2009" title="Portal:Current events/October 2009">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2009" title="Portal:Current events/November 2009">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2009" title="Portal:Current events/December 2009">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2008" title="2008">2008</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2008" title="Portal:Current events/January 2008">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2008" title="Portal:Current events/February 2008">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2008" title="Portal:Current events/March 2008">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2008" title="Portal:Current events/April 2008">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2008" title="Portal:Current events/May 2008">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2008" title="Portal:Current events/June 2008">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2008" title="Portal:Current events/July 2008">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2008" title="Portal:Current events/August 2008">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2008" title="Portal:Current events/September 2008">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2008" title="Portal:Current events/October 2008">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2008" title="Portal:Current events/November 2008">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2008" title="Portal:Current events/December 2008">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2007" title="2007">2007</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2007" title="Portal:Current events/January 2007">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2007" title="Portal:Current events/February 2007">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2007" title="Portal:Current events/March 2007">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2007" title="Portal:Current events/April 2007">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2007" title="Portal:Current events/May 2007">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2007" title="Portal:Current events/June 2007">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2007" title="Portal:Current events/July 2007">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2007" title="Portal:Current events/August 2007">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2007" title="Portal:Current events/September 2007">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2007" title="Portal:Current events/October 2007">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2007" title="Portal:Current events/November 2007">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2007" title="Portal:Current events/December 2007">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2006" title="2006">2006</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2006" title="Portal:Current events/January 2006">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2006" title="Portal:Current events/February 2006">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2006" title="Portal:Current events/March 2006">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2006" title="Portal:Current events/April 2006">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2006" title="Portal:Current events/May 2006">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2006" title="Portal:Current events/June 2006">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2006" title="Portal:Current events/July 2006">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2006" title="Portal:Current events/August 2006">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2006" title="Portal:Current events/September 2006">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2006" title="Portal:Current events/October 2006">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2006" title="Portal:Current events/November 2006">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2006" title="Portal:Current events/December 2006">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2005" title="2005">2005</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2005" title="Portal:Current events/January 2005">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2005" title="Portal:Current events/February 2005">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2005" title="Portal:Current events/March 2005">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2005" title="Portal:Current events/April 2005">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2005" title="Portal:Current events/May 2005">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2005" title="Portal:Current events/June 2005">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2005" title="Portal:Current events/July 2005">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2005" title="Portal:Current events/August 2005">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2005" title="Portal:Current events/September 2005">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2005" title="Portal:Current events/October 2005">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2005" title="Portal:Current events/November 2005">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2005" title="Portal:Current events/December 2005">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2004" title="2004">2004</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2004" title="Portal:Current events/January 2004">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2004" title="Portal:Current events/February 2004">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2004" title="Portal:Current events/March 2004">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2004" title="Portal:Current events/April 2004">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2004" title="Portal:Current events/May 2004">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2004" title="Portal:Current events/June 2004">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2004" title="Portal:Current events/July 2004">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2004" title="Portal:Current events/August 2004">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2004" title="Portal:Current events/September 2004">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2004" title="Portal:Current events/October 2004">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2004" title="Portal:Current events/November 2004">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2004" title="Portal:Current events/December 2004">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2003" title="2003">2003</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2003" title="Portal:Current events/January 2003">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2003" title="Portal:Current events/February 2003">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2003" title="Portal:Current events/March 2003">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2003" title="Portal:Current events/April 2003">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2003" title="Portal:Current events/May 2003">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2003" title="Portal:Current events/June 2003">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2003" title="Portal:Current events/July 2003">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2003" title="Portal:Current events/August 2003">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2003" title="Portal:Current events/September 2003">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2003" title="Portal:Current events/October 2003">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2003" title="Portal:Current events/November 2003">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2003" title="Portal:Current events/December 2003">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2002" title="2002">2002</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2002" title="Portal:Current events/January 2002">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2002" title="Portal:Current events/February 2002">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2002" title="Portal:Current events/March 2002">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2002" title="Portal:Current events/April 2002">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2002" title="Portal:Current events/May 2002">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2002" title="Portal:Current events/June 2002">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2002" title="Portal:Current events/July 2002">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2002" title="Portal:Current events/August 2002">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2002" title="Portal:Current events/September 2002">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2002" title="Portal:Current events/October 2002">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2002" title="Portal:Current events/November 2002">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2002" title="Portal:Current events/December 2002">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2001" title="2001">2001</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2001" title="Portal:Current events/January 2001">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2001" title="Portal:Current events/February 2001">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2001" title="Portal:Current events/March 2001">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2001" title="Portal:Current events/April 2001">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2001" title="Portal:Current events/May 2001">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2001" title="Portal:Current events/June 2001">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2001" title="Portal:Current events/July 2001">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2001" title="Portal:Current events/August 2001">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2001" title="Portal:Current events/September 2001">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2001" title="Portal:Current events/October 2001">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2001" title="Portal:Current events/November 2001">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2001" title="Portal:Current events/December 2001">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/2000" title="2000">2000</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_2000" title="Portal:Current events/January 2000">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_2000" title="Portal:Current events/February 2000">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_2000" title="Portal:Current events/March 2000">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_2000" title="Portal:Current events/April 2000">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_2000" title="Portal:Current events/May 2000">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_2000" title="Portal:Current events/June 2000">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_2000" title="Portal:Current events/July 2000">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_2000" title="Portal:Current events/August 2000">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_2000" title="Portal:Current events/September 2000">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_2000" title="Portal:Current events/October 2000">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_2000" title="Portal:Current events/November 2000">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_2000" title="Portal:Current events/December 2000">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/1999" title="1999">1999</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_1999" title="Portal:Current events/January 1999">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_1999" title="Portal:Current events/February 1999">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_1999" title="Portal:Current events/March 1999">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_1999" title="Portal:Current events/April 1999">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_1999" title="Portal:Current events/May 1999">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_1999" title="Portal:Current events/June 1999">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_1999" title="Portal:Current events/July 1999">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_1999" title="Portal:Current events/August 1999">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_1999" title="Portal:Current events/September 1999">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_1999" title="Portal:Current events/October 1999">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_1999" title="Portal:Current events/November 1999">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_1999" title="Portal:Current events/December 1999">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/1998" title="1998">1998</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_1998" title="Portal:Current events/January 1998">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_1998" title="Portal:Current events/February 1998">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_1998" title="Portal:Current events/March 1998">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_1998" title="Portal:Current events/April 1998">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_1998" title="Portal:Current events/May 1998">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_1998" title="Portal:Current events/June 1998">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_1998" title="Portal:Current events/July 1998">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_1998" title="Portal:Current events/August 1998">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_1998" title="Portal:Current events/September 1998">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_1998" title="Portal:Current events/October 1998">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_1998" title="Portal:Current events/November 1998">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_1998" title="Portal:Current events/December 1998">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/1997" title="1997">1997</a></th><td class="navbox-list-with-group navbox-list navbox-even" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_1997" title="Portal:Current events/January 1997">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_1997" title="Portal:Current events/February 1997">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_1997" title="Portal:Current events/March 1997">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_1997" title="Portal:Current events/April 1997">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_1997" title="Portal:Current events/May 1997">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_1997" title="Portal:Current events/June 1997">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_1997" title="Portal:Current events/July 1997">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_1997" title="Portal:Current events/August 1997">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_1997" title="Portal:Current events/September 1997">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_1997" title="Portal:Current events/October 1997">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_1997" title="Portal:Current events/November 1997">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_1997" title="Portal:Current events/December 1997">December</a></li></ul>
</div></td></tr><tr><th scope="row" class="navbox-group" style="width:1%"><a href="/wiki/1996" title="1996">1996</a></th><td class="navbox-list-with-group navbox-list navbox-odd" style="width:100%;padding:0"><div style="padding:0 0.25em">
<ul><li><a href="/wiki/Portal:Current_events/January_1996" title="Portal:Current events/January 1996">January</a></li>
<li><a href="/wiki/Portal:Current_events/February_1996" title="Portal:Current events/February 1996">February</a></li>
<li><a href="/wiki/Portal:Current_events/March_1996" title="Portal:Current events/March 1996">March</a></li>
<li><a href="/wiki/Portal:Current_events/April_1996" title="Portal:Current events/April 1996">April</a></li>
<li><a href="/wiki/Portal:Current_events/May_1996" title="Portal:Current events/May 1996">May</a></li>
<li><a href="/wiki/Portal:Current_events/June_1996" title="Portal:Current events/June 1996">June</a></li>
<li><a href="/wiki/Portal:Current_events/July_1996" title="Portal:Current events/July 1996">July</a></li>
<li><a href="/wiki/Portal:Current_events/August_1996" title="Portal:Current events/August 1996">August</a></li>
<li><a href="/wiki/Portal:Current_events/September_1996" title="Portal:Current events/September 1996">September</a></li>
<li><a href="/wiki/Portal:Current_events/October_1996" title="Portal:Current events/October 1996">October</a></li>
<li><a href="/wiki/Portal:Current_events/November_1996" title="Portal:Current events/November 1996">November</a></li>
<li><a href="/wiki/Portal:Current_events/December_1996" title="Portal:Current events/December 1996">December</a></li></ul>
</div></td></tr><tr><td class="navbox-abovebelow hlist" colspan="2"><div>
<ul><li><a class="mw-selflink selflink">Portal:Current events</a></li>
<li><a href="/wiki/Portal:Current_events/Calendars" title="Portal:Current events/Calendars">Calendars</a></li></ul>
</div></td></tr></tbody></table></div>
<style data-mw-deduplicate="TemplateStyles:r1007624485">.mw-parser-output #sister-projects-list{display:flex;flex-wrap:wrap}.mw-parser-output #sister-projects-list li{display:inline-block}.mw-parser-output #sister-projects-list li span{font-weight:bold}.mw-parser-output #sister-projects-list li>div{display:inline-block;vertical-align:middle;padding:6px 4px}.mw-parser-output #sister-projects-list li>div:first-child{text-align:center}@media(min-width:360px){.mw-parser-output #sister-projects-list li{width:33%;min-width:20em;white-space:nowrap;flex:1 0 25%}.mw-parser-output #sister-projects-list li>div:first-child{min-width:50px}}</style>
<div class="smallcaps" style="font-variant:small-caps;"><div class="center" style="width:auto; margin-left:auto; margin-right:auto;"><b>Discover Wikipedia using <a href="/wiki/Wikipedia:Portal" title="Wikipedia:Portal">portals</a></b></div></div>
<div class="plainlist">
<ul id="sister-projects-list">

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Wikipedia:Contents/Portals" title="List of all portals"><img alt="List of all portals" src="//upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lorentzian_Wormhole.svg/35px-Lorentzian_Wormhole.svg.png" decoding="async" width="35" height="34" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lorentzian_Wormhole.svg/53px-Lorentzian_Wormhole.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Lorentzian_Wormhole.svg/70px-Lorentzian_Wormhole.svg.png 2x" data-file-width="620" data-file-height="600" /></a></div></div></div>
<div><span><a href="/wiki/Wikipedia:Contents/Portals" title="Wikipedia:Contents/Portals">List of all portals</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:The_arts" title="The arts portal"><img alt="The arts portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nuvola_apps_package_graphics.png/35px-Nuvola_apps_package_graphics.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nuvola_apps_package_graphics.png/53px-Nuvola_apps_package_graphics.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/2/22/Nuvola_apps_package_graphics.png/70px-Nuvola_apps_package_graphics.png 2x" data-file-width="128" data-file-height="128" /></a></div></div></div>
<div><span><a href="/wiki/Portal:The_arts" title="Portal:The arts">The arts portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Biography" title="Biography portal"><img alt="Biography portal" src="//upload.wikimedia.org/wikipedia/en/thumb/6/69/P_vip.svg/35px-P_vip.svg.png" decoding="async" width="35" height="36" srcset="//upload.wikimedia.org/wikipedia/en/thumb/6/69/P_vip.svg/53px-P_vip.svg.png 1.5x, //upload.wikimedia.org/wikipedia/en/thumb/6/69/P_vip.svg/70px-P_vip.svg.png 2x" data-file-width="1911" data-file-height="1944" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Biography" title="Portal:Biography">Biography portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Current_events" title="Current events portal"><img alt="Current events portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/5/53/Ambox_current_red_Americas.svg/35px-Ambox_current_red_Americas.svg.png" decoding="async" width="35" height="28" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/5/53/Ambox_current_red_Americas.svg/53px-Ambox_current_red_Americas.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/5/53/Ambox_current_red_Americas.svg/70px-Ambox_current_red_Americas.svg.png 2x" data-file-width="360" data-file-height="290" /></a></div></div></div>
<div><span><a class="mw-selflink selflink">Current events portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Geography" title="Geography portal"><img alt="Geography portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Terra.png/35px-Terra.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Terra.png/53px-Terra.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Terra.png/70px-Terra.png 2x" data-file-width="600" data-file-height="600" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Geography" title="Portal:Geography">Geography portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:History" title="History portal"><img alt="History portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/4/48/P_history.svg/35px-P_history.svg.png" decoding="async" width="35" height="32" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/48/P_history.svg/53px-P_history.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/48/P_history.svg/70px-P_history.svg.png 2x" data-file-width="400" data-file-height="360" /></a></div></div></div>
<div><span><a href="/wiki/Portal:History" title="Portal:History">History portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Mathematics" title="Mathematics portal"><img alt="Mathematics portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nuvola_apps_edu_mathematics_blue-p.svg/35px-Nuvola_apps_edu_mathematics_blue-p.svg.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nuvola_apps_edu_mathematics_blue-p.svg/53px-Nuvola_apps_edu_mathematics_blue-p.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nuvola_apps_edu_mathematics_blue-p.svg/70px-Nuvola_apps_edu_mathematics_blue-p.svg.png 2x" data-file-width="128" data-file-height="128" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Mathematics" title="Portal:Mathematics">Mathematics portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Science" title="Science portal"><img alt="Science portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Nuvola_apps_kalzium.svg/35px-Nuvola_apps_kalzium.svg.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Nuvola_apps_kalzium.svg/53px-Nuvola_apps_kalzium.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Nuvola_apps_kalzium.svg/70px-Nuvola_apps_kalzium.svg.png 2x" data-file-width="128" data-file-height="128" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Science" title="Portal:Science">Science portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Society" title="Society portal"><img alt="Society portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/4/42/Social_sciences.svg/35px-Social_sciences.svg.png" decoding="async" width="35" height="31" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/42/Social_sciences.svg/53px-Social_sciences.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/42/Social_sciences.svg/70px-Social_sciences.svg.png 2x" data-file-width="139" data-file-height="122" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Society" title="Portal:Society">Society portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Portal:Technology" title="Technology portal"><img alt="Technology portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Telecom-icon.svg/35px-Telecom-icon.svg.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Telecom-icon.svg/53px-Telecom-icon.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Telecom-icon.svg/70px-Telecom-icon.svg.png 2x" data-file-width="512" data-file-height="512" /></a></div></div></div>
<div><span><a href="/wiki/Portal:Technology" title="Portal:Technology">Technology portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Special:RandomInCategory/All_portals" title="Random portal"><img alt="Random portal" src="//upload.wikimedia.org/wikipedia/commons/thumb/7/70/Random_font_awesome.svg/35px-Random_font_awesome.svg.png" decoding="async" width="35" height="35" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/7/70/Random_font_awesome.svg/53px-Random_font_awesome.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/7/70/Random_font_awesome.svg/70px-Random_font_awesome.svg.png 2x" data-file-width="512" data-file-height="512" /></a></div></div></div>
<div><span><a href="/wiki/Special:RandomInCategory/All_portals" title="Special:RandomInCategory/All portals">Random portal</a></span></div>
</li>

<li>
<div><div class="center"><div class="floatnone"><a href="/wiki/Wikipedia:WikiProject_Portals" title="WikiProject Portals"><img alt="WikiProject Portals" src="//upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Portal.svg/35px-Portal.svg.png" decoding="async" width="35" height="31" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Portal.svg/53px-Portal.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Portal.svg/70px-Portal.svg.png 2x" data-file-width="36" data-file-height="32" /></a></div></div></div>
<div><span><a href="/wiki/Wikipedia:WikiProject_Portals" title="Wikipedia:WikiProject Portals">WikiProject Portals</a></span></div>
</li>

<li class="mw-empty-elt">
</li>
</ul>
</div>
</div>

<!-- 
NewPP limit report
Parsed by mw1418
Cached time: 20221001091033
Cache expiry: 3600
Reduced expiry: true
Complications: []
CPU time usage: 0.494 seconds
Real time usage: 0.704 seconds
Preprocessor visited node count: 6739/1000000
Post‐expand include size: 308690/2097152 bytes
Template argument size: 43851/2097152 bytes
Highest expansion depth: 18/100
Expensive parser function count: 4/500
Unstrip recursion depth: 0/20
Unstrip post‐expand size: 25912/5000000 bytes
Lua time usage: 0.100/10.000 seconds
Lua memory usage: 2793681/52428800 bytes
Number of Wikibase entities loaded: 0/400
-->
<!--
Transclusion expansion time report (%,ms,calls,template)
100.00%  406.709      1 -total
 20.40%   82.951      1 Portal:Current_events/Inclusion
 16.78%   68.242      1 Portal:Current_events/Sidebar
 14.62%   59.473      1 Template:Portal_maintenance_status
 12.94%   52.614      7 Template:Current_events
 10.96%   44.559      1 Portal:Current_events/Events_by_month
 10.20%   41.485      1 Template:Navbox
  9.64%   39.193      1 Template:Pp-vandalism
  8.19%   33.304      1 Template:Ombox
  8.14%   33.103      1 Portal:Current_events/Headlines
-->

<!-- Saved in parser cache with key enwiki:pcache:idhash:5776237-0!canonical and timestamp 20221001091032 and revision id 1086497673.
 -->
</div>
`;
