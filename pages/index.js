import Head from "next/head";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Question from "../components/Question";
import { updateQuizResult, getQuizConfig } from "../api/quiz";
import ClipLoader from "react-spinners/ClipLoader";

const Home = ({ email, configuration, result }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [currQuestionConfig, setCurrQuestionConfig] = useState();
  const [currQuestionNum, setCurrQuestionNum] = useState(0);
  const [newResult, setNewResult] = useState(result);
  const [nextQuestionId, setNextQuestionId] = useState(
    configuration.firstQuestionId
  );
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  useEffect(() => {
    if (currQuestionConfig) {
      const previouslySelectedAnswerId = newResult.find(
        (answer) => answer.questionId === currQuestionConfig.id
      )?.answerId;
      if (previouslySelectedAnswerId) {
        setSelectedAnswerId(previouslySelectedAnswerId);
        const _nextQuestionId = currQuestionConfig.answers.find(
          (answer) => answer.id === previouslySelectedAnswerId
        ).nextQuestionId;
        setNextQuestionId(_nextQuestionId);
      }
    }
  }, [currQuestionConfig]);

  const getNextQuestionConfig = () => {
    return configuration.questions.find(
      (question) => question.id === nextQuestionId
    );
  };

  const handleLetsGoButtonClick = () => {
    setCurrQuestionConfig(getNextQuestionConfig());
    setCurrQuestionNum(1);
  };

  const handleChangeSelectedAnswer = (answerId, nextQuestionId) => {
    setDisplayError(false);
    setSelectedAnswerId(answerId);
    setNextQuestionId(nextQuestionId);
  };

  const handleNextButtonClick = async () => {
    if (selectedAnswerId) {
      const updatedResult = newResult.filter(
        (answer) => answer.questionId !== currQuestionConfig.id
      );
      updatedResult.push({
        questionId: currQuestionConfig.id,
        answerId: selectedAnswerId,
      });
      setNewResult(updatedResult);
      const nextQuestionConfig = getNextQuestionConfig();
      if (!nextQuestionConfig) {
        setIsLoading(true);
        await updateQuizResult({ email, configuration, result: updatedResult });
        setIsLoading(false);
      }
      setSelectedAnswerId(null);
      setCurrQuestionConfig(nextQuestionConfig);
      setNextQuestionId(null);
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
      {!currQuestionConfig ? (
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
      ) : isLoading ? (
        <ClipLoader />
      ) : (
        <>
          <Question
            config={currQuestionConfig}
            questionNum={currQuestionNum}
            onChange={handleChangeSelectedAnswer}
            displayError={displayError}
            selectedAnswerId={selectedAnswerId}
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
