import React from 'react'
import { Link } from 'react-router'
import styles from './HomePage.css'

const HomePage = () => {
    return (
        <main className={styles.main}>
            <Link className={styles.nav} to='/patient/1'>Patient 1</Link>
        </main>
    )
}

export default HomePage