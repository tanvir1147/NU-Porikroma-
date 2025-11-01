'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Download, RefreshCw, Clock, Eye, BookOpen, GraduationCap, FileText, Menu, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';
import AdBanner from '@/components/ads/AdBanner';
import { AdSenseScript } from '@/components/ads/AdSense';


interface Notice {
  id: string;
  title: string;
  postDate: string;
  link: string;
  category: string;
  course?: string;
  year?: string;
  createdAt?: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProgram, setSelectedProgram] = useState('recent-news');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [lastUpdated, setLastUpdated] = useState<string>('');


  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/notices');
      const data = await response.json();

      if (response.ok) {
        const noticesWithNumbers = data.notices.map((notice: Notice, index: number) => ({
          ...notice,
          no: index + 1,
          course: notice.category || 'General',
          year: 'N/A'
        }));
        
        setNotices(noticesWithNumbers);
        setFilteredNotices(noticesWithNumbers);
        setPagination({
          page: 1,
          limit: 10,
          total: noticesWithNumbers.length,
          pages: Math.ceil(noticesWithNumbers.length / 10)
        });
      } else {
        toast.error('Failed to fetch notices');
      }
    } catch (error) {
      toast.error('Error fetching notices');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchNotices();
    setLastUpdated(new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    }));
  }, []);

  useEffect(() => {
    let filtered = [...notices];
    
    if (selectedProgram === 'honours') {
      filtered = filtered.filter(notice => {
        const title = notice.title.toLowerCase();
        // More inclusive filtering for honours program
        return title.includes('অনার্স') || title.includes('honours') || 
               title.includes('b.sc') || title.includes('b.a') || 
               title.includes('b.com') || title.includes('bba') ||
               title.includes('bsc') || title.includes('bss') ||
               title.includes('hon') || title.includes('বিএসসি') ||
               title.includes('বিএ') || title.includes('বিকম');
      });
    } else if (selectedProgram === 'degree') {
      filtered = filtered.filter(notice => {
        const title = notice.title.toLowerCase();
        // More inclusive filtering for degree program
        return title.includes('ডিগ্রী') || title.includes('ডিগ্রি') || 
               title.includes('degree') || title.includes('পাস') ||
               title.includes('certificate') || title.includes('ডিগ্রি') ||
               title.includes('ডিপ্লোমা') || title.includes('diploma') ||
               title.includes('ডি কম') || title.includes('d.com');
      });
    }
    // For 'recent-news', we show all notices without filtering
    // This ensures we don't miss any important notices that don't match specific keywords
    

    
    setFilteredNotices(filtered);
    setPagination(prev => ({
      ...prev,
      total: filtered.length,
      pages: Math.ceil(filtered.length / prev.limit)
    }));
  }, [selectedProgram, notices]);

  const handleViewPDF = async (pdfUrl: string, title: string) => {
    try {
      // Instant PDF opening - no loading, no intermediate page
      const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: open in current tab
        window.location.href = pdfUrl;
        return;
      }
      
      // Show success message only after opening
      setTimeout(() => {
        toast.success('PDF opened successfully');
      }, 100);
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  const handleDownloadPDF = async (pdfUrl: string, title: string) => {
    try {
      toast.info(`Downloading: ${title.substring(0, 30)}...`);
      
      // Use the download API for better compatibility
      const downloadUrl = `/api/pdf/download?url=${encodeURIComponent(pdfUrl)}`;
      
      // Create download link
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${title.substring(0, 50).replace(/[^a-zA-Z0-9\u0980-\u09FF\s]/g, '') || 'NU_Notice'}.pdf`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      
      // Add to DOM, click, and remove
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success('PDF download started');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Fallback: direct link
      try {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.info('Opening PDF directly (fallback)');
      } catch (fallbackError) {
        toast.error('Failed to download PDF');
      }
    }
  };

  const getProgramTitle = () => {
    switch (selectedProgram) {
      case 'recent-news':
        return 'সাম্প্রতিক বিজ্ঞপ্তি';
      case 'honours':
        return 'অনার্স প্রোগ্রাম';
      case 'degree':
        return 'ডিগ্রী প্রোগ্রাম';
      default:
        return 'সাম্প্রতিক বিজ্ঞপ্তি';
    }
  };

  const getProgramDescription = () => {
    switch (selectedProgram) {
      case 'recent-news':
        return 'সাম্প্রতিক বিজ্ঞপ্তি, পরীক্ষার সময়সূচী, ফলাফল এবং একাডেমিক আপডেটসমূহ';
      case 'honours':
        return 'বিএসসি, বিএ, বিকম, বিবিএ এবং অন্যান্য অনার্স প্রোগ্রাম সংক্রান্ত বিজ্ঞপ্তি';
      case 'degree':
        return 'ডিগ্রী পাস, সার্টিফিকেট এবং ডিপ্লোমা প্রোগ্রাম সংক্রান্ত বিজ্ঞপ্তি';
      default:
        return 'সাম্প্রতিক বিজ্ঞপ্তি, পরীক্ষার সময়সূচী, ফলাফল এবং একাডেমিক আপডেটসমূহ';
    }
  };

  const getProgramIcon = () => {
    switch (selectedProgram) {
      case 'recent-news':
        return <FileText className="w-6 h-6" />;
      case 'honours':
        return <GraduationCap className="w-6 h-6" />;
      case 'degree':
        return <BookOpen className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is NU Porikroma?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NU Porikroma is the official notice management system for National University Bangladesh. It provides real-time updates on exam schedules, results, admission notices, and other academic announcements."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the data updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our system automatically scrapes data from the official National University website every 4 hours to ensure you have access to the most current information. Only new notices are added to our database during each scraping cycle."
        }
      },
      {
        "@type": "Question",
        "name": "Is this an official National University website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "NU Porikroma is not the official website of National University Bangladesh, but it aggregates official notices and announcements from the university's official website for student convenience."
        }
      }
    ]
  };

  // Breadcrumbs structured data
  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nu-porikroma.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Notices",
        "item": "https://nu-porikroma.vercel.app/notices"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Exam Notices",
        "item": "https://nu-porikroma.vercel.app/exam-notices"
      }
    ]
  };

  return (
    <>
      {/* AdSense Script */}
      <AdSenseScript />
      
      <Script
        id="structured-data-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbsData),
        }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "NU Porikroma",
            "alternateName": "National University Bangladesh Notice Portal",
            "url": "https://nu-porikroma.vercel.app/",
            "description": "জাতীয় বিশ্ববিদ্যালয়ের পরীক্ষার নোটিশ, রেজাল্ট এবং সকল ধরনের একাডেমিক আপডেটস",
            "inLanguage": ["en", "bn"],
            "about": {
              "@type": "Organization",
              "name": "National University Bangladesh",
              "url": "https://www.nu.ac.bd/"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://nu-porikroma.vercel.app/?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }),
        }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqData),
        }}
      />
      <div className="min-h-screen relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900">
          <div className="absolute inset-0 bg-black/20" />
          {/* Animated floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float opacity-20"
                style={{
                  left: `${(i * 7) % 100}%`,
                  top: `${(i * 13) % 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${6 + (i % 4)}s`
                }}
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full blur-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="NU Porikroma"
                    className="w-full h-full object-cover rounded-lg sm:rounded-xl shadow-2xl ring-2 ring-white/20"
                  />
                </div>
                <h1 className="text-base sm:text-2xl font-bold text-white tracking-wide" style={{ 
                  textShadow: '0 0 10px #00E0FF',
                  fontFamily: 'var(--font-poppins)',
                  letterSpacing: '0.5px'
                }}>
                  NU Porikroma
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setSelectedProgram('recent-news')}
                  className={`text-sm font-medium transition-all duration-300 ${
                    selectedProgram === 'recent-news' 
                      ? 'text-cyan-400' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={selectedProgram === 'recent-news' ? { textShadow: '0 0 10px #00E0FF' } : {}}
                >
                  Recent Notices
                </button>
                <button
                  onClick={() => setSelectedProgram('honours')}
                  className={`text-sm font-medium transition-all duration-300 ${
                    selectedProgram === 'honours' 
                      ? 'text-cyan-400' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={selectedProgram === 'honours' ? { textShadow: '0 0 10px #00E0FF' } : {}}
                >
                  Honours
                </button>
                <button
                  onClick={() => setSelectedProgram('degree')}
                  className={`text-sm font-medium transition-all duration-300 ${
                    selectedProgram === 'degree' 
                      ? 'text-cyan-400' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={selectedProgram === 'degree' ? { textShadow: '0 0 10px #00E0FF' } : {}}
                >
                  Degree
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <ThemeToggle />
              
                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-3 pt-3 border-t border-white/10">
                <div className="flex flex-col items-center space-y-4 mb-4">
                  <div className="relative w-20 h-20 flex items-center justify-center overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="NU Porikroma"
                      className="w-full h-full object-cover rounded-2xl shadow-2xl ring-2 ring-white/20"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white">NU Porikroma</h2>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedProgram('recent-news');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedProgram === 'recent-news' 
                        ? 'bg-white/20 text-cyan-400' 
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5" />
                      <span>Recent Notices</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProgram('honours');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedProgram === 'honours' 
                        ? 'bg-white/20 text-cyan-400' 
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="w-5 h-5" />
                      <span>Honours</span>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setSelectedProgram('degree');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      selectedProgram === 'degree' 
                        ? 'bg-white/20 text-cyan-400' 
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen className="w-5 h-5" />
                      <span>Degree</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-24 pb-16 relative z-10">
          {/* Header Section */}
          <header className="text-center mb-8 sm:mb-12 animate-slide-up pt-4">
            <div className="w-full px-4">
              <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 text-glow-cyan">
                {getProgramTitle()}
              </h1>
              <p className="text-white/80 text-sm sm:text-base md:text-lg px-2">
                {getProgramDescription()}
              </p>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="flex items-center text-white/60 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Last Updated: {lastUpdated}
                </div>

              </div>
            </div>
          </header>

          {/* Animated Description Section */}
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mb-6 sm:mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden relative">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
              
              {/* Main Content */}
              <div className="relative z-10 text-center">
                <div className="animate-slide-up">
                  <div className="bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bengali-text text-white text-readable-glow leading-tight sm:leading-relaxed tracking-wide">
                      জাতীয় বিশ্ববিদ্যালয়ের পরীক্ষার নোটিশ, রেজাল্ট এবং সকল ধরনের একাডেমিক আপডেটস
                    </h2>
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-6">
                    <div className="flex items-center text-cyan-400 animate-bounce" style={{ animationDelay: '0s' }}>
                      <FileText className="w-6 h-6 mr-2" />
                      <span className="text-sm font-medium">নোটিশ</span>
                    </div>
                    <div className="flex items-center text-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }}>
                      <GraduationCap className="w-6 h-6 mr-2" />
                      <span className="text-sm font-medium">রেজাল্ট</span>
                    </div>
                    <div className="flex items-center text-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}>
                      <BookOpen className="w-6 h-6 mr-2" />
                      <span className="text-sm font-medium">আপডেটস</span>
                    </div>
                  </div>
                </div>
                

              </div>
              
              {/* Floating Animation Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-30" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-6 left-8 w-4 h-4 bg-purple-400 rounded-full animate-float opacity-20" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-50" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>

          {/* Top Ad Banner */}
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 mb-8">
            <AdBanner position="top" />
          </div>

          {/* Notices Grid */}
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            {loading ? (
              <div className="space-y-4">
                {/* Loading Skeleton */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 animate-pulse">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/20 rounded w-3/4"></div>
                        <div className="h-3 bg-white/20 rounded w-1/2"></div>
                      </div>
                      <div className="w-6 h-6 bg-white/20 rounded"></div>
                    </div>
                    <div className="flex space-x-2 mb-3">
                      <div className="h-6 bg-cyan-900/30 rounded-full w-16"></div>
                      <div className="h-6 bg-blue-900/30 rounded-full w-20"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-cyan-600/30 rounded flex-1"></div>
                      <div className="h-8 bg-white/20 rounded flex-1"></div>
                    </div>
                  </div>
                ))}
                <div className="text-center py-4">
                  <RefreshCw className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-2" />
                  <p className="text-white/80 text-sm">Loading notices...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Summary Section */}
                <div className="mb-4 sm:mb-6 text-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20 p-3 sm:p-4 inline-block">
                    <p className="text-white/80 text-xs sm:text-sm">
                      Showing <span className="text-cyan-400 font-semibold">{Math.min(pagination.page * pagination.limit, filteredNotices.length)}</span> of <span className="text-cyan-400 font-semibold">{filteredNotices.length}</span> notices
                      {selectedProgram !== 'recent-news' && (
                        <span className="text-white/60 hidden sm:inline"> • Filtered by {selectedProgram === 'honours' ? 'Honours Program' : 'Degree Program'}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 justify-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 450px))' }}>
                  {filteredNotices.slice((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit).map((notice, index) => (
                    <Card key={notice.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 sm:hover:scale-105 group h-full flex flex-col animate-slide-up w-full max-w-[450px] p-1 sm:p-2" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <CardTitle className="text-white text-sm sm:text-base md:text-lg font-medium sm:font-semibold group-hover:text-cyan-300 transition-colors duration-300 line-clamp-3 sm:line-clamp-4 leading-tight sm:leading-relaxed">
                            {notice.title.substring(0, 100)}{notice.title.length > 100 ? '...' : ''}
                          </CardTitle>
                          <div className="flex-shrink-0 text-cyan-400 mt-0.5">
                            <div className="w-4 h-4 sm:w-5 sm:h-5">
                              {getProgramIcon()}
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-white/70 flex items-center text-xs sm:text-sm mt-2 sm:mt-3">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          {notice.postDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 flex-1 flex flex-col justify-between px-3 sm:px-6 pb-3 sm:pb-6">
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-cyan-900/50 text-cyan-300">
                            {notice.category}
                          </span>
                          {notice.course && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-900/50 text-blue-300">
                              {notice.course}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 sm:space-y-3 mt-auto">
                          <div className="flex space-x-2 sm:space-x-3">
                            <Button 
                              size="sm"
                              onClick={() => handleViewPDF(notice.link, notice.title)}
                              className="flex-1 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-md hover:shadow-cyan-500/30 text-xs sm:text-sm py-2 sm:py-2.5"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">View PDF</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPDF(notice.link, notice.title)}
                              className="flex-1 border-cyan-500 text-cyan-300 hover:bg-cyan-500/20 text-xs sm:text-sm py-2 sm:py-2.5"
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Download</span>
                              <span className="sm:hidden">Save</span>
                            </Button>
                          </div>
                          
                          {/* Direct PDF link for mobile users */}
                          <div className="text-center">
                            <a 
                              href={notice.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 underline opacity-70"
                            >
                              Open PDF directly
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredNotices.length === 0 && (
                  <div className="text-center py-16">
                    <FileText className="mx-auto h-16 w-16 text-white/30 mb-4" />
                    <h3 className="text-xl font-medium text-white/80 mb-2">No notices found</h3>
                    <p className="text-white/60 mb-4">
                      No notices found for October & November 2025
                    </p>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 max-w-md mx-auto">
                      <p className="text-white/70 text-sm">
                        📅 We only show notices from October and November 2025 from the NU website.
                        <br />
                        🔄 The website may not have published any notices for these months yet.
                        <br />
                        ⏰ Try refreshing the data or check back later.
                      </p>
                    </div>
                  </div>
                )}

                {/* Middle Ad Banner */}
                {pagination.page >= 1 && filteredNotices.length > 5 && (
                  <div className="mt-12 mb-8">
                    <AdBanner position="middle" />
                  </div>
                )}

                {/* Show More Button */}
                {filteredNotices.length > pagination.page * pagination.limit && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 px-8 py-3"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Load More Notices ({filteredNotices.length - (pagination.page * pagination.limit)} remaining)
                    </Button>
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.preventDefault();
                              if (pagination.page > 1) {
                                setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                              }
                            }}
                          />
                        </PaginationItem>
                        
                        {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                          const pageNum = i + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink 
                                href="#" 
                                isActive={pagination.page === pageNum}
                                className={pagination.page === pageNum 
                                  ? "bg-cyan-500 text-white" 
                                  : "text-white/70 hover:text-white hover:bg-white/10"
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPagination(prev => ({ ...prev, page: pageNum }));
                                }}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        {pagination.pages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis className="text-white/50" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink 
                                href="#" 
                                className="text-white/70 hover:text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPagination(prev => ({ ...prev, page: pagination.pages }));
                                }}
                              >
                                {pagination.pages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            className="text-white/70 hover:text-white hover:bg-white/10"
                            onClick={(e) => {
                              e.preventDefault();
                              if (pagination.page < pagination.pages) {
                                setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                              }
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {/* Bottom Ad Banner */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
          <AdBanner position="bottom" />
        </div>

        {/* Footer */}
        <footer className="relative z-10 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="NU Porikroma"
                  className="w-full h-full object-cover rounded-xl shadow-2xl ring-2 ring-white/20"
                />
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">
                  © 2024 NU Porikroma. National University Bangladesh Notice Management System.
                </p>
                <p className="text-white/40 text-xs mt-2">
                  Built with ❤️ for students • Real-time data from nu.ac.bd
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}