import marked from "marked";

const markdownToHtml = async (markdown: string): Promise<string> =>
  marked(markdown);

export default markdownToHtml;
