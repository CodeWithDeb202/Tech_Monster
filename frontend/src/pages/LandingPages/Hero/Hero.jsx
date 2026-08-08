import './Hero.css';

import { useEffect, useState } from "react";

import api from "../../../services/api/axios";
import { API } from "../../../services/api/endpoints";

import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { FaArrowRight, FaPlayCircle, FaShieldAlt } from 'react-icons/fa';
import { heroContent } from './HeroData';
import HeroImage from '../../../assets/logo/logo.png';

import Button from '../../../components/Common/Form/Button';
import Card from '../../../components/Common/CardComponent/Card';


const fadeUp = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            delay,
            ease: 'easeOut',
        },
    }),
};

function Hero() {
    const [heroStats, setHeroStats] = useState({
        students: 0,
        internships: 0,
        admins: 0
    });

    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {

        const fetchHeroStats = async () => {

            try {

                const response = await api.get(
                    API.PUBLIC.HERO_STATS
                );

                if (response.data.success) {

                    setHeroStats(
                        response.data.stats
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to fetch hero stats:",
                    error
                );

            } finally {

                setStatsLoading(false);

            }

        };

        fetchHeroStats();

    }, []);


    return (
        <>
            <section className='hero' id='home'>


                <div id="hero-container">
                    {/* LEFT */}
                    <div id="hero-left">
                        <motion.span id='hero-badge' variants={fadeUp} initial='hidden' animate='show' custom={0}>{heroContent.badge}</motion.span>
                        <motion.h1 id='hero-title' variants={fadeUp} initial='hidden' animate='show' custom={0.2}>{heroContent.title} <span> <FaShieldAlt /></span> <span>{heroContent.highlight}</span></motion.h1>
                        <motion.p id='hero-description' variants={fadeUp} initial='hidden' animate='show' custom={0.4}>{heroContent.description}</motion.p>
                        <motion.div id='hero-buttons' variants={fadeUp} initial='hidden' animate='show' custom={0.6}>
                            <Link to={'/signup'}>
                                <Button variant="primary" icon={<FaArrowRight />}>
                                    {heroContent.primaryButton}
                                </Button>
                            </Link>

                            <Link to={'/learnmore'}>
                                <Button variant='secondary' icon={<FaPlayCircle />}>
                                    {heroContent.secondaryButton}
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div className='hero-stats' variants={fadeUp} initial='hidden' animate='show' custom={0.8}>
                            <Card className="stat-card">
                                <h2>
                                    {statsLoading
                                        ? "..."
                                        : `${heroStats.students}+`}
                                </h2>
                                <p>Students</p>
                            </Card>

                            <Card className="stat-card">
                                <h2>
                                    {statsLoading
                                        ? "..."
                                        : `${heroStats.internships}+`}
                                </h2>
                                <p>Internships</p>
                            </Card>

                            <Card className="stat-card">
                                <h2>
                                    {statsLoading
                                        ? "..."
                                        : `${heroStats.admins}+`}
                                </h2>
                                <p>Mentors</p>
                            </Card>
                        </motion.div>
                    </div>

                    {/* RIGHT */}
                    <motion.div id='hero-right' initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                        <motion.img src={HeroImage} alt='Hero image' animate={{ y: [0, -30, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />
                    </motion.div>
                </div>
            </section>
        </>
    )
}

export default Hero;