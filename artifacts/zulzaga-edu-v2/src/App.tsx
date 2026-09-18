import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Heart,
  LayoutDashboard,
  MessageCircle,
  NotebookPen,
  Sparkles,
  Users,
  WalletCards,
} from 'lucide-react';

type Role = 'student' | 'parent' | 'teacher';
type Screen = 'splash' | 'roles' | 'login' | 'dashboard';

const roles: Array<{
  id: Role;
  label: string;
  description: string;
  icon: typeof GraduationCap;
}> = [
  {
    id: 'student',
    label: 'Сурагч',
    description: 'Хичээлээ сонирхолтойгоор хийж, ахицаа харах',
    icon: GraduationCap,
  },
  {
    id: 'parent',
    label: 'Эцэг эх',
    description: 'Хүүхдийнхээ сурах замыг ойлгож дэмжих',
    icon: Heart,
  },
  {
    id: 'teacher',
    label: 'Багш',
    description: 'Ангиа цэгцтэй удирдаж, хүүхэд бүрт хүрэх',
    icon: NotebookPen,
  },
];

const roleCopy: Record<
  Role,
  {
    greeting: string;
    title: string;
    subtitle: string;
    accent: string;
  }
> = {
  student: {
    greeting: 'Сайн уу, Номин',
    title: 'Өнөөдөр сурах зүйлс',
    subtitle: 'Жижиг алхам бүр чинь ахиц юм.',
    accent: 'Сурагчийн орон зай',
  },
  parent: {
    greeting: 'Сайн уу, Номин',
    title: 'Хүүхдийн тань өнөөдөр',
    subtitle: 'Ойрхон байж, зөв цагт нь дэмжицгээе.',
    accent: 'Эцэг эхийн орон зай',
  },
  teacher: {
    greeting: 'Сайн байна уу, багш аа',
    title: 'Ангидаа тавтай морил',
    subtitle: 'Хүүхэд бүрийн жижиг ахицыг хамтдаа анзааръя.',
    accent: 'Багшийн орон зай',
  },
};

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`app-brand ${compact ? 'app-brand-compact' : ''}`}>
      <span className="brand-mark">
        <Sparkles size={compact ? 16 : 19} strokeWidth={2.4} />
      </span>
      <span className="brand-text">
        <strong>zulzaga</strong>
        {!compact && <small>EDU · хамтдаа өснө</small>}
      </span>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const activeRole = roles[roleIndex];

  const chooseRole = (role: Role) => {
    setSelectedRole(role);
    setScreen('login');
  };

  const moveRole = (direction: -1 | 1) => {
    setRoleIndex((current) => (current + direction + roles.length) % roles.length);
  };

  if (screen === 'splash') {
    return (
      <main className="mobile-app app-welcome">
        <section className="welcome-content">
          <span className="welcome-kicker">Суралцах шинэ орон зай</span>
          <button
            className="welcome-entry"
            onClick={() => setScreen('roles')}
            data-testid="button-open-zulzaga"
          >
            <span className="welcome-mark"><Sparkles size={27} strokeWidth={2.2} /></span>
            <span className="welcome-name">Zulzaga EDU</span>
            <span className="welcome-action">Нээх <ArrowRight size={16} /></span>
          </button>
          <p>Хүүхэд, эцэг эх, багшийг нэг зорилгын төлөө холбох орон зай.</p>
        </section>
        <span className="welcome-footer">Хамтдаа өснө</span>
      </main>
    );
  }

  if (screen === 'roles') {
    return (
      <main className="mobile-app app-roles">
        <div className="app-topbar">
          <Brand compact />
          <span className="step-label">Алхам 1 / 2</span>
        </div>
        <div className="step-progress"><span /></div>
        <section className="roles-intro">
          <span className="eyebrow">Тавтай морил</span>
          <h1>Та хэнээр<br /><em>нэвтрэх вэ?</em></h1>
          <p>Өөрт тохирох орон зайгаа сонгоод үргэлжлүүлээрэй.</p>
        </section>
        <div className="role-carousel" aria-label="Хэрэглэгчийн төрөл сонгох">
          <button className="carousel-arrow" onClick={() => moveRole(-1)} aria-label="Өмнөх сонголт">
            <ArrowLeft size={19} />
          </button>
          <div className={`single-role-card role-${activeRole.id}`}>
            <span className="single-role-icon">
              <activeRole.icon size={31} strokeWidth={1.7} />
            </span>
            <span className="single-role-copy">
              <small>Нэвтрэх төрөл</small>
              <strong>{activeRole.label}</strong>
              <p>{activeRole.description}</p>
            </span>
          </div>
          <button className="carousel-arrow" onClick={() => moveRole(1)} aria-label="Дараагийн сонголт">
            <ArrowRight size={19} />
          </button>
        </div>
        <div className="role-dots" aria-label={`${roleIndex + 1} дахь сонголт`}>
          {roles.map((role, index) => (
            <button
              key={role.id}
              className={index === roleIndex ? 'active' : ''}
              onClick={() => setRoleIndex(index)}
              aria-label={role.label}
            />
          ))}
        </div>
        <button
          className="continue-button"
          onClick={() => chooseRole(activeRole.id)}
          data-testid={`button-role-${activeRole.id}`}
        >
          {activeRole.label}аар үргэлжлүүлэх <ArrowRight size={17} />
        </button>
        <p className="safe-note"><CheckCircle2 size={15} /> Таны мэдээлэл аюулгүй хадгалагдана</p>
      </main>
    );
  }

  if (screen === 'login' && selectedRole) {
    const role = roles.find((item) => item.id === selectedRole)!;
    const Icon = role.icon;
    return (
      <main className="mobile-app app-login">
        <div className="app-topbar">
          <button className="icon-button" onClick={() => setScreen('roles')} aria-label="Буцах">
            <ArrowLeft size={20} />
          </button>
          <Brand compact />
          <span className="step-label">Алхам 2 / 2</span>
        </div>
        <div className="step-progress"><span className="progress-complete" /></div>
        <section className="login-panel">
          <div className={`login-role-icon login-${selectedRole}`}><Icon size={28} strokeWidth={1.7} /></div>
          <span className="eyebrow">{role.label} · {role.id === 'teacher' ? 'ажлын орон зай' : 'суралцах орон зай'}</span>
          <h1>Тавтай морил,<br /><em>{role.label} аа.</em></h1>
          <p>Өөрийн орон зайдаа орохын тулд нэвтэрнэ үү.</p>
          <div className="login-placeholder">
            <Sparkles size={17} />
            <span>Нэвтрэх үйлдлийг дараагийн алхамд холбоно.</span>
          </div>
          <button className="demo-button" onClick={() => setScreen('dashboard')} data-testid="button-demo-login">
            Demo орчноор үргэлжлүүлэх <ArrowRight size={17} />
          </button>
          <div className="future-login-options" aria-label="Ирээдүйн нэвтрэх сонголтууд">
            <span>Дараа нь сонгох боломжтой</span>
            <div><span>Google</span><span>Утас</span><span>Apple</span></div>
          </div>
        </section>
        <p className="login-footer">Zulzaga EDU · Хамтдаа өснө</p>
      </main>
    );
  }

  return <Dashboard role={selectedRole ?? 'student'} onBack={() => setScreen('roles')} />;
}

function Dashboard({ role, onBack }: { role: Role; onBack: () => void }) {
  const copy = roleCopy[role];
  return (
    <main className="mobile-app app-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-brand-row">
          <Brand compact />
          <button className="avatar-button" onClick={onBack} aria-label="Role сонголт руу буцах">Н</button>
        </div>
        <div className="dashboard-greeting">
          <span className="eyebrow">{copy.accent}</span>
          <h1>{copy.greeting}</h1>
          <p>{copy.subtitle}</p>
        </div>
      </header>

      <section className={`dashboard-highlight highlight-${role}`}>
        <div>
          <span className="highlight-kicker">{role === 'teacher' ? 'ЭНЭ ДОЛОО ХОНОГТ' : 'ӨНӨӨДӨР'}</span>
          <h2>{copy.title}</h2>
          <button className="text-action">Дэлгэрэнгүй <ArrowRight size={14} /></button>
        </div>
        <span className="highlight-icon">
          {role === 'student' ? <BookOpen size={25} /> : role === 'parent' ? <Heart size={25} /> : <Users size={25} />}
        </span>
      </section>

      {role === 'student' && <StudentDashboard />}
      {role === 'parent' && <ParentDashboard />}
      {role === 'teacher' && <TeacherDashboard />}

      <nav className="bottom-nav" aria-label="Үндсэн цэс">
        <button className="active"><LayoutDashboard size={19} /><span>Эхлэл</span></button>
        <button><BookOpen size={19} /><span>{role === 'teacher' ? 'Анги' : 'Хичээл'}</span></button>
        <button><CalendarDays size={19} /><span>Хуваарь</span></button>
        <button><MessageCircle size={19} /><span>Холбоо</span></button>
      </nav>
    </main>
  );
}

function StudentDashboard() {
  const learningSteps = [
    { id: 'mongolian', subject: 'Монгол хэл', detail: 'Өгүүлбэрийн бүтэц · 20 минут', tone: 'task-blue', goal: 'Өгүүлбэрийн эхлэл, гол санаа, төгсгөлийг ялгаж сурах.', instruction: 'Богино эхийг уншаад гол санааг илэрхийлсэн өгүүлбэрийг олоорой.' },
    { id: 'math', subject: 'Математик', detail: 'Үржих үйлдэл · 15 минут', tone: 'task-yellow', goal: 'Нэг оронтой тоог үржүүлэх аргаа бататгах.', instruction: 'Жишээг ажиглаад дараагийн гурван бодлогыг өөрөө бодоорой.' },
    { id: 'art', subject: 'Зургийн даалгавар', detail: 'Маргааш өгөх', tone: 'task-purple', goal: 'Өнгө ашиглан өөрийн санааг чөлөөтэй илэрхийлэх.', instruction: '“Миний дуртай улирал” сэдвээр жижиг зураг зураарай.' },
  ];
  const [completedSteps, setCompletedSteps] = useState<string[]>(['mongolian']);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const progress = Math.round((completedSteps.length / learningSteps.length) * 100);
  const selectedStep = learningSteps.find((step) => step.id === selectedStepId);

  const toggleStep = (id: string) => {
    setCompletedSteps((current) =>
      current.includes(id) ? current.filter((step) => step !== id) : [...current, id],
    );
  };

  if (selectedStep) {
    const isDone = completedSteps.includes(selectedStep.id);
    return (
      <div className="dashboard-content student-lesson-view">
        <button className="lesson-back" onClick={() => setSelectedStepId(null)}>
          <ArrowLeft size={17} /> Өнөөдрийн ажлууд
        </button>
        <section className={`lesson-detail-card ${selectedStep.tone}`}>
          <span className="lesson-subject">Хичээл</span>
          <h3>{selectedStep.subject}</h3>
          <p>{selectedStep.detail}</p>
        </section>
        <section className="lesson-block">
          <span className="lesson-block-number">1</span>
          <div><small>ӨНӨӨДРИЙН ЗОРИЛГО</small><p>{selectedStep.goal}</p></div>
        </section>
        <section className="lesson-block">
          <span className="lesson-block-number">2</span>
          <div><small>ХИЙХ АЛХАМ</small><p>{selectedStep.instruction}</p></div>
        </section>
        <div className="lesson-practice">
          <span>Жижиг дасгал</span>
          <strong>{selectedStep.id === 'mongolian' ? 'Гол санааг олъё' : selectedStep.id === 'math' ? '3 бодлого бодъё' : 'Зургаа эхлүүлье'}</strong>
          <p>Дараагийн хөгжүүлэлтээр дасгалын асуулт, хариултыг энд оруулна.</p>
        </div>
        <button
          className={`lesson-complete-button ${isDone ? 'is-done' : ''}`}
          onClick={() => {
            if (!isDone) toggleStep(selectedStep.id);
            setSelectedStepId(null);
          }}
        >
          {isDone ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
          {isDone ? 'Өнөөдөр дууссан' : 'Дууссан гэж тэмдэглэх'}
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="student-daily-progress">
        <div>
          <span>Өнөөдрийн төлөвлөгөө</span>
          <strong>{completedSteps.length} / {learningSteps.length} ажил дууссан</strong>
        </div>
        <b>{progress}%</b>
        <div className="student-progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>
      <div className="section-heading section-heading-spaced">
        <h3>Өнөөдрийн хийх зүйл</h3>
        <span>{learningSteps.length - completedSteps.length} үлдлээ</span>
      </div>
      <div className="student-step-list">
        {learningSteps.map((step, index) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              className={`student-step ${isDone ? 'is-complete' : ''}`}
              onClick={() => setSelectedStepId(step.id)}
              aria-pressed={isDone}
            >
              <span className={`task-icon ${step.tone}`}>
                {isDone ? <CheckCircle2 size={20} /> : index === 0 ? <BookOpen size={20} /> : <NotebookPen size={20} />}
              </span>
              <span className="student-step-copy">
                <strong>{step.subject}</strong>
                <small>{step.detail}</small>
              </span>
              <span className="step-state">{isDone ? 'Дууссан' : 'Хийх'}</span>
            </button>
          );
        })}
      </div>
      <div className="section-heading section-heading-spaced"><h3>Миний ахиц</h3><span>Энэ 7 хоног</span></div>
      <div className="progress-card">
        <div className="progress-ring"><span>78<small>%</small></span></div>
        <div><strong>Сайн явж байна!</strong><p>Өнгөрсөн долоо хоногоос 12% илүү.</p></div>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="dashboard-content">
      <div className="child-card">
        <div className="child-avatar">Н</div>
        <div><span>Хүүхдийн мэдээлэл</span><strong>Номин · 3А анги</strong><p>Өнөөдөр 2 даалгавартай</p></div>
        <ChevronRight size={18} />
      </div>
      <div className="section-heading section-heading-spaced"><h3>Сүүлийн ахиц</h3><span>Бүгдийг харах</span></div>
      <div className="parent-metrics">
        <div><span className="metric-icon metric-green"><CheckCircle2 size={18} /></span><strong>86%</strong><small>Даалгавар</small></div>
        <div><span className="metric-icon metric-orange"><Sparkles size={18} /></span><strong>240</strong><small>Оноо</small></div>
        <div><span className="metric-icon metric-purple"><Heart size={18} /></span><strong>4.8</strong><small>Идэвх</small></div>
      </div>
      <div className="section-heading section-heading-spaced"><h3>Багшийн тэмдэглэл</h3></div>
      <div className="note-card"><span className="note-quote">“</span><p>Номин өнөөдөр асуултаа маш зоригтой асуусан.</p><small>Багш Болормаа · Өнөөдөр</small></div>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="dashboard-content">
      <div className="teacher-summary">
        <div><span>Идэвхтэй анги</span><strong>3А анги</strong><p>24 сурагч · 2 шинэ илгээлт</p></div>
        <span className="teacher-summary-icon"><Users size={23} /></span>
      </div>
      <div className="teacher-pulse" aria-label="Өнөөдрийн ангийн байдал">
        <div><strong>21</strong><span>Ирсэн</span></div>
        <div><strong>18</strong><span>Даалгавартай</span></div>
        <div><strong>3</strong><span>Анхаарах</span></div>
      </div>
      <div className="section-heading section-heading-spaced"><h3>Анхаарах зүйл</h3><span>Өнөөдөр</span></div>
      <button className="student-attention">
        <span className="attention-avatar">Т</span>
        <div><strong>Тэмүүлэнг дэмжих</strong><p>Монгол хэлний 2 даалгавар хоцорсон байна.</p></div>
        <ChevronRight size={18} />
      </button>
      <div className="section-heading section-heading-spaced"><h3>Өнөөдрийн ажлууд</h3><span>Бүгдийг харах</span></div>
      <div className="teacher-task"><span className="task-icon task-blue"><NotebookPen size={20} /></span><div><strong>Даалгавар шалгах</strong><p>8 сурагч илгээсэн байна</p></div><span className="count-badge">8</span></div>
      <div className="teacher-task"><span className="task-icon task-yellow"><MessageCircle size={20} /></span><div><strong>Шинэ мессеж</strong><p>Эцэг эхээс 2 шинэ асуулт</p></div><span className="count-badge">2</span></div>
      <div className="section-heading section-heading-spaced"><h3>Ангийн урамшуулал</h3></div>
      <div className="points-card"><WalletCards size={22} /><div><strong>1,240 оноо</strong><p>Энэ сард ашиглах боломжтой</p></div><ArrowRight size={17} /></div>
    </div>
  );
}

export default App;