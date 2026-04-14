import './style.css'

const app = document.querySelector('#app')

const modules = [
  {
    id: 'listening',
    name: '🎧 Listening Comprehension',
    desc: 'Improve your English ear with audio exercises',
    icon: 'headphones',
    color: '#818cf8',
    progress: 65
  },
  {
    id: 'extempore',
    name: '🎤 Extempore Speaking',
    desc: 'Practice impromptu speaking on random topics',
    icon: 'mic',
    color: '#a78bfa',
    progress: 40
  },
  {
    id: 'phonetics',
    name: '🗣️ Phonetics Practice',
    desc: 'Master pronunciation and word sounds',
    icon: 'audio-lines',
    color: '#fb7185',
    progress: 82
  },
  {
    id: 'dialogue',
    name: '✍️ Dialogue Writing',
    desc: 'Build real-world conversation scenarios',
    icon: 'message-square-text',
    color: '#22d3ee',
    progress: 25
  },
  {
    id: 'discussion',
    name: '💬 Group Discussion',
    desc: 'Interactive debate and discussion sessions',
    icon: 'users',
    color: '#34d399',
    progress: 10
  }
]

let currentScreen = 'dashboard'
let listeningScore = null
let selectedAnswers = [null, null, null]

// Global state for live simulation
let isDiscussionRunning = false;
let discussionTopicIndex = 1; // Default to Environment & Climate
let mockDiscussionMessages = [
  { sender: 'Alex', text: 'I think AI will definitely transform education by providing personalized learning paths for every student.', time: '10:02 AM', color: '#818cf8' },
  { sender: 'Sarah', text: 'True, but we must also consider the digital divide. Not all students have equal access to this technology.', time: '10:05 AM', color: '#fb7185' },
  { sender: 'James', text: 'Integrating AI correctly requires a massive overhaul of our current teaching methodologies.', time: '10:09 AM', color: '#34d399' }
];

const listeningQuestions = [
  {
    q: "What is the primary reason for the software delay?",
    options: ["Budget constraints", "Server migration issues", "Lack of UI/UX designers", "New security requirements"],
    correct: 1
  },
  {
    q: "Who is responsible for the final deployment?",
    options: ["Project Manager", "Lead Developer", "QA Engineer", "Cloud Operations Team"],
    correct: 3
  },
  {
    q: "When is the new deadline set?",
    options: ["Friday evening", "Next Monday morning", "End of the month", "TBA"],
    correct: 1
  }
]

function render() {
  app.innerHTML = `
    <div class="app-layout" style="display: flex; height: 100vh; width: 100vw; overflow: hidden; background: transparent;">
      
      <!-- Sidebar -->
      <aside class="sidebar" style="width: 280px; background: rgba(255,255,255,0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; flex-shrink: 0; z-index: 50;">
        <div style="padding: 24px 32px; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; gap: 14px; height: 90px; flex-shrink: 0;">
           <div style="width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), #4f46e5); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px -4px rgba(49, 46, 129, 0.4);">
              <i data-lucide="sparkles" style="color: white; width: 20px; height: 20px;"></i>
           </div>
           <div style="font-size: 20px; font-weight: 900; color: var(--text); letter-spacing: -0.5px; line-height: 1.1;">Smart Lab</div>
        </div>
        
        <nav class="sidebar-nav">
          <div class="sidebar-item ${currentScreen === 'dashboard' ? 'active' : ''}" onclick="navigateTo('dashboard')">
             <i data-lucide="layout-grid"></i> Dashboard
          </div>
          <div class="sidebar-item ${currentScreen === 'listening' ? 'active' : ''}" onclick="navigateTo('listening')">
             <i data-lucide="headphones"></i> Listening
          </div>
          <div class="sidebar-item ${currentScreen === 'extempore' ? 'active' : ''}" onclick="navigateTo('extempore')">
             <i data-lucide="mic"></i> Speaking
          </div>
          <div class="sidebar-item ${currentScreen === 'dialogue' ? 'active' : ''}" onclick="navigateTo('dialogue')">
             <i data-lucide="pen-tool"></i> Writing
          </div>
          <div class="sidebar-item ${currentScreen === 'progress' ? 'active' : ''}" onclick="navigateTo('progress')">
             <i data-lucide="bar-chart-2"></i> Progress
          </div>
        </nav>
      </aside>

      <!-- Main Layout -->
      <div class="main-wrapper" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background: transparent;">
        <!-- Topbar -->
        <header class="topbar" style="height: 80px; background: rgba(255,255,255,0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid var(--glass-border); padding: 0 48px; display: flex; justify-content: center; z-index: 40; flex-shrink: 0;">
           <div style="width: 100%; max-width: 1200px; display: flex; justify-content: space-between; align-items: center;">
             <div style="font-size: 20px; font-weight: 800; color: var(--text);">
               ${currentScreen === 'dashboard' ? 'Overview' : currentScreen === 'progress' ? 'My Progress' : modules.find(m => m.id === currentScreen)?.name.replace(/[^a-zA-Z ]/g, "").trim() || 'Module'}
             </div>
             
             <div style="display: flex; align-items: center; gap: 20px;">
                <div style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: var(--glass-border); color: var(--text-muted);">
                   <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; cursor: pointer; background: var(--glass-border); padding: 6px 16px 6px 6px; border-radius: 30px;">
                   <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center;">
                     <i data-lucide="user" style="width: 18px; height: 18px;"></i>
                   </div>
                   <span style="font-size: 14px; font-weight: 700; color: var(--text);">Student</span>
                </div>
             </div>
           </div>
        </header>

        <!-- Content Area -->
        <main id="main-content" style="flex: 1; overflow-y: auto; padding: 48px; display: flex; flex-direction: column; align-items: center;">
           <div style="width: 100%; max-width: 1200px; padding-bottom: 64px;">
              ${currentScreen === 'dashboard' ? getDashboardHTML() : currentScreen === 'progress' ? getProgressHTML() : getModuleHTML(currentScreen)}
           </div>
        </main>
      </div>
    </div>
  `

  lucide.createIcons()
}

function getDashboardHTML() {
  return `
    <div class="dashboard-content fade-in" style="display: flex; flex-direction: column; gap: 40px;">
      <header class="app-header" style="display: flex; flex-direction: column; gap: 32px; padding: 0;">
        
        <!-- Hero Section -->
        <div style="background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%); border-radius: 28px; padding: 48px 56px; color: white; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.4); position: relative; overflow: hidden; margin-bottom: 8px;">
          <div style="position: absolute; right: -20px; top: -50px; opacity: 0.15; font-size: 280px; pointer-events: none; transform: rotate(-10deg);">
            🚀
          </div>
          
          <div style="z-index: 1; max-width: 60%;">
            <h1 style="font-size: 42px; font-weight: 800; margin-bottom: 12px; line-height: 1.2; letter-spacing: -1px; color: white;">Master Communication Skills 🚀</h1>
            <p style="font-size: 18px; color: rgba(255,255,255,0.9); margin-bottom: 32px; font-weight: 500;">Practice speaking, listening and writing in one place.</p>
            <button onclick="navigateTo('listening')" style="background: white; color: #3b82f6; border: none; padding: 18px 36px; border-radius: 99px; font-size: 16px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 12px; box-shadow: 0 10px 24px rgba(0,0,0,0.15); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);" onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 16px 32px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 10px 24px rgba(0,0,0,0.15)';">
               <i data-lucide="play" style="fill: currentColor; width: 22px;"></i> Start Practice
            </button>
          </div>
          
          <div style="z-index: 1; display: flex; align-items: center; justify-content: center; width: 160px; height: 160px; background: rgba(255,255,255,0.15); border: 4px solid rgba(255,255,255,0.25); backdrop-filter: blur(12px); border-radius: 50%; box-shadow: 0 16px 40px rgba(0,0,0,0.15);">
             <i data-lucide="mic" style="width: 72px; height: 72px; color: white;"></i>
          </div>
        </div>

        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 4px; line-height: 1.25; letter-spacing: -0.5px;">Welcome back, Student 👋</h2>
          <p style="color: var(--text-muted); font-size: 16px; font-weight: 500;">Here's an overview of your productivity today.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
          <!-- Stat Card 1 -->
          <div style="background: var(--surface); border: 1px solid var(--glass-border); border-radius: 20px; padding: 24px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 20px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
             <div style="width: 64px; height: 64px; border-radius: 16px; background: rgba(99, 102, 241, 0.1); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
               <i data-lucide="book-open" style="width: 28px; height: 28px;"></i>
             </div>
             <div style="display: flex; flex-direction: column; justify-content: center;">
               <div style="font-size: 32px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1;">14</div>
               <div style="font-size: 14px; font-weight: 600; color: var(--text-muted); margin-top: 4px;">Lessons Completed</div>
             </div>
          </div>

          <!-- Stat Card 2 -->
          <div style="background: var(--surface); border: 1px solid var(--glass-border); border-radius: 20px; padding: 24px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 20px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
             <div style="width: 64px; height: 64px; border-radius: 16px; background: rgba(244, 63, 94, 0.1); color: #f43f5e; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
               <i data-lucide="clock" style="width: 28px; height: 28px;"></i>
             </div>
             <div style="display: flex; flex-direction: column; justify-content: center;">
               <div style="font-size: 32px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1;">2h 15m</div>
               <div style="font-size: 14px; font-weight: 600; color: var(--text-muted); margin-top: 4px;">Practice Time</div>
             </div>
          </div>

          <!-- Stat Card 3 -->
          <div style="background: var(--surface); border: 1px solid var(--glass-border); border-radius: 20px; padding: 24px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.03); display: flex; align-items: center; gap: 20px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
             <div style="width: 64px; height: 64px; border-radius: 16px; background: rgba(16, 185, 129, 0.1); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
               <i data-lucide="target" style="width: 28px; height: 28px;"></i>
             </div>
             <div style="display: flex; flex-direction: column; justify-content: center;">
               <div style="font-size: 32px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1;">850</div>
               <div style="font-size: 14px; font-weight: 600; color: var(--text-muted); margin-top: 4px;">Average Score</div>
             </div>
          </div>
        </div>
      </header>

      <!-- Daily Challenge Banner -->
      <section style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); border-radius: 24px; padding: 32px 40px; display: flex; align-items: center; justify-content: space-between; color: white; box-shadow: 0 20px 40px -10px rgba(239, 68, 68, 0.3); position: relative; overflow: hidden; margin-bottom: 8px;">
         <div style="position: absolute; right: 10%; top: -30px; font-size: 160px; opacity: 0.1; pointer-events: none; transform: rotate(15deg);">🔥</div>
         
         <div style="display: flex; align-items: center; gap: 32px; z-index: 1; flex: 1;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 8px 16px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.4);">
              <i data-lucide="flame" style="width: 40px; height: 40px; color: white;"></i>
            </div>
            <div style="flex: 1; max-width: 600px;">
              <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,0.9); margin-bottom: 8px;">Daily Challenge</div>
              <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 16px; line-height: 1.2;">Complete 1 Listening + 1 Speaking</h2>
              <div style="display: flex; align-items: center; gap: 16px;">
                 <div style="flex: 1; height: 8px; background: rgba(0,0,0,0.2); border-radius: 4px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                    <div style="width: 50%; height: 100%; background: white; border-radius: 4px;"></div>
                 </div>
                 <span style="font-size: 14px; font-weight: 700;">1/2 Tasks</span>
              </div>
            </div>
         </div>
         
         <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 16px; z-index: 1;">
            <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 800; border: 1px solid rgba(255,255,255,0.3);">
              🎁 Earn +10 XP
            </div>
            <button onclick="navigateTo('listening')" style="background: white; color: #ef4444; border: none; padding: 14px 28px; border-radius: 99px; font-size: 15px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 8px 16px rgba(0,0,0,0.15); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
               Start Now <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
         </div>
      </section>

      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
           <div class="section-title" style="font-size: 20px; font-weight: 800; color: var(--text);">Learning Modules</div>
           <div style="font-size: 14px; color: var(--primary); font-weight: 700; cursor: pointer;">View All</div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px; align-items: stretch;">
          ${modules.map((m, index) => {
            let recommendedStyle = index === 1 ? '; transform: scale(1.02);' : '';
            return `
            <div class="module-card fade-in" style="display: flex; flex-direction: column; align-items: flex-start; text-align: left; animation-delay: ${index * 0.1}s; padding: 32px; border-radius: 28px; box-shadow: 0 16px 40px -10px ${m.color}15; border: 1px solid ${m.color}33; background: linear-gradient(180deg, var(--surface) 0%, ${m.color}08 100%); position: relative; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);${recommendedStyle}" onmouseover="if(${index}!==1)this.style.transform='translateY(-6px) scale(1.02)'; this.style.boxShadow='0 24px 50px -12px ${m.color}40'; this.style.borderColor='${m.color}66';" onmouseout="this.style.transform='${index===1?'scale(1.02)':'translateY(0) scale(1)'}'; this.style.boxShadow='0 16px 40px -10px ${m.color}15'; this.style.borderColor='${m.color}33';" onclick="navigateTo('${m.id}')">
              
              ${index === 1 ? `<div style="background: ${m.color}; color: white; padding: 6px 14px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; position: absolute; top: -14px; right: 32px; box-shadow: 0 8px 16px ${m.color}66; z-index: 10;">⭐ Recommended</div>` : ''}
              
              <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 24px;">
                <div class="icon-container" style="background: ${m.color}1a; color: ${m.color}; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);">
                  <i data-lucide="${m.icon}" style="width: 28px; height: 28px;"></i>
                </div>
                
                <div style="position: relative; width: 56px; height: 56px; border-radius: 50%; background: conic-gradient(${m.color} ${m.progress}%, ${m.color}22 0); display: flex; align-items: center; justify-content: center;">
                   <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: ${m.color}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                      ${m.progress}%
                   </div>
                </div>
              </div>
              
              <div class="module-info" style="display: flex; flex-direction: column; gap: 8px; width: 100%; height: 100%;">
                <div class="module-name" style="font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; line-height: 1.2;">${m.name}</div>
                <div class="module-desc" style="font-size: 15px; color: var(--text-muted); line-height: 1.6; font-weight: 500;">${m.desc}</div>
                
                <div style="margin-top: auto; padding-top: 24px; display: flex; align-items: center; justify-content: flex-end; gap: 8px; color: ${m.color}; font-size: 14px; font-weight: 700;">
                  Start Module <i data-lucide="arrow-right" style="width: 16px;"></i>
                </div>
              </div>
            </div>
          `}).join('')}
        </div>
      </section>
    </div>
  `
}

function getProgressHTML() {
  return `
    <div class="fade-in" style="margin-bottom: 32px;">
      <p style="color: var(--text-muted); font-size: 16px;">Review your overall performance and scores.</p>
    </div>
    <div class="placeholder-card fade-in" style="padding: 32px; text-align: left; align-items: flex-start; gap: 32px; width: 100%; border-radius: 24px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.05); background: var(--surface); border: 1px solid var(--glass-border); display: flex; flex-direction: column;">
      
      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 12px;"><i data-lucide="headphones" style="width: 20px; color: var(--primary);"></i> Listening Comprehension</span>
          <span style="color: var(--primary); font-weight: 800; font-size: 16px;">85%</span>
        </div>
        <div class="progress-bar-mini" style="height: 12px; background: var(--glass-border); border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
          <div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, #818cf8, var(--primary)); height: 100%; border-radius: 6px;"></div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 500;">Attempts: 3 &nbsp;|&nbsp; Last Score: 3/3</div>
      </div>

      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 12px;"><i data-lucide="audio-lines" style="width: 20px; color: #f43f5e;"></i> Phonetics Mastery</span>
          <span style="color: #f43f5e; font-weight: 800; font-size: 16px;">92%</span>
        </div>
        <div class="progress-bar-mini" style="height: 12px; background: var(--glass-border); border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
          <div class="progress-fill" style="width: 92%; background: linear-gradient(90deg, #fb7185, #f43f5e); height: 100%; border-radius: 6px;"></div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 500;">Attempts: 5 &nbsp;|&nbsp; Last Score: 9/10</div>
      </div>
      
      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span style="font-weight: 700; font-size: 16px; display: flex; align-items: center; gap: 12px;"><i data-lucide="book-check" style="width: 20px; color: #10b981;"></i> Advanced Vocabulary</span>
          <span style="color: #10b981; font-weight: 800; font-size: 16px;">70%</span>
        </div>
        <div class="progress-bar-mini" style="height: 12px; background: var(--glass-border); border-radius: 6px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
          <div class="progress-fill" style="width: 70%; background: linear-gradient(90deg, #34d399, #10b981); height: 100%; border-radius: 6px;"></div>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); margin-top: 8px; font-weight: 500;">Attempts: 2 &nbsp;|&nbsp; Last Score: 7/10</div>
      </div>
      
    </div>

    <div class="fade-in" style="animation-delay: 0.2s; margin-top: 40px;">
      <h3 style="margin-bottom: 24px; font-size: 20px; font-weight: 800;">Activity Chart</h3>
      <div style="display: flex; align-items: flex-end; justify-content: space-between; height: 180px; background: var(--surface); border: 1px solid var(--glass-border); border-radius: 24px; padding: 32px 24px 16px; gap: 16px; box-shadow: 0 12px 30px -10px rgba(0,0,0,0.05);">
        ${[40, 70, 45, 90, 60, 80, 50].map((h, i) => `
          <div style="display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 1; height: 100%; justify-content: flex-end;">
             <div style="width: 100%; max-width: 32px; height: ${h}%; background: linear-gradient(180deg, var(--primary), rgba(99, 102, 241, 0.15)); border-radius: 8px; box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2); transition: height 1s ease-out;"></div>
             <span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function getModuleHTML(id) {
  const module = modules.find(m => m.id === id)
  
  return `
    <div class="fade-in" style="display: flex; flex-direction: column; gap: 32px;">
      <header style="display: flex; align-items: center; gap: 24px;">
         <div style="width: 64px; height: 64px; background: linear-gradient(135deg, ${module.color}33, ${module.color}11); color: ${module.color}; border-radius: 16px; display: flex; align-items: center; justify-content: center; border: 1px solid ${module.color}44;">
            <i data-lucide="${module.icon}" style="width: 32px; height: 32px;"></i>
         </div>
         <div>
           <div style="font-size: 28px; font-weight: 800; color: var(--text);">${module.name}</div>
           <div style="font-size: 16px; color: var(--text-muted); font-weight: 500; margin-top: 4px;">${module.desc}</div>
         </div>
      </header>
      <div class="module-content" style="padding: 0;">
        ${(() => {
          switch(id) {
    case 'listening':
      if (listeningScore !== null) {
        return `
          <div class="result-card fade-in">
            <div class="score-circle">
               <span class="score-text">${listeningScore}/3</span>
               <span class="score-label">Points</span>
            </div>
            <h3>Practice Complete!</h3>
            <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">You've successfully completed the Listening Practice module.</p>
            <button class="btn btn-primary" onclick="resetListening()">Try Again</button>
            <button class="btn btn-outline" style="margin-top: 10px;" onclick="navigateTo('dashboard')">Back to Dashboard</button>
          </div>
        `
      }
      return `
        <div class="fade-in" style="max-width: 800px; margin: 0 auto; margin-bottom: 40px;">
          <!-- Advanced Audio Player Card -->
          <div style="display: flex; gap: 32px; align-items: center; background: var(--surface); padding: 32px; border-radius: 32px; border: 1px solid var(--glass-border); box-shadow: 0 24px 50px -12px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
            
            <!-- Abstract Album Art -->
            <div style="width: 140px; height: 140px; border-radius: 20px; background: linear-gradient(135deg, #a855f7, #3b82f6); box-shadow: 0 16px 32px -8px rgba(59, 130, 246, 0.5); display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; overflow: hidden;">
              <div style="position: absolute; width: 200%; height: 200%; background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 60%); top: -50%; left: -50%; animation: spin 10s linear infinite;"></div>
              <i data-lucide="headphones" style="color: white; width: 56px; height: 56px; position: relative; z-index: 1;"></i>
            </div>
            
            <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
               <!-- Track Metadata -->
               <div>
                 <div style="font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Now Playing</div>
                 <h3 style="font-size: 24px; font-weight: 800; color: var(--text); line-height: 1.2; letter-spacing: -0.5px;">Advanced Business Negotiation</h3>
                 <div style="font-size: 15px; font-weight: 500; color: var(--text-muted); margin-top: 4px;">Speaker: Sarah Jenkins</div>
               </div>
               
               <!-- Scrubbing / Progress Area -->
               <div style="display: flex; flex-direction: column; gap: 8px;">
                 <div style="width: 100%; height: 6px; background: var(--glass-border); border-radius: 3px; position: relative; cursor: pointer;" onmouseover="this.querySelector('.audio-thumb').style.transform='scale(1.2)'" onmouseout="this.querySelector('.audio-thumb').style.transform='scale(1)'">
                    <div style="position: absolute; top: 0; left: 0; width: 35%; height: 100%; background: var(--primary); border-radius: 3px; box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);"></div>
                    <div class="audio-thumb" style="position: absolute; top: -6px; left: 35%; width: 18px; height: 18px; background: white; border: 2px solid var(--primary); border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.15); transition: transform 0.2s;"></div>
                 </div>
                 <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 600; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                    <span>0:45</span>
                    <span>3:12</span>
                 </div>
               </div>
               
               <!-- Media Controls -->
               <div style="display: flex; align-items: center; justify-content: center; gap: 32px;">
                 <i data-lucide="skip-back" style="width: 24px; height: 24px; color: var(--text-muted); cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'"></i>
                 
                 <div id="audio-play-btn" style="width: 56px; height: 56px; background: var(--text); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 8px 16px rgba(0,0,0,0.15); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onmousedown="this.style.transform='scale(0.95)'" onclick="window.toggleListeningAudio()">
                    <i id="audio-play-icon" data-lucide="play" style="color: var(--surface); width: 24px; height: 24px; fill: currentColor; margin-left: 3px;"></i>
                 </div>
                 
                 <i data-lucide="skip-forward" style="width: 24px; height: 24px; color: var(--text-muted); cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'"></i>
               </div>
            </div>
          </div>
        </div>

        <div class="questions-container" style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 30px; max-width: 800px; margin-left: auto; margin-right: auto;">
          ${listeningQuestions.map((q, qIndex) => `
            <div class="question-block fade-in" style="animation-delay: ${qIndex * 0.15}s">
              <h4 style="margin-bottom: 12px; font-size: 16px; color: var(--text);">${qIndex + 1}. ${q.q}</h4>
              <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                ${q.options.map((opt, optIndex) => `
                  <button class="option-btn ${selectedAnswers[qIndex] === optIndex ? 'selected' : ''}" 
                          onclick="selectOption(${qIndex}, ${optIndex})">
                    <span class="option-indicator">${String.fromCharCode(65 + optIndex)}</span>
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary fade-in" style="margin-top: auto; border-radius: 20px;" onclick="submitListening()">Submit Answers</button>
      `
    case 'extempore':
      return `
        <div class="placeholder-card fade-in" style="background: var(--surface); padding: 56px 24px; text-align: center; gap: 24px; border: 1px solid var(--glass-border); width: 100%; max-width: 800px; margin: 0 auto; border-radius: 32px; box-shadow: 0 24px 50px -12px rgba(0,0,0,0.05);">
          
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
            <div class="card-badge" style="background: rgba(167, 139, 250, 0.15); color: #a78bfa; margin-bottom: 24px;">Topic</div>
            <h2 style="font-size: 32px; font-weight: 800; color: var(--text); line-height: 1.3; max-width: 600px;">"How digital nomads are redefining the traditional office space."</h2>
          </div>
          
          <div style="width: 100%; height: 1px; background: linear-gradient(90deg, transparent, var(--glass-border), transparent); margin: 40px 0;"></div>
          
          <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
             <!-- Timer Display -->
             <div id="recording-timer" style="font-size: 56px; font-weight: 900; color: var(--text); font-variant-numeric: tabular-nums; letter-spacing: -2px;">00:00</div>
             
             <!-- Record Button with pulsing glow -->
             <div class="record-wrapper" style="position: relative; padding: 20px; display: flex; align-items: center; justify-content: center;">
               <!-- Outer Glow Rings -->
               <div id="recording-glow-1" style="position: absolute; inset: 0; border-radius: 50%; background: #fb7185; opacity: 0.15; animation: pulseGlow 2s infinite cubic-bezier(0.4, 0, 0.6, 1);"></div>
               <div id="recording-glow-2" style="position: absolute; inset: 12px; border-radius: 50%; background: #fb7185; opacity: 0.25; animation: pulseGlow 2s infinite cubic-bezier(0.4, 0, 0.6, 1); animation-delay: 0.2s;"></div>
               
               <!-- Main Button -->
               <div id="recording-btn" style="position: relative; z-index: 2; width: 110px; height: 110px; background: linear-gradient(135deg, #fb7185, #e11d48); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 16px 32px rgba(225, 29, 72, 0.4); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); border: 4px solid white;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1.05)'" onclick="window.toggleExtemporeRecording()">
                 <i id="recording-btn-icon" data-lucide="mic" style="color: white; width: 48px; height: 48px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));"></i>
               </div>
             </div>

             <div id="recording-instruction" style="font-size: 22px; font-weight: 800; color: #e11d48; margin-top: 8px;">Tap to start recording</div>
             <p style="text-align: center; font-size: 16px; color: var(--text-muted); font-weight: 500;">Speak clearly into your microphone for at least 2 minutes.</p>
             
             <!-- Live Transcript Box -->
             <div id="extempore-transcript" style="width: 100%; min-height: 120px; background: rgba(0,0,0,0.02); border: 1px solid var(--glass-border); border-radius: 16px; margin-top: 24px; padding: 24px; text-align: left; font-size: 16px; line-height: 1.6; color: var(--text); opacity: 0; transition: opacity 0.4s; overflow-y: auto;">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 8px; letter-spacing: 1px;">Live Transcript</div>
                <span id="extempore-text" style="color: var(--text-muted);"></span><span id="extempore-interim" style="color: var(--text);"></span>
             </div>
          </div>
        </div>
        
        <style>
          @keyframes pulseGlow {
            0% { transform: scale(0.8); opacity: 0.6; }
            50% { opacity: 0.15; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        </style>
      `
    case 'phonetics':
      return `
        <div class="fade-in" style="margin-bottom: 20px; text-align: center;">
          <h2 style="font-size: 26px; font-weight: 700; background: linear-gradient(135deg, var(--accent), #fb7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Phonetics Lab</h2>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Master the basic vowel sounds</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
          ${[
            { letter: 'A', symbol: '/æ/', label: 'Short A', example: 'cat, apple' },
            { letter: 'E', symbol: '/ɛ/', label: 'Short E', example: 'bed, pen' },
            { letter: 'I', symbol: '/ɪ/', label: 'Short I', example: 'sit, pin' },
            { letter: 'O', symbol: '/ɒ/', label: 'Short O', example: 'hot, top' },
            { letter: 'U', symbol: '/ʌ/', label: 'Short U', example: 'cup, sun' }
          ].map((snd, idx) => `
            <div class="placeholder-card fade-in" style="padding: 20px 16px; gap: 12px; animation-delay: ${idx * 0.1}s; border-color: rgba(244, 63, 94, 0.2); background: linear-gradient(180deg, var(--glass) 0%, rgba(244, 63, 94, 0.03) 100%); ${idx === 4 ? 'grid-column: span 2;' : ''}">
              <div style="font-size: 32px; font-weight: 800; color: var(--accent); line-height: 1;">${snd.symbol}</div>
              <div style="text-align: center;">
                <div style="font-weight: 600; font-size: 15px; color: var(--text);">${snd.letter} - ${snd.label}</div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">e.g. ${snd.example}</div>
              </div>
              <button class="btn btn-primary" onclick="window.playPhonetic('${snd.example.split(', ')[0]}')" style="background: rgba(244, 63, 94, 0.15); color: var(--accent); box-shadow: none; width: 44px; height: 44px; border-radius: 50%; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(244, 63, 94, 0.3); transition: all 0.3s; cursor: pointer;">
                <i data-lucide="play" style="width: 20px; height: 20px; fill: var(--accent);"></i>
              </button>
            </div>
          `).join('')}
        </div>
      `
    case 'dialogue':
      return `
        <div class="fade-in" style="margin-bottom: 20px; text-align: center;">
          <h2 style="font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #06b6d4, #67e8f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">✍️ Dialogue Writing</h2>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px; font-weight: 500;">Practice real-world conversations</p>
        </div>
        
        <div class="placeholder-card fade-in" style="padding: 24px; text-align: left; align-items: flex-start; gap: 16px; border-color: rgba(6, 182, 212, 0.2); background: var(--surface);">
          <div style="width: 100%;">
            <div class="card-badge" style="background: rgba(34, 211, 238, 0.15); color: #0891b2;">Topic</div>
            <h3 style="margin-top: 12px; font-size: 18px; color: var(--text); font-weight: 800;">Conversation between teacher and student</h3>
            <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px; font-weight: 500;">Write a short dialogue where a student asks their teacher for an extension on an assignment.</p>
          </div>
          
          <textarea id="dialogue-input" placeholder="Start writing your dialogue here...&#10;Student: Good morning, Mr. Smith. Do you have a moment?&#10;Teacher: " style="width: 100%; min-height: 250px; background: var(--background); border: 1px solid var(--glass-border); border-radius: 16px; padding: 16px; color: var(--text); font-family: inherit; font-size: 15px; font-weight: 500; resize: none; outline: none; transition: border-color 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);" onfocus="this.style.borderColor='#22d3ee'" onblur="this.style.borderColor='var(--glass-border)'">${localStorage.getItem('langLab_dialogue') || ''}</textarea>
          
          <div id="dialogue-msg" style="width: 100%; display: none; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); padding: 12px; border-radius: 12px; color: #4ade80; font-size: 14px; text-align: center;">✅ Dialogue permanently saved to browser!</div>
          
          <button class="btn btn-primary" onclick="window.saveDialogue()" style="width: 100%; background: linear-gradient(135deg, #0891b2, #06b6d4); font-size: 16px; gap: 8px;">
            <i data-lucide="save" style="width: 18px; height: 18px;"></i> Save Progress
          </button>
        </div>
      `
    case 'discussion':
      if (isDiscussionRunning) {
        return `
          <div class="fade-in" style="display: flex; flex-direction: column; gap: 24px; max-width: 900px; margin: 0 auto; width: 100%;">
            <div style="background: var(--surface); border: 1px solid var(--glass-border); border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div class="card-badge" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">Live Session</div>
                  <h2 style="font-size: 24px; margin-top: 12px;">${['Technology & AI', 'Environment & Climate', 'Future of Education'][discussionTopicIndex]}</h2>
                </div>
                <button class="btn btn-outline" onclick="window.leaveDiscussion()" style="color: #ef4444; border-color: rgba(239, 68, 68, 0.2);">Leave Room</button>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 240px; gap: 24px; min-height: 400px;">
                <!-- Chat Feed -->
                <div style="background: var(--background); border: 1px solid var(--glass-border); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto;">
                  ${mockDiscussionMessages.map(msg => `
                    <div class="fade-in" style="display: flex; flex-direction: column; align-items: flex-start;">
                       <span style="font-size: 11px; font-weight: 800; color: ${msg.color}; margin-bottom: 4px;">${msg.sender} • ${msg.time}</span>
                       <div style="background: white; padding: 12px 16px; border-radius: 12px; border-bottom-left-radius: 2px; font-size: 14px; border: 1px solid var(--glass-border); max-width: 90%;">
                         ${msg.text}
                       </div>
                    </div>
                  `).join('')}
                </div>

                <!-- Participants -->
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <h4 style="font-size: 14px;">Participants (4)</h4>
                  ${[
                    { name: 'Alex', color: '#818cf8', active: true },
                    { name: 'Sarah', color: '#fb7185', active: true },
                    { name: 'James', color: '#34d399', active: true },
                    { name: 'You (Student)', color: 'var(--primary)', active: true }
                  ].map(p => `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 8px;">
                       <div style="width: 32px; height: 32px; border-radius: 50%; background: ${p.color}33; color: ${p.color}; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; border: 1px solid ${p.color}66;">
                         ${p.name[0]}
                       </div>
                       <span style="font-size: 14px; font-weight: 600;">${p.name}</span>
                       <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; margin-left: auto;"></div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="display: flex; gap: 16px; align-items: center;">
                 <input type="text" placeholder="Share your thoughts..." style="flex: 1; height: 50px; background: var(--background); border: 1px solid var(--glass-border); border-radius: 14px; padding: 0 20px; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='var(--primary)'">
                 <button class="btn btn-primary" style="height: 50px; width: 50px; padding: 0; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="send" style="width: 18px; margin-left: 2px;"></i>
                 </button>
                 <button class="btn btn-primary" style="height: 50px; width: 50px; padding: 0; display: flex; align-items: center; justify-content: center; background: #fb7185;" onclick="alert('Microphone active. Your turn to speak!')">
                    <i data-lucide="mic" style="width: 18px;"></i>
                 </button>
              </div>
            </div>
          </div>
        `
      }
      return `
        <div class="fade-in" style="margin-bottom: 20px; text-align: center;">
          <h2 style="font-size: 26px; font-weight: 700; background: linear-gradient(135deg, #10b981, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Group Discussion</h2>
          <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">Choose a topic and share your thoughts</p>
        </div>
        
        <div class="placeholder-card fade-in" style="padding: 24px; text-align: left; align-items: flex-start; gap: 20px; border-color: rgba(16, 185, 129, 0.2); background: linear-gradient(180deg, var(--glass) 0%, rgba(16, 185, 129, 0.03) 100%); width: 100%;">
          
          <div style="width: 100%;">
            <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--text);">Select a Topic:</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${['Technology & AI', 'Environment & Climate', 'Future of Education'].map((topic, i) => `
                <div onclick="window.setDiscTopic(${i})" style="padding: 14px 16px; background: var(--surface); border: 1px solid ${discussionTopicIndex === i ? 'rgba(16, 185, 129, 0.8)' : 'var(--glass-border)'}; border-radius: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='${discussionTopicIndex === i ? 'rgba(16, 185, 129, 0.8)' : 'var(--glass-border)'}'">
                  <div style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${discussionTopicIndex === i ? '#10b981' : 'var(--text-muted)'}; display: flex; align-items: center; justify-content: center;">
                    ${discussionTopicIndex === i ? '<div style="width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></div>' : ''}
                  </div>
                  <span style="font-size: 15px; color: ${discussionTopicIndex === i ? 'var(--text)' : 'var(--text-muted)'}; font-weight: ${discussionTopicIndex === i ? '700' : '500'};">${topic}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="width: 100%; border-top: 1px solid var(--glass-border); padding-top: 16px;">
            <div style="font-size: 13px; color: var(--text-muted); background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 14px; line-height: 1.5;">
              <strong style="color: #10b981; display: block; margin-bottom: 4px;">Instructions:</strong> 
              Click "Start Discussion" below to enter the virtual room, then use the record button to articulate your perspective on the selected topic.
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; width: 100%;">
            <button class="btn btn-outline" style="flex: 1; border-radius: 16px; border-color: rgba(16, 185, 129, 0.3); color: #10b981; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 0;" onclick="window.startDiscussion()">
               Join Room
            </button>
            <button class="btn btn-primary" onclick="window.startDiscussion()" style="flex: 3; border-radius: 16px; background: linear-gradient(135deg, #059669, #10b981); display: flex; align-items: center; justify-content: center; gap: 8px;">
               Start Discussion
            </button>
          </div>
        </div>
      `
    default:
      return '<div class="placeholder-card"><h3>Coming Soon</h3><p>This module is under development.</p></div>'
  }
  })()}
      </div>
    </div>
  `
}

window.navigateTo = (screen) => {
  currentScreen = screen
  render()
}

window.selectOption = (qIndex, optIndex) => {
  selectedAnswers[qIndex] = optIndex
  render()
}

window.submitListening = () => {
  if (selectedAnswers.includes(null)) {
    alert('Please answer all questions before submitting.')
    return
  }
  
  let score = 0
  selectedAnswers.forEach((ans, i) => {
    if (ans === listeningQuestions[i].correct) score++
  })
  
  listeningScore = score
  render()
}

window.resetListening = () => {
  listeningScore = null
  selectedAnswers = [null, null, null]
  render()
}

window.startDiscussion = () => {
  isDiscussionRunning = true;
  render();
}

window.leaveDiscussion = () => {
  isDiscussionRunning = false;
  render();
}

window.setDiscTopic = (idx) => {
  discussionTopicIndex = idx;
  render();
}

// Initial render
render()

window.saveDialogue = () => {
  const el = document.getElementById('dialogue-input');
  if(el) localStorage.setItem('langLab_dialogue', el.value);

  const msg = document.getElementById('dialogue-msg');
  if (msg) {
    msg.style.display = 'block';
    setTimeout(() => {
      msg.style.display = 'none';
    }, 3000);
  }
}


// FULLY FUNCTIONAL APP EXTENSIONS //
window.playPhonetic = (text) => {
  if (!('speechSynthesis' in window)) {
    alert("Sorry, your browser doesn't' support Text-to-Speech!");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

let audioPlayer = null;
window.toggleListeningAudio = () => {
  if (!audioPlayer) {
    // Standard Royalty Free Public MP3 used as placeholder 
    audioPlayer = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
  }
  const btn = document.getElementById('audio-play-btn');
  const icon = document.getElementById('audio-play-icon');
  
  if (audioPlayer.paused) {
    audioPlayer.play();
    btn.style.background = "#10b981"; // Active Green
    icon.setAttribute('data-lucide', 'pause');
  } else {
    audioPlayer.pause();
    btn.style.background = "var(--text)";
    icon.setAttribute('data-lucide', 'play');
  }
  lucide.createIcons();
}

let recordState = 'idle';
let recordInterval = null;
let recordSeconds = 0;

let speechRec = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  speechRec = new SpeechRec();
  speechRec.continuous = true;
  speechRec.interimResults = true;
  
  speechRec.onresult = (e) => {
    let finalT = '';
    let interimT = '';
    for(let i = e.resultIndex; i < e.results.length; i++) {
      if(e.results[i].isFinal) finalT += e.results[i][0].transcript;
      else interimT += e.results[i][0].transcript;
    }
    const fEl = document.getElementById('extempore-text');
    const iEl = document.getElementById('extempore-interim');
    if (fEl && iEl) {
      if(finalT) fEl.innerText += finalT;
      iEl.innerText = interimT;
      document.getElementById('extempore-transcript').style.opacity = '1';
    }
  }
}

window.toggleExtemporeRecording = () => {
  const btn = document.getElementById('recording-btn');
  const icon = document.getElementById('recording-btn-icon');
  const timer = document.getElementById('recording-timer');
  const glow1 = document.getElementById('recording-glow-1');
  const glow2 = document.getElementById('recording-glow-2');
  const instruction = document.getElementById('recording-instruction');
  
  if (recordState === 'idle') {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      window.mediaRecorder = new MediaRecorder(stream);
      window.mediaRecorder.start();
      recordState = 'recording';
      recordSeconds = 0;
      
      instruction.innerText = "Recording in progress... Tap to stop";
      btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
      glow1.style.background = "#10b981";
      glow2.style.background = "#10b981";
      icon.setAttribute('data-lucide', 'square');
      lucide.createIcons();
      
      if(speechRec) {
        document.getElementById('extempore-text').innerText = '';
        document.getElementById('extempore-interim').innerText = '';
        document.getElementById('extempore-transcript').style.opacity = '1';
        speechRec.start();
      }
      
      recordInterval = setInterval(() => {
        recordSeconds++;
        const m = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
        const s = String(recordSeconds % 60).padStart(2, '0');
        timer.innerText = m + ":" + s;
      }, 1000);
      
    }).catch(err => alert("Microphone permissions denied. Please allow it to test functionality!"));
  } else if (recordState === 'recording') {
    window.mediaRecorder.stop();
    window.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    clearInterval(recordInterval);
    recordState = 'done';
    if(speechRec) speechRec.stop();
    
    instruction.innerText = "Recording securely saved and transcribed!";
    btn.style.background = "#64748b"; // muted
    glow1.style.display = "none";
    glow2.style.display = "none";
    icon.setAttribute('data-lucide', 'check');
    lucide.createIcons();
  }
}
