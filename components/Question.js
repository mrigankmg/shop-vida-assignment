import styles from "../styles/Question.module.css";

const Question = ({
  config,
  questionNum,
  onChange,
  displayError,
  selectedAnswerId,
}) => {
  const renderOptions = () => {
    return config.answers.map((answer) => {
      return (
        <div className={styles.option} key={answer.id}>
          <input
            type="radio"
            id={answer.id}
            name="answer"
            value={answer.id}
            checked={answer.id === selectedAnswerId}
            onChange={() => onChange(answer.id, answer.nextQuestionId)}
          />
          <label htmlFor={answer.id}>{answer.answer}</label>
        </div>
      );
    });
  };

  return (
    <div className={styles["question-container"]}>
      <h2>Question {questionNum}</h2>
      <div className={styles.question}>{config.question}</div>
      {displayError && (
        <div className={styles.error}>Please select an option...</div>
      )}
      <div className={styles["options-container"]}>{renderOptions()}</div>
    </div>
  );
};

export default Question;
