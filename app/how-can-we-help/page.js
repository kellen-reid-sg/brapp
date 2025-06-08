"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const HowCanWeHelpPage = () => {
  const [answers, setAnswers] = useState({
    goals: [],
    experience: '',
    ageGroups: [],
    level: '',
    feeling: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const questions = [
    {
      id: 'goals',
      title: 'How can we help you?',
      subtitle: 'I want to...',
      type: 'multiple',
      options: [
        { id: 'learn-coaching', text: 'Learn more about coaching', icon: '📚' },
        { id: 'better-coach', text: 'Become a better coach', icon: '🎯' },
        { id: 'practice-sessions', text: 'Create better practice sessions', icon: '⚽' },
        { id: 'exercise-ideas', text: 'Get new ideas for exercises and drills', icon: '💡' },
        { id: 'coaching-community', text: 'Join a coaching community', icon: '👥' }
      ]
    },
    {
      id: 'experience',
      title: 'How many years of coaching experience do you have?',
      subtitle: '',
      type: 'single',
      options: [
        { id: '0', text: '0', icon: '🌱' },
        { id: '1-2', text: '1-2', icon: '📈' },
        { id: '3-4', text: '3-4', icon: '📊' },
        { id: '4-5', text: '4-5', icon: '🎯' },
        { id: '5+', text: '5+', icon: '🏆' },
        { id: '10+', text: '10+', icon: '👑' }
      ]
    },
    {
      id: 'ageGroups',
      title: 'What age groups do you currently coach?',
      subtitle: '',
      type: 'multiple',
      options: [
        { id: 'U5', text: 'U5', icon: '👶' },
        { id: 'U5-U8', text: 'U5-U8', icon: '🧒' },
        { id: 'U8-U10', text: 'U8-U10', icon: '👦' },
        { id: 'U10-U12', text: 'U10-U12', icon: '👧' },
        { id: 'U12-U15', text: 'U12-U15', icon: '🧑' },
        { id: 'U15+', text: 'U15+', icon: '👨' }
      ]
    },
    {
      id: 'level',
      title: 'What level are you currently coaching at?',
      subtitle: '',
      type: 'single',
      options: [
        { id: 'recreational', text: 'Recreational', icon: '🎪' },
        { id: 'middle-school', text: 'Middle School', icon: '🎓' },
        { id: 'high-school', text: 'High School', icon: '🏫' },
        { id: 'select-club', text: 'Select Club', icon: '⭐' },
        { id: 'academy', text: 'Academy', icon: '🏛️' }
      ]
    },
    {
      id: 'feeling',
      title: 'How do you feel about your coaching today?',
      subtitle: '',
      type: 'single',
      options: [
        { id: 'great', text: 'Great', icon: '😊' },
        { id: 'good', text: 'Good', icon: '🙂' },
        { id: 'neutral', text: 'Neutral', icon: '😐' },
        { id: 'not-good', text: 'Not good', icon: '😕' },
        { id: 'bad', text: 'Bad', icon: '😞' }
      ]
    }
  ];

  const handleOptionToggle = (questionId, optionId, isMultiple) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = {
          ...prev,
          [questionId]: currentAnswers.includes(optionId)
            ? currentAnswers.filter(id => id !== optionId)
            : [...currentAnswers, optionId]
        };
        
        // Auto-advance for first question (goals) even though it's multiple choice
        if (questionId === 'goals' && !currentAnswers.includes(optionId)) {
          setTimeout(() => {
            if (currentStep < questions.length) {
              setCurrentStep(currentStep + 1);
            }
          }, 300);
        }
        
        return newAnswers;
      } else {
        const newAnswers = {
          ...prev,
          [questionId]: optionId
        };
        
        // Auto-advance to next question for single select
        setTimeout(() => {
          if (currentStep < questions.length) {
            setCurrentStep(currentStep + 1);
          }
        }, 300);
        
        return newAnswers;
      }
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isQuestionAnswered = (questionId, type) => {
    const answer = answers[questionId];
    if (type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    } else {
      return answer && answer.length > 0;
    }
  };

  const getCurrentQuestion = () => {
    return questions[currentStep - 1];
  };

  const allQuestionsAnswered = () => {
    return questions.every(q => isQuestionAnswered(q.id, q.type));
  };

  const handleContinue = () => {
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    router.push('/signup');
  };

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="bg-green-800 text-white shadow-md border-b-2 border-green-600">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            <Link href="/" className="flex items-center border-0 outline-none no-underline">
              <span className="br-main-heading text-2xl br-logo">The Boot Room</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-10 px-4">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Boot Room Title */}
          <div style={{marginBottom: '3rem', textAlign: 'center'}}>
            <h1 style={{
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              fontSize: '3rem',
              fontWeight: '900',
              fontStyle: 'italic',
              color: 'transparent',
              WebkitTextStroke: '2px white',
              textStroke: '2px white',
              letterSpacing: '-0.01em',
              transform: 'skew(-5deg)',
              display: 'inline-block',
              textTransform: 'uppercase',
              marginBottom: '0'
            }}>The Boot Room</h1>
          </div>

          {/* Questions Container */}
          <div style={{
            backgroundColor: 'rgba(40, 40, 40, 0.95)',
            borderRadius: '24px',
            padding: '48px 40px',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}>
            {/* Back Arrow - positioned relative to container */}
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0',
                  transition: 'opacity 0.2s ease',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                ←
              </button>
            )}
            {/* Render Current Question Only */}
            {(() => {
              const question = getCurrentQuestion();
              if (!question) return null;
              
              const isAnswered = isQuestionAnswered(question.id, question.type);
              const currentAnswer = answers[question.id];
              const questionIndex = currentStep - 1;
              
              return (
                <div key={question.id} style={{marginBottom: '2rem'}}>
                  <h2 style={{
                    fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
                    color: 'white',
                    fontSize: questionIndex === 0 ? '2rem' : '1.5rem',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    marginTop: '0'
                  }}>{question.title}</h2>

                  {question.subtitle && (
                    <p style={{
                      color: '#d1d5db',
                      fontSize: '1.2rem',
                      textAlign: 'left',
                      marginBottom: '2rem',
                      fontStyle: 'italic'
                    }}>{question.subtitle}</p>
                  )}

                  {/* Options */}
                  <div style={{marginBottom: '2rem'}}>
                    {question.options.map((option) => {
                      const isSelected = question.type === 'multiple' 
                        ? (currentAnswer || []).includes(option.id)
                        : currentAnswer === option.id;
                      
                      return (
                        <div
                          key={option.id}
                          onClick={() => handleOptionToggle(question.id, option.id, question.type === 'multiple')}
                          style={{
                            backgroundColor: isSelected 
                              ? 'rgba(22, 163, 74, 0.3)' 
                              : 'rgba(60, 60, 60, 0.8)',
                            border: isSelected 
                              ? '2px solid #16a34a' 
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '16px 20px',
                            marginBottom: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{
                            fontSize: '1.5rem',
                            marginRight: '16px'
                          }}>{option.icon}</span>
                          <span style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '500'
                          }}>{option.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Show "Next" button only for age groups question (multiple choice, but not goals) */}
                  {question.type === 'multiple' && question.id === 'ageGroups' && isAnswered && currentStep < questions.length && (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontStyle: 'italic',
                        marginBottom: '1rem'
                      }}
                    >
                      Next
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Continue Button - only show when all questions answered */}
            {allQuestionsAnswered() && (
              <button
                onClick={handleContinue}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontStyle: 'italic',
                  transition: 'all 0.2s ease'
                }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowCanWeHelpPage;
