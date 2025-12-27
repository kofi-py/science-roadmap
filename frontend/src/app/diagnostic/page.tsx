'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- DATA TYPES & QUESTIONS ---

type Difficulty = 'Elementary' | 'Middle School' | 'High School' | 'College';
type Subject = 'Biology' | 'Chemistry' | 'Physics' | 'Earth Science';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number; // Index of the correct option
    subject: Subject;
    difficulty: Difficulty;
}

const questions: Question[] = [
    // --- BIOLOGY ---
    {
        id: 1,
        text: "What do plants use to turn sunlight into food?",
        options: ["Oxygen", "Photosynthesis", "Digestion", "Respiration"],
        correctAnswer: 1,
        subject: 'Biology',
        difficulty: 'Elementary'
    },
    {
        id: 2,
        text: "Which organelle is known as the 'powerhouse' of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
        correctAnswer: 2,
        subject: 'Biology',
        difficulty: 'High School'
    },
    {
        id: 3,
        text: "In genetics, what is the term for an observable trait?",
        options: ["Genotype", "Phenotype", "Allele", "Chromosome"],
        correctAnswer: 1,
        subject: 'Biology',
        difficulty: 'College'
    },

    // --- CHEMISTRY ---
    {
        id: 4,
        text: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correctAnswer: 0,
        subject: 'Chemistry',
        difficulty: 'Elementary'
    },
    {
        id: 5,
        text: "Which of these is a solution with a pH of 2?",
        options: ["Strong Base", "Neutral", "Weak Base", "Strong Acid"],
        correctAnswer: 3,
        subject: 'Chemistry',
        difficulty: 'High School'
    },
    {
        id: 6,
        text: "What is the geometry of a molecule with sp3 hybridization (e.g., Methane)?",
        options: ["Linear", "Trigonal Planar", "Tetrahedral", "Octahedral"],
        correctAnswer: 2,
        subject: 'Chemistry',
        difficulty: 'College'
    },

    // --- PHYSICS ---
    {
        id: 7,
        text: "What force pulls objects toward the center of the Earth?",
        options: ["Magnetism", "Friction", "Gravity", "Tension"],
        correctAnswer: 2,
        subject: 'Physics',
        difficulty: 'Elementary'
    },
    {
        id: 8,
        text: "According to Newton's Second Law, Force equals:",
        options: ["Mass × Velocity", "Mass × Acceleration", "Mass ÷ Volume", "Energy ÷ Time"],
        correctAnswer: 1,
        subject: 'Physics',
        difficulty: 'High School'
    },
    {
        id: 9,
        text: "In Special Relativity, what happens to time for an object moving near the speed of light relative to a stationary observer?",
        options: ["It speeds up", "It stays the same", "It slows down (Time Dilation)", "It stops completely"],
        correctAnswer: 2,
        subject: 'Physics',
        difficulty: 'College'
    },

    // --- EARTH SCIENCE ---
    {
        id: 10,
        text: "Molten rock that erupts from a volcano is called:",
        options: ["Magma", "Lava", "Ash", "Crust"],
        correctAnswer: 1,
        subject: 'Earth Science',
        difficulty: 'Elementary'
    },
    {
        id: 11,
        text: "Which layer of the atmosphere contains the ozone layer?",
        options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
        correctAnswer: 1,
        subject: 'Earth Science',
        difficulty: 'High School'
    },
    {
        id: 12,
        text: "The 'Wilson Cycle' describes the periodic:",
        options: ["Opening and closing of ocean basins", "Changes in Earth's orbit", "Reversal of magnetic poles", "Formation of glaciers"],
        correctAnswer: 0,
        subject: 'Earth Science',
        difficulty: 'College'
    }
];

// --- RECOMMENDATION LOGIC ---

type Level = 'K-5' | 'Middle School' | 'High School' | 'College';

const getRecommendation = (scorePercentage: number): { level: Level, message: string, color: string } => {
    if (scorePercentage >= 85) {
        return {
            level: 'College',
            message: "Outstanding! You have a strong grasp of scientific principles. You're ready for advanced university-level challenges.",
            color: 'text-space-blue-600'
        };
    } else if (scorePercentage >= 60) {
        return {
            level: 'High School',
            message: "Great job! You have a solid foundation. We recommend starting with High School courses to solidify your knowledge before tackling college material.",
            color: 'text-fusion-purple-600'
        };
    } else if (scorePercentage >= 35) {
        return {
            level: 'Middle School',
            message: "Good start! You know the basics. Middle School courses will help you bridge the gap to more complex topics.",
            color: 'text-electric-cyan-600'
        };
    } else {
        return {
            level: 'K-5',
            message: "Welcome to science! We recommend starting from the beginning to build a rock-solid foundation in all subjects.",
            color: 'text-neon-green-600'
        };
    }
};

// --- COMPONENT ---

export default function DiagnosticPage() {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const handleStart = () => {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResults(false);
    };

    const handleAnswer = (optionIndex: number) => {
        if (selectedOption !== null) return; // Prevent multiple clicks
        setSelectedOption(optionIndex);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = optionIndex === currentQuestion.correctAnswer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        // Delay to show feedback before moving to next question
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                setShowResults(true);
            }
        }, 800);
    };

    const restartQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResults(false);
        setSelectedOption(null);
    };

    // --- RENDER: INTRO ---
    if (!quizStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold gradient-text-science mb-8">Science Diagnostic Test</h1>

                    <div className="science-card p-8 md:p-12 mb-8">
                        <div className="text-6xl mb-6">📝</div>
                        <h2 className="text-2xl font-bold text-space-blue-900 mb-4">
                            Discover Your Learning Path
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Take our adaptive assessment to identify your current knowledge level
                            across Biology, Chemistry, Physics, and Earth Science. From K-5 to <strong>College Level</strong>.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="font-bold text-space-blue-900">4 Subjects</div>
                                <div className="text-xs text-gray-500">All sciences covered</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="font-bold text-space-blue-900">{questions.length} Questions</div>
                                <div className="text-xs text-gray-500">K-12 & College</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="font-bold text-space-blue-900">~10 Mins</div>
                                <div className="text-xs text-gray-500">Quick & Effective</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="font-bold text-space-blue-900">Instant</div>
                                <div className="text-xs text-gray-500">Personalized Roadmap</div>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="btn-primary text-xl px-12 py-4 w-full md:w-auto hover:scale-105 transition-transform"
                        >
                            Start Diagnostic Test
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Ready to learn? <Link href="/login" className="text-electric-cyan-600 underline">Log in</Link> to save your progress.
                    </p>
                </div>
            </div>
        );
    }

    // --- RENDER: RESULTS ---
    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const { level, message, color } = getRecommendation(percentage);

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="science-card p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold text-space-blue-900 mb-2">Diagnostic Complete!</h2>
                        <div className="text-6xl font-black gradient-text-science mb-6">
                            {percentage}%
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Recommended Starting Level:</h3>
                            <div className={`text-4xl font-bold ${color} mb-4`}>{level}</div>
                            <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                                {message}
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link
                                href="/curriculum"
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Go to Curriculum ({level}) <span>→</span>
                            </Link>
                            <button
                                onClick={restartQuiz}
                                className="px-6 py-3 bg-white text-gray-600 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                            >
                                Retake Diagnostic
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: QUIZ QUESTION ---
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>{currentQuestion.subject} • {currentQuestion.difficulty}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-electric-cyan-500 to-fusion-purple-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="science-card p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-space-blue-900 mb-8 leading-snug">
                        {currentQuestion.text}
                    </h3>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrect = index === currentQuestion.correctAnswer;
                            const showCorrectness = selectedOption !== null;

                            let buttonStyle = "w-full p-4 rounded-xl text-left border-2 transition-all duration-200 relative ";

                            if (showCorrectness) {
                                if (isCorrect) {
                                    buttonStyle += "bg-green-50 border-green-500 text-green-700 font-medium";
                                } else if (isSelected) {
                                    buttonStyle += "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    buttonStyle += "bg-white border-gray-100 text-gray-400";
                                }
                            } else {
                                buttonStyle += "bg-white border-gray-100 hover:border-electric-cyan-400 hover:bg-electric-cyan-50 text-gray-700";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedOption !== null}
                                    className={buttonStyle}
                                >
                                    <span className="mr-3 text-sm font-bold opacity-50">
                                        {['A', 'B', 'C', 'D'][index]}
                                    </span>
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
