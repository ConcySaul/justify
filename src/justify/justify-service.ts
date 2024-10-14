import { getUserByEmail } from "../user/user-repository"
import { getWordsNumber, saveWordsUsed } from "./justify-repository";

type JustifyReturnType = {
  success: true;
  text: string;
} | {
  success: false;
  reason: 'needs_payment';
}

export const justifier = (text: string, maxWidth = 80) => {
    const paragraphs = text.replaceAll("\r\n", "\n").replaceAll("\n\n", "\n").split('\n').map((part) => part.trim());

    const justifiedParagraphs = paragraphs.map((part) => {
      const words = part.split(' ');
      const lines = words.reduce(
        (acc, word) => {
          const lastLine = acc[acc.length - 1];
          if (!lastLine) {
            return [[word]];
          }
          const lineLength = lastLine.join(' ').length;
          if (lineLength + word.length < maxWidth) {
            lastLine.push(word);
            return acc;
          }
          const missingSpaces = maxWidth - lineLength;
          for (let i = 0; i < missingSpaces; i++) {
            lastLine[i % (lastLine.length - 1)] += ' ';
          }
          return [...acc, [word]];
        },
        [[]] as string[][],
      );
      return lines.map((line) => line.join(' ')).join('\n');
    });
    return justifiedParagraphs.join('\n');
}

export const justifyText = async (email: string, text: string): Promise<JustifyReturnType> => {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('No user found');
    }
    const wordsNumber = text.split(/\s+/).length;
    const wordsUsed = await getWordsNumber(user.id);

    if ((wordsNumber + wordsUsed) <= 80000) {
        await saveWordsUsed(user.id, wordsNumber);
        const justifiedText = justifier(text);
        return {
          success: true,
          text: justifiedText
        };
    }
    return {
      success: false,
      reason: 'needs_payment'
    };
}