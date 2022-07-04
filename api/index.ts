import express from "express";
import { deleteFile, ensureFolderExists, moveFile, uuidv4 } from "easier-node";
import { mutateMarkdown } from "./markdown";

type ChangeObject = {
  [k: string]: unknown;
};

type ExtendApi = (
  request: express.Request,
  response: express.Response,
  dataPath: string,
  update: () => Promise<void>
) => void | Promise<void>;

const sections = /^\/sections\/([^\/]{1,100})\/?$/;
const portfolio = /^\/portfolio\/([^\/]{1,100})\/?$/;
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
    const filePath = `${dataPath}/sections/${sectionsMatch[1]}.md`;
    const changeObject: ChangeObject = {};
    if (typeof request.body.markdown === "string") {
      changeObject.markdown = request.body.markdown;
    }
    await mutateMarkdown(filePath, changeObject);
    update();
    response.status(200).send("OK");
    return;
  }

  const portfolioMatch = url.match(portfolio);
  if (portfolioMatch !== null) {
    if (portfolioMatch[1] === "new") {
      const uuid = uuidv4();
      await mutateMarkdown(`${dataPath}/portfolio/${uuid}.md`, {
        title: "(Title)",
        flex: "(Flex)",
        markdown: "(Markdown)",
      });
      await update();
      response
        .status(200)
        .header("content-type", "application/json")
        .send(
          JSON.stringify({
            id: uuid,
          })
        );
    } else if (portfolioMatch[1] === "delete") {
      if (typeof request.body.slug !== "string") {
        return;
      }
      await ensureFolderExists(`${dataPath}/deleted/portfolio`);
      await moveFile(
        `${dataPath}/portfolio/${request.body.slug}.md`,
        `${dataPath}/deleted/portfolio/${request.body.slug}.md`
      );
      await update();
      response.status(200).send("OK");
    } else {
      const changeObject: ChangeObject = {};
      if (typeof request.body.markdown === "string") {
        changeObject.markdown = request.body.markdown;
      }
      if (typeof request.body.title === "string") {
        changeObject.title = request.body.title;
      }
      if (typeof request.body.flex === "string") {
        changeObject.flex = request.body.flex;
      }
      await mutateMarkdown(
        `${dataPath}/portfolio/${portfolioMatch[1]}.md`,
        changeObject
      );
      response.status(200).send("OK");
      update();
    }
  }

  const postsMatch = url.match(posts);
  if (postsMatch !== null) {
    if (postsMatch[1] === "new") {
      const uuid = uuidv4();
      await mutateMarkdown(`${dataPath}/posts/${uuid}.md`, {
        title: "(Title)",
        imageUrl: "https://picsum.photos/200/300",
        markdown: "(Markdown)",
      });
      await update();
      response
        .status(200)
        .header("content-type", "application/json")
        .send(
          JSON.stringify({
            id: uuid,
          })
        );
    } else if (postsMatch[1] === "delete") {
      if (typeof request.body.slug !== "string") {
        return;
      }
      await ensureFolderExists(`${dataPath}/deleted/posts`);
      await moveFile(
        `${dataPath}/posts/${request.body.slug}.md`,
        `${dataPath}/deleted/posts/${request.body.slug}.md`
      );
      await update();
      response.status(200).send("OK");
    } else {
      const changeObject: ChangeObject = {};
      if (typeof request.body.markdown === "string") {
        changeObject.markdown = request.body.markdown;
      }
      if (typeof request.body.title === "string") {
        changeObject.title = request.body.title;
      }
      if (typeof request.body.imageUrl === "string") {
        changeObject.imageUrl = request.body.imageUrl;
      }
      await mutateMarkdown(
        `${dataPath}/posts/${postsMatch[1]}.md`,
        changeObject
      );
      response.status(200).send("OK");
      update();
    }
  }
};
