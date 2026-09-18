import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen('roles'), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  const chooseRole = (role: Role) => {
    setSelectedRole(role);
    setScreen('login');
  };

  if (screen === 'splash') {
    return (
      <main className="mobile-app app-splash">
        <div className="splash-orbit splash-orbit-one" />
        <div className="splash-orbit splash-orbit-two" />
        <div className="splash-content">
          <div className="splash-art" aria-label="Zulzaga EDU">
            <div className="splash-art-sun" />
            <div className="splash-art-hill" />
            <div className="splash-art-book">
              <BookOpen size={52} strokeWidth={1.35} />
            </div>
            <span className="splash-art-star star-one"><Sparkles size={20} /></span>
            <span className="splash-art-star star-two"><Sparkles size={15} /></span>
          </div>
          <Brand />
          <p className="splash-tagline">Хүүхэд бүрийн сурах замд<br />хамтдаа өснө.</p>
          <div className="loading-line" aria-label="Уншиж байна"><span /></div>
        </div>
        <button className="skip-button" onClick={() => setScreen('roles')}>Алгасах</button>
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
        <div className="role-list" aria-label="Хэрэглэгчийн төрөл сонгох">
          {roles.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              className={`role-card role-${id}`}
              onClick={() => chooseRole(id)}
              data-testid={`button-role-${id}`}
            >
              <span className="role-card-icon"><Icon size={25} strokeWidth={1.8} /></span>
              <span className="role-card-copy">
                <strong>{label}</strong>
                <small>{description}</small>
              </span>
              <ChevronRight className="role-card-arrow" size={20} />
            </button>
          ))}
        </div>
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
  return (
    <div className="dashboard-content">
      <div className="section-heading"><h3>Дараагийн хийх зүйл</h3><span>2 үлдлээ</span></div>
      <div className="task-card task-card-main">
        <span className="task-icon task-blue"><BookOpen size={21} /></span>
        <div><strong>Монгол хэл</strong><p>Өгүүлбэрийн бүтэц · 20 минут</p></div>
        <ChevronRight size={18} />
      </div>
      <div className="task-card">
        <span className="task-icon task-yellow"><NotebookPen size={20} /></span>
        <div><strong>Зургийн даалгавар</strong><p>Маргааш өгөх</p></div>
        <ChevronRight size={18} />
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
      <div className="section-heading section-heading-spaced"><h3>Өнөөдрийн ажлууд</h3><span>Бүгдийг харах</span></div>
      <div className="teacher-task"><span className="task-icon task-blue"><NotebookPen size={20} /></span><div><strong>Даалгавар шалгах</strong><p>8 сурагч илгээсэн байна</p></div><span className="count-badge">8</span></div>
      <div className="teacher-task"><span className="task-icon task-yellow"><MessageCircle size={20} /></span><div><strong>Шинэ мессеж</strong><p>Эцэг эхээс 2 шинэ асуулт</p></div><span className="count-badge">2</span></div>
      <div className="section-heading section-heading-spaced"><h3>Ангидаа өгөх оноо</h3></div>
      <div className="points-card"><WalletCards size={22} /><div><strong>1,240 оноо</strong><p>Энэ сард ашиглах боломжтой</p></div><ArrowRight size={17} /></div>
    </div>
  );
}

export default App;