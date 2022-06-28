import express from "express";

type ExtendApi = (
  request: express.Request,
  response: express.Response
) => void | Promise<void>;

export const extendApi: ExtendApi = (request, response) => {
  console.log(
    "hello!",
    JSON.stringify(request.url),
    JSON.stringify(request.method)
  );
};
