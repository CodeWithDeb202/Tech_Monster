import './Navbar.css';

import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from './Navbardata.js';

import Systembar from "../common/navbar/SystemBar";

import logo from "../../assets/logo/logo.png"

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("#");

    useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveLink(`#${entry.target.id}`);
                }
            });
        },
        {
            threshold: 0.6,
        }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
}, []);


    return (
        <>

            <motion.nav id='navbar' initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
                <Systembar user='DEB' />
                <div id='navbar-container' >
                    <a href={'#home'} onClick={() => setActiveLink('#')} id='navLogo'>
                        
                        <img src={logo} alt="Tech monster Logo" />

                        <div id='navLogo-text'>
                            <h2>Tech <span>Monster</span></h2>
                        </div>
                    </a>
                    <div id="toggleBar">
                        <button onClick={() => setIsOpen(true)}>
                            <FaBars />
                        </button>
                    </div>

                    <div id="navlink">
                        {navLinks.map((link) => (
                            <a id='navlinkPageBtn' className={activeLink === link.path ? 'active' : ''} key={link.id} href={link.path} onClick={() => setActiveLink(link.path)}>{link.title}</a>
                        ))}

                        <div id="auth-buttons">

                            <Link to={'/login'} id='login-btn'>Login</Link>

                            <Link to={'/signup'} id='signup-btn'>Sign Up</Link>

                        </div>
                    </div>

                </div>

            </motion.nav>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            id="sideOverlay"
                            onClick={() => setIsOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        <motion.div
                            id="navSidebar"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <button id="closeBtn" onClick={() => setIsOpen(false)}>
                                <FaTimes />
                            </button>

                            {navLinks.map((link) => (
                                <a key={link.id} onClick={() => setIsOpen(false)} href={link.path}>{link.title}</a>
                            ))}

                            <Link to={'/signup'} id='signup-btn' onClick={() => setIsOpen(false)}>Sign Up</Link>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )

}

export default Navbar;