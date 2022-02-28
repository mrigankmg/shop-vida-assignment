import styles from "styles/Container.module.css";

const Container = ({ children, bgColor }) => {
  return (
    <div className={`container-color ${styles.container}`}>
      {children}
      <style jsx>{`
        .container-color {
          background-color: ${bgColor};
          transition: background-color 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default Container;
