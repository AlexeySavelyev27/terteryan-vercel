'use client';

import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLocale } from '../../src/contexts/LocaleContext';

export default function Contact() {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' });
  const [isMounted, setIsMounted] = useState(false);

  // Generate simple math captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    setCaptcha({ question, answer, userAnswer: '' });
  };

  // Initialize captcha on component mount
  useEffect(() => {
    setIsMounted(true);
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptcha(prev => ({
      ...prev,
      userAnswer: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate captcha
    if (parseInt(captcha.userAnswer) !== captcha.answer) {
      alert(t.contact.invalidCaptcha);
      generateCaptcha();
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after showing success message
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      generateCaptcha();
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="w-full min-h-full flex flex-col justify-start overflow-y-auto py-4 text-theme">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          {/* Success Title */}
          <h1 
            style={{
              fontFamily: 'var(--font-vollkorn), serif',
              fontSize: '48px',
              letterSpacing: '0.05em',
              textAlign: 'center',
              marginBottom: '1rem'
            }}
          >
            {t.contact.successTitle}
          </h1>
          
          {/* Success Message */}
          <p 
            style={{
              fontFamily: 'var(--font-merriweather), serif',
              fontSize: '18px',
              opacity: 0.8,
              textAlign: 'center'
            }}
          >
            {t.contact.successMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col justify-start overflow-y-auto py-4 text-theme">
      {/* Title Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 
          style={{
            fontFamily: 'var(--font-vollkorn), serif',
            fontSize: '72px',
            letterSpacing: '0.05em',
            textAlign: 'left',
            marginBottom: '-1rem',
			marginTop: '-2rem'
          }}
        >
          {t.contact.title}
        </h1>
        
        <p 
          style={{
            fontFamily: 'var(--font-merriweather), serif',
            fontSize: '24px',
            opacity: 0.8,
            textAlign: 'left',
            marginBottom: '0px'
          }}
        >
          {t.contact.subtitle}
        </p>
      </div>

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 consistent-bg"
        style={{
          width: '100%',
          padding: '1.5rem',
          //border: '1px solid rgba(0, 0, 0, 0.4)',
          borderRadius: '12px',
          zIndex: 4
        }}
      >
        {/* Name and Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium mb-2"
              style={{ 
			  fontFamily: 'var(--font-merriweather), serif',
			  }}
            >
              {t.contact.name} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-current/20 rounded-lg input-bg focus:outline-none focus:ring-2 focus:ring-current/50 transition-all"
              style={{ 
			  fontFamily: 'var(--font-merriweather), serif',
			  }}
              placeholder={t.contact.namePlaceholder}
            />
          </div>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              {t.contact.email} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-current/20 rounded-lg input-bg focus:outline-none focus:ring-2 focus:ring-current/50 transition-all"
              style={{ 
			  fontFamily: 'var(--font-merriweather), serif',
			  }}
              placeholder={t.contact.emailPlaceholder}
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label 
            htmlFor="subject" 
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            {t.contact.subject}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-current/20 rounded-lg input-bg focus:outline-none focus:ring-2 focus:ring-current/50 transition-all"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
            placeholder={t.contact.subjectPlaceholder}
          />
        </div>

        {/* Message */}
        <div>
          <label 
            htmlFor="message" 
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            {t.contact.message} *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-current/20 rounded-lg input-bg focus:outline-none focus:ring-2 focus:ring-current/50 transition-all resize-vertical"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
            placeholder={t.contact.messagePlaceholder}
          />
        </div>

        {/* Captcha */}
        <div>
          <label 
            htmlFor="captcha" 
            className="block text-sm font-medium mb-2"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            {t.contact.captcha} *
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-medium px-3 py-2 border border-current/20 rounded-lg input-bg"
                style={{ fontFamily: 'var(--font-merriweather), serif' }}
              >
                {isMounted ? captcha.question : '...'} = ?
              </span>
            </div>
            <input
              type="number"
              id="captcha"
              value={captcha.userAnswer}
              onChange={handleCaptchaChange}
              required
              className="w-24 px-3 py-2 border border-current/20 rounded-lg input-bg focus:outline-none focus:ring-2 focus:ring-current/50 transition-all text-center"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
              placeholder={t.contact.captchaPlaceholder}
            />
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-sm text-current/60 hover:text-current/80 transition-colors"
              style={{ fontFamily: 'var(--font-merriweather), serif' }}
            >
              {t.contact.refresh}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-start pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button px-8 py-3 rounded-full transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-merriweather), serif' }}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                {t.contact.sending}
              </>
            ) : (
              <>
                <Send size={16} />
                {t.contact.submit}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
