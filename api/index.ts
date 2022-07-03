import { readFile, writeFile } from "easier-node";
import express from "express";

type ExtendApi = (
  request: express.Request,
  response: express.Response,
  dataPath: string,
  update: () => void
) => void | Promise<void>;

const sections = /^\/sections\/([^\/]{1,100})\/?$/;
const posts = /^\/posts\/([^\/]{1,100})\/?$/;

export const extendApi: ExtendApi = async (
  request,
  response,
  dataPath,
  update
) => {
  const url = request.url;

  const sectionsMatch = url.match(sections);
  if (sectionsMatch !== null) {
    if (typeof request.body.markdown === "string") {
      const filePath = `${dataPath}/sections/${sectionsMatch[1]}.md`;
      await writeFile(filePath, request.body.markdown);
      update();
      response.status(200).send("OK");
    } else {
      response.status(400).send("Not OK");
    }
    return;
  }

  const postsMatch = url.match(posts);
  if (postsMatch !== null) {
    if (typeof request.body.markdown === "string") {
      const filePath = `${dataPath}/posts/${postsMatch[1]}.md`;
      await writeFile(filePath, request.body.markdown);
      update();
      response.status(200).send("OK");
    } else {
      response.status(400).send("Not OK");
    }
    return;
  }

  console.log(
    "hello!",
    JSON.stringify(request.url),
    JSON.stringify(request.method)
  );
};
