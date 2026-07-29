import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Note, Meeting, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { BookOpen, Plus, Tag, FileText, CheckCircle2, Circle, Users, Calendar } from 'lucide-react';

export const Knowledge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notes' | 'meetings'>('notes');
  const [notes, setNotes] = useState<Note[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');

  // Meeting form state
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingSummary, setMeetingSummary] = useState('');
  const [meetingProjectId, setMeetingProjectId] = useState('');
  const [actionItemsInput, setActionItemsInput] = useState('');

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [notesRes, meetingsRes, projRes] = await Promise.all([
        api.get('/notes'),
        api.get('/meetings'),
        api.get('/projects')
      ]);
      setNotes(notesRes.data);
      setMeetings(meetingsRes.data);
      setProjects(projRes.data);
    } catch (err) {
      console.error('Error fetching knowledge records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = noteTags.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/notes', { title: noteTitle, content: noteContent, tags: tagsArray });
      setIsNoteModalOpen(false);
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving note');
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const actionItems = actionItemsInput
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(task => ({ task, completed: false }));

      await api.post('/meetings', {
        title: meetingTitle,
        summary: meetingSummary,
        projectId: meetingProjectId || undefined,
        actionItems
      });

      setIsMeetingModalOpen(false);
      setMeetingTitle('');
      setMeetingSummary('');
      setMeetingProjectId('');
      setActionItemsInput('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving meeting notes');
    }
  };

  const handleToggleActionItem = async (meetingId: string, itemIdx: number) => {
    try {
      await api.patch(`/meetings/${meetingId}/action-items/${itemIdx}`);
      fetchData();
    } catch (err) {
      alert('Error updating action item state');
    }
  };

  const canCreateMeeting = ['Super Admin', 'CEO', 'Manager'].includes(user?.role || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Internal Knowledge Base</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Company operational notes, technical specs, and meeting minutes</p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'notes' ? (
            <button onClick={() => setIsNoteModalOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          ) : (
            canCreateMeeting && (
              <button onClick={() => setIsMeetingModalOpen(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                <span>Log Meeting Notes</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'notes'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Company Notes ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'meetings'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
              : 'text-[var(--text-muted)] hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Meeting Minutes ({meetings.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'notes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((n) => (
            <div key={n._id} className="glass-panel p-6 glass-card-interactive flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">{n.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-2 whitespace-pre-line leading-relaxed">{n.content}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[var(--border-color)]">
                <div className="flex flex-wrap gap-1">
                  {n.tags.map((t, idx) => (
                    <span key={idx} className="badge badge-purple">
                      <Tag className="w-2.5 h-2.5" /> #{t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
                  <span>Author: {n.authorId?.name || 'User'}</span>
                  <span>{new Date(n.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => (
            <div key={m._id} className="glass-panel p-6 space-y-4">
              <div className="flex items-start justify-between border-b border-[var(--border-color)] pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{m.title}</h3>
                  {m.projectId && (
                    <span className="text-xs text-indigo-300 font-medium">Linked Project: {m.projectId.name}</span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(m.createdAt || '').toLocaleDateString()}
                </span>
              </div>

              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                <h4 className="font-semibold text-white uppercase text-[11px] mb-1">Executive Summary:</h4>
                <p className="whitespace-pre-line">{m.summary}</p>
              </div>

              {/* Action Items Checklist */}
              {m.actionItems && m.actionItems.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-semibold text-white uppercase text-[11px] mb-2">Action Items Checklist:</h4>
                  <div className="space-y-1.5">
                    {m.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleToggleActionItem(m._id, idx)}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                          item.completed
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 line-through'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-[var(--border-color)]'
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                        )}
                        <span>{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="Create Knowledge Note">
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Title</label>
            <input type="text" required value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} placeholder="System Security Standard" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Content</label>
            <textarea required value={noteContent} onChange={(e) => setNoteContent(e.target.value)} rows={5} placeholder="Document note details..." className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Tags (Comma-separated)</label>
            <input type="text" value={noteTags} onChange={(e) => setNoteTags(e.target.value)} placeholder="architecture, security, sprint" className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsNoteModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Note</button>
          </div>
        </form>
      </Modal>

      {/* Meeting Modal */}
      <Modal isOpen={isMeetingModalOpen} onClose={() => setIsMeetingModalOpen(false)} title="Log Meeting Minutes">
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Meeting Title</label>
            <input type="text" required value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} placeholder="Weekly Executive Sync" className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Linked Project (Optional)</label>
            <select value={meetingProjectId} onChange={(e) => setMeetingProjectId(e.target.value)} className="input-field bg-[#0f172a]">
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Summary / Minutes</label>
            <textarea required value={meetingSummary} onChange={(e) => setMeetingSummary(e.target.value)} rows={4} placeholder="Key points discussed..." className="input-field" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Action Items (One task per line)</label>
            <textarea value={actionItemsInput} onChange={(e) => setActionItemsInput(e.target.value)} rows={3} placeholder="Resolve database index issue&#10;Submit Q3 invoice" className="input-field" />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" onClick={() => setIsMeetingModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Log Meeting</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
