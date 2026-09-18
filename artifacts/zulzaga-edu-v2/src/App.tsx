import { useState } from 'react';
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, CircleUserRound, Clock3, GraduationCap, HeartHandshake, Menu, MessageCircle, NotebookPen, Sparkles, UsersRound, X } from 'lucide-react';

type Role = 'parent' | 'teacher' | 'school';

const roleContent: Record<Role, {
  label: string;
  title: string;
  body: string;
  quote: string;
  features: { icon: typeof BookOpen; title: string; body: string }[];
}> = {
  parent: {
    label: 'Эцэг эх',
    title: 'Хүүхдийнхээ ахиц дэвшлийг ойроос мэдэрнэ.',
    body: 'Өдөр бүр юу сурч, юунд баярлаж, хаана дэмжлэг хэрэгтэйг нь ойлгох жижигхэн дохиог нэг дороос хараарай.',
    quote: '“Хяналт биш, хамтдаа өнгөрүүлэх илүү олон мөч.”',
    features: [
      { icon: HeartHandshake, title: 'Тодорхой ахиц', body: 'Хичээл бүрийн явцыг ойлгоход амархан тоймоор.' },
      { icon: MessageCircle, title: 'Зөв цагт нь холбоо', body: 'Багшийн тэмдэглэл, санал хүсэлтийг цаг алдалгүй.' },
      { icon: Clock3, title: 'Өглөөг илүү амар', body: 'Долоо хоногийн хуваарь, сануулга нэг дор.' },
    ],
  },
  teacher: {
    label: 'Багш',
    title: 'Заах цагтаа илүү ихийг заана.',
    body: 'Давтагддаг ажлуудыг цэгцэлж, хүүхэд бүрийн сурах хэмнэлд анхаарах цагийг тань буцааж өгнө.',
    quote: '“Бага цаас, их ажиглалт. Их ажиглалт, илүү сайн дэмжлэг.”',
    features: [
      { icon: NotebookPen, title: 'Төлөвлөлт хурууны үзүүрт', body: 'Хичээлийн бэлтгэл, даалгавар, тэмдэглэл эмх цэгцтэй.' },
      { icon: UsersRound, title: 'Хүүхэд бүр харагдана', body: 'Нэг бүрийн суралцах замнал, жижиг амжилтыг анзаарна.' },
      { icon: Sparkles, title: 'Ажлын өдрийн хөнгөвчлөл', body: 'Тайлан, сануулга, холбоог нэг хялбар урсгалд.' },
    ],
  },
  school: {
    label: 'Сургууль',
    title: 'Нэг зорилгын төлөө нэг хэмнэлээр.',
    body: 'Сургуулийн хамтын соёлыг мэдээллээр бус, ойлголцлоор холбож, сурах орчныг бүхэлд нь дэмжинэ.',
    quote: '“Хүүхдийн төлөө ажилладаг хүн бүр нэг хуудсанд.”',
    features: [
      { icon: GraduationCap, title: 'Нэгдсэн харах өнцөг', body: 'Анги, багш, гэр бүлийн мэдээллийг уялдуулна.' },
      { icon: BookOpen, title: 'Суралцах чанарын хэмнэл', body: 'Өдөр тутмын ажлаас урт хугацааны ахицыг олж харна.' },
      { icon: UsersRound, title: 'Итгэл дээрх хамтын ажиллагаа', body: 'Мэдээлэл илүү цэгцтэй, шийдвэр илүү бодитой.' },
    ],
  },
};

const faqs = [
  ['Zulzaga EDU-г хэн ашиглах вэ?', '1–5 дугаар ангийн хүүхэдтэй гэр бүл, ангийн багш болон сургуулийн удирдлагад зориулсан. Хүн бүр өөрт хэрэгтэй өнцгөөсөө нэг орон зайг харна.'],
  ['Одоо бүртгүүлж ашиглаж болох уу?', 'Энэ танилцуулга нь Zulzaga EDU V2-ийн эхний хувилбар. Бид сургуулиудтай хамтран туршиж, хүүхэд бүрт илүү сайн болгохоор бэлтгэж байна.'],
  ['Миний хүүхдийн мэдээлэл хэрхэн хамгаалагдах вэ?', 'Аюулгүй, хүндэтгэлтэй орчин бол бидний эхний зарчим. Хувийн мэдээллийн хамгаалалтыг бүтээгдэхүүний суурь хэсэг болгон төлөвлөж байна.'],
  ['Багш нарт ямар өөрчлөлт авчрах вэ?', 'Давтагддаг төлөвлөлт, тэмдэглэл, холбооны ажлыг эмхэлж, багш хүүхэд бүртэй ажиллахад илүү их цаг зарцуулахад тусална.'],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<Role>('parent');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const content = roleContent[role];

  const closeMenu = () => setMenuOpen(false);
  const navigate = (id: string) => {
    closeMenu();
    scrollToId(id);
  };

  return (
    <main className="z-page">
      <div className="z-topline">2025 ОНЫ НАМРЫН ТУРШИЛТЫН ХӨТӨЛБӨРТ СУРГУУЛИУДЫГ УРЬЖ БАЙНА <ArrowRight size={13} /></div>
      <header className="z-nav">
        <div className="z-container z-nav-inner">
          <button className="z-brand" onClick={() => navigate('top')} data-testid="button-brand-home" aria-label="Эхлэл рүү очих">
            <span className="z-mark"><Sparkles size={19} strokeWidth={2.5} /></span>
            <span><span className="z-brand-name">zulzaga</span><span className="z-brand-sub">EDU · хамтдаа өснө</span></span>
          </button>
          <nav className={`z-nav-links ${menuOpen ? 'z-mobile-open' : ''}`} aria-label="Үндсэн цэс">
            <button className="z-nav-link" onClick={() => navigate('why')} data-testid="link-why">Яагаад Zulzaga?</button>
            <button className="z-nav-link" onClick={() => navigate('journey')} data-testid="link-journey">Хэрхэн ажилладаг вэ?</button>
            <button className="z-nav-link" onClick={() => navigate('faq')} data-testid="link-faq">Түгээмэл асуулт</button>
          </nav>
          <div className="z-nav-actions">
            <button className="z-link-button" onClick={() => setModalOpen(true)} data-testid="button-sign-in">Танилцуулга авах</button>
            <button className="z-solid-button" onClick={() => navigate('contact')} data-testid="button-nav-contact">Холбогдох <ArrowRight size={14} /></button>
            <button className="z-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu" aria-label="Цэс нээх">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </header>

      <section className="z-hero" id="top">
        <div className="z-container z-hero-grid">
          <div className="z-hero-copy">
            <div className="z-eyebrow z-appear">Хүүхэд бүрийн сурах зам</div>
            <h1 className="z-appear z-delay-1">Өнөөдрийн жижиг алхам, <em>маргаашийн том итгэл.</em></h1>
            <p className="z-hero-lede z-appear z-delay-2">Zulzaga EDU бол 1–5 дугаар ангийн хүүхэд, эцэг эх, багшийг нэг зорилгын төлөө зөөлөн холбох суралцах орчин.</p>
            <div className="z-hero-actions z-appear z-delay-3">
              <button className="z-solid-button" onClick={() => navigate('why')} data-testid="button-hero-explore">Zulzaga-г танилцъя <ArrowDown size={15} /></button>
              <button className="z-outline-button" onClick={() => setModalOpen(true)} data-testid="button-hero-demo">Сонирхож байна <CircleUserRound size={15} /></button>
            </div>
            <div className="z-proof-line z-appear z-delay-3">
              <span className="z-proof-dots"><span className="z-proof-dot">А</span><span className="z-proof-dot">Н</span><span className="z-proof-dot">Т</span><span className="z-proof-dot">С</span></span>
              <span>Суралцах замд хамт алхах<br />гэр бүл, багш нарын орон зай</span>
            </div>
          </div>
          <div className="z-hero-art" aria-label="Хүүхэд ном уншиж буй дулаан дүрслэл" role="img">
            <div className="z-art-glow" />
            <div className="z-art-paper"><div className="z-sun" /><div className="z-hill-back" /><div className="z-hill" /><div className="z-student" /><div className="z-book" /></div>
            <div className="z-float-tag">ӨНӨӨДӨР БИ<br />ЧАДЛАА.</div>
            <div className="z-note"><div className="z-note-label">багшийн тэмдэглэл</div><div className="z-note-text">Чи асуултаа маш зоригтой асуусан шүү.</div><div className="z-note-line" /></div>
            <div className="z-float-star"><Sparkles size={32} strokeWidth={1.8} /></div>
          </div>
        </div>
        <div className="z-scroll-cue">доош гүйлгэх<span /></div>
      </section>

      <section className="z-stat-band" aria-label="Zulzaga EDU-ийн чиглэл">
        <div className="z-container z-stat-grid">
          <div className="z-stat"><strong>1–5</strong><span>ангийн сурагчдад</span></div>
          <div className="z-stat"><strong>3</strong><span>тал нэг зорилготой</span></div>
          <div className="z-stat"><strong>1</strong><span>холбогдсон орон зай</span></div>
          <div className="z-stat"><strong>∞</strong><span>өсөх боломж</span></div>
        </div>
      </section>

      <section className="z-section z-section-cream" id="why">
        <div className="z-container">
          <div className="z-section-heading">
            <div className="z-eyebrow">Нэг хүүхэд, гурван дэмжлэг</div>
            <h2>Сурна гэдэг зөвхөн дүн биш.</h2>
            <p>Хүүхэд өөртөө итгэх итгэлтэй болж, эцэг эх нь ойлгож дэмжиж, багш нь анхаарах цагтай байх тухай.</p>
          </div>
          <div className="z-role-switch" role="tablist" aria-label="Хэрэглэгчийн төрлөөр харах">
            {(Object.keys(roleContent) as Role[]).map((item) => (
              <button key={item} className={`z-role-tab ${role === item ? 'active' : ''}`} onClick={() => setRole(item)} role="tab" aria-selected={role === item} data-testid={`button-role-${item}`}>
                <strong>{roleContent[item].label}</strong><small>{item === 'parent' ? 'Хүүхдийнхээ төлөө' : item === 'teacher' ? 'Ангидаа зориулахад' : 'Бүхэлд нь харахад'}</small>
              </button>
            ))}
          </div>
          <div className="z-role-content">
            <div className="z-role-message">
              <h3>{content.title}</h3>
              <p>{content.body}</p>
              <div className="z-role-quote">{content.quote}</div>
            </div>
            <div className="z-feature-list">
              {content.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return <div className="z-feature-item" key={feature.title} data-testid={`feature-${role}-${index}`}><span className="z-feature-icon"><FeatureIcon size={19} /></span><div><h4>{feature.title}</h4><p>{feature.body}</p></div></div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="z-section" id="journey">
        <div className="z-container z-journey">
          <div className="z-journey-sticky">
            <div className="z-eyebrow">Өсөх замыг нь харах</div>
            <h2>Холбоо бүрдсэн үед сурах амьд болдог.</h2>
            <p>Мэдээллийг цуглуулахын тулд биш, өдөр тутмын жижиг ахиц бүрийг утгатай болгохын тулд бид орон зайг бүтээж байна.</p>
            <button className="z-solid-button" onClick={() => setModalOpen(true)} data-testid="button-journey-interest">Сургуулийнхаа талаар ярилцъя <ArrowRight size={14} /></button>
          </div>
          <div className="z-path">
            <div className="z-path-step"><span className="z-path-number">01</span><h3>Өдөр эхлэхэд — чиглэл тодорхой</h3><p>Хүүхэд өнөөдөр юу сурах, юунд анхаарахаа ойлгож эхэлнэ. Багшийн бэлтгэл нэг дор, эцэг эхийн хүлээлт илүү бодитой.</p><span className="z-path-tag">Төлөвлөе</span></div>
            <div className="z-path-step"><span className="z-path-number">02</span><h3>Өдөр үргэлжлэхэд — жижиг дохио</h3><p>Хичээлийн оролцоо, асуулт, оролдлого бүр сурах замын нэг хэсэг. Ахиц дандаа том тоогоор хэмжигдэх албагүй.</p><span className="z-path-tag">Анзааръя</span></div>
            <div className="z-path-step"><span className="z-path-number">03</span><h3>Өдөр дуусахад — ойлголцол</h3><p>Товч, ойлгомжтой тойм гэр бүлийг хүүхдийнхээ сурах ертөнцтэй ойртуулна. Зөв асуулт, зөв цагт төрнө.</p><span className="z-path-tag">Хуваалцъя</span></div>
            <div className="z-path-step"><span className="z-path-number">04</span><h3>Цаг хугацаа өнгөрөхөд — итгэл</h3><p>Жижиг амжилтууд хуримтлагдаж, хүүхэд өөрийнхөө хэр хол явснаа харах болно. Энэ бол урт замын хамгийн сайхан хэсэг.</p><span className="z-path-tag">Өсгөе</span></div>
          </div>
        </div>
      </section>

      <section className="z-section z-section-dark">
        <div className="z-container">
          <div className="z-section-heading">
            <div className="z-eyebrow">Zulzaga EDU-ийн амлалт</div>
            <h2>Хүүхэд бүр өөрийн хэмнэлтэй. Бид тэр хэмнэлийг сонсоно.</h2>
            <p>Яаралгүй, харьцуулахгүй, хүүхдийг зөвхөн үр дүнгээр нь хязгаарлахгүй. Сурах хүсэл төрөхөд нь хэрэгтэй орчныг хамтдаа бүрдүүлнэ.</p>
          </div>
        </div>
      </section>

      <section className="z-section z-testimonial-section">
        <div className="z-container z-testimonial-grid">
          <div className="z-testimonial-heading">
            <div className="z-eyebrow">Яагаад эхэлсэн бэ?</div>
            <h2>Сайн сурах орчин гэдэг сайн харилцаанаас эхэлдэг.</h2>
            <p>Zulzaga-г бүтээхдээ бид эцэг эхийн санаа зовнил, багшийн завгүй өдөр, хүүхдийн зоригтой оролдлогыг зэрэг сонссон.</p>
          </div>
          <div className="z-testimonial-card">
            <div className="z-testimonial-text">“Охин маань даалгавраа хийсэн эсэхээс илүү, өнөөдөр юуг ойлгосныг нь ярьдаг болсон.”</div>
            <div className="z-testimonial-person"><div className="z-person-avatar">ОБ</div><div><div className="z-person-name">Оюунбилэгийн ээж</div><div className="z-person-role">2-р ангийн сурагчийн гэр бүл</div></div></div>
          </div>
        </div>
      </section>

      <section className="z-section" id="faq">
        <div className="z-container z-faq-grid">
          <div className="z-faq-heading">
            <div className="z-eyebrow">Мэдэхийг хүссэн зүйл</div>
            <h2>Асуух нь эхлэхийн нэг хэлбэр.</h2>
            <p>Энд хариултаа олохгүй байвал бидэнд бичээрэй. Хамтдаа ярилцахад үргэлж бэлэн.</p>
            <button className="z-outline-button" onClick={() => setModalOpen(true)} data-testid="button-faq-contact">Асуулт асуух <MessageCircle size={15} /></button>
          </div>
          <div className="z-faq-list">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              return <div className="z-faq-item" key={question}><button className={`z-faq-button ${isOpen ? 'open' : ''}`} onClick={() => setOpenFaq(isOpen ? null : index)} data-testid={`button-faq-${index}`} aria-expanded={isOpen}>{question}<ChevronDown size={18} /></button>{isOpen && <div className="z-faq-answer" data-testid={`text-faq-answer-${index}`}>{answer}</div>}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="z-contact" id="contact">
        <div className="z-container z-contact-box">
          <div>
            <div className="z-eyebrow">Хамт эхлүүлэх үү?</div>
            <h2>Суралцах ирээдүйг хамтдаа дулаан болгоё.</h2>
            <p>Танай гэр бүл, анги, сургуульд Zulzaga EDU хэрхэн тусалж болох талаар ярилцъя. Ямар ч урт танилцуулга, төвөгтэй амлалтгүй — эхлээд сонсоно.</p>
          </div>
          {sent ? <div className="z-success" data-testid="status-contact-success"><strong>Баярлалаа.</strong><br />Таны сонирхлыг хүлээж авлаа. Бид удахгүй холбогдох болно.</div> : <form className="z-contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label htmlFor="contact-name">Таны нэр</label><input id="contact-name" required placeholder="Жишээ нь: Номин" data-testid="input-contact-name" /><label htmlFor="contact-email">Имэйл хаяг</label><input id="contact-email" type="email" required placeholder="hello@example.mn" data-testid="input-contact-email" /><label htmlFor="contact-message">Та юу сонирхож байна вэ?</label><textarea id="contact-message" placeholder="Гэр бүл, анги эсвэл сургуулийнхаа талаар бичээрэй." data-testid="input-contact-message" /><button className="z-solid-button" type="submit" data-testid="button-contact-submit">Илгээх <ArrowRight size={14} /></button></form>}
        </div>
      </section>

      <footer className="z-footer">
        <div className="z-container">
          <div className="z-footer-top">
            <div><button className="z-brand" onClick={() => navigate('top')} data-testid="button-footer-brand"><span className="z-mark"><Sparkles size={19} /></span><span><span className="z-brand-name">zulzaga</span><span className="z-brand-sub">EDU · хамтдаа өснө</span></span></button><p className="z-footer-about">Хүүхэд бүр өөрийн хэмнэлээр, өөртөө итгэлтэй сурахыг дэмжинэ.</p></div>
            <div className="z-footer-links"><div><h4>Танилцах</h4><a href="#why" data-testid="link-footer-why">Яагаад Zulzaga?</a><a href="#journey" data-testid="link-footer-journey">Хэрхэн ажилладаг вэ?</a></div><div><h4>Холбоо</h4><a href="mailto:hello@zulzaga.mn" data-testid="link-footer-email">hello@zulzaga.mn</a><a href="#contact" data-testid="link-footer-contact">Бидэнтэй ярилцах</a></div></div>
          </div>
          <div className="z-footer-bottom"><span>© 2025 Zulzaga EDU. Сайн сурах орчин хамтдаа.</span><span>Хүүхэд бүрийн талд.</span></div>
        </div>
      </footer>

      {modalOpen && <div className="z-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><div className="z-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="z-modal-top"><h3 id="modal-title">Zulzaga-г илүү ойроос танилцъя.</h3><button className="z-close" onClick={() => setModalOpen(false)} data-testid="button-close-modal" aria-label="Цонх хаах"><X size={17} /></button></div><p>Имэйлээ үлдээгээрэй. Бид V2 туршилтын хөтөлбөр, шинэ мэдээг хамгийн түрүүнд хуваалцана.</p><form className="z-contact-form" onSubmit={(event) => { event.preventDefault(); setModalOpen(false); setSent(true); scrollToId('contact'); }}><label htmlFor="modal-email">Имэйл хаяг</label><input id="modal-email" type="email" required placeholder="таны@имэйл.mn" data-testid="input-modal-email" /><button className="z-solid-button" type="submit" data-testid="button-modal-submit">Мэдээлэл авах <ArrowRight size={14} /></button></form></div></div>}
    </main>
  );
}

export default App;