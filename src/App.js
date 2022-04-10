import logo from './logo.svg';
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid';
import './App.css';
import LandingPage from './components/LandingPage'
import Question from './components/Question'

function App() {
  const [isStarted, setIsStarted] = useState(true)
  const [questions, setQuestions] = useState([])

  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  // Get our questions data from the API and store it in state
  useEffect(() => {
      fetch('https://opentdb.com/api.php?amount=5&category=15&difficulty=medium&type=multiple')
          .then(res => res.json())
          .then(data => {
              const questionsData = data.results.map(question => {
              const choicesArr = shuffle(question.incorrect_answers.concat(question.correct_answer))
              return {...question, id: nanoid(), choices: choicesArr, isSelected: false, userAnswer: ""}
            })
            // Set our questions state
            setQuestions(questionsData)
          })
  }, [])

  function selectAnswer(event, id) {
    event.target.classList.toggle('selected')
    setQuestions(prevQuestions => prevQuestions.map(question => {
      return question.id === id 
             ? {...question, isSelected: !question.isSelected, userAnswer: event.target.textContent.toLowerCase() } 
             : question
    }))
  }

  const questionElements = questions.map(q => {
    return <Question 
              key={q.id} 
              question={q.question} 
              choices={q.choices}
              userAnswer={q.userAnswer}
              correctAnswer={q.correct_answer}
              isSelected={q.isSelected}
              selectAnswer={(event) => selectAnswer(event, q.id)}
          />
  })

  return (
    <div>
      {questionElements}
    </div>
  )

}

export default App