import { parse, stringify } from "yaml";
import { readFile, writeFile } from "easier-node";

export const mutateMarkdown = async (
  filePath: string,
  changeObj: Record<string, unknown>
) => {
  let prevFile = "";
  try {
    prevFile = await readFile(filePath);
  } catch {}
  const prevData = markdownToObject(prevFile);
  const nextData = { ...prevData, ...changeObj };
  const nextFile = objectToMarkdown(nextData);
  await writeFile(filePath, nextFile);
};

const frontmatterRegex = /(?:(?:^|\n)\-\-\-\n)([\s\S]*?)(?:\n\-\-\-(?:\n|$))/;
const markdownToObject = (
  markdown: string
): {
  markdown: string;
  [k: string]: unknown;
} => {
  const match = markdown.match(frontmatterRegex);
  let frontmatter = "";
  let rest = markdown;
  if (match !== null) {
    frontmatter = match[1] ?? "";
    rest = (
      markdown.slice(0, match.index) +
      "\n" +
      markdown.slice(match.index + match[0].length)
    ).trim();
  }
  return {
    ...parse(frontmatter),
    markdown: rest,
  };
};

const objectToMarkdown = ({
  markdown,
  ...rest
}: {
  markdown: string;
  [k: string]: unknown;
}): string => {
  return "---\n" + stringify(rest) + "---\n\n" + markdown + "\n";
};
