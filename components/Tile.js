import React from "react";
import styles from "../styles/Home.module.css";

const Tile = ({ value }) => {
    const tileClass = value ? `${styles.tile} ${styles[`tile-${value}`]}` : styles.tile;
    return <div className={tileClass}>{value || ""}</div>;
};

export default Tile;
