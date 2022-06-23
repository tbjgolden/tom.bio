import { Section } from "astro-boilerplate-components";

import { AppConfig } from "@/utils/AppConfig";

const Footer = () => {
  return (
    <Section>
      <div>
        &copy; Copyright {new Date().getFullYear()} by {AppConfig.site_name}
      </div>
    </Section>
  );
};

export { Footer };
