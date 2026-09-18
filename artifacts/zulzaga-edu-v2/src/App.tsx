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

export type Assignment = {
  id: string;
  subject: string;
  title: string;
  instruction: string;
  dueDate: string;
  createdAt: number;
  completed: boolean;
};

const ASSIGNMENTS_KEY = 'zulzaga-edu-assignments-v1';

function loadAssignments(): Assignment[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(ASSIGNMENTS_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is Record<string, unknown> =>
          typeof item === 'object' && item !== null,
      )
      .filter(
        (item) =>
          typeof item.id === 'string' &&
          typeof item.subject === 'string' &&
          typeof item.instruction === 'string' &&
          typeof item.dueDate === 'string',
      )
      .map((item) => ({
        id: item.id as string,
        subject: item.subject as string,
        title:
          typeof item.title === 'string' && item.title.trim()
            ? item.title
            : (item.subject as string),
        instruction: item.instruction as string,
        dueDate: item.dueDate as string,
        createdAt:
          typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        completed: item.completed === true,
      }));
  } catch {
    return [];
  }
}

function saveAssignments(assignments: Assignment[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  }
}

const STUDENT_PROGRESS_KEY = 'zulzaga-edu-student-progress-v1';

function loadStudentProgress() {
  if (typeof window === 'undefined') {
    return { completedSteps: [] as string[], mongolianExerciseCorrect: false, mathExerciseCorrect: false };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(STUDENT_PROGRESS_KEY) ?? '{}');
    return {
      completedSteps: Array.isArray(saved.completedSteps)
        ? saved.completedSteps.filter((id: unknown): id is string => typeof id === 'string')
        : [],
      mongolianExerciseCorrect: saved.mongolianExerciseCorrect === true,
      mathExerciseCorrect: saved.mathExerciseCorrect === true,
    };
  } catch {
    return { completedSteps: [] as string[], mongolianExerciseCorrect: false, mathExerciseCorrect: false };
  }
}

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
  const [savedProgress] = useState(loadStudentProgress);
  const [completedSteps, setCompletedSteps] = useState<string[]>(savedProgress.completedSteps);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [mongolianExerciseCorrect, setMongolianExerciseCorrect] = useState(savedProgress.mongolianExerciseCorrect);
  const [selectedMathAnswer, setSelectedMathAnswer] = useState<number | null>(null);
  const [mathAnswerState, setMathAnswerState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [mathExerciseCorrect, setMathExerciseCorrect] = useState(savedProgress.mathExerciseCorrect);

  const [assignments, setAssignments] = useState<Assignment[]>(loadAssignments);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);

  const toggleAssignment = (id: string) => {
    const updated = assignments.map((assignment) =>
      assignment.id === id
        ? { ...assignment, completed: !assignment.completed }
        : assignment,
    );
    setAssignments(updated);
    saveAssignments(updated);
  };
  const progress = Math.round((completedSteps.length / learningSteps.length) * 100);
  const selectedStep = learningSteps.find((step) => step.id === selectedStepId);
  const mongolianAnswers = [
    'Номин өглөө эрт босов.',
    'Тэр цүнхээ үүрээд сургуульдаа баяртайгаар явлаа.',
    'Өнөөдөр тэнгэр цэлмэг байв.',
  ];
  const correctAnswer = mongolianAnswers[1];

  useEffect(() => {
    window.localStorage.setItem(
      STUDENT_PROGRESS_KEY,
      JSON.stringify({ completedSteps, mongolianExerciseCorrect, mathExerciseCorrect }),
    );
  }, [completedSteps, mongolianExerciseCorrect, mathExerciseCorrect]);

  const toggleStep = (id: string) => {
    setCompletedSteps((current) =>
      current.includes(id) ? current.filter((step) => step !== id) : [...current, id],
    );
  };

  const openStep = (id: string) => {
    setSelectedStepId(id);
    setSelectedAnswer(null);
    setAnswerState(id === 'mongolian' && mongolianExerciseCorrect ? 'correct' : 'idle');
    setSelectedMathAnswer(null);
    setMathAnswerState(id === 'math' && mathExerciseCorrect ? 'correct' : 'idle');
  };

  const checkAnswer = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === correctAnswer;
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setMongolianExerciseCorrect(true);
  };

  const checkMathAnswer = () => {
    if (selectedMathAnswer === null) return;
    const isCorrect = selectedMathAnswer === 24;
    setMathAnswerState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setMathExerciseCorrect(true);
  };

  if (selectedAssignmentId) {
    const assignment = assignments.find(a => a.id === selectedAssignmentId);
    if (assignment) {
      const isDone = assignment.completed;
      return (
        <div className="dashboard-content student-lesson-view">
          <button className="lesson-back" onClick={() => setSelectedAssignmentId(null)}>
            <ArrowLeft size={17} /> Өнөөдрийн ажлууд
          </button>
          <section className="lesson-detail-card task-blue">
            <span className="lesson-subject">{assignment.subject}</span>
            <h3>{assignment.title}</h3>
            <p>Хугацаа: {assignment.dueDate}</p>
          </section>
          <section className="lesson-block">
            <span className="lesson-block-number">1</span>
            <div><small>ЗААВАР</small><p>{assignment.instruction}</p></div>
          </section>
          <button
            className={`lesson-complete-button ${isDone ? 'is-done' : ''}`}
            onClick={() => {
              toggleAssignment(assignment.id);
              setSelectedAssignmentId(null);
            }}
            data-testid={`button-complete-assignment-${assignment.id}`}
          >
            {isDone ? <CheckCircle2 size={18} /> : <Sparkles size={18} />}
            {isDone ? 'Хийж дууссан (Буцах)' : 'Дууссан гэж тэмдэглэх'}
          </button>
        </div>
      );
    }
  }

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
        {selectedStep.id === 'mongolian' ? (
          <section className="lesson-practice exercise-card">
            <span>Жижиг дасгал</span>
            <strong>Гол санааг олъё</strong>
            <p className="exercise-passage">Номин өглөө эрт босов. Тэр цүнхээ үүрээд сургуульдаа баяртайгаар явлаа. Өнөөдөр тэнгэр цэлмэг байв.</p>
            <fieldset className="answer-list">
              <legend>Эхийн гол санааг аль өгүүлбэр илэрхийлж байна вэ?</legend>
              {mongolianAnswers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                return (
                  <label
                    key={answer}
                    className={`answer-option ${isSelected ? 'is-selected' : ''} ${answerState === 'correct' && isSelected ? 'is-correct' : ''} ${answerState === 'incorrect' && isSelected ? 'is-incorrect' : ''}`}
                  >
                    <input
                      type="radio"
                      name="mongolian-answer"
                      value={answer}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedAnswer(answer);
                        setAnswerState('idle');
                      }}
                    />
                    <b>{index + 1}</b>
                    <span>{answer}</span>
                  </label>
                );
              })}
            </fieldset>
            {(answerState === 'correct' || mongolianExerciseCorrect) && (
              <div className="answer-feedback is-correct" role="status">
                <CheckCircle2 size={18} />
                <div><strong>Зөв хариуллаа!</strong><p>Номин сургуульдаа баяртайгаар явсан нь эхийн гол санаа юм.</p></div>
              </div>
            )}
            {answerState === 'incorrect' && (
              <div className="answer-feedback is-incorrect" role="status">
                <Sparkles size={18} />
                <div><strong>Дахин нэг оролдоорой</strong><p>Бүх эхэд юуны тухай өгүүлснийг бодоод өөр хариулт сонгоорой.</p></div>
              </div>
            )}
            {answerState !== 'correct' && !mongolianExerciseCorrect && (
              <button
                className="check-answer-button"
                onClick={checkAnswer}
                disabled={!selectedAnswer}
              >
                Хариултаа шалгах
              </button>
            )}
          </section>
        ) : selectedStep.id === 'math' ? (
          <section className="lesson-practice exercise-card math-exercise-card">
            <span>Жижиг дасгал</span>
            <strong>Үржүүлэх аргаа ашиглая</strong>
            <div className="math-question">
              <small>6 ширхэг хайрцаг бүрд 4 харандаа байвал нийт хэдэн харандаа вэ?</small>
              <b>6 × 4 = ?</b>
            </div>
            <fieldset className="answer-list math-answer-grid">
              <legend>Зөв хариултыг сонгоорой</legend>
              {[18, 24, 28].map((answer) => {
                const isSelected = selectedMathAnswer === answer;
                return (
                  <label
                    key={answer}
                    className={`answer-option ${isSelected ? 'is-selected' : ''} ${mathAnswerState === 'correct' && isSelected ? 'is-correct' : ''} ${mathAnswerState === 'incorrect' && isSelected ? 'is-incorrect' : ''}`}
                  >
                    <input
                      type="radio"
                      name="math-answer"
                      value={answer}
                      checked={isSelected}
                      onChange={() => {
                        setSelectedMathAnswer(answer);
                        setMathAnswerState('idle');
                      }}
                    />
                    <b>{answer}</b>
                  </label>
                );
              })}
            </fieldset>
            {(mathAnswerState === 'correct' || mathExerciseCorrect) && (
              <div className="answer-feedback is-correct" role="status">
                <CheckCircle2 size={18} />
                <div><strong>Яг зөв, 24 харандаа!</strong><p>4-ийг 6 удаа нэмэхэд 24 болно.</p></div>
              </div>
            )}
            {mathAnswerState === 'incorrect' && (
              <div className="answer-feedback is-incorrect" role="status">
                <Sparkles size={18} />
                <div><strong>Дахин бодоод үзээрэй</strong><p>4 + 4 + 4 + 4 + 4 + 4 гэж нэмээд үзээрэй.</p></div>
              </div>
            )}
            {mathAnswerState !== 'correct' && !mathExerciseCorrect && (
              <button className="check-answer-button" onClick={checkMathAnswer} disabled={selectedMathAnswer === null}>
                Хариултаа шалгах
              </button>
            )}
          </section>
        ) : (
          <div className="lesson-practice">
            <span>Жижиг дасгал</span>
            <strong>Зургаа эхлүүлье</strong>
            <p>Дараагийн хөгжүүлэлтээр дасгалын асуулт, хариултыг энд оруулна.</p>
          </div>
        )}
        {(
          (selectedStep.id === 'mongolian' && (answerState === 'correct' || mongolianExerciseCorrect || isDone))
          || (selectedStep.id === 'math' && (mathAnswerState === 'correct' || mathExerciseCorrect || isDone))
          || selectedStep.id === 'art'
        ) && (
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
        )}
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
      {assignments.length > 0 && (
        <>
          <div className="section-heading section-heading-spaced">
            <h3>Багшийн даалгавар</h3>
            <span>{assignments.filter(a => !a.completed).length} шинэ</span>
          </div>
          <div className="student-step-list" style={{ marginBottom: '28px' }}>
            {assignments.map(assignment => (
              <button
                key={assignment.id}
                className={`student-step ${assignment.completed ? 'is-complete' : ''}`}
                onClick={() => setSelectedAssignmentId(assignment.id)}
                aria-pressed={assignment.completed}
                data-testid={`student-assignment-${assignment.id}`}
              >
                <span className={`task-icon ${assignment.completed ? 'task-mint' : 'task-blue'}`}>
                  {assignment.completed ? <CheckCircle2 size={20} /> : <NotebookPen size={20} />}
                </span>
                <span className="student-step-copy">
                  <strong>{assignment.title}</strong>
                  <small>{assignment.subject} · {assignment.dueDate}</small>
                  <small className="truncate-text">{assignment.instruction}</small>
                </span>
                <span className="step-state">{assignment.completed ? 'Дууссан' : 'Шинэ'}</span>
              </button>
            ))}
          </div>
        </>
      )}

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
              onClick={() => openStep(step.id)}
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
  const [assignments, setAssignments] = useState<Assignment[]>(loadAssignments);
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('Монгол хэл');
  const [title, setTitle] = useState('');
  const [instruction, setInstruction] = useState('');
  const [dueDate, setDueDate] = useState('Маргааш');

  const handleCreateAssignment = () => {
    if (!title.trim() || !instruction.trim()) return;
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      subject,
      title: title.trim(),
      instruction: instruction.trim(),
      dueDate,
      createdAt: Date.now(),
      completed: false,
    };
    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    saveAssignments(updated);
    setIsCreating(false);
    setTitle('');
    setInstruction('');
    setSubject('Монгол хэл');
    setDueDate('Маргааш');
  };

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

      <div className="teacher-assignments-header">
        <h3>Багшийн даалгавар</h3>
        {!isCreating && (
          <button className="btn-add-assignment" onClick={() => setIsCreating(true)} data-testid="button-add-assignment">
            <Sparkles size={13} /> Нэмэх
          </button>
        )}
      </div>

      {isCreating && (
        <div className="create-assignment-form animate-in">
          <label>
            <span>Хичээлийн нэр</span>
            <select value={subject} onChange={e => setSubject(e.target.value)} data-testid="select-assignment-subject">
              <option value="Монгол хэл">Монгол хэл</option>
              <option value="Математик">Математик</option>
              <option value="Хүн ба орчин">Хүн ба орчин</option>
              <option value="Зураг урлал">Зураг урлал</option>
              <option value="Бусад">Бусад</option>
            </select>
          </label>
          <label>
            <span>Даалгаврын нэр</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Жишээ: Миний дуртай ном"
              data-testid="input-assignment-title"
            />
          </label>
          <label>
            <span>Даалгаврын заавар</span>
            <textarea
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              placeholder="Юу хийх талаар дэлгэрэнгүй бичнэ үү..."
              data-testid="input-assignment-instruction"
            />
          </label>
          <label>
            <span>Хугацаа</span>
            <select value={dueDate} onChange={e => setDueDate(e.target.value)} data-testid="select-assignment-due">
              <option value="Өнөөдөр">Өнөөдөр</option>
              <option value="Маргааш">Маргааш</option>
              <option value="Ирэх долоо хоногт">Ирэх долоо хоногт</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setIsCreating(false)} data-testid="button-cancel-assignment">
              Болих
            </button>
            <button className="btn-save" onClick={handleCreateAssignment} disabled={!title.trim() || !instruction.trim()} data-testid="button-save-assignment">
              Хадгалах <ArrowRight size={15}/>
            </button>
          </div>
        </div>
      )}

      {assignments.length === 0 && !isCreating ? (
        <div className="teacher-assignment-empty" data-testid="empty-assignments">
          <NotebookPen size={32} opacity={0.5} />
          <span>Одоогоор шинэ даалгавар өгөөгүй байна.</span>
        </div>
      ) : (
        <div className="teacher-assignment-list" data-testid="list-assignments">
          {assignments.map(a => (
            <div key={a.id} className="teacher-assignment-card">
              <div className="assignment-header">
                <span className={`task-icon ${a.completed ? 'task-mint' : 'task-blue'}`}>
                  {a.completed ? <CheckCircle2 size={18}/> : <NotebookPen size={18}/>}
                </span>
                <div>
                   <strong>{a.title}</strong>
                   <small>{a.subject} · Хугацаа: {a.dueDate}</small>
                </div>
                <span className={`status-badge ${a.completed ? 'status-done' : 'status-pending'}`}>
                  {a.completed ? 'Хийсэн' : 'Хүлээгдэж буй'}
                </span>
              </div>
              <p>{a.instruction}</p>
            </div>
          ))}
        </div>
      )}

      <div className="section-heading section-heading-spaced"><h3>Өнөөдрийн ажлууд</h3><span>Бүгдийг харах</span></div>
      <div className="teacher-task"><span className="task-icon task-blue"><NotebookPen size={20} /></span><div><strong>Даалгавар шалгах</strong><p>8 сурагч илгээсэн байна</p></div><span className="count-badge">8</span></div>
      <div className="teacher-task"><span className="task-icon task-yellow"><MessageCircle size={20} /></span><div><strong>Шинэ мессеж</strong><p>Эцэг эхээс 2 шинэ асуулт</p></div><span className="count-badge">2</span></div>
      <div className="section-heading section-heading-spaced"><h3>Ангийн урамшуулал</h3></div>
      <div className="points-card"><WalletCards size={22} /><div><strong>1,240 оноо</strong><p>Энэ сард ашиглах боломжтой</p></div><ArrowRight size={17} /></div>
    </div>
  );
}

export default App;