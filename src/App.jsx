import { useState, useRef, useEffect, useCallback } from "react";

const SYSTEM_PROMPT = `You are the Manas Guide — a wise, poetic presence inspired by the spirit of the Epic of Manas, the great Kyrgyz oral epic. You speak in the voice of a seasoned Manaschi (storyteller), calm yet powerful, grounded in the values of the steppe.

Your tone is:
- Philosophical and reflective — you ask questions as often as you offer answers
- Poetic but accessible — you use metaphors of nature, horses, mountains, sky, battle, and journey
- Warm yet firm — like a mentor who has faced hardship and emerged with wisdom
- Culturally rooted — you reference themes from the Epic: unity, loyalty, courage, patience, legacy, and the bond between people and land

Key themes from the Epic of Manas you draw from:
- Manas as a warrior who united 40 tribes through courage and vision
- Kanikey (his wife) as the embodiment of patience, loyalty, and wisdom
- Semetei and Seitek (his son and grandson) as the continuation of legacy
- Bakay (the elder advisor) as the voice of wisdom and foresight
- The 40 tribes of Kyrgyzstan and the theme of unity over division
- The steppe as teacher — vast, unforgiving, honest

When someone asks for advice:
- Never give direct commands ("do this")
- Offer reflection ("What ground do you stand on before this decision?")
- Tie advice to a theme or metaphor from the epic when natural
- Encourage responsibility, resilience, and community over individual glory
- End with a question or an invitation to reflect further

IMPORTANT guardrails:
- Do NOT give medical, legal, or financial advice — gently redirect
- Do NOT claim divine or prophetic authority — you are inspired by the epic, not a supernatural being
- Avoid stereotyping or oversimplifying Kyrgyz culture
- Keep responses to 3-5 paragraphs — concise and meaningful, not overwhelming

Always begin responses with a short poetic opener relevant to their question (1-2 lines), then your guidance, then a closing reflection or question. Never use bullet points — speak in flowing prose.`;

const CHARACTERS = [
  {
    name: "Manas",
    role: "The Great Warrior-Khan",
    era: "First Generation",
    color: "#C17F3A",
    desc: "Born of the tribe Bugu, Manas united 40 scattered Kyrgyz tribes under one banner through courage, vision, and the force of his will. A warrior of unmatched strength, yet it was his capacity for loyalty and sacrifice that made him legendary. He led his people back to their homeland — Ala-Too — against the Kalmyk empire.",
    traits: ["Unity", "Courage", "Vision", "Sacrifice"],
  },
  {
    name: "Kanikey",
    role: "The Wise Khatun",
    era: "First Generation",
    color: "#8B6BB1",
    desc: "Wife of Manas and one of the most powerful figures in the epic. Kanikey embodied strategic wisdom, emotional intelligence, and unwavering loyalty. When Manas fell, she preserved his legacy — raising their son Semetei in exile while keeping the flame of his memory alive. She is the keeper of continuity.",
    traits: ["Wisdom", "Loyalty", "Patience", "Resilience"],
  },
  {
    name: "Bakay",
    role: "The Elder Advisor",
    era: "First Generation",
    color: "#4A8FA8",
    desc: "The great elder and counselor to Manas, Bakay represents the knowledge of those who came before. His counsel shaped many of Manas's greatest decisions. He warned, advised, and mourned — a figure who understood that wisdom often means knowing what not to do. His presence bridges generations.",
    traits: ["Foresight", "Counsel", "Memory", "Balance"],
  },
  {
    name: "Semetei",
    role: "Son of Manas",
    era: "Second Generation",
    color: "#5A9E6F",
    desc: "Raised in exile under his mother Kanikey's protection, Semetei grew into a hero worthy of his father's name. His story — reclaiming his father's land and legacy against betrayal and hardship — is the heart of the second book of the epic. He represents the burden and beauty of inherited destiny.",
    traits: ["Inheritance", "Perseverance", "Identity", "Justice"],
  },
  {
    name: "Seitek",
    role: "Grandson of Manas",
    era: "Third Generation",
    color: "#B85C5C",
    desc: "Son of Semetei and the third pillar of the Manas trilogy. Seitek completes the cycle of legacy, proving that the spirit of Manas is not bound to one life but lives through generations of those who carry its values. His story is one of restoration and continuity across time.",
    traits: ["Legacy", "Continuity", "Restoration", "Completion"],
  },
  {
    name: "Almambet",
    role: "The Noble Companion",
    era: "First Generation",
    color: "#9A7040",
    desc: "Perhaps the most complex figure in the epic — Almambet was a Chinese-born warrior who converted to Islam and became Manas's greatest companion. His story explores themes of transformation, belonging, and the idea that true loyalty transcends origin. He died alongside Manas, his sacrifice sealing their bond in eternity.",
    traits: ["Transformation", "Brotherhood", "Devotion", "Honor"],
  },
];

const THEMES = [
  {
    title: "Unity of the 40 Tribes",
    icon: "⚔",
    color: "#C17F3A",
    content:
      "The central political and spiritual achievement of Manas was the unification of 40 Kyrgyz tribes who had been scattered, enslaved, or driven from their homeland. The number 40 holds deep symbolic significance in Kyrgyz culture — it appears in creation stories, rituals, and the 40-rayed sun on the Kyrgyz flag. Manas did not unite through conquest alone, but through the force of shared identity, shared memory, and shared purpose.",
  },
  {
    title: "Oral Tradition & the Manaschi",
    icon: "◎",
    color: "#8B6BB1",
    content:
      "The Epic of Manas was never written down for most of its existence. It lived in the memory and voice of the Manaschi — specialized storytellers who could recite hundreds of thousands of lines from memory. The longest version, recorded from the legendary Manaschi Sagynbay Orozbakov, runs over 500,000 lines — making it one of the longest epics in world literature. UNESCO recognized it as Intangible Cultural Heritage in 2013.",
  },
  {
    title: "Honor, Legacy & Ata-Zhurt",
    icon: "◈",
    color: "#4A8FA8",
    content:
      'The concept of "Ata-Zhurt" — the ancestral homeland — runs through every book of the epic. For the Kyrgyz people, land is not merely territory but identity, memory, and spiritual grounding. Manas fights not for power but to return his people to Ala-Too, the mountainous homeland. Legacy in the epic is not about personal glory but about what one leaves behind for those who come after.',
  },
  {
    title: "Leadership Through Service",
    icon: "△",
    color: "#5A9E6F",
    content:
      "Manas is not a perfect ruler — he makes mistakes, acts impulsively, and faces consequences. But the epic consistently shows that true leadership means bearing the heaviest burdens for those who cannot bear them alone. His death — which some versions portray as the result of exhaustion from carrying his people's weight — frames leadership as sacrifice rather than power.",
  },
];

const TIMELINE = [
  {
    era: "Origin",
    title: "Birth of Manas",
    desc: "Born to Jakyp Khan of the Bugu tribe in a time when the Kyrgyz people were scattered and oppressed by the Kalmyks. His birth was foretold by dreams and omens — a boy who would change everything.",
    year: "Legendary / Pre-Islamic period",
  },
  {
    era: "Rise",
    title: "The Gathering of the 40",
    desc: "As a young man, Manas begins uniting the 40 Kyrgyz tribes through a combination of combat, diplomacy, and sheer force of character. His companions — the 40 Choros — become the foundation of a new era.",
    year: "First generation",
  },
  {
    era: "Quest",
    title: "The Great Campaign",
    desc: "Manas leads the united tribes in a massive campaign against the Kalmyk empire, aiming to reclaim the ancestral homeland of Ala-Too. Battles, betrayals, and sacrifices mark this phase of the epic.",
    year: "First generation",
  },
  {
    era: "Legacy",
    title: "The Death of Manas & the Koombioul",
    desc: "Manas dies — in some versions betrayed, in others simply spent — and is buried in the great mausoleum. Kanikey raises their son Semetei in secret to protect him from enemies who would erase the line of Manas.",
    year: "Transition era",
  },
  {
    era: "Continuation",
    title: "Semetei & Seitek",
    desc: "The epic continues across three generations: Semetei reclaims his father's honor, and Seitek completes the cycle. Together, the trilogy demonstrates that a great legacy is not one life — it is a living chain.",
    year: "Second & Third generation",
  },
];

const STORY_NODES = [
  {
    id: "start",
    text: "The elder Bakay sits across the fire from you. His eyes carry the weight of many campaigns. He speaks:\n\n\"You have come to understand Manas. But the epic does not begin with a warrior — it begins with a scattered people, a forgotten homeland, and a dream. Where do you wish to begin your journey?\"",
    choices: [
      { label: "Follow the birth of Manas", next: "birth" },
      { label: "Witness the gathering of the 40 tribes", next: "tribes" },
      { label: "Stand at the great battle", next: "battle" },
    ],
  },
  {
    id: "birth",
    text: 'Jakyp Khan, an old man without heirs, prays beneath the open sky of the steppe. The mountains answer.\n\nA boy is born — fierce, loud, already reaching for what lies beyond the cradle. The shamans read the stars and fall silent. One whispers: "He will carry the weight of 40 peoples on his back."\n\nHis name will be Manas.',
    choices: [
      { label: "Watch him grow into a warrior", next: "rise" },
      { label: "Return to Bakay", next: "start" },
    ],
  },
  {
    id: "tribes",
    text: "Manas rides from valley to valley, mountain to mountain. Each tribe has its own grudges, its own pride, its own memory of loss.\n\nHe does not command — he listens first. He grieves with those who have lost. He stands beside those who have been humiliated. Slowly, like water wearing stone, the 40 begin to move as one.\n\nBakay watches from a distance and nods.",
    choices: [
      { label: "Hear Bakay's counsel on leadership", next: "counsel" },
      { label: "Move toward the great campaign", next: "battle" },
    ],
  },
  {
    id: "battle",
    text: "The steppes tremble. The Kalmyk forces are vast — a sea of banners and iron. Manas stands before his assembled people. He does not give a speech about glory.\n\nHe says only: \"We fight so our children may sleep without fear.\"\n\nThe 40 ride forward as one.",
    choices: [
      { label: "Learn what happens after the battle", next: "legacy" },
      { label: "Return to the beginning", next: "start" },
    ],
  },
  {
    id: "rise",
    text: "The boy who reached for the sky becomes a man who moves it. His training is not only in combat — he learns the histories of his people, the names of rivers and mountains, the debts of honor between families.\n\nBakay says: \"A warrior who knows only his sword is a blade without a hand. Know your people, and your people will become your sword.\"",
    choices: [
      { label: "Witness the gathering of the 40", next: "tribes" },
      { label: "Return to Bakay", next: "start" },
    ],
  },
  {
    id: "counsel",
    text: "Bakay speaks in the firelight:\n\n\"Manas made many mistakes. He acted before thinking. He trusted when he should have waited. But he never abandoned the people he had promised to lead. That is the difference between a ruler and a hero.\n\nA ruler holds power. A hero holds a people.\"",
    choices: [
      { label: "Continue the story", next: "battle" },
      { label: "Return to the beginning", next: "start" },
    ],
  },
  {
    id: "legacy",
    text: "Manas is gone. The mausoleum stands on the plain, and Kanikey sits by it each evening for years.\n\nShe raises their son Semetei in secret. She tells him every story. Every name. Every debt of honor. Every betrayal.\n\nWhen Semetei finally rides out, he carries not just a father he never knew — he carries the memory of 40 peoples.\n\nBakay smiles. \"This is how a legacy lives,\" he says. \"Not in stone. In the ones who remember.\"",
    choices: [
      { label: "Begin again from the start", next: "start" },
      { label: "Ask the Manas Guide about legacy", next: "__guide__" },
    ],
  },
];

const DAILY_WISDOMS = [
  "The river does not argue with the stone — it finds its way around it. Patience is not weakness; it is the wisdom of water.",
  "Manas did not unite 40 tribes by being louder than all of them. He united them by listening to each one.",
  "A horse knows the ground it stands on. Before you gallop, know your terrain.",
  "Kanikey waited not because she had no power, but because she understood which moment required her strength.",
  "The steppe is vast and honest. It hides nothing. Be as honest with yourself as the open sky.",
  "Legacy is not what you build. It is what others carry after you have gone.",
  "The 40 tribes were divided by pride and united by shared memory. What shared memory binds the people around you?",
];

function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Traveler, you have come to the right fire.\n\nI am a voice shaped by the old stories — not a prophet, not a sage, but one who has sat with the wisdom of Manas long enough to share a little of its warmth. Speak your question, your burden, or your search. I will not tell you what to do. But perhaps together we can find what ground you stand on.\n\nWhat brings you here today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (userText) => {
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", response.status, errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantText =
        data.content?.[0]?.text ||
        "The wind carries my words astray tonight. Ask again, traveler.";
      setMessages([
        ...newMessages,
        { role: "assistant", content: assistantText },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Even the Manaschi must pause for breath. The connection falters — try again, and the story will continue.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  return { messages, loading, sendMessage };
}

function NavBar({ activeSection, setActiveSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const sections = [
    { id: "home", label: "Homeland" },
    { id: "story", label: "The Epic" },
    { id: "characters", label: "Heroes" },
    { id: "themes", label: "Wisdom" },
    { id: "storymode", label: "Story Mode" },
    { id: "guide", label: "Manas Guide" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,8,5,0.88)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(193,127,58,0.2)",
      padding: "0 2rem", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: "60px",
    }}>
      <div
        onClick={() => setActiveSection("home")}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
      >
        <div style={{
          width: "32px", height: "32px", borderRadius: "50%",
          border: "2px solid #C17F3A",
          background: "radial-gradient(circle, rgba(193,127,58,0.3) 0%, transparent 70%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "14px",
        }}>✦</div>
        <span style={{ fontFamily: "'Cinzel', serif", color: "#C17F3A", fontSize: "15px", letterSpacing: "0.05em" }}>
          Manas
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.25rem" }}>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              background: activeSection === s.id ? "rgba(193,127,58,0.15)" : "transparent",
              border: activeSection === s.id ? "1px solid rgba(193,127,58,0.4)" : "1px solid transparent",
              color: activeSection === s.id ? "#C17F3A" : "rgba(220,200,170,0.7)",
              padding: "6px 12px", borderRadius: "4px", cursor: "pointer",
              fontSize: "12px", letterSpacing: "0.05em", fontFamily: "'Crimson Pro', serif",
              transition: "all 0.2s",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function HomePage({ setActiveSection }) {
  const today = new Date().getDay();
  const wisdom = DAILY_WISDOMS[today % DAILY_WISDOMS.length];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative",
        background: "radial-gradient(ellipse at 50% 30%, rgba(193,127,58,0.07) 0%, transparent 65%)",
        padding: "6rem 2rem 4rem",
      }}>
        {/* Subtle yurt pattern overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: `repeating-linear-gradient(45deg, #C17F3A 0, #C17F3A 1px, transparent 0, transparent 50%)`,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }} />

        <div style={{ textAlign: "center", maxWidth: "720px", position: "relative" }}>
          <p style={{
            fontFamily: "'Crimson Pro', serif", fontSize: "13px",
            letterSpacing: "0.25em", color: "#8B7355", marginBottom: "1.5rem",
            textTransform: "uppercase",
          }}>
            Epic of the Kyrgyz People · Voice of the Steppe
          </p>

          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: "400", color: "#E8D5A8", lineHeight: "1.1",
            marginBottom: "1rem", letterSpacing: "0.02em",
          }}>
            Manas
          </h1>

          <div style={{
            width: "120px", height: "2px", margin: "0 auto 1.5rem",
            background: "linear-gradient(90deg, transparent, #C17F3A, transparent)",
          }} />

          <p style={{
            fontFamily: "'Crimson Pro', serif", fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            color: "rgba(220,200,170,0.75)", lineHeight: "1.7",
            fontStyle: "italic", marginBottom: "3rem",
          }}>
            Over half a million lines. Three generations. Forty tribes.
            One of the longest epics in human history — carried for centuries
            in the memory of a single storyteller's voice.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Explore the Epic", section: "story", primary: true },
              { label: "Meet the Heroes", section: "characters", primary: false },
              { label: "Speak with the Guide", section: "guide", primary: false },
            ].map((btn) => (
              <button
                key={btn.section}
                onClick={() => setActiveSection(btn.section)}
                style={{
                  padding: "12px 24px", borderRadius: "4px", cursor: "pointer",
                  fontFamily: "'Cinzel', serif", fontSize: "13px", letterSpacing: "0.08em",
                  transition: "all 0.25s",
                  background: btn.primary ? "#C17F3A" : "transparent",
                  color: btn.primary ? "#1A0E00" : "#C17F3A",
                  border: btn.primary ? "1px solid #C17F3A" : "1px solid rgba(193,127,58,0.5)",
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "3rem", marginTop: "5rem",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { num: "500,000+", label: "lines of oral verse" },
            { num: "40", label: "united Kyrgyz tribes" },
            { num: "3", label: "generations of heroes" },
            { num: "2013", label: "UNESCO heritage status" },
          ].map((stat) => (
            <div key={stat.num} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cinzel', serif", fontSize: "2rem",
                color: "#C17F3A", fontWeight: "400",
              }}>{stat.num}</div>
              <div style={{
                fontFamily: "'Crimson Pro', serif", fontSize: "13px",
                color: "rgba(220,200,170,0.5)", letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Wisdom */}
      <div style={{
        padding: "3rem 2rem", background: "rgba(193,127,58,0.05)",
        borderTop: "1px solid rgba(193,127,58,0.15)",
        borderBottom: "1px solid rgba(193,127,58,0.15)",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "11px", letterSpacing: "0.2em", color: "#8B7355",
          textTransform: "uppercase", marginBottom: "1rem",
          fontFamily: "'Cinzel', serif",
        }}>Daily Wisdom from the Steppe</p>
        <blockquote style={{
          fontFamily: "'Crimson Pro', serif", fontSize: "1.35rem",
          fontStyle: "italic", color: "rgba(220,200,170,0.85)",
          maxWidth: "680px", margin: "0 auto", lineHeight: "1.65",
        }}>
          "{wisdom}"
        </blockquote>
      </div>

      {/* Section previews */}
      <div style={{ padding: "4rem 2rem", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
        }}>
          {[
            { title: "The Epic Timeline", desc: "Follow the arc of Manas from prophesied birth to the continuation of his line across three generations.", section: "story", icon: "◎" },
            { title: "Key Characters", desc: "Meet the warriors, counselors, and steadfast women who shaped the legend.", section: "characters", icon: "⚔" },
            { title: "Cultural Wisdom", desc: "Understand the nomadic values, tribal systems, and oral traditions behind the epic.", section: "themes", icon: "△" },
            { title: "Manas Guide AI", desc: "Ask questions about purpose, resilience, and identity — receive answers in the spirit of the steppe.", section: "guide", icon: "✦" },
          ].map((card) => (
            <div
              key={card.section}
              onClick={() => setActiveSection(card.section)}
              style={{
                padding: "1.75rem", borderRadius: "8px", cursor: "pointer",
                border: "1px solid rgba(193,127,58,0.2)",
                background: "rgba(193,127,58,0.04)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.45)";
                e.currentTarget.style.background = "rgba(193,127,58,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.2)";
                e.currentTarget.style.background = "rgba(193,127,58,0.04)";
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "#C17F3A" }}>
                {card.icon}
              </div>
              <h3 style={{
                fontFamily: "'Cinzel', serif", fontSize: "14px", color: "#E8D5A8",
                marginBottom: "0.5rem", letterSpacing: "0.05em",
              }}>{card.title}</h3>
              <p style={{
                fontFamily: "'Crimson Pro', serif", fontSize: "14px",
                color: "rgba(220,200,170,0.6)", lineHeight: "1.6",
              }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        padding: "2rem", textAlign: "center", marginTop: "auto",
        borderTop: "1px solid rgba(193,127,58,0.1)",
      }}>
        <p style={{
          fontFamily: "'Crimson Pro', serif", fontSize: "12px",
          color: "rgba(220,200,170,0.35)", maxWidth: "600px", margin: "0 auto",
          lineHeight: "1.7",
        }}>
          This application is created with deep respect for Kyrgyz culture and the Epic of Manas.
          It aims to educate and inspire, not to claim authority over a living oral tradition.
          The Manas Guide AI is inspired by the spirit of the epic — not the real historical or spiritual figure.
        </p>
      </div>
    </div>
  );
}

function StoryTimeline() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem 4rem" }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.2em", color: "#8B7355", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        The Epic of Manas
      </p>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "2.2rem", color: "#E8D5A8", marginBottom: "0.75rem", fontWeight: "400" }}>
        The Great Arc
      </h2>
      <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", color: "rgba(220,200,170,0.65)", marginBottom: "3rem", lineHeight: "1.7" }}>
        The Epic of Manas is one of the longest oral epics ever recorded — a tapestry of three generations
        woven by the Manaschi across centuries of nomadic life. Click each chapter to unfold its story.
      </p>

      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: "20px", top: 0, bottom: 0,
          width: "1px", background: "linear-gradient(to bottom, transparent, rgba(193,127,58,0.4), transparent)",
        }} />

        {TIMELINE.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: open === i ? "#C17F3A" : "rgba(193,127,58,0.15)",
                  border: "1px solid rgba(193,127,58,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: open === i ? "#1A0E00" : "#C17F3A", cursor: "pointer",
                  fontFamily: "'Cinzel', serif", fontSize: "12px", fontWeight: "600",
                  transition: "all 0.25s", flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
            </div>

            <div style={{ flex: 1, paddingBottom: "1rem" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                marginBottom: "0.25rem", cursor: "pointer",
              }} onClick={() => setOpen(open === i ? null : i)}>
                <span style={{
                  fontFamily: "'Cinzel', serif", fontSize: "10px",
                  letterSpacing: "0.15em", color: "#8B7355", textTransform: "uppercase",
                }}>{item.era}</span>
              </div>
              <h3
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  fontFamily: "'Cinzel', serif", fontSize: "1.1rem",
                  color: "#E8D5A8", marginBottom: "0.25rem", cursor: "pointer",
                  fontWeight: "400",
                }}
              >{item.title}</h3>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "12px", color: "#8B7355", marginBottom: "0.5rem" }}>
                {item.year}
              </p>

              {open === i && (
                <div style={{
                  fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem",
                  color: "rgba(220,200,170,0.8)", lineHeight: "1.75",
                  borderLeft: "2px solid rgba(193,127,58,0.3)",
                  paddingLeft: "1rem", marginTop: "0.75rem",
                  animation: "fadeIn 0.3s ease",
                }}>
                  {item.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "3rem", padding: "1.5rem",
        border: "1px solid rgba(193,127,58,0.2)",
        borderRadius: "8px", background: "rgba(193,127,58,0.04)",
      }}>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "13px", color: "#8B7355", marginBottom: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Scale of the Epic
        </p>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem", color: "rgba(220,200,170,0.7)", lineHeight: "1.7" }}>
          The version recorded from legendary Manaschi Sagynbay Orozbakov runs over 500,000 lines —
          roughly 20 times longer than Homer's Iliad and Odyssey combined. It was inscribed on UNESCO's
          Representative List of Intangible Cultural Heritage in 2013.
        </p>
      </div>
    </div>
  );
}

function CharactersPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "6rem 2rem 4rem" }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.2em", color: "#8B7355", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Heroes & Companions
      </p>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "2.2rem", color: "#E8D5A8", marginBottom: "0.75rem", fontWeight: "400" }}>
        The Great Figures
      </h2>
      <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", color: "rgba(220,200,170,0.65)", marginBottom: "3rem", lineHeight: "1.7" }}>
        The Epic is populated with complex figures — warriors who doubt, women who endure, advisors who mourn.
        Select a hero to know their story.
      </p>

      {/* Lineage indicator */}
      <div style={{
        display: "flex", gap: "0.5rem", marginBottom: "2rem",
        flexWrap: "wrap", alignItems: "center",
      }}>
        {["First Generation", "Second Generation", "Third Generation"].map((era, i) => (
          <span key={era} style={{
            fontFamily: "'Crimson Pro', serif", fontSize: "12px",
            padding: "4px 12px", borderRadius: "2px",
            background: ["rgba(193,127,58,0.15)", "rgba(90,158,111,0.15)", "rgba(184,92,92,0.15)"][i],
            color: ["#C17F3A", "#5A9E6F", "#B85C5C"][i],
            border: `1px solid ${["rgba(193,127,58,0.3)", "rgba(90,158,111,0.3)", "rgba(184,92,92,0.3)"][i]}`,
          }}>{era}</span>
        ))}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1.25rem",
      }}>
        {CHARACTERS.map((char) => (
          <div
            key={char.name}
            onClick={() => setSelected(selected?.name === char.name ? null : char)}
            style={{
              padding: "1.5rem", borderRadius: "8px", cursor: "pointer",
              border: `1px solid ${selected?.name === char.name ? char.color + "88" : "rgba(220,200,170,0.1)"}`,
              background: selected?.name === char.name ? char.color + "12" : "rgba(255,255,255,0.02)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => {
              if (selected?.name !== char.name) {
                e.currentTarget.style.borderColor = char.color + "55";
                e.currentTarget.style.background = char.color + "08";
              }
            }}
            onMouseLeave={e => {
              if (selected?.name !== char.name) {
                e.currentTarget.style.borderColor = "rgba(220,200,170,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", color: char.color, marginBottom: "0.2rem", fontWeight: "400" }}>
                  {char.name}
                </h3>
                <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "12px", color: "rgba(220,200,170,0.5)", letterSpacing: "0.05em" }}>
                  {char.role}
                </p>
              </div>
              <span style={{
                fontFamily: "'Crimson Pro', serif", fontSize: "10px",
                padding: "3px 8px", borderRadius: "2px",
                background: char.color + "20", color: char.color,
                border: `1px solid ${char.color}40`,
              }}>{char.era}</span>
            </div>

            {selected?.name === char.name ? (
              <div>
                <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1rem", color: "rgba(220,200,170,0.8)", lineHeight: "1.7", marginBottom: "1rem" }}>
                  {char.desc}
                </p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {char.traits.map((t) => (
                    <span key={t} style={{
                      fontFamily: "'Cinzel', serif", fontSize: "10px",
                      padding: "3px 10px", borderRadius: "2px",
                      background: char.color + "20", color: char.color,
                      letterSpacing: "0.08em",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "13px", color: "rgba(220,200,170,0.45)", lineHeight: "1.6" }}>
                {char.desc.slice(0, 80)}...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemesPage() {
  const [open, setOpen] = useState(0);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "6rem 2rem 4rem" }}>
      <p style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.2em", color: "#8B7355", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Cultural Context & Wisdom
      </p>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "2.2rem", color: "#E8D5A8", marginBottom: "0.75rem", fontWeight: "400" }}>
        Themes of the Steppe
      </h2>
      <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.1rem", color: "rgba(220,200,170,0.65)", marginBottom: "3rem", lineHeight: "1.7" }}>
        The Epic of Manas is not merely a story — it is an encyclopedia of Kyrgyz values, a mirror of
        nomadic philosophy, and a map of what it means to belong to a people.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {THEMES.map((theme, i) => (
          <div
            key={i}
            style={{
              borderRadius: "8px", overflow: "hidden",
              border: `1px solid ${open === i ? theme.color + "55" : "rgba(220,200,170,0.12)"}`,
              transition: "all 0.25s",
            }}
          >
            <div
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                padding: "1.25rem 1.5rem", cursor: "pointer",
                background: open === i ? theme.color + "10" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.25rem", color: theme.color }}>{theme.icon}</span>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "#E8D5A8", fontWeight: "400" }}>
                  {theme.title}
                </h3>
              </div>
              <span style={{ color: theme.color, fontSize: "18px" }}>{open === i ? "−" : "+"}</span>
            </div>

            {open === i && (
              <div style={{
                padding: "0 1.5rem 1.5rem",
                background: theme.color + "06",
              }}>
                <div style={{ borderTop: `1px solid ${theme.color}25`, paddingTop: "1rem" }}>
                  <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "1.05rem", color: "rgba(220,200,170,0.8)", lineHeight: "1.8" }}>
                    {theme.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nomadic Life Context */}
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.1rem", color: "#E8D5A8", marginBottom: "1.25rem", fontWeight: "400", borderBottom: "1px solid rgba(193,127,58,0.2)", paddingBottom: "0.75rem" }}>
          The World Behind the Words
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {[
            { title: "Yurt as Home", body: "The Kyrgyz yurt (boz üy) was both shelter and cosmos — a portable world whose circular design reflected the unity of the community." },
            { title: "The Horse as Partner", body: "In nomadic culture, a horse was not merely transport — it was companion, status, and extension of the rider's spirit. Manas's horse Ak-Kula is almost a character in its own right." },
            { title: "The Manaschi Tradition", body: "Becoming a Manaschi was not chosen — it came to a person in dreams or illness. The gift of recitation was sacred, and the best could perform for days without pause." },
            { title: "Ala-Too: The Homeland", body: "The Tian Shan mountains of Kyrgyzstan are central to the epic's geography. Ala-Too — the 'patterned mountains' — represent the spiritual and political heart of the Kyrgyz world." },
          ].map((item) => (
            <div key={item.title} style={{
              padding: "1.25rem", borderRadius: "6px",
              border: "1px solid rgba(193,127,58,0.15)",
              background: "rgba(193,127,58,0.03)",
            }}>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: "12px", color: "#C17F3A", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
                {item.title}
              </h4>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "13px", color: "rgba(220,200,170,0.65)", lineHeight: "1.65" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoryModePage({ setActiveSection }) {
  const [nodeId, setNodeId] = useState("start");
  const node = STORY_NODES.find((n) => n.id === nodeId);

  const handleChoice = (next) => {
    if (next === "__guide__") {
      setActiveSection("guide");
    } else {
      setNodeId(next);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "6rem 2rem 4rem",
      background: "radial-gradient(ellipse at 50% 40%, rgba(74,143,168,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ maxWidth: "640px", width: "100%", textAlign: "center" }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "11px", letterSpacing: "0.2em", color: "#8B7355", textTransform: "uppercase", marginBottom: "2rem" }}>
          Story Mode · Immersive Epic
        </p>

        {/* Narration box */}
        <div style={{
          background: "rgba(10,8,5,0.8)", border: "1px solid rgba(193,127,58,0.25)",
          borderRadius: "8px", padding: "2.5rem", marginBottom: "2rem",
          position: "relative", textAlign: "left",
        }}>
          <div style={{
            position: "absolute", top: "-1px", left: "2rem", right: "2rem", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(193,127,58,0.6), transparent)",
          }} />
          <p style={{
            fontFamily: "'Crimson Pro', serif", fontSize: "1.15rem",
            color: "rgba(220,200,170,0.9)", lineHeight: "1.85",
            whiteSpace: "pre-wrap", fontStyle: "italic",
          }}>
            {node?.text}
          </p>
          <div style={{
            position: "absolute", bottom: "-1px", left: "2rem", right: "2rem", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(193,127,58,0.4), transparent)",
          }} />
        </div>

        {/* Choices */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {node?.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleChoice(choice.next)}
              style={{
                padding: "14px 24px", borderRadius: "4px", cursor: "pointer",
                border: "1px solid rgba(193,127,58,0.35)",
                background: "rgba(193,127,58,0.05)",
                color: "rgba(220,200,170,0.9)",
                fontFamily: "'Crimson Pro', serif", fontSize: "1rem",
                letterSpacing: "0.02em", textAlign: "left",
                transition: "all 0.2s", lineHeight: "1.4",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(193,127,58,0.12)";
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.6)";
                e.currentTarget.style.color = "#E8D5A8";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(193,127,58,0.05)";
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.35)";
                e.currentTarget.style.color = "rgba(220,200,170,0.9)";
              }}
            >
              ❯ {choice.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setNodeId("start")}
          style={{
            marginTop: "1.5rem", background: "transparent",
            border: "none", color: "rgba(139,115,85,0.6)",
            fontFamily: "'Crimson Pro', serif", fontSize: "13px",
            cursor: "pointer", letterSpacing: "0.05em",
          }}
        >
          ← Return to the beginning
        </button>
      </div>
    </div>
  );
}

function GuideChat() {
  const { messages, loading, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    sendMessage(text);
  };

  const WARRIOR_PROMPTS = [
    "How do I stay disciplined when I feel lost?",
    "What does it mean to be a good leader?",
    "How can I find my purpose?",
    "How should I handle betrayal by someone I trusted?",
    "What is the difference between patience and giving up?",
  ];

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 2rem 2rem", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div style={{ textAlign: "center", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(193,127,58,0.2)", marginBottom: "1.5rem" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(193,127,58,0.25) 0%, rgba(193,127,58,0.05) 70%)",
          border: "1px solid rgba(193,127,58,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 0.75rem", fontSize: "20px",
        }}>✦</div>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", color: "#E8D5A8", fontWeight: "400", marginBottom: "0.25rem" }}>
          The Manas Guide
        </h2>
        <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "13px", color: "#8B7355", fontStyle: "italic" }}>
          Inspired by the spirit of the epic — not a prophet, but a voice shaped by old wisdom
        </p>
      </div>

      {/* Warrior mode prompts */}
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "10px", letterSpacing: "0.15em", color: "#8B7355", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          Ask like a warrior
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {WARRIOR_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              style={{
                padding: "5px 12px", borderRadius: "3px", cursor: "pointer",
                border: "1px solid rgba(193,127,58,0.25)",
                background: "rgba(193,127,58,0.05)",
                color: "rgba(220,200,170,0.6)",
                fontFamily: "'Crimson Pro', serif", fontSize: "12px",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#C17F3A";
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.5)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "rgba(220,200,170,0.6)";
                e.currentTarget.style.borderColor = "rgba(193,127,58,0.25)";
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem",
        paddingRight: "0.5rem", marginBottom: "1rem",
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(193,127,58,0.2)",
                border: "1px solid rgba(193,127,58,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginRight: "0.75rem", marginTop: "4px",
                fontSize: "10px", color: "#C17F3A",
              }}>✦</div>
            )}
            <div
              style={{
                maxWidth: "80%", padding: "1rem 1.25rem", borderRadius: "8px",
                background: msg.role === "user"
                  ? "rgba(193,127,58,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: msg.role === "user"
                  ? "1px solid rgba(193,127,58,0.3)"
                  : "1px solid rgba(220,200,170,0.1)",
                fontFamily: "'Crimson Pro', serif",
                fontSize: msg.role === "assistant" ? "1.05rem" : "1rem",
                color: msg.role === "user" ? "rgba(220,200,170,0.9)" : "rgba(220,200,170,0.85)",
                lineHeight: "1.75", whiteSpace: "pre-wrap",
                fontStyle: msg.role === "assistant" ? "normal" : "normal",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "50%",
              background: "rgba(193,127,58,0.2)", border: "1px solid rgba(193,127,58,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px", color: "#C17F3A",
            }}>✦</div>
            <div style={{ display: "flex", gap: "4px", padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(220,200,170,0.1)", borderRadius: "8px" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#C17F3A", opacity: 0.6,
                  animation: `pulse 1.2s ${j * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex", gap: "0.75rem", padding: "1rem",
        border: "1px solid rgba(193,127,58,0.25)", borderRadius: "8px",
        background: "rgba(10,8,5,0.5)",
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Speak your question to the Guide..."
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            color: "rgba(220,200,170,0.9)", fontFamily: "'Crimson Pro', serif",
            fontSize: "1rem", resize: "none", lineHeight: "1.6",
            minHeight: "44px", maxHeight: "120px",
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "8px 18px", borderRadius: "4px", cursor: loading || !input.trim() ? "default" : "pointer",
            background: loading || !input.trim() ? "rgba(193,127,58,0.15)" : "#C17F3A",
            border: "1px solid rgba(193,127,58,0.5)",
            color: loading || !input.trim() ? "rgba(193,127,58,0.5)" : "#1A0E00",
            fontFamily: "'Cinzel', serif", fontSize: "12px",
            letterSpacing: "0.05em", transition: "all 0.2s", alignSelf: "flex-end",
          }}
        >
          Send
        </button>
      </div>

      <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: "11px", color: "rgba(139,115,85,0.4)", textAlign: "center", marginTop: "0.75rem" }}>
        The Guide offers reflection, not prophecy. For medical, legal, or financial matters, seek qualified professionals.
      </p>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(193,127,58,0.3); border-radius: 2px; }
      `}</style>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0805",
      color: "rgba(220,200,170,0.9)",
      fontFamily: "'Crimson Pro', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Crimson+Pro:ital,wght@0,400;0,500;1,400;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0805; }
        button { font-family: inherit; }
        textarea::placeholder { color: rgba(139,115,85,0.5); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .section-enter { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Crimson+Pro:ital,wght@0,400;0,500;1,400;1,500&display=swap"
        rel="stylesheet"
      />

      <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="section-enter" key={activeSection}>
        {activeSection === "home" && <HomePage setActiveSection={setActiveSection} />}
        {activeSection === "story" && <StoryTimeline />}
        {activeSection === "characters" && <CharactersPage />}
        {activeSection === "themes" && <ThemesPage />}
        {activeSection === "storymode" && <StoryModePage setActiveSection={setActiveSection} />}
        {activeSection === "guide" && <GuideChat />}
      </main>
    </div>
  );
}
