import { NextApiRequest, NextApiResponse } from "next";
import { generateChallengeFromTimestamp } from 'lib/challenge';

export default async function challenge(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const time = Date.now()
  const msSinceMinute = time % 60000
  const minute = (time - msSinceMinute)

  return res.status(200).json({ challenge: generateChallengeFromTimestamp(minute).challenge });
}
