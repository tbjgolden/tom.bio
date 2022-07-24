import fs from "node:fs";
import url, { URL } from "node:url";
import http from "node:http";
import https from "node:https";

const TIMEOUT_MS = 20000;

export const download = async (
  remotePath: string,
  localPath: string
): Promise<string> => {
  console.log("downloading", remotePath, "to", localPath);

  let req;
  if (url.parse(remotePath).protocol === null) {
    remotePath = "http://" + remotePath;
    req = http;
  } else if (url.parse(remotePath).protocol === "https:") {
    req = https;
  } else {
    req = http;
  }

  return new Promise<string>((resolve, reject) => {
    let request = req
      .get(remotePath, function (response) {
        if (response.statusCode >= 200 && response.statusCode <= 299) {
          let file = fs.createWriteStream(localPath);
          response.pipe(file);
        } else if (
          response.statusCode >= 300 &&
          response.statusCode <= 399 &&
          typeof response.headers["location"] === "string"
        ) {
          return download(
            new URL(response.headers["location"], remotePath).toString(),
            localPath
          )
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          return reject(new Error(`Status code: ${response.statusCode}`));
        }

        response.on("end", () => {
          return resolve(response.headers["content-type"]);
        });

        request.setTimeout(TIMEOUT_MS, () => {
          request.abort();
          return reject(new Error(`Timeout`));
        });
      })
      .on("error", function (error) {
        return reject(error);
      });
  });
};
