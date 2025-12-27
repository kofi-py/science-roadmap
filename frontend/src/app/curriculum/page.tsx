'use client';

import { useState, useMemo } from 'react';
import { courses, Course } from '@/data/coursesData';

export default function CurriculumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

      return matchesSearch && matchesSubject && matchesLevel;
    });
  }, [searchQuery, selectedSubject, selectedLevel]);

  const subjects = ['All', 'Biology', 'Chemistry', 'Physics', 'Earth Science'];
  const levels = ['All', 'K-5', 'Middle School', 'High School', 'College'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-text-science mb-4">Science Curriculum</h1>
          <p className="text-xl text-gray-600">Master science from K-12 to College</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-electric-cyan-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search topics, titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-electric-cyan-400 outline-none transition-all"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-electric-cyan-400 outline-none bg-white"
            >
              {subjects.map(s => <option key={s} value={s}>{s} Subjects</option>)}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-electric-cyan-400 outline-none bg-white"
            >
              {levels.map(l => <option key={l} value={l}>{l} Level</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="science-card group hover:scale-[1.02] transition-all duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${course.subject === 'Biology' ? 'bg-green-100 text-green-700' :
                      course.subject === 'Chemistry' ? 'bg-purple-100 text-purple-700' :
                        course.subject === 'Physics' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'}`}>
                    {course.subject}
                  </span>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-space-blue-900 mb-2 group-hover:text-electric-cyan-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {course.topics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    ⏱️ {course.duration}
                  </span>
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-electric-cyan-600 font-semibold text-sm hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  >
                    Start Course →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No courses found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSubject('All'); setSelectedLevel('All'); }}
              className="mt-4 text-electric-cyan-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
