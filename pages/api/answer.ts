import { NextApiRequest, NextApiResponse } from "next";
import { generateChallengeFromTimestamp } from "lib/challenge";
import { encode } from "html-entities";

export default async function challenge(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Only POST requests allowed" });
    return;
  } else {
    const { answer: submitted, name, email, message } = JSON.parse(req.body);

    const time = Date.now();
    const msSinceMinute = time % 60000;
    const minute = time - msSinceMinute;
    const { challenge, answer } = generateChallengeFromTimestamp(minute);

    const correct =
      submitted === answer ||
      submitted === generateChallengeFromTimestamp(minute - 60000).answer;

    if (correct) {
      const res = await fetch(`https://api.sendinblue.com/v3/smtp/email`, {
        method: "POST",
        headers: {
          accept: 'application/json',
          'api-key': process.env.SENDINBLUE_API_TOKEN,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name,
            email,
          },
          to: [
            {
              email: "hey@tom.bio",
              name: "Tom Golden",
            },
          ],
          subject: "tom.bio | Contact Form",
          htmlContent: `<html><head></head><body><p>${encode(
            message
          )}</p><p><strong>&nbsp;&ndash; ${encode(name)} (${encode(
            email
          )})</strong></p></body></html>`,
        }),
      });
      console.debug(await res.json())
    }

    res.status(200).json({
      challenge,
      correct,
    });
    return;
  }
}
