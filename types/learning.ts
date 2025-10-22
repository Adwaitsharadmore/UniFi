// Learning System Types

export type Unit = {
  id: string;
  title: string;            // e.g., "Foundations"
  order: number;
  skills: Skill[];
  checkpointId?: string;
};

export type Skill = {
  id: string;               // e.g., "budgeting_basics"
  title: string;            // Display name
  icon: string;             // emoji or key name
  color: string;            // token name / hex from theme
  order: number;
  lessons: LessonRef[];     // references
  prerequisiteSkillIds?: string[];
  tipId?: string;           // for "Tips" modal
};

export type LessonRef = { 
  id: string; 
};

export type Lesson = {
  id: string;
  skillId: string;
  title: string;
  exercises: ExerciseRef[]; // 5–8 per lesson
};

export type ExerciseRef = { 
  id: string; 
};

export type BaseExercise = { 
  id: string; 
  type: string; 
  prompt: string; 
  difficulty?: 1 | 2 | 3; 
};

export type MultipleChoice = BaseExercise & {
  type: 'multiple_choice';
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type TapTokens = BaseExercise & { 
  type: 'tap_tokens'; 
  tokens: string[]; 
  correct: string[]; 
};

export type FillInNumeric = BaseExercise & { 
  type: 'fill_in_numeric'; 
  unit?: '$' | '%'; 
  correct: number; 
  tolerance?: number; 
};

export type CategorizeTxn = BaseExercise & {
  type: 'categorize_txn';
  transactions: { desc: string; amount: number; }[];
  categories: string[];               // Dining, Groceries, Rent...
  correct: string[];                  // category for each txn
};

export type BudgetScenario = BaseExercise & {
  type: 'budget_scenario';
  context: { 
    incomeMonthly: number; 
    fixed: Record<string, number>; 
    variable: Record<string, number>; 
    goalMonthly?: number; 
  };
  question: string;                   // e.g., "What change keeps you on track?"
  options: string[]; 
  correctIndex: number; 
  explanation?: string;
};

export type TrueFalse = BaseExercise & { 
  type: 'true_false'; 
  correct: boolean; 
  explanation?: string; 
};

export type OrderSteps = BaseExercise & { 
  type: 'order_steps'; 
  steps: string[]; 
  correctOrder: string[]; 
};

export type Exercise = 
  | MultipleChoice
  | TapTokens
  | FillInNumeric
  | CategorizeTxn
  | BudgetScenario
  | TrueFalse
  | OrderSteps;

export type Tip = { 
  id: string; 
  title: string; 
  bullets: string[]; 
  link?: string; 
};

export type ProgressState = {
  hearts: number;                // 5 max
  maxHearts: number;             // default 5
  xp: number;
  streakDays: number;
  lastActiveISO?: string;
  crownsBySkill: Record<string, number>; // level per skill (0..3)
  lessonStatus: Record<string, 'locked' | 'open' | 'passed' | 'perfect'>;
  srs: SRSItem[];                // spaced repetition queue
};

export type SRSItem = { 
  exerciseId: string; 
  dueAt: string; 
  ease: number; 
  interval: number; 
  wrongStreak: number; 
};

export type LessonStatus = 'locked' | 'open' | 'passed' | 'perfect';

export type SkillStatus = 'locked' | 'open' | 'passed' | 'perfect';

export type LeaderboardEntry = {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  rank: number;
  region?: string;
};

export type WeeklyLeaderboard = {
  week: string; // YYYY-MM-DD format for Monday
  entries: LeaderboardEntry[];
};

// Learning Hook Types
export type LearningActions = {
  startLesson: (lessonId: string) => void;
  submitAnswer: (exerciseId: string, answer: any) => boolean;
  loseHeart: () => void;
  gainHeart: () => void;
  completeLesson: (lessonId: string, perfect: boolean) => void;
  enqueueSRS: (exerciseId: string, correct: boolean, responseTime: number) => void;
  dequeueSRS: (exerciseId: string) => void;
  refillDaily: () => void;
  awardXP: (amount: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
};

export type LearningState = ProgressState & {
  currentLesson?: string;
  currentExercise?: string;
  lessonHearts: number;
  lessonXP: number;
};

export type UseLearningReturn = LearningState & LearningActions;
