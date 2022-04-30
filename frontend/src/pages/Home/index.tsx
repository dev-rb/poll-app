import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

const Home = () => {
    return (
        <div className={styles.homeContainer}>
            <h1>P0LL</h1>
            <h6>The Better Polling Application</h6>
            <div className={styles.homeButtonsContainer}>
                <Link to="/polls"> Start a Poll</Link>
                <Link to="/polls"> Join a Poll </Link>
            </div>
        </div>
    );
}

export default Home;