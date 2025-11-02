import React from "react";
import PropTypes from 'prop-types';
import styles from "./index.module.sass";

export default function BulletPoints(props) {
  const { points } = props;

  const bulletPoints = points.map((point, i)=>{
    return (
      <div className={styles.bulletPoint}>
        { point.img &&
          <img src={point.img} />
        }
        <p>{point.text}</p>
      </div>
    )
  })

  return (
    <div className={styles.Main}>
      {bulletPoints}
    </div>
  );
}

BulletPoints.propTypes = {
  points: PropTypes.array.isRequired
};
