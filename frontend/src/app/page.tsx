"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Trophy,
  Users,
  Target,
  Star,
  Play,
  Rocket,
  Shield,
  TrendingUp,
  Award,
  User,
  Calendar,
  Zap,
  Briefcase,
  HelpCircle,
  Edit3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jobPositions, JobPosition } from "@/types/job-positions";
import { useChatStore } from "@/store/use-chat-store";

export default function HomePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    age: "",
    strengths: "",
    weaknesses: "",
    previousJob: "",
  });

  const { setUserSelection, generateWelcomeMessage, setMessages } =
    useChatStore();

  const steps = [
    { label: "Intro", active: true },
    { label: "Rule", active: false },
    { label: "Select quiz", active: false },
    { label: "Your info", active: false },
    { label: "Start test", active: false },
    { label: "Final Results", active: false },
  ];
  const handleStartInterview = () => {
    // บันทึกข้อมูลที่ผู้ใช้เลือกและกรอก
    setUserSelection({
      selectedJob: selectedJob || undefined,
      userInfo: userInfo.name ? userInfo : undefined,
    });

    // สร้างข้อความต้อนรับใหม่ตามข้อมูลที่เลือก
    const welcomeMessage = generateWelcomeMessage();
    setMessages([welcomeMessage]);

    router.push("/interview");
  };

  const renderIntroStep = () => (
    <div className="flex items-center justify-center min-h-[600px] px-8 py-12 relative">
      <div className="max-w-6xl w-full flex items-center gap-12">
        <div className="flex-1 relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f28b1b] to-[#f28b1b]/80 text-white rounded-full text-sm font-comfortaa font-bold shadow-lg">
              <Play className="h-4 w-4" />
              Gaming Mode ON!
            </div>
          </div>
          <h1 className="text-5xl font-bungee mb-6 leading-tight text-[#5c4394] relative">
            <span className="inline-block hover:animate-pulse transition-all duration-300">
              Let's try
            </span>
            <br />
            <span className="text-6xl text-[#f28b1b] drop-shadow-2xl font-audiowide bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] bg-clip-text text-transparent animate-pulse">
              HIVE AI
            </span>
            <br />
            <span className="text-4xl text-[#5c4394] font-righteous hover:scale-105 transition-transform duration-300 inline-block">
              Interview Game
            </span>
          </h1>

          {/* เพิ่ม description ที่น่าสนใจ */}
          <div className="mb-8 space-y-4">
            <div className="bg-gradient-to-r from-white/90 to-gray-50/90 rounded-2xl p-6 shadow-xl border-2 border-[#f28b1b]/20 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5c4394] to-[#7c64b4] rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  {" "}
                  <h3 className="text-lg font-comfortaa font-bold text-[#5c4394] mb-2">
                    🎯 Practice Real Interview Skills
                  </h3>
                  <p className="text-sm text-gray-600 font-comfortaa">
                    Experience realistic interview scenarios and get
                    personalized feedback to improve your performance
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-white/90 to-gray-50/90 rounded-2xl p-6 shadow-xl border-2 border-[#f28b1b]/20 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  {" "}
                  <h3 className="text-lg font-comfortaa font-bold text-[#5c4394] mb-2">
                    ⚡ AI-Powered Coaching
                  </h3>
                  <p className="text-sm text-gray-600 font-comfortaa">
                    Get instant feedback and tips from our advanced AI
                    interviewer tailored to your responses
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < 5 ? "bg-[#f28b1b]" : "bg-gray-300"
                  } animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <span className="text-sm font-comfortaa text-[#5c4394] font-semibold flex items-center gap-1">
              <Star className="h-4 w-4" />
              Level 1 Ready!
            </span>
          </div>

          <Button
            onClick={() => setCurrentStep(1)}
            className="mt-6 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] hover:from-[#ff6b1a] hover:to-[#f28b1b] text-white px-8 py-6 text-xl font-comfortaa font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-[#f28b1b]/50 border-2 border-white/20 inline-flex items-center gap-2"
          >
            <Rocket className="h-5 w-5" />
            Start Interview Game
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 relative">
          <div className="relative w-full h-96">
            {/* Animated background circles */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#f28b1b]/20 to-[#f28b1b]/5 rounded-full animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-[#5c4394]/20 to-[#5c4394]/5 rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="absolute top-10 right-20 w-16 h-16 bg-gradient-to-br from-[#5c4394] to-[#7c64b4] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Star className="h-8 w-8 text-white animate-spin slow-spin" />
            </div>
            <div className="absolute bottom-20 left-10 w-20 h-20 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer animate-bounce">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-[#5c4394] to-[#7c64b4] rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
              <Zap className="h-14 w-14 text-white animate-pulse" />
            </div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 cursor-pointer animate-pulse">
              <User className="h-10 w-10 text-white" />
            </div>

            {/* Floating particles */}
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#f28b1b] rounded-full animate-ping"></div>
            <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-[#5c4394] rounded-full animate-ping delay-500"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#f28b1b] rounded-full animate-ping delay-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRuleStep = () => (
    <div className="flex items-center justify-center min-h-[500px] px-8 pt-10">
      <div className="max-w-5xl w-full flex items-center gap-12">
        <div className="flex-1 relative">
          <div className="w-32 h-32 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-3xl flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <Play className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-[#5c4394]/20 to-transparent rounded-full animate-pulse"></div>
        </div>
        <div className="flex-2 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#5c4394]/20 relative overflow-hidden hover:shadow-3xl transition-all duration-300">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#f28b1b]/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#5c4394]/10 to-transparent"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] rounded-lg flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-4xl font-righteous text-[#5c4394] bg-gradient-to-r from-[#5c4394] to-[#7c64b4] bg-clip-text text-transparent">
                HOW TO PLAY
              </h2>
            </div>

            <div className="space-y-6 font-comfortaa">
              {[
                {
                  text: "You are the job candidate in this interview simulation game.",
                  icon: Target,
                  color: "text-[#f28b1b]",
                },
                {
                  text: "Your mission: Answer questions truthfully based on your real experiences and level up your interview skills.",
                  icon: Rocket,
                  color: "text-[#5c4394]",
                },
                {
                  text: "Answer like it's the real deal",
                  icon: Shield,
                  color: "text-[#f28b1b]",
                  subItems: [
                    "• Speak from your real-life experiences",
                    '• No need for perfect answers "just be you"',
                  ],
                },
                {
                  text: 'Click "Next" to advance through levels',
                  icon: TrendingUp,
                  color: "text-[#5c4394]",
                  subItems: [
                    "• Each stage introduces new challenges stay sharp!",
                  ],
                },
                {
                  text: "Your goal: Get ready for the real interviews and win the offer!",
                  icon: Award,
                  color: "text-[#f28b1b]",
                  strong: true,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#f28b1b]/5 hover:to-[#5c4394]/5 transition-all duration-300 group"
                >
                  <div
                    className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mt-1`}
                  >
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-lg ${
                        item.strong ? "font-bold text-[#5c4394]" : ""
                      }`}
                    >
                      {item.text}
                    </p>
                    {item.subItems && (
                      <ul className="ml-6 mt-2 space-y-1 text-gray-600">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>{subItem}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              className="mt-8 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] hover:from-[#ff6b1a] hover:to-[#f28b1b] text-white px-8 py-4 font-comfortaa font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-[#f28b1b]/50 border border-white/20"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSelectQuizStep = () => (
    <div className="px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#5c4394] to-[#7c64b4] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer mr-8">
            <Users className="h-10 w-10 text-white" />
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#f28b1b] relative overflow-hidden hover:shadow-3xl transition-all duration-300">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f28b1b]/5 via-transparent to-[#5c4394]/5 animate-pulse"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-4xl font-righteous font-black text-[#5c4394] bg-gradient-to-r from-[#5c4394] to-[#7c64b4] bg-clip-text text-transparent">
                  SELECT OPP
                </h2>
              </div>

              <div className="flex gap-2 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      i < 2 ? "bg-[#f28b1b] animate-pulse" : "bg-gray-300"
                    }`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>

              <div className="mt-4 text-sm font-comfortaa text-[#5c4394] font-semibold flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Choose your challenge!
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {jobPositions.map((job, index) => (
            <button
              key={index}
              className={`${job.color} text-white p-6 rounded-2xl font-comfortaa font-bold text-center hover:opacity-90 transition-all duration-300 transform hover:scale-105 hover:rotate-1 shadow-2xl hover:shadow-3xl relative overflow-hidden group`}
              onClick={() => {
                setSelectedJob(job);
                setCurrentStep(4);
              }}
            >
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative z-10">
                <div className="text-sm underline mb-2 group-hover:animate-pulse">
                  {job.title}
                </div>
                <div className="text-xs font-normal opacity-90">
                  {job.subtitle}
                </div>

                {/* Hover effect icon */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Star className="h-3 w-3 text-white" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-r from-[#f1e6f0] to-[#e8d5f0] rounded-2xl shadow-lg">
            <div className="mb-4 text-sm font-comfortaa text-[#5c4394] font-semibold flex items-center gap-2">
              <Play className="h-4 w-4" />
              Ready to level up?
            </div>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-gradient-to-r from-[#5c4394] to-[#7c64b4] hover:from-[#7c64b4] hover:to-[#5c4394] text-white px-8 py-4 font-comfortaa font-bold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-[#5c4394]/50 border border-white/20 inline-flex items-center gap-2"
            >
              Position Selected
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDescriptionStep = () => (
    <div className="px-8 py-12">
      <div className="max-w-4xl mx-auto">
        {selectedJob && (
          <>
            <div className="text-center mb-8 relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f28b1b]/5 via-transparent to-[#5c4394]/5 rounded-3xl animate-pulse"></div>

              <div className="relative z-10 p-8">
                {" "}
                <div className="inline-block mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-righteous font-black underline mb-2 text-[#5c4394] bg-gradient-to-r from-[#5c4394] to-[#7c64b4] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  {selectedJob.title}
                </h2>
                <p className="text-xl font-comfortaa font-bold text-[#5c4394] opacity-80">
                  {selectedJob.subtitle}
                </p>
                {/* Animated underline */}
                <div className="w-24 h-1 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] mx-auto mt-4 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border-2 border-[#f28b1b] mb-8 relative overflow-hidden hover:shadow-3xl transition-all duration-300">
              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#f28b1b]/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#5c4394]/10 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#5c4394] to-[#7c64b4] rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-comfortaa font-bold text-[#5c4394]">
                    Job Description:
                  </h3>
                </div>

                <ul className="space-y-4">
                  {selectedJob.description.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-[#f28b1b]/5 hover:to-[#5c4394]/5 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-[#f28b1b] to-[#ff6b1a] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-sm">✓</span>
                      </div>
                      <span className="text-sm leading-relaxed font-comfortaa text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-to-r from-[#f1e6f0] to-[#e8d5f0] rounded-3xl shadow-lg">
                <div className="mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl animate-bounce">🚀</span>
                    <span className="text-lg font-comfortaa text-[#5c4394] font-semibold">
                      Ready for the challenge?
                    </span>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-[#f28b1b] rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-[#5c4394] to-[#7c64b4] hover:from-[#7c64b4] hover:to-[#5c4394] text-white px-10 py-5 text-xl font-comfortaa font-bold rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-[#5c4394]/50 border-2 border-white/20"
                >
                  🎯 Next <ArrowRight className="ml-2 h-6 w-6 animate-bounce" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderYourInfoStep = () => (
    <div className="px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-r from-[#f28b1b]/10 to-[#5c4394]/10 rounded-2xl mb-4">
            <Edit3 className="h-8 w-8 text-[#5c4394]" />
          </div>
          <h2 className="text-3xl font-righteous font-black text-[#5c4394] bg-gradient-to-r from-[#5c4394] to-[#7c64b4] bg-clip-text text-transparent">
            PLEASE ANSWER THE QUESTIONS BELOW
          </h2>
          <div className="mt-4 text-sm font-comfortaa text-gray-600 flex items-center justify-center gap-2">
            <Star className="h-4 w-4" />
            Tell us about yourself to personalize your interview experience
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl border-2 border-[#f28b1b] relative overflow-hidden hover:shadow-3xl transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#f28b1b]/10 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-[#5c4394]/10 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] rounded-lg flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-comfortaa font-bold text-[#5c4394] text-lg">
                  Questions
                </h3>
              </div>

              <ul className="space-y-4 text-lg font-comfortaa">
                {[
                  { q: "What's your name?", icon: User },
                  { q: "How old are you?", icon: Calendar },
                  { q: "What's your strongest point?", icon: Zap },
                  { q: "What's your weakness point?", icon: Target },
                  {
                    q: "What were you doing in your last job?",
                    icon: Briefcase,
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#f28b1b]/5 hover:to-[#5c4394]/5 transition-all duration-300"
                  >
                    <item.icon className="h-5 w-5 text-[#5c4394]" />
                    <span>{item.q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl border-2 border-[#f28b1b] relative overflow-hidden hover:shadow-3xl transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#5c4394]/10 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-[#f28b1b]/10 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-[#5c4394] to-[#7c64b4] rounded-lg flex items-center justify-center">
                  <Edit3 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-comfortaa font-bold text-[#5c4394]">
                  Your answers:
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "name",
                    placeholder: "Your Name",
                    value: userInfo.name,
                    icon: User,
                  },
                  {
                    key: "age",
                    placeholder: "Age",
                    value: userInfo.age,
                    icon: Calendar,
                  },
                  {
                    key: "strengths",
                    placeholder: "Strengths",
                    value: userInfo.strengths,
                    icon: Zap,
                  },
                  {
                    key: "weaknesses",
                    placeholder: "Weaknesses",
                    value: userInfo.weaknesses,
                    icon: Target,
                  },
                  {
                    key: "previousJob",
                    placeholder: "Previous Job",
                    value: userInfo.previousJob,
                    icon: Briefcase,
                  },
                ].map((field, index) => (
                  <div key={field.key} className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                      <field.icon className="h-4 w-4 text-gray-400 group-hover:text-[#f28b1b] transition-colors duration-300" />
                    </div>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          [field.key]: e.target.value,
                        })
                      }
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl font-comfortaa placeholder:text-gray-400 focus:border-[#f28b1b] focus:ring-4 focus:ring-[#f28b1b]/20 transition-all duration-300 bg-white hover:shadow-lg group-hover:border-[#f28b1b]/50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#f28b1b]/5 to-[#5c4394]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="inline-block p-6 bg-gradient-to-r from-[#f1e6f0] to-[#e8d5f0] rounded-3xl shadow-lg">
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#f28b1b] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#5c4394] rounded-full animate-pulse delay-200"></div>
                <div className="w-2 h-2 bg-[#f28b1b] rounded-full animate-pulse delay-400"></div>
              </div>
              <div className="text-sm font-comfortaa text-[#5c4394] font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Ready to start your interview journey?
              </div>
            </div>
            <Button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-[#5c4394] to-[#7c64b4] hover:from-[#7c64b4] hover:to-[#5c4394] text-white px-10 py-5 text-xl font-comfortaa font-bold rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-[#5c4394]/50 border-2 border-white/20 inline-flex items-center gap-2"
            >
              <Rocket className="h-6 w-6" />
              Start Interview!
              <Trophy className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderIntroStep();
      case 1:
        return renderRuleStep();
      case 2:
        return renderSelectQuizStep();
      case 3:
        return renderYourInfoStep();
      case 4:
        return renderJobDescriptionStep();
      default:
        return renderIntroStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f1e6f0] via-[#f8f0f5] to-[#e8d5f0] relative overflow-hidden">
      {/* Enhanced Progress Bar */}
      <div className="bg-gradient-to-r from-white to-gray-50 shadow-2xl relative">
        <div className="flex relative">
          {/* Progress line animation */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] transition-all duration-700 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 py-4 px-4 text-center font-comfortaa font-bold text-white relative z-10 transition-all duration-500 transform ${
                index <= currentStep
                  ? "bg-gradient-to-r from-[#f28b1b] to-[#ff6b1a] scale-105"
                  : "bg-gradient-to-r from-[#5c4394] to-[#7c64b4] hover:scale-105"
              } ${index === 0 ? "rounded-tl-none" : ""} ${
                index === steps.length - 1 ? "rounded-tr-none" : ""
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {index <= currentStep && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center animate-bounce">
                    <Trophy className="h-3 w-3 text-[#f28b1b]" />
                  </div>
                )}
                <span className={index <= currentStep ? "animate-pulse" : ""}>
                  {step.label}
                </span>
              </div>

              {/* Step number indicator */}
              <div
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-white text-[#f28b1b] shadow-lg scale-110"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10">{renderCurrentStep()}</main>

      {/* Enhanced Decorative Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-[#f28b1b]/30 to-[#f28b1b]/10 rounded-full animate-pulse shadow-xl"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-[#5c4394]/30 to-[#5c4394]/10 rounded-full animate-bounce delay-300 shadow-lg"></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-gradient-to-br from-[#f28b1b]/20 to-[#f28b1b]/5 rounded-full animate-pulse delay-700 shadow-2xl"></div>
      <div className="absolute bottom-20 right-10 w-14 h-14 bg-gradient-to-br from-[#5c4394]/25 to-[#5c4394]/5 rounded-full animate-bounce delay-1000 shadow-xl"></div>

      {/* Additional floating particles */}
      <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#f28b1b] rounded-full animate-ping opacity-70"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#5c4394] rounded-full animate-ping delay-500 opacity-60"></div>
      <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-[#f28b1b] rounded-full animate-pulse delay-1000 opacity-50"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#f28b1b] rounded-full animate-spin slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-[#5c4394] rounded-full animate-spin reverse-spin slow"></div>
      </div>
    </div>
  );
}
