
import React, { useState, useEffect } from 'react';
import { gameQuestionServices } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const TrueOrFalse = () => {
  // Fix the call to getRandomQuestions to match the updated API
  const { data: questionsData, isLoading, error } = useQuery({
    queryKey: ['trueOrFalseQuestions'],
    queryFn: () => gameQuestionServices.trueFalse.getRandomQuestions(10)
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const questions = questionsData?.data || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setGameFinished(true);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = (answer: boolean) => {
    if (currentQuestion && answer === currentQuestion.isTrue) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestartGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowExplanation(false);
    setGameFinished(false);
  };

  if (isLoading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (gameFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-semibold mb-4">Game Over!</h2>
          <p className="text-gray-700 mb-4">Your Score: {score} / {questions.length}</p>
          <button
            onClick={handleRestartGame}
            className="bg-islamic-primary text-white py-2 px-4 rounded hover:bg-islamic-secondary focus:outline-none focus:ring-2 focus:ring-islamic-primary focus:ring-opacity-50"
          >
            Restart Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {currentQuestion && (
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-xl font-semibold mb-4">True or False</h2>
          <p className="text-gray-700 mb-4">{currentQuestion.text}</p>

          <div className="flex justify-around mb-4">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              True
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              False
            </button>
          </div>

          {showExplanation && (
            <div className="mt-4">
              <p className="text-gray-600 italic">Explanation: {currentQuestion.explanation}</p>
              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Next Question
              </button>
            </div>
          )}

          <p className="text-gray-800 mt-4">Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default TrueOrFalse;
