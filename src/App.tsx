import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Hash,
  Trash2,
  BrainCircuit,
  Loader2,
  Settings2,
  Calendar,
  Layers,
  LogOut,
  X,
  Lock,
  ArrowRight,
  Shield,
  GripVertical,
  Download,
  Eye,
  FileText,
  MessageSquare,
  Wand2,
  ShieldCheck,
  Check,
  Zap,
  User
} from 'lucide-react';
import Markdown from 'react-markdown';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  signOut
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Task, Status, Priority, SubTask } from './types';

// --- Components ---

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Dynamic Glow Rings */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute w-16 h-16 rounded-full bg-blue-500/20 blur-2xl"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.3, 0.1],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-20 h-20 rounded-full bg-purple-500/10 blur-3xl"
      />

      {/* Main Container */}
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
      >
        {/* Layer 1: Animated Gradient Orbit */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-[16px] p-[2px] bg-gradient-to-tr from-[#4285F4] via-[#9b72cb] to-[#4285F4]"
        >
          <div className="w-full h-full rounded-[14px] bg-[#FAFAFA]" />
        </motion.div>

        {/* Layer 2: Glass Morphism Core */}
        <div className="absolute inset-[3px] rounded-[13px] bg-white/40 backdrop-blur-md border border-white/50 shadow-sm overflow-hidden flex items-center justify-center">
          <motion.div 
            animate={{ 
              top: ["-100%", "200%"],
              left: ["-100%", "200%"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-full h-8 bg-white/60 blur-md -rotate-45"
          />
          
          {/* Central Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              animate={{ 
                filter: ["drop-shadow(0 0 0px #4285F4)", "drop-shadow(0 0 8px #4285F4)", "drop-shadow(0 0 0px #4285F4)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-[#4285F4]" />
            </motion.div>
          </div>
        </div>

        {/* Status Pulse */}
        <div className="absolute -top-1 -right-1 z-20">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500 border-2 border-white shadow-sm"></span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function ProfileDialog({ user }: { user: FirebaseUser }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 outline-none">
            <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#9b72cb] p-[2px] shadow-lg shadow-blue-500/10">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs xs:text-sm font-bold text-[#4285F4]">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
                )}
              </div>
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
               <span className="text-xs font-bold text-[#1D1D1F] leading-none mb-0.5">{user.displayName || 'Architect'}</span>
               <span className="text-[9px] font-black uppercase tracking-widest text-[#AEAeb2]">View Identity</span>
            </div>
          </button>
        }
      />
      <DialogContent className="w-[95vw] sm:max-w-[400px] rounded-[32px] md:rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-[#FAFAFA] z-[100]">
        <div className="h-28 md:h-32 gemini-gradient relative">
           <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-6 md:px-8 pb-8 md:pb-10 -mt-10 md:-mt-12 relative z-10">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] bg-white p-1.5 shadow-xl mx-auto mb-4 md:mb-6">
            <div className="w-full h-full rounded-[18px] md:rounded-[26px] bg-gradient-to-tr from-[#4285F4] to-[#9b72cb] p-[2px]">
              <div className="w-full h-full rounded-[16px] md:rounded-[24px] bg-white flex items-center justify-center text-2xl md:text-3xl font-black text-[#4285F4] overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#1D1D1F] mb-1">{user.displayName || 'Vanguard Member'}</h3>
            <p className="text-[#8E8E93] font-medium text-xs md:text-sm truncate max-w-full">{user.email}</p>
          </div>

          <div className="space-y-3 mb-8 md:mb-10">
            <div className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white border border-[#EBEBEB]">
               <div className="flex items-center gap-3">
                 <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                   <Calendar className="w-3.5 h-3.5 md:w-4 h-4 text-[#4285F4]" />
                 </div>
                 <span className="text-xs md:text-sm font-bold text-[#8E8E93]">Recruited</span>
               </div>
               <span className="text-xs md:text-sm font-black text-[#1D1D1F]">{new Date(user.metadata.creationTime || '').toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white border border-[#EBEBEB] group/item hover:border-[#4285F4] transition-colors">
               <div className="flex items-center gap-3">
                 <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                   <Shield className="w-3.5 h-3.5 md:w-4 h-4 text-[#4285F4]" />
                 </div>
                 <span className="text-xs md:text-sm font-bold text-[#8E8E93]">Access Status</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#4285F4] px-2 py-1 bg-blue-50 rounded-lg">Verified</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 md:h-14 rounded-2xl border-[#EBEBEB] hover:border-[#FF3B30] hover:bg-[#FFF2F2] text-[#AEAeb2] hover:text-[#FF3B30] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all gap-2"
            onClick={() => {
              setOpen(false);
              signOut(auth);
            }}
          >
            <LogOut className="w-4 h-4" />
            Terminate Protocol
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Auth View Component ---

function AuthView() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Welcome to Todo App');
    } catch (error: any) {
      console.error('Auth Error:', error);
      if (error.code === 'auth/popup-blocked') {
        toast.error('Sign-in popup blocked. Please allow popups for this site and try again.', { duration: 5000 });
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error('Google Sign-In is disabled. You MUST enable it in your Firebase Console > Authentication > Sign-in method.', { duration: 8000 });
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error(`This domain (${window.location.hostname}) is not authorized. Add it to Firebase Console > Authentication > Settings > Authorized domains.`, { duration: 8000 });
      } else {
        toast.error('Authentication failed: ' + error.message, { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-12 bg-[#FAFAFA] font-sans selection:bg-[#4285F4] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md pt-8 md:pt-0"
      >
        <div className="text-center mb-10">
          <Logo />
          <h1 className="text-4xl font-black tracking-tighter text-[#1D1D1F] mt-6 mb-2 uppercase">Todo App</h1>
          <p className="text-[#8E8E93] font-bold text-sm tracking-tight">A Simple and Easy Task Manager</p>
        </div>

        <Card className="border-none shadow-[0_20px_60px_rgb(0,0,0,0.05)] rounded-[40px] bg-white p-8 group hover:shadow-[0_40px_80px_rgb(0,0,0,0.08)] transition-all duration-500">
          <CardHeader className="p-0 mb-8 text-center">
            <div className="bg-blue-50 w-fit mx-auto px-3 py-1 rounded-full mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#4285F4]">Secure Login</span>
            </div>
            <CardTitle className="text-2xl font-black tracking-tight mb-2">Sign In to Todo App</CardTitle>
            <CardDescription className="text-sm font-medium">
              Sign in with your Google account to start managing your tasks.
            </CardDescription>
          </CardHeader>
          
          <div className="space-y-6">
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-16 bg-white border border-[#EBEBEB] hover:border-[#4285F4] hover:bg-blue-50 text-[#1D1D1F] rounded-2xl font-black uppercase tracking-[0.1em] shadow-sm active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </>
                )}
            </Button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] bg-[#EBEBEB] flex-1" />
              <span className="text-[10px] font-black text-[#AEAeb2] uppercase tracking-[0.2em]">Secure Login</span>
              <div className="h-[1px] bg-[#EBEBEB] flex-1" />
            </div>

            <p className="text-[10px] text-center text-[#AEAeb2] font-medium px-4 leading-relaxed tracking-tight">
              By continuing, you agree to store your tasks securely in the cloud.
            </p>
          </div>
        </Card>
        
        <p className="mt-10 text-center text-[10px] uppercase font-black tracking-[0.4em] text-[#AEAeb2] opacity-50">
          Todo App v1.0
        </p>
      </motion.div>
    </div>
  );
}

// --- Main App Component ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [goal, setGoal] = useState('');
  const [taskCount, setTaskCount] = useState<3 | 5 | 7>(5);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [showAIPreview, setShowAIPreview] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(tasks.length === 0);
    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      // Dynamic sort based on user preference
      taskList.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
      
      setTasks(taskList);
      setIsLoading(false);
    }, (error) => {
      toast.error('Sync failed: ' + error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, sortOrder]);

  const addTask = async (
    title: string, 
    priority: Priority = 'medium', 
    tags: string[] = [], 
    notes: string = "",
    workingDate?: string,
    dueDate?: string
  ) => {
    if (!user) return;
    try {
      // Find max order
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order ?? 0)) : 0;
      
      await addDoc(collection(db, 'tasks'), {
        title,
        priority,
        status: 'todo',
        tags,
        notes,
        subTasks: [],
        userId: user.uid,
        userEmail: user.email,
        order: maxOrder + 1,
        createdAt: new Date().toISOString(),
        workingDate: workingDate || null,
        dueDate: dueDate || null
      });
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, updates);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      setSelectedIds(prev => prev.filter(i => i !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleBulkUpdate = async (updates: Partial<Task>) => {
    if (selectedIds.length === 0) return;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => {
        batch.update(doc(db, 'tasks', id), updates);
      });
      await batch.commit();
      setSelectedIds([]);
      toast.success(`Updated ${selectedIds.length} tasks`);
    } catch (error) {
      toast.error('Bulk update failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => {
        batch.delete(doc(db, 'tasks', id));
      });
      await batch.commit();
      setSelectedIds([]);
      toast.success(`Deleted ${selectedIds.length} tasks`);
    } catch (error) {
      toast.error('Bulk delete failed');
    }
  };

  const handleGenerateTasks = async () => {
    if (!goal || !user) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, count: taskCount, negativePrompt }),
      });
      const generated = await res.json();
      setGeneratedTasks(generated);
      setShowAIPreview(true);
      setGoal('');
      setNegativePrompt('');
    } catch (error) {
      toast.error('AI task generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeSelection = async (message?: string) => {
    if (selectedIds.length === 0) {
      toast.error('Select tasks for analysis first');
      return;
    }
    
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setIsAnalysisOpen(true);

    try {
      const selectedTasks = tasks.filter(t => selectedIds.includes(t.id));
      const res = await fetch('/api/ai/analyze-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: selectedTasks, message }),
      });
      const data = await res.json();
      setAiAnalysis(data.text);
    } catch (error) {
      toast.error('Analysis failed');
      setIsAnalysisOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmGeneratedTasks = async (selectedGenerated: any[]) => {
    if (!user || selectedGenerated.length === 0) {
      setShowAIPreview(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map(t => t.order ?? 0)) : 0;
      
      selectedGenerated.forEach((t: any, index: number) => {
        const newDocRef = doc(collection(db, 'tasks'));
        batch.set(newDocRef, {
          ...t,
          status: 'todo',
          userId: user.uid,
          userEmail: user.email,
          order: maxOrder + index + 1,
          createdAt: new Date().toISOString(),
          subTasks: []
        });
      });
      await batch.commit();
      setShowAIPreview(false);
      setGeneratedTasks([]);
      toast.success(`AI created ${selectedGenerated.length} tasks for your goal!`);
    } catch (error) {
      toast.error('Failed to create tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = async (reorderedItems: Task[]) => {
    // 1. Update the main tasks state by merging the new order
    // Create a map for quick lookup
    const idToIndex = new Map(reorderedItems.map((task, index) => [task.id, index]));
    
    const updatedTasks = tasks.map(task => {
      const newIndex = idToIndex.get(task.id);
      if (newIndex !== undefined) {
        return { ...task, order: newIndex };
      }
      return task;
    });

    setTasks(updatedTasks);
    
    // 2. Persist only the changed items to Firebase
    try {
      const batch = writeBatch(db);
      reorderedItems.forEach((task, index) => {
        const taskRef = doc(db, 'tasks', task.id);
        batch.update(taskRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      console.error('Reorder persistence failed', error);
      toast.error('Failed to save task order');
    }
  };

  const filteredTasks = tasks
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      
      if (sortOrder === 'newest') {
        return timeB - timeA; 
      }
      return timeA - timeB;
    });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'todo').length,
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-10 h-10 animate-spin text-[#4285F4]" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthView />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1D1D1F] font-sans selection:bg-[#4285F4] selection:text-white pb-32 overflow-x-hidden pt-20 scroll-smooth">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <header className="border-b border-[#EBEBEB] bg-white/70 backdrop-blur-xl fixed top-0 left-0 w-full z-50">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <Logo className="scale-90" />
            <div className="flex flex-col hidden xs:flex">
              <span className="font-bold text-xl leading-tight tracking-tight text-[#1D1D1F]">Todo App</span>
              <span className="text-[10px] text-[#4285F4] font-bold uppercase tracking-widest">Task Manager</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="relative group w-full max-w-[120px] xs:max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-xl transition-all duration-300">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8E8E93] group-focus-within:text-[#4285F4] transition-colors" />
              <input 
                type="text" 
                placeholder="Search tasks..."
                className="bg-[#F2F2F7] border-none rounded-2xl py-2 pl-10 pr-4 text-[12px] w-full focus:ring-2 focus:ring-[#4285F4]/20 focus:bg-white transition-all outline-none md:pl-12 md:pr-6 md:text-sm h-12 font-medium shadow-sm hover:bg-[#EBEBEB]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ProfileDialog user={user} />
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1600px] mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: AI Assistant & Quick Stats */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-8">
          {/* AI Generator */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white relative group">
            <div className="absolute inset-x-0 top-0 h-1 gemini-gradient opacity-80" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 px-2 rounded-full bg-blue-50 flex items-center gap-1.5 transition-transform group-hover:scale-105">
                  <BrainCircuit className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#4285F4]">AI Assistant</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-[#1D1D1F]">Plan your day</CardTitle>
              <CardDescription className="text-[#8E8E93] text-sm">
                Todo App uses AI to break down your goals into simple steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <Textarea 
                  className="w-full bg-[#F9F9F9] border-[#EBEBEB] rounded-2xl p-4 text-sm focus-visible:ring-[#4285F4]/20 focus-visible:border-[#4285F4] min-h-[120px] resize-none placeholder:text-[#AEAeb2] transition-all"
                  placeholder="What do you want to achieve today?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
                <div className="absolute bottom-3 right-3 opacity-30">
                  <Sparkles className="w-4 h-4 text-[#4285F4]" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Number of Tasks</label>
                  <div className="flex gap-2">
                    {[3, 5, 7].map((num) => (
                      <button
                        key={num}
                        onClick={() => setTaskCount(num as 3 | 5 | 7)}
                        className={`flex-1 h-10 rounded-xl font-bold text-xs transition-all ${
                          taskCount === num 
                            ? 'bg-[#4285F4] text-white shadow-md shadow-blue-500/20' 
                            : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#EBEBEB]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Exclude (Optional)</label>
                  <Input 
                    placeholder="e.g. meetings, emails, calls"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="h-11 rounded-xl bg-[#F9F9F9] border-[#EBEBEB] text-xs focus-visible:ring-[#4285F4]/20"
                  />
                </div>
              </div>

              <Button 
                className="w-full h-12 gemini-gradient text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all border-none disabled:opacity-70 disabled:pointer-events-none"
                onClick={handleGenerateTasks}
                disabled={isGenerating || !goal}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create AI Tasks
                  </>
                )}
              </Button>

              <div className="pt-2">
                <Button 
                  variant="outline"
                  className="w-full h-11 border-2 border-[#EBEBEB] text-[#8E8E93] hover:text-[#4285F4] hover:border-[#4285F4]/30 hover:bg-blue-50/50 rounded-xl font-bold text-xs uppercase tracking-widest transition-all group/analyze"
                  onClick={() => handleAnalyzeSelection()}
                  disabled={isAnalyzing || selectedIds.length === 0}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <MessageSquare className="w-4 h-4 mr-2 transition-transform group-hover/analyze:scale-110" />
                  )}
                  Analyze Selected Tasks ({selectedIds.length})
                </Button>
                {selectedIds.length === 0 && (
                  <p className="text-[10px] text-center mt-2 text-[#AEAeb2] font-medium tracking-tight">Select tasks to unlock deeper analysis</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Active', value: stats.total, icon: Layers, color: '#4285F4' },
              { label: 'Victory', value: `${Math.round((stats.completed / (stats.total || 1)) * 100)}%`, icon: TrendingUp, color: '#34C759' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-extrabold text-[#AEAeb2] uppercase tracking-widest">{stat.label}</span>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div className="text-3xl font-black text-[#1D1D1F] tracking-tight">{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </aside>

        {/* Right Column: Task List */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-4 flex-wrap">
                <TabsList className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#EBEBEB] shadow-sm">
                  <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#1D1D1F] data-[state=active]:shadow-sm px-4 sm:px-8 py-2.5 font-bold text-[#8E8E93] text-sm transition-all uppercase tracking-tight">All Tasks</TabsTrigger>
                  <TabsTrigger value="todo" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#1D1D1F] data-[state=active]:shadow-sm px-4 sm:px-8 py-2.5 font-bold text-[#8E8E93] text-sm transition-all uppercase tracking-tight">Queue</TabsTrigger>
                  <TabsTrigger value="done" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-[#1D1D1F] data-[state=active]:shadow-sm px-4 sm:px-8 py-2.5 font-bold text-[#8E8E93] text-sm transition-all uppercase tracking-tight">Done</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#EBEBEB] shadow-sm">
                  <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
                    <SelectTrigger className="h-10 w-[150px] rounded-xl border-none bg-transparent hover:bg-white transition-all text-sm font-bold text-[#1D1D1F]">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`w-3.5 h-3.5 text-[#4285F4] ${sortOrder === 'oldest' ? 'rotate-180' : ''} transition-transform`} />
                        <SelectValue placeholder="Sort" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-[#EBEBEB] bg-white shadow-2xl p-2 font-bold z-[150]" sideOffset={5}>
                      <SelectItem value="newest" className="rounded-xl">Newest First</SelectItem>
                      <SelectItem value="oldest" className="rounded-xl">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <CreateTaskDialog onAdd={addTask} userEmail={user?.email || undefined} />
            </div>

            <TabsContent value="all" className="mt-0 focus-visible:outline-none">
               <div className="space-y-5">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-[#4285F4] opacity-20" />
                        <Sparkles className="w-6 h-6 text-[#4285F4] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      <p className="text-sm font-bold text-[#AEAeb2] uppercase tracking-[0.3em]">Loading tasks...</p>
                    </div>
                  ) : (
                    <Reorder.Group axis="y" values={filteredTasks} onReorder={handleReorder} className="space-y-5">
                      {filteredTasks.map((task) => (
                        <TaskItem 
                          key={task.id}
                          task={task} 
                          onUpdate={updateTask} 
                          onDelete={deleteTask}
                          isSelected={selectedIds.includes(task.id)}
                          onToggleSelect={() => {
                            setSelectedIds(prev => 
                              prev.includes(task.id) 
                                ? prev.filter(id => id !== task.id) 
                                : [...prev, task.id]
                            );
                          }}
                        />
                      ))}
                    </Reorder.Group>
                  )}
                  
                  {!isLoading && filteredTasks.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-32 bg-white rounded-[32px] border-2 border-dashed border-[#EBEBEB]"
                    >
                      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[#4285F4] opacity-40" />
                      </div>
                      <h3 className="text-xl font-bold text-[#1D1D1F] mb-2 tracking-tight">All caught up!</h3>
                      <p className="text-[#8E8E93] text-sm max-w-xs mx-auto font-medium">
                        You have no tasks. Add a new task or use AI to generate some!
                      </p>
                    </motion.div>
                  )}
               </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[95%] md:max-w-2xl px-2 md:px-6"
          >
            <div className="bg-[#1D1D1F] text-white rounded-[24px] shadow-2xl p-3 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-3 md:gap-4 ml-2">
                <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center font-bold text-xs ring-4 ring-[#4285F4]/20">
                  {selectedIds.length}
                </div>
                <span className="text-sm font-bold tracking-tight whitespace-nowrap">Tasks Selected</span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <PrioritySelector 
                  value={selectedIds.length > 0 ? (tasks.find(t => t.id === selectedIds[0])?.priority || 'medium') : 'medium'}
                  onChange={(v) => handleBulkUpdate({ priority: v })}
                  className="w-48 h-10 border-white/10 bg-white/10 text-white hover:bg-white/20"
                />

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleBulkUpdate({ status: 'completed' })}
                  className="h-10 px-4 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-xs shrink-0"
                >
                  Complete
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleBulkDelete}
                  className="h-10 px-4 rounded-xl font-bold bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs shrink-0"
                >
                  Delete
                </Button>

                <Separator orientation="vertical" className="h-6 bg-white/10 hidden md:block" />

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  className="h-10 px-4 rounded-xl font-bold hover:bg-white/10 text-xs shrink-0"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Preview Dialog */}
      <Dialog open={showAIPreview} onOpenChange={setShowAIPreview}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[32px] border-none shadow-2xl p-0 bg-white z-[150]">
          <div className="p-6 md:p-8 border-b border-[#F2F2F7] relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 px-2 rounded-full bg-blue-50 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-[#4285F4]" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#4285F4]">AI Tasks Preview</span>
              </div>
            </div>
            <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight text-[#1D1D1F]">Review AI Tasks</DialogTitle>
            <DialogDescription className="text-[#8E8E93] text-sm md:text-base font-medium">
              We've created some tasks for your goal. Select the ones you want to keep.
            </DialogDescription>
          </div>

          <ScrollArea className="flex-1 w-full">
            <div className="p-6 md:p-8 space-y-4">
              {generatedTasks.map((t, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#F9F9F9] border border-[#EBEBEB] flex items-start gap-4">
                  <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 ${
                    t.priority === 'high' ? 'bg-[#FF3B30]' : 
                    t.priority === 'medium' ? 'bg-[#4285F4]' : 'bg-[#AEAeb2]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1D1D1F] mb-1">{t.title}</h4>
                    <p className="text-xs text-[#8E8E93] line-clamp-2 mb-2">{t.notes}</p>
                    <div className="flex gap-2">
                      {t.tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold text-[#AEAeb2] bg-white border border-[#EBEBEB] px-1.5 py-0.5 rounded-lg uppercase tracking-widest leading-none">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={`mt-2 text-[10px] font-black uppercase tracking-widest ${
                       t.priority === 'high' ? 'text-[#FF3B30]' : 
                       t.priority === 'medium' ? 'text-[#4285F4]' : 'text-[#AEAeb2]'
                    }`}>
                      {t.priority} priority
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 md:p-8 pt-4 gap-3 md:gap-4 bg-gray-50/50 flex-row justify-end border-t border-[#F2F2F7]">
            <Button 
              variant="ghost" 
              className="flex-1 sm:flex-none rounded-2xl h-12 md:h-14 px-6 md:px-8 font-black uppercase tracking-widest text-[10px] md:text-xs"
              onClick={() => setShowAIPreview(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-[1.5] sm:flex-none gemini-gradient text-white rounded-2xl h-12 md:h-14 px-8 md:px-12 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-70 disabled:pointer-events-none"
              onClick={() => confirmGeneratedTasks(generatedTasks)}
            >
              Save AI Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-[32px] border-none shadow-2xl p-0 bg-white z-[150]">
          <div className="p-6 md:p-8 pb-4 border-b border-[#F2F2F7] relative">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 rounded-xl bg-blue-50">
                 <Wand2 className="w-5 h-5 text-[#4285F4]" />
               </div>
               <div>
                  <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">AI Analysis</DialogTitle>
                  <DialogDescription className="text-xs md:text-sm font-medium text-[#8E8E93]">
                    AI insights for your selected tasks
                  </DialogDescription>
               </div>
            </div>
          </div>
          <ScrollArea className="flex-1 w-full">
             <div className="p-6 md:p-8">
               {isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                   <Loader2 className="w-10 h-10 text-[#4285F4] animate-spin opacity-20" />
                   <p className="text-sm font-black uppercase tracking-[0.2em] text-[#AEAeb2] animate-pulse">Analyzing Tasks...</p>
                 </div>
               ) : aiAnalysis ? (
                 <div className="prose prose-sm max-w-none text-[#1D1D1F] markdown-body">
                   <Markdown>{aiAnalysis}</Markdown>
                 </div>
               ) : null}
             </div>
          </ScrollArea>
          <DialogFooter className="p-6 md:p-8 pt-4 border-t border-[#F2F2F7] bg-gray-50/50">
            <Button 
               className="w-full h-12 md:h-14 gemini-gradient text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
               onClick={() => setIsAnalysisOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateTaskDialog({ onAdd, userEmail }: { 
  onAdd: (title: string, priority: Priority, tags: string[], notes: string, workingDate?: string, dueDate?: string) => Promise<void>,
  userEmail?: string
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [workingDate, setWorkingDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await onAdd(title, priority, tags.split(',').map(t => t.trim()).filter(t => t), notes, workingDate, dueDate);
    setTitle('');
    setPriority('medium');
    setTags('');
    setNotes('');
    setWorkingDate('');
    setDueDate('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="rounded-2xl flex gap-2 h-10 px-6 border-[#EBEBEB] hover:border-[#4285F4] hover:bg-blue-50 text-sm font-bold text-[#1D1D1F] transition-all shadow-sm" />}>
        <Plus className="w-4 h-4 text-[#4285F4]" />
        Add Task
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] rounded-[32px] md:rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white z-[100] flex flex-col">
        <div className="p-6 md:p-10 pb-5 border-b border-gray-50 bg-[#FAFAFA]/50 relative">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-4xl font-black tracking-tight text-[#1D1D1F] flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#4285F4]" />
              </div>
              New Task
            </DialogTitle>
            <DialogDescription className="text-[#8E8E93] text-sm md:text-base font-medium mt-2">
              Create a new task for your project.
            </DialogDescription>
          </DialogHeader>
        </div>
        <ScrollArea className="flex-1 w-full">
          <div className="px-6 md:px-10 py-8">
            <form id="add-task-form" onSubmit={handleSubmit} className="space-y-8 md:space-y-10 pb-4">
              <div className="space-y-4">
                <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Task Title</Label>
                <Input 
                  id="title" 
                  placeholder="Ex: Finish the report" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-2xl h-14 md:h-16 bg-[#F9F9F9] border-[#EBEBEB] focus-visible:ring-[#4285F4]/20 border-2 px-6 font-bold text-lg md:text-xl placeholder:text-[#AEAeb2]/30 transition-all focus:bg-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Priority</Label>
                  <PrioritySelector value={priority} onChange={setPriority} className="w-full h-14 md:h-16" />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="tags" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Tags</Label>
                  <Input 
                    id="tags" 
                    placeholder="dev, prod, core" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)}
                    className="rounded-2xl h-14 md:h-16 bg-[#F9F9F9] border-[#EBEBEB] border-2 px-6 font-bold text-lg focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <Label htmlFor="workingDate" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4285F4] pointer-events-none" />
                    <Input 
                      id="workingDate"
                      type="date"
                      value={workingDate}
                      onChange={(e) => setWorkingDate(e.target.value)}
                      className="rounded-2xl h-14 md:h-16 bg-[#F9F9F9] border-[#EBEBEB] border-2 pl-14 pr-6 font-black uppercase tracking-tight text-lg focus:bg-white transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label htmlFor="dueDate" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Due Date</Label>
                  <div className="relative">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF3B30] pointer-events-none" />
                    <Input 
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="rounded-2xl h-14 md:h-16 bg-[#F9F9F9] border-[#EBEBEB] border-2 pl-14 pr-6 font-black uppercase tracking-tight text-lg focus:bg-white transition-all cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="create-notes" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Task Notes (Optional)</Label>
                <Textarea 
                  id="create-notes" 
                  placeholder="Add some details about this task..." 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-3xl bg-[#F9F9F9] border-[#EBEBEB] border-2 p-6 font-medium min-h-[140px] md:min-h-[180px] focus-visible:ring-[#4285F4]/20 text-lg focus:bg-white transition-all resize-none"
                />
              </div>
            </form>
          </div>
        </ScrollArea>
        <div className="p-6 md:p-10 pt-6 border-t border-gray-50 bg-[#FAFAFA]/30 flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full sm:w-auto flex-1 rounded-2xl h-14 md:h-16 px-10 font-black uppercase tracking-widest text-xs text-[#AEAeb2] hover:text-[#1D1D1F] hover:bg-gray-100 transition-all" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              form="add-task-form" 
              type="submit" 
              className="w-full sm:w-auto flex-[2] gemini-gradient text-white rounded-2xl h-14 md:h-16 px-12 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
            >
              <Zap className="w-5 h-5 fill-current" />
              Save Task
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrioritySelector({ value, onChange, className = "" }: { value: Priority, onChange: (v: Priority) => void, className?: string }) {
  const [open, setOpen] = useState(false);

  const priorities: { value: Priority, label: string, color: string, bg: string, text: string }[] = [
    { value: 'low', label: 'Low Priority', color: '#AEAeb2', bg: 'bg-[#F2F2F7]', text: 'text-[#8E8E93]' },
    { value: 'medium', label: 'Medium Priority', color: '#4285F4', bg: 'bg-[#E5F1FF]', text: 'text-[#4285F4]' },
    { value: 'high', label: 'High Priority', color: '#FF3B30', bg: 'bg-[#FFF2F2]', text: 'text-[#FF3B30]' },
  ];

  const current = priorities.find(p => p.value === value) || priorities[1];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" className={`justify-start gap-3 h-14 rounded-2xl border-2 border-[#EBEBEB] hover:border-[#4285F4] transition-all bg-[#F9F9F9] ${className}`}>
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: current.color }} />
          <span className="font-bold text-[#1D1D1F]">{current.label}</span>
          <ChevronRight className="w-4 h-4 ml-auto text-[#AEAeb2]" />
        </Button>
      } />
      <DialogContent className="w-[95vw] sm:max-w-[400px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden bg-white z-[200]">
        <div className="p-6 md:p-8 border-b border-[#F2F2F7] relative">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-black tracking-tight">Select Priority</DialogTitle>
            <DialogDescription className="text-xs md:text-sm font-medium text-[#8E8E93]">
              How important is this task?
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 md:p-8 space-y-3">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => {
                onChange(p.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                value === p.value 
                  ? 'border-[#4285F4] bg-blue-50 shadow-md' 
                  : 'border-[#EBEBEB] hover:border-[#4285F4]/30 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full transition-transform group-hover:scale-125 shadow-sm`} style={{ backgroundColor: p.color }} />
                <span className={`font-black uppercase tracking-widest text-xs ${value === p.value ? 'text-[#4285F4]' : 'text-[#1D1D1F]'}`}>
                  {p.label}
                </span>
              </div>
              {value === p.value && <CheckCircle2 className="w-5 h-5 text-[#4285F4]" />}
            </button>
          ))}
        </div>
        <div className="p-6 md:p-8 pt-0">
          <Button variant="ghost" className="w-full rounded-2xl font-bold h-12 md:h-14 bg-[#F2F2F7] hover:bg-gray-200" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TaskDetailsSheet({ task, onUpdate }: { task: Task, onUpdate: (id: string, updates: Partial<Task>) => Promise<void> }) {
  const [newSubTask, setNewSubTask] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const addSubTask = async () => {
    if (!newSubTask) return;
    const subTasks = task.subTasks || [];
    const updated = [...subTasks, { id: crypto.randomUUID(), title: newSubTask, isCompleted: false }];
    await onUpdate(task.id, { subTasks: updated });
    setNewSubTask('');
  };

  const toggleSubTask = async (subId: string) => {
    const updated = (task.subTasks || []).map(st => st.id === subId ? { ...st, isCompleted: !st.isCompleted } : st);
    await onUpdate(task.id, { subTasks: updated });
  };

  const deleteSubTask = async (subId: string) => {
    const updated = (task.subTasks || []).filter(st => st.id !== subId);
    await onUpdate(task.id, { subTasks: updated });
  };

  const downloadPDF = async () => {
    setIsExporting(true);
    // Create a temporary hidden container for clean PDF export
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '0';
    pdfContainer.style.width = '800px'; 
    pdfContainer.style.backgroundColor = '#ffffff';
    pdfContainer.style.padding = '50px';
    pdfContainer.style.color = '#1D1D1F';
    pdfContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    pdfContainer.innerHTML = `
      <div style="border: 4px solid #1D1D1F; border-radius: 24px; padding: 40px; background: #ffffff; box-shadow: 12px 12px 0px #4285F4; position: relative; overflow: hidden;">
        <!-- decorative corner elements for Jane System -->
        <div style="position: absolute; top: 0; left: 0; right: 0; height: 12px; background: repeating-linear-gradient(45deg, #1D1D1F, #1D1D1F 10px, #4285F4 10px, #4285F4 20px);"></div>
        <div style="position: absolute; top: -2px; right: 30px; background: #1D1D1F; color: #fff; padding: 8px 16px; font-weight: 900; letter-spacing: 0.15em; font-size: 11px; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; text-transform: uppercase;">
          PROJECT JANE SYSTEM
        </div>

        <div style="border-bottom: 3px dashed #EBEBEB; padding-bottom: 25px; margin-bottom: 35px; margin-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <h1 style="color: #1D1D1F; font-size: 34px; font-weight: 900; margin: 0; letter-spacing: -0.05em; text-transform: uppercase; border-left: 6px solid #4285F4; padding-left: 16px;">TODO APP REPORT</h1>
          </div>
          <div style="color: #8E8E93; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; display: flex; gap: 15px;">
            <span style="background: #F2F2F7; padding: 4px 10px; border-radius: 6px;">Ref: ${task.id.slice(0, 8)}</span>
            <span style="background: ${task.priority === 'high' ? '#FFF2F2' : task.priority === 'medium' ? '#E5F1FF' : '#F2F2F7'}; color: ${task.priority === 'high' ? '#FF3B30' : task.priority === 'medium' ? '#4285F4' : '#8E8E93'}; padding: 4px 10px; border-radius: 6px;">Priority: ${task.priority}</span>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <div style="margin-bottom: 30px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; border-bottom: 3px dashed #EBEBEB; padding-bottom: 25px;">
            <div style="border: 2px solid #EBEBEB; border-radius: 12px; padding: 15px; background: #FAFAFA; position: relative;">
              <div style="color: #AEAeb2; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 5px;">Status</div>
              <div style="color: #1D1D1F; font-size: 16px; font-weight: 800;">${task.status.toUpperCase()}</div>
              <div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; border-radius: 50%; background: ${task.status === 'completed' ? '#34C759' : '#4285F4'}; border: 2px solid #fff;"></div>
            </div>
            <div style="border: 2px solid #EBEBEB; border-radius: 12px; padding: 15px; background: #FAFAFA; position: relative;">
              <div style="color: #AEAeb2; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 5px;">Due Date</div>
              <div style="color: #1D1D1F; font-size: 16px; font-weight: 800;">${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'NO DEADLINE'}</div>
            </div>
            <div style="border: 2px solid #EBEBEB; border-radius: 12px; padding: 15px; background: #FAFAFA;">
              <div style="color: #AEAeb2; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 5px;">Created</div>
              <div style="color: #1D1D1F; font-size: 16px; font-weight: 800;">${new Date(task.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <h2 style="color: #1D1D1F; font-size: 28px; font-weight: 800; margin-bottom: 25px; line-height: 1.25;">${task.title}</h2>
          
          <div style="margin-bottom: 35px;">
             <div style="color: #AEAeb2; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px; border-left: 3px solid #1D1D1F; padding-left: 10px;">
               TASK NOTES
             </div>
             <div style="background: #FAFAFA; border-radius: 16px; padding: 25px; font-size: 15px; line-height: 1.7; border: 2px solid #1D1D1F; color: #1D1D1F; font-weight: 500; box-shadow: 4px 4px 0px #EBEBEB;">
               ${task.notes || "No notes provided for this task."}
             </div>
          </div>

          <div style="margin-bottom: 35px;">
             <div style="color: #AEAeb2; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 15px; border-left: 3px solid #1D1D1F; padding-left: 10px;">
               SUBTASKS
             </div>
             <div style="display: flex; flex-direction: column; gap: 12px;">
               ${(task.subTasks || []).map(st => `
                 <div style="display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; background: #fff; border: 2px solid #1D1D1F; box-shadow: 3px 3px 0px #F2F2F7;">
                   <div style="width: 20px; height: 20px; border: 2px solid ${st.isCompleted ? '#1D1D1F' : '#AEAeb2'}; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: ${st.isCompleted ? '#1D1D1F' : 'transparent'};">
                     ${st.isCompleted ? '<span style="color: white; font-size: 12px; font-weight: 900;">✓</span>' : ''}
                   </div>
                   <span style="font-size: 16px; font-weight: 700; color: ${st.isCompleted ? '#8E8E93' : '#1D1D1F'}; ${st.isCompleted ? 'text-decoration: line-through;' : ''}">${st.title}</span>
                 </div>
               `).join('')}
               ${(task.subTasks || []).length === 0 ? '<div style="color: #8E8E93; font-style: italic; font-size: 14px; padding: 20px; text-align: center; background: #FAFAFA; border: 2px dashed #EBEBEB; border-radius: 12px;">No subtasks defined.</div>' : ''}
             </div>
          </div>

          <div>
             <div style="color: #AEAeb2; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px; border-left: 3px solid #1D1D1F; padding-left: 10px;">
               TAGS
             </div>
             <div style="display: flex; gap: 12px; flex-wrap: wrap;">
               ${task.tags.map(tag => `
                 <span style="background: #fff; color: #1D1D1F; border-radius: 8px; border: 2px solid #1D1D1F; padding: 6px 14px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 2px 2px 0px #EBEBEB;">${tag}</span>
               `).join('')}
               ${task.tags.length === 0 ? '<span style="color: #AEAeb2; font-size: 12px; font-style: italic;">No tags allocated.</span>' : ''}
             </div>
          </div>
        </div>

        <div style="margin-top: 50px; padding-top: 25px; border-top: 3px solid #1D1D1F; display: flex; justify-content: space-between; align-items: center;">
          <div style="color: #1D1D1F; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em;">Todo App Verified</div>
          <div style="color: #1D1D1F; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em;">// END REPORT</div>
        </div>
      </div>
    `;
    document.body.appendChild(pdfContainer);

    try {
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        logging: false, // Turn off logging to suppress oklch warnings if any remain
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Todo-App-${task.title.replace(/\s+/g, '-')}.pdf`);
      toast.success('Exported to PDF successfully');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Export failed');
    } finally {
      document.body.removeChild(pdfContainer);
      setIsExporting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="rounded-xl w-9 h-9 hover:bg-blue-50 text-[#AEAeb2] hover:text-[#4285F4] transition-all" />}>
        <Eye className="w-5 h-5" />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl bg-white border-l border-[#EBEBEB] p-0 flex flex-col z-[100] h-full overflow-hidden">
        <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-[#F2F2F7] bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#AEAeb2]">Protocol Details</h2>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth" id={`task-pdf-content-${task.id}`}>
          <div className="p-6 md:p-10 space-y-10 md:space-y-12">
            <SheetHeader className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <Dialog>
                    <DialogTrigger render={
                      <button className={`p-1 px-3 rounded-full flex items-center gap-1.5 transition-all hover:ring-2 hover:ring-offset-2 shrink-0 ${
                        task.priority === 'high' ? 'bg-[#FFF2F2] hover:ring-[#FF3B30]/20' : 
                        task.priority === 'medium' ? 'bg-[#E5F1FF] hover:ring-[#4285F4]/20' : 'bg-[#F2F2F7] hover:ring-[#AEAeb2]/20'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-[#FF3B30]' : 
                          task.priority === 'medium' ? 'bg-[#4285F4]' : 'bg-[#AEAeb2]'
                        }`} />
                        <span className={`text-[10px] uppercase tracking-wider font-black ${
                          task.priority === 'high' ? 'text-[#FF3B30]' : 
                          task.priority === 'medium' ? 'text-[#4285F4]' : 'text-[#8E8E93]'
                        }`}>
                          {task.priority}
                        </span>
                        <ChevronDown className="w-3 h-3 opacity-40 ml-0.5" />
                      </button>
                    } />
                    <DialogContent className="w-[90vw] sm:max-w-[400px] rounded-[32px] border-none shadow-2xl p-6 md:p-8 z-[200]">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black tracking-tight">Modify Priority</DialogTitle>
                        <DialogDescription className="text-sm font-medium text-[#8E8E93]">
                          Re-architect the importance of this protocol.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              onUpdate(task.id, { priority: p });
                            }}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                              task.priority === p 
                                ? 'border-[#4285F4] bg-blue-50' 
                                : 'border-[#EBEBEB] hover:border-[#4285F4]/30'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-4 h-4 rounded-full`} style={{ 
                                backgroundColor: p === 'high' ? '#FF3B30' : p === 'medium' ? '#4285F4' : '#AEAeb2' 
                              }} />
                              <span className="font-black uppercase tracking-widest text-xs">{p} Priority</span>
                            </div>
                            {task.priority === p && <CheckCircle2 className="w-5 h-5 text-[#4285F4]" />}
                          </button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Badge variant="outline" className="rounded-full border-[#EBEBEB] text-[#4285F4] text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white">
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-9 md:h-10 px-3 md:px-4 rounded-xl text-[#4285F4] hover:bg-blue-50 font-bold text-[10px] uppercase tracking-widest gap-2 bg-blue-50/30 no-pdf shrink-0 disabled:opacity-70 disabled:pointer-events-none"
                  onClick={downloadPDF}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-3.5 h-3.5 md:w-4 h-4" />}
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
              </div>
              
              <div className="space-y-2">
                <SheetTitle className="text-2xl md:text-4xl font-black tracking-tight text-[#1D1D1F] leading-[1.1] break-words">
                  {task.title}
                </SheetTitle>
                <SheetDescription className="text-[11px] md:text-sm font-medium text-[#8E8E93] flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 md:w-4 h-4 opacity-50" />
                  Initial Manifestation: {new Date(task.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </SheetDescription>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 pt-4 border-t border-[#F2F2F7]">
                 <div className="space-y-1">
                   <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-[#AEAeb2]">Protocol Info</span>
                   <div className="flex items-center gap-1.5 text-[#1D1D1F]">
                     <Shield className="w-3.5 h-3.5 text-[#4285F4] opacity-40" />
                     <span className="text-xs font-bold">Encrypted</span>
                   </div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-[#AEAeb2]">System Load</span>
                   <div className="flex items-center gap-1.5 text-[#1D1D1F]">
                     <TrendingUp className="w-3.5 h-3.5 text-[#34C759] opacity-40" />
                     <span className="text-xs font-bold">Normal-AI</span>
                   </div>
                 </div>
                 <div className="space-y-1 col-span-2 md:col-span-1">
                   <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-[#AEAeb2]">Sync State</span>
                   <div className="flex items-center gap-1.5 text-[#1D1D1F]">
                     <Clock className="w-3.5 h-3.5 text-[#4285F4] opacity-40" />
                     <span className="text-xs font-bold">Real-time</span>
                   </div>
                 </div>
              </div>
            </SheetHeader>

            <section className="space-y-4">
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#AEAeb2]">Strategic Context</h4>
              <div className="bg-gradient-to-br from-[#FAFAFA] to-white rounded-2xl p-5 md:p-6 text-sm leading-relaxed text-[#1D1D1F] border border-[#EBEBEB] shadow-inner font-medium">
                {task.notes || "No context provided for this architecture module yet."}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#AEAeb2]">Architecture Components</h4>
                <Badge className="bg-[#1D1D1F] text-white rounded-lg text-[8px] md:text-[9px] font-black border-none">
                  {(task.subTasks || []).length} Elements
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(task.subTasks || []).map(st => (
                  <motion.div 
                    key={st.id} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 md:gap-4 p-4 rounded-2xl bg-white border border-[#F2F2F7] hover:border-[#4285F4]/30 hover:bg-blue-50/10 transition-all group/sub"
                  >
                    <button 
                      onClick={() => toggleSubTask(st.id)}
                      className={`w-5 h-5 md:w-6 h-6 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        st.isCompleted ? 'bg-[#34C759] border-[#34C759] shadow-inner' : 'border-[#EBEBEB] hover:border-[#4285F4] bg-white'
                      }`}
                    >
                      {st.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <span className={`text-[13px] md:text-sm flex-1 font-bold transition-all break-words ${st.isCompleted ? 'text-[#AEAeb2] line-through' : 'text-[#1D1D1F]'}`}>
                      {st.title}
                    </span>
                    <button onClick={() => deleteSubTask(st.id)} className="p-2 text-[#AEAeb2] hover:text-[#FF3B30] transition-colors md:opacity-0 md:group-hover/sub:opacity-100 no-pdf">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                
                <div className="hidden pdf-only flex flex-col gap-2 pt-6 border-t border-[#EBEBEB]">
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#AEAeb2]">Taxonomy Identification</span>
                   <div className="flex gap-2 flex-wrap">
                     {task.tags.map(tag => (
                       <span key={tag} className="text-[10px] font-bold text-[#4285F4] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                         {tag}
                       </span>
                     ))}
                   </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="px-6 md:p-10 pb-6 space-y-4 no-pdf bg-gray-50/50 border-t border-[#EBEBEB]">
           <div className="flex gap-2 md:gap-3">
                <Input 
                  placeholder="New component..." 
                  value={newSubTask} 
                  onChange={(e) => setNewSubTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubTask()}
                  className="rounded-xl md:rounded-2xl h-12 md:h-14 bg-white border-[#EBEBEB] text-xs md:text-sm focus-visible:ring-[#4285F4]/20 border-2 px-4 md:px-5 font-medium flex-1 overflow-hidden"
                />
                <Button onClick={addSubTask} variant="outline" className="h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-2xl font-bold text-[#4285F4] hover:bg-blue-50 border-2 border-[#EBEBEB] shrink-0">
                  <Plus className="w-5 h-5 md:w-6 h-6" />
                </Button>
            </div>
            <SheetClose render={<Button className="w-full gemini-gradient text-white font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] h-14 md:h-16 rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">
              Close
            </Button>} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface TaskItemProps {
  key?: React.Key;
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isSelected: boolean;
  onToggleSelect: () => void;
}

function TaskItem({ task, onUpdate, onDelete, isSelected, onToggleSelect }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedPriority, setEditedPriority] = useState<Priority>(task.priority);
  const [editedTags, setEditedTags] = useState(task.tags.join(', '));
  const [editedNotes, setEditedNotes] = useState(task.notes || '');
  const [editedWorkingDate, setEditedWorkingDate] = useState(task.workingDate || '');
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || '');
  const dragControls = useDragControls();

  const handleUpdate = async () => {
    await onUpdate(task.id, { 
      title: editedTitle, 
      priority: editedPriority, 
      tags: editedTags.split(',').map(t => t.trim()).filter(t => t),
      notes: editedNotes,
      workingDate: editedWorkingDate || null,
      dueDate: editedDueDate || null
    });
    setIsEditing(false);
    toast.success('Task updated');
  };

  const toggleStatus = async () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await onUpdate(task.id, { status: newStatus });
    if (newStatus === 'completed') {
      toast.success('Task Completed!', {
        icon: <Sparkles className="w-4 h-4 text-[#4285F4]" />,
        className: 'font-bold rounded-2xl border-none shadow-xl'
      });
    }
  };

  const statusIcons = {
    'todo': <Clock className="w-3.5 h-3.5" />,
    'in-progress': <Layers className="w-3.5 h-3.5" />,
    'completed': <CheckCircle2 className="w-3.5 h-3.5" />
  };

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="list-none"
    >
      <Card className={`bg-white border-none shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.06)] transition-all overflow-hidden p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 group relative ${isSelected ? 'ring-2 ring-[#4285F4]/40 bg-blue-50/10' : ''}`}>
        
        {/* Gemini-like circular animation inside task card */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-tr from-[#4285F4]/10 to-[#9b72cb]/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
          />
          <motion.div 
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-[#9b72cb]/10 to-[#4285F4]/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <div className="relative z-10 flex items-center gap-3 md:gap-4 flex-1 w-full">
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
             <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus();
                }}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                  task.status === 'completed' 
                    ? 'bg-[#34C759] border-[#34C759] shadow-lg shadow-green-200' 
                    : 'border-[#EBEBEB] hover:border-[#4285F4] hover:bg-blue-50/50'
                }`}
              >
                {task.status === 'completed' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="w-4 md:w-4.5 h-4 md:h-4.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
          </div>
          
          <div className="flex-1 min-w-0">
            <motion.h3 
              layout
              className={`font-bold text-base md:text-lg tracking-tight transition-all truncate ${
                task.status === 'completed' ? 'text-[#AEAeb2] line-through decoration-2' : 'text-[#1D1D1F]'
              }`}
            >
              {task.title}
            </motion.h3>
            <div className="flex items-center gap-2 md:gap-4 mt-1.5 md:mt-2 flex-wrap">
              <Badge variant="outline" className={`rounded-lg border-none text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 ${
                task.priority === 'high' ? 'bg-[#FFF2F2] text-[#FF3B30]' : 
                task.priority === 'medium' ? 'bg-[#E5F1FF] text-[#4285F4]' : 'bg-[#F2F2F7] text-[#8E8E93]'
              }`}>
                {task.priority} Priority
              </Badge>
              {task.workingDate && (
                <>
                  <Separator orientation="vertical" className="h-2.5 md:h-3 bg-[#EBEBEB]" />
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-[#8E8E93] uppercase tracking-tighter">
                    <Calendar className="w-2.5 h-2.5 md:w-3 h-3 text-[#4285F4]" />
                    {new Date(task.workingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </>
              )}
              {task.dueDate && (
                <>
                  <Separator orientation="vertical" className="h-2.5 md:h-3 bg-[#EBEBEB]" />
                  <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-[#8E8E93] uppercase tracking-tighter">
                    <Clock className="w-2.5 h-2.5 md:w-3 h-3 text-[#FF3B30]" />
                    Due: {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </>
              )}
              <Separator orientation="vertical" className="h-2.5 md:h-3 bg-[#EBEBEB]" />
              <div className="flex gap-1.5 md:gap-2">
                {task.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[#AEAeb2] text-[9px] md:text-[10px] font-bold flex items-center gap-1 bg-[#F2F2F7] px-1.5 md:px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
                {task.tags.length > 3 && <span className="text-[#AEAeb2] text-[9px] font-bold">+{task.tags.length - 3}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-[#F2F2F7] pt-4 md:pt-0 md:pl-6">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] ${
              task.status === 'completed' ? 'bg-green-50 text-[#34C759]' : 'bg-[#F2F2F7] text-[#8E8E93]'
            }`}>
              {statusIcons[task.status]}
              {task.status.replace('-', ' ')}
            </div>
          </div>

          <div className="flex items-center gap-2 transition-all duration-300 md:opacity-0 group-hover:opacity-100">
            {/* Right side: View, Delete, Edit */}
            <TaskDetailsSheet task={task} onUpdate={onUpdate} />

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="rounded-xl w-9 h-9 border-2 border-transparent hover:border-[#FF3B30] hover:bg-[#FFF2F2] text-[#AEAeb2] hover:text-[#FF3B30] transition-all" />}>
                <Trash2 className="w-4 h-4" />
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8 max-w-sm z-[200]">
                <AlertDialogHeader className="mb-6">
                  <AlertDialogTitle className="text-2xl font-black tracking-tight text-[#1D1D1F]">Delete Task?</AlertDialogTitle>
                  <AlertDialogDescription className="text-[#8E8E93] text-sm">
                    This task will be deleted permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 flex flex-col sm:flex-col-reverse">
                  <AlertDialogCancel variant="outline" className="w-full rounded-2xl h-12 font-bold border-[#EBEBEB] text-[#1D1D1F]">Keep Task</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(task.id)} className="w-full bg-[#FF3B30] text-white hover:bg-[#D70015] rounded-2xl h-12 font-bold shadow-lg shadow-red-500/20">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger render={<Button variant="ghost" size="icon" className="rounded-xl w-9 h-9 hover:bg-blue-50 text-[#AEAeb2] hover:text-[#1D1D1F] transition-all" />}>
                <Settings2 className="w-5 h-5" />
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] rounded-[32px] md:rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white z-[200] flex flex-col">
                <div className="p-6 md:p-8 border-b border-[#F2F2F7] relative bg-[#FAFAFA]/50">
                  <DialogHeader>
                    <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight text-[#1D1D1F]">Edit Task</DialogTitle>
                    <DialogDescription className="text-xs md:text-sm font-medium text-[#8E8E93] mt-1">
                      Update the details of your task.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <ScrollArea className="flex-1 w-full">
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Task Title</Label>
                      <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="rounded-2xl h-12 md:h-14 bg-[#F9F9F9] border-[#EBEBEB] focus-visible:ring-[#4285F4]/20 border-2 px-5 font-bold text-base md:text-lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Priority</Label>
                        <PrioritySelector value={editedPriority} onChange={setEditedPriority} className="w-full h-12 md:h-14" />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Tags</Label>
                        <Input value={editedTags} onChange={(e) => setEditedTags(e.target.value)} className="rounded-2xl h-12 md:h-14 bg-[#F9F9F9] border-[#EBEBEB] border-2 px-5 font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4285F4] pointer-events-none opacity-50" />
                          <Input type="date" value={editedWorkingDate} onChange={(e) => setEditedWorkingDate(e.target.value)} className="rounded-2xl h-12 md:h-14 bg-[#F9F9F9] border-[#EBEBEB] border-2 pl-12 pr-5 font-bold uppercase tracking-tight" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Due Date</Label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF3B30] pointer-events-none opacity-50" />
                          <Input type="date" value={editedDueDate} onChange={(e) => setEditedDueDate(e.target.value)} className="rounded-2xl h-12 md:h-14 bg-[#F9F9F9] border-[#EBEBEB] border-2 pl-12 pr-5 font-bold uppercase tracking-tight" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#AEAeb2] ml-1">Task Notes</Label>
                      <Textarea value={editedNotes} onChange={(e) => setEditedNotes(e.target.value)} className="rounded-2xl bg-[#F9F9F9] border-[#EBEBEB] border-2 p-5 font-medium min-h-[120px] md:min-h-[150px] resize-none" />
                    </div>
                  </div>
                </ScrollArea>
                <div className="p-6 md:p-8 pt-4 border-t border-[#F2F2F7] flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="w-full sm:flex-1 rounded-2xl h-12 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs text-[#AEAeb2] hover:text-[#1D1D1F]">Cancel</Button>
                  <Button onClick={handleUpdate} className="w-full sm:flex-1 gemini-gradient text-white rounded-2xl h-12 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Save Changes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </Reorder.Item>
  );
}
