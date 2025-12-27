export interface Course {
    id: string;
    title: string;
    subject: 'Biology' | 'Chemistry' | 'Physics' | 'Earth Science';
    level: 'K-5' | 'Middle School' | 'High School' | 'College';
    description: string;
    duration: string;
    topics: string[];
    link: string;
}

export const courses: Course[] = [
    // ==================== BIOLOGY ====================
    {
        id: 'bio-k5-1',
        title: 'Life All Around Us',
        subject: 'Biology',
        level: 'K-5',
        description: 'Introduction to living things, plants, animals, and habitats.',
        duration: '4 weeks',
        topics: ['Plants', 'Animals', 'Habitats', 'Life Cycles'],
        link: 'https://www.khanacademy.org/science/biology'
    },
    {
        id: 'bio-ms-1',
        title: 'Cells and Heredity',
        subject: 'Biology',
        level: 'Middle School',
        description: 'Explore the building blocks of life and how traits are passed down.',
        duration: '8 weeks',
        topics: ['Cell Structure', 'DNA Basics', 'Genetics', 'Evolution'],
        link: 'https://www.khanacademy.org/science/ms-biology'
    },
    {
        id: 'bio-hs-1',
        title: 'High School Biology',
        subject: 'Biology',
        level: 'High School',
        description: 'Comprehensive study of life processes, ecology, and molecular biology.',
        duration: '12 weeks',
        topics: ['Cellular Respiration', 'Photosynthesis', 'Ecology', 'Human Anatomy'],
        link: 'https://www.khanacademy.org/science/high-school-biology'
    },
    {
        id: 'bio-col-1',
        title: 'Molecular Biology',
        subject: 'Biology',
        level: 'College',
        description: 'Advanced study of molecular mechanisms in biological systems.',
        duration: '16 weeks',
        topics: ['Protein Synthesis', 'Gene Regulation', 'Cell Signaling', 'Biotechnology'],
        link: 'https://ocw.mit.edu/courses/7-01sc-fundamentals-of-biology-fall-2011/'
    },

    // ==================== CHEMISTRY ====================
    {
        id: 'chem-k5-1',
        title: 'Matter and Mixtures',
        subject: 'Chemistry',
        level: 'K-5',
        description: 'Fun experiments with solids, liquids, and gases.',
        duration: '4 weeks',
        topics: ['States of Matter', 'Mixtures', 'Solutions', 'Changes of State'],
        link: 'https://www.khanacademy.org/science/chemistry'
    },
    {
        id: 'chem-ms-1',
        title: 'Atoms and Periodic Table',
        subject: 'Chemistry',
        level: 'Middle School',
        description: 'Introduction to elements, atoms, and chemical reactions.',
        duration: '8 weeks',
        topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonds', 'Reactions'],
        link: 'https://www.khanacademy.org/science/ms-chemistry' // Hypothetical or map to general chem
    },
    // Mapping MS Chem to General Chemistry basics on Khan or similar if specific MS course doesn't exist
    // Using general chem link for now or "Science -> Chemistry"
    {
        id: 'chem-hs-1',
        title: 'General Chemistry',
        subject: 'Chemistry',
        level: 'High School',
        description: 'Stoichiometry, thermodynamics, and kinetics.',
        duration: '12 weeks',
        topics: ['Stoichiometry', 'Thermodynamics', 'Acids and Bases', 'Redox Reactions'],
        link: 'https://www.khanacademy.org/science/hs-chemistry'
    },
    {
        id: 'chem-col-1',
        title: 'Organic Chemistry I',
        subject: 'Chemistry',
        level: 'College',
        description: 'Structure, properties, and reactions of organic compounds.',
        duration: '16 weeks',
        topics: ['Alkanes/Alkenes', 'Stereochemistry', 'Substitution Reactions', 'Spectroscopy'],
        link: 'https://www.khanacademy.org/science/organic-chemistry'
    },

    // ==================== PHYSICS ====================
    {
        id: 'phys-k5-1',
        title: 'Forces and Motion',
        subject: 'Physics',
        level: 'K-5',
        description: 'Learn how things move properly with pushes and pulls.',
        duration: '4 weeks',
        topics: ['Push and Pull', 'Gravity', 'Simple Machines', 'Magnetism'],
        link: 'https://www.khanacademy.org/science/physics'
    },
    {
        id: 'phys-ms-1',
        title: 'Energy and Waves',
        subject: 'Physics',
        level: 'Middle School',
        description: 'Understanding potential/kinetic energy and sound/light waves.',
        duration: '8 weeks',
        topics: ['Kinetic Energy', 'Potential Energy', 'Sound Waves', 'Light'],
        link: 'https://www.khanacademy.org/science/ms-physics'
    },
    {
        id: 'phys-hs-1',
        title: 'AP Physics 1',
        subject: 'Physics',
        level: 'High School',
        description: 'Algebra-based mechanics, waves, and electricity.',
        duration: '12 weeks',
        topics: ['Kinematics', 'Dynamics', 'Circular Motion', 'Simple Harmonic Motion'],
        link: 'https://www.khanacademy.org/science/ap-physics-1'
    },
    {
        id: 'phys-col-1',
        title: 'Quantum Mechanics',
        subject: 'Physics',
        level: 'College',
        description: 'Introduction to quantum theory and wave mechanics.',
        duration: '16 weeks',
        topics: ['Wave Functions', 'Schrodinger Equation', 'Quantum Tunneling', 'Spin'],
        link: 'https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/'
    },

    // ==================== EARTH SCIENCE ====================
    {
        id: 'earth-k5-1',
        title: 'Our Planet Earth',
        subject: 'Earth Science',
        level: 'K-5',
        description: 'Discover rocks, weather, and the solar system.',
        duration: '4 weeks',
        topics: ['Rocks and Minerals', 'Weather', 'Solar System', 'Water Cycle'],
        link: 'https://www.khanacademy.org/science/middle-school-earth-and-space-science' // Closest for K-5/MS
    },
    {
        id: 'earth-ms-1',
        title: 'Plate Tectonics and Climate',
        subject: 'Earth Science',
        level: 'Middle School',
        description: 'How the earth moves and how climate changes over time.',
        duration: '8 weeks',
        topics: ['Plate Tectonics', 'Earthquakes', 'Volcanoes', 'Climate Change'],
        link: 'https://www.khanacademy.org/science/middle-school-earth-and-space-science'
    },
    {
        id: 'earth-hs-1',
        title: 'Geology and Astronomy',
        subject: 'Earth Science',
        level: 'High School',
        description: 'Deep dive into earth\'s history and the universe.',
        duration: '12 weeks',
        topics: ['Geologic Time', 'Stellar Evolution', 'Cosmology', 'Oceanography'],
        link: 'https://www.khanacademy.org/science/cosmology-and-astronomy'
    },
    {
        id: 'earth-col-1',
        title: 'Atmospheric Science',
        subject: 'Earth Science',
        level: 'College',
        description: 'Physics and chemistry of the atmosphere and climate dynamics.',
        duration: '16 weeks',
        topics: ['Atmospheric Dynamics', 'Radiation Budget', 'Climate Modeling', 'Meteorology'],
        link: 'https://ocw.mit.edu/courses/12-003-atmosphere-ocean-and-climate-dynamics-fall-2008/'
    }
];
