export interface IQuestion {
  body: string;
  correctAnswers: string[];
}
export const dataSetQuestions: IQuestion[] = [
  {
    body: 'What is the capital of France?',
    correctAnswers: ['correct'],
  },
  {
    body: 'Which planet is known as the Red Planet?',
    correctAnswers: ['correct'],
  },
  {
    body: 'What is the largest mammal?',
    correctAnswers: ['correct'],
  },
  {
    body: 'In what year did the Titanic sink?',
    correctAnswers: ['correct'],
  },
  {
    body: 'What is the square root of 64?',
    correctAnswers: ['correct'],
  },
];

export const dataSetAnswers = [
  {
    answer: 'correct',
  },
  {
    answer: 'incorrect',
  },
  {
    answer: 'incorrect',
  },
  {
    answer: 'incorrect',
  },
  {
    answer: 'incorrect',
  },
];

export const dataSetAllAnswersCorrect = [
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
];

export const dataSet3AnswersCorrect = [
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
  {
    answer: 'correct',
  },
];
