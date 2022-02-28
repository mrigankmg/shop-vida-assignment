import styles from "styles/Button.module.css";

const Button = ({ type, onClick, text }) => {
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {text}
    </button>
  );
};

export default Button;
