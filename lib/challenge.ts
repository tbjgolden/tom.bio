import N from 'number-to-words';

export const generateChallengeFromTimestamp = (time: number): {
  challenge: string,
  answer: string
} => {
  const minuteStr = (time / 60000).toFixed(0);
  let strOne = ''
  let strTwo = ''
  for (let i = 0; i < minuteStr.length; i++) {
    if (i % 2 === 0) {
      strOne += minuteStr.charAt(i);
    } else {
      strTwo += minuteStr.charAt(i);
    }
  }
  const numOne = parseInt(strOne)
  const numTwo = parseInt(strTwo)

  return {
    challenge: `What is ${N.toWords(numOne)} multiplied by ${N.toWords(numTwo)}?`,
    answer: (numOne * numTwo).toString()
  }
}
