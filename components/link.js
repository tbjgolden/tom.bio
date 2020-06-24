import NextLink from "next/link";

export default function Link({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  className,
  ...props
}) {
  return (
    <NextLink
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      prefetch={prefetch}
    >
      <a className={`dIB ${className ?? ""}`} {...props} />
    </NextLink>
  );
}
