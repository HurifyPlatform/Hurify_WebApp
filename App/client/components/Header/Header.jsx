import React from 'react'
require('./../../fonts/FranklinGothicCondensed.css')
import styles from './Header.css'

const Header = () => {
    return (
        <header className={styles.header}>
            <h1 className={styles.brand}>Bank of America</h1>
        </header>
    )
}

export default Header