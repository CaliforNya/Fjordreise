import Link from "next/link";

type ExampleLinkProps = {
  href: string;
  label: string;
};

export function ExampleLink({ href, label }: ExampleLinkProps) {
  return <Link href={href}>{label}</Link>;
}
