import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSend, IoChevronBack, IoChatbubbles } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';

interface Message { id: string; text: string; isUser: boolean; }

const KB: Record<string, string> = {
  play: "Tap any song card to start playing. The mini-player will appear at the bottom so you can control playback from any screen.",
  search: "Go to the Search tab and type your query. Results appear as you type with a short delay to save data.",
  playlist: "Go to Library → tap the + button → give your playlist a name. Then tap 'Add to Playlist' on any song.",
  like: "Tap the ❤️ button on any song or in the Player screen. All liked songs are in Library → Liked Songs.",
  theme: "Go to Settings → Themes. There are 40 beautiful themes — dark and light!",
  download: "On any song, tap the ⋯ menu and choose 'Download Song'. This opens the stream in a new tab to save.",
  lyrics: "Lyrics are shown automatically in the Player screen. Synchronized lyrics scroll with the music.",
  repeat: "In the Player, tap the repeat button to cycle: Off → Repeat One → Repeat All.",
  login: "Tap the Login button or go to Settings. Use email/password or Google to sign in.",
  register: "Go to Login → Register. Enter your name, email, and password to create an account.",
  recently: "Melodify remembers what you listen to. View your history in Settings → Recently Played.",
  help: "I can help with: playing music, searching, playlists, likes, themes, downloads, lyrics, login, and more!",
  hello: "Hi there! 👋 I'm Melodify AI. How can I help you today?",
  hi: "Hello! I'm the Melodify support assistant. Ask me anything about the app!",
};

const getResponse = (input: string): string => {
  const text = input.toLowerCase();
  for (const [key, answer] of Object.entries(KB)) {
    if (text.includes(key)) return answer;
  }
  return "I'm here to help with Melodify! Try asking about playing music, playlists, themes, lyrics, or login.";
};

export default function SupportChatPage() {
  const { colors } = useTheme();
  const nav = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hi! I'm the Melodify AI assistant 🎵 Ask me anything about the app!", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), text, isUser: true };
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: getResponse(text), isUser: false };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderBottom: `1px solid ${colors.glassBorder}` }}>
        <button className="icon-btn" onClick={() => nav(-1)} style={{ color: colors.text }}><IoChevronBack size={26} /></button>
        <IoChatbubbles size={26} color={colors.primary} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: colors.text }}>Melodify AI Support</div>
          <div style={{ fontSize: 12, color: '#00e676' }}>● Online</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
            {!msg.isUser && (
              <div style={{ width: 32, height: 32, borderRadius: 10, background: colors.primary + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, flexShrink: 0 }}>
                🎵
              </div>
            )}
            <div style={{
              maxWidth: '80%', padding: '12px 16px', borderRadius: msg.isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              background: msg.isUser ? colors.primary : colors.surface,
              color: msg.isUser ? '#fff' : colors.text,
              border: msg.isUser ? 'none' : `1px solid ${colors.glassBorder}`,
              fontSize: 14, lineHeight: 1.5,
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.glassBorder}`, display: 'flex', gap: 10 }}>
        <input
          className="input-field"
          style={{ borderRadius: 25, color: colors.text, background: colors.surface, borderColor: colors.glassBorder }}
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button onClick={send}
          style={{ width: 52, height: 52, borderRadius: 50, background: input.trim() ? colors.primary : colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
          <IoSend size={20} color={input.trim() ? '#fff' : colors.textSecondary} />
        </button>
      </div>
    </div>
  );
}
