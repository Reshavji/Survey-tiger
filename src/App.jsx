import React, { useState, useEffect } from 'react';
import './App.css';

function SurveyQuestions({ questions }) {
  return (
    <div className="survey-questions">
      <h2>Survey Questions</h2>
      {questions.map((question, index) => (
        <div className="question" key={index}>
          <h3>Question {index + 1}</h3>
          <p>Type: {question.type}</p>
          <p>Question: {question.question}</p>
          <p>
            Options:
            {question.options.map((option, optionIndex) => (
              <label className="option" key={optionIndex}>
                <input
                  type={question.type === 'Multi-select' ? 'checkbox' : 'radio'}
                  value={option}
                  name={`question${index}`} // Add name attribute to group radio buttons of the same question
                />
                {option}
              </label>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: '',
    question: '',
    options: ['']
  });
  const [isCreateSurveyMode, setIsCreateSurveyMode] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('surveyQuestions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  const handleQuestionTypeChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      type: e.target.value
    });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      question: e.target.value
    });
  };

  const handleOptionChange = (e, index) => {
    const options = [...currentQuestion.options];
    options[index] = e.target.value;
    setCurrentQuestion({
      ...currentQuestion,
      options
    });
  };

  const addOption = () => {
    if (currentQuestion.options.length < 4) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...currentQuestion.options, '']
      });
    }
  };

  const removeOption = (index) => {
    const options = [...currentQuestion.options];
    options.splice(index, 1);
    setCurrentQuestion({
      ...currentQuestion,
      options
    });
  };

  const addQuestion = () => {
    if (validateQuestion()) {
      const updatedOptions = currentQuestion.type === 'Single-select' ? ['Yes', 'No'] : currentQuestion.options;
      const newQuestion = { ...currentQuestion, options: updatedOptions };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        type: '',
        question: '',
        options: ['']
      });
      setErrors([]);
    }
  };
  

  const validateQuestion = () => {
    const { type, question, options } = currentQuestion;
    const errors = [];

    if (!type) {
      errors.push('Please select a question type.');
    }

    if (!question.trim()) {
      errors.push('Please enter a question.');
    }

    if (type === 'Multi-select' && options.length < 2) {
      errors.push('Please provide at least two options for a multi-select question.');
    }

    setErrors(errors);

    return errors.length === 0;
  };

  const publishSurvey = () => {
    if (questions.length > 0) {
      console.log('Survey published:', questions);
    } else {
      console.log('Cannot publish survey without any questions.');
    }
  };

  const handleCreateSurvey = () => {
    setIsCreateSurveyMode(true);
  };

  const handleTakeSurvey = () => {
    setIsCreateSurveyMode(false);
  };

  const handleSurveySubmit = () => {
    localStorage.setItem('surveyQuestions', JSON.stringify(questions));
    console.log('Survey submitted:', questions);
  };

  return (
    <div className="app">
      <h1 className="title">Welcome to Survey Tiger</h1>
      <div className="buttons">
        <button className="button" onClick={handleCreateSurvey}>Create Survey</button>
        <button className="button" onClick={handleTakeSurvey}>Take Survey</button>
      </div>

      {isCreateSurveyMode ? (
        <div>
          <div className="create-survey">
            <h2>Create Survey</h2>
            <select className="select" value={currentQuestion.type} onChange={handleQuestionTypeChange}>
              <option value="">Select Question Type</option>
              <option value="Multi-select">Multi-Select</option>
              <option value="Single-select">Single-Select</option>
            </select>

            {currentQuestion.type && (
              <div>
                <label className="label">
                  Question:
                  <input className="input" type="text" value={currentQuestion.question} onChange={handleQuestionChange} />
                </label>

                {currentQuestion.type === 'Multi-select' && (
                  <>
                    {currentQuestion.options.map((option, index) => (
                      <div className="option-container" key={index}>
                        <label className="label">
                          Option {index + 1}:
                          <input className="input" type="text" value={option} onChange={(e) => handleOptionChange(e, index)} />
                        </label>
                        <button className="remove-option-button" onClick={() => removeOption(index)}>-</button>
                      </div>
                    ))}
                    {currentQuestion.options.length < 4 && (
                      <button className="add-option-button" onClick={addOption}>+</button>
                    )}
                  </>
                )}

                {currentQuestion.type === 'Single-select' && (
                  <>
                    <div className="option-container">
                      <label className="label">
                        Option 1:
                        <input className="input" type="text" value="Yes" disabled />
                      </label>
                    </div>
                    <div className="option-container">
                      <label className="label">
                        Option 2:
                        <input className="input" type="text" value="No" disabled />
                      </label>
                    </div>
                  </>
                )}

                <button className="add-question-button" onClick={addQuestion}>Add Question</button>
                <button className="publish-button" onClick={publishSurvey}>Publish</button>

                {errors.length > 0 && (
                  <div>
                    {errors.map((error, index) => (
                      <p className="error" key={index}>{error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {questions.length > 0 && (
            <div className="survey-preview">
              <SurveyQuestions questions={questions} />
              <button className="publish-survey-button" onClick={publishSurvey}>Publish Survey</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="take-survey-title">Take Survey</h2>
          <SurveyQuestions questions={questions} />
          {questions.length > 0 && (
            <button className="submit-survey-button" onClick={handleSurveySubmit}>Submit</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
