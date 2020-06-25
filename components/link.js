import { useEffect } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

export default function Link({
  href,
  as: _as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  className,
  ...props
}) {
  const { asPath } = useRouter();
  const isActive = (_as ?? href).startsWith(asPath);

  return (
    <NextLink
      href={href}
      as={_as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
    >
      <a
        className={`dIB fowB ${isActive ? "" : "tdN o-tdU"} ${className ?? ""}`}
        {...props}
      />
    </NextLink>
  );
}
