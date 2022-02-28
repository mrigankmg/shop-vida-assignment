import Head from "next/head";
import Button from "components/ui/Button";
import Container from "components/ui/Container";
import Question from "components/Question";
import { useState, useEffect } from "react";
import { updateQuizResult, getQuizConfig } from "api/quiz";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "styles/Home.module.css";

const Home = ({ email, configuration, result }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [currQuestionConfig, setCurrQuestionConfig] = useState();
  const [currQuestionNum, setCurrQuestionNum] = useState(0);
  const [newResult, setNewResult] = useState(result);
  const [selectedAnswerConfig, setSelectedAnswerConfig] = useState();

  useEffect(() => {
    if (currQuestionConfig) {
      const previouslySelectedAnswerId = newResult.find(
        (answer) => answer.questionId === currQuestionConfig.id
      )?.answerId;
      if (previouslySelectedAnswerId) {
        const _selectedAnswerConfig = currQuestionConfig.answers.find(
          (answer) => answer.id === previouslySelectedAnswerId
        );
        setSelectedAnswerConfig(_selectedAnswerConfig);
      }
    }
  }, [currQuestionConfig]);

  const getQuestionConfig = (id) => {
    return configuration.questions.find((question) => question.id === id);
  };

  const handleLetsGoButtonClick = () => {
    setCurrQuestionConfig(getQuestionConfig(configuration.firstQuestionId));
    setCurrQuestionNum(1);
  };

  const handleChangeSelectedAnswer = (answerConfig) => {
    setDisplayError(false);
    setSelectedAnswerConfig(answerConfig);
  };

  const handleNextButtonClick = async () => {
    if (selectedAnswerConfig) {
      const updatedResult = newResult.filter(
        (answer) => answer.questionId !== currQuestionConfig.id
      );
      updatedResult.push({
        questionId: currQuestionConfig.id,
        answerId: selectedAnswerConfig.id,
      });
      setNewResult(updatedResult);
      const nextQuestionConfig = getQuestionConfig(
        selectedAnswerConfig.nextQuestionId
      );
      if (!nextQuestionConfig) {
        setIsLoading(true);
        await updateQuizResult({ email, configuration, result: updatedResult });
        setIsLoading(false);
      }
      setSelectedAnswerConfig(null);
      setCurrQuestionConfig(nextQuestionConfig);
      setCurrQuestionNum(currQuestionNum + 1);
    } else {
      setDisplayError(true);
    }
  };

  return (
    <Container bgColor={currQuestionConfig?.bgColor || "#ffcba4"}>
      <Head>
        <title>Food Quiz</title>
      </Head>
      {isLoading ? (
        <ClipLoader />
      ) : !currQuestionConfig ? (
        currQuestionNum === 0 ? (
          <>
            <div className={styles["quiz-title"]}>Food Quiz</div>
            <Button
              type="button"
              onClick={handleLetsGoButtonClick}
              text="Let's go!"
            />
          </>
        ) : (
          <div className={styles["quiz-title"]}>
            Thanks for taking the quiz!
          </div>
        )
      ) : (
        <>
          <Question
            config={currQuestionConfig}
            questionNum={currQuestionNum}
            onChange={handleChangeSelectedAnswer}
            displayError={displayError}
            selectedAnswerId={selectedAnswerConfig?.id}
          ></Question>
          <Button type="button" onClick={handleNextButtonClick} text="Next" />
        </>
      )}
    </Container>
  );
};

export const getStaticProps = async () => {
  const res = await getQuizConfig();
  const { email, configuration, result } = res.data;
  return {
    props: {
      email,
      configuration,
      result,
    },
  };
};

export default Home;
