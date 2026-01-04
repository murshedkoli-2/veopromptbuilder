export interface SceneState {
  location: string;
  timeOfDay: string;
  weather: string;
  envDescription: string;
  sensoryDetails: string;
}

export interface CharacterState {
  count: number;
  ageGroup: string;
  attire: string;
  role: string;
  gestures: string;
  emotions: string;
  props: string;
  culturalNotes: string;
}

export interface CameraState {
  shotType: string;
  angle: string;
  movement: string;
  lensStyle: string;
  aspectRatio: string;
  notes: string;
}

export interface EmotionState {
  mood: string;
  pacing: string;
  colorGrade: string;
  nuance: string;
}

export interface DialogueState {
  language: string;
  style: string;
  delivery: string;
  lines: string;
  ambience: string;
}

export interface TechnicalState {
  resolution: string;
  motionFidelity: string;
  realismLevel: string;
  safetyRating: string;
  constraints: string;
}

export interface PromptState {
  scene: SceneState;
  characters: CharacterState;
  camera: CameraState;
  emotion: EmotionState;
  dialogue: DialogueState;
  technical: TechnicalState;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  promptState: PromptState;
}

export interface SavedScene {
  id: string;
  name: string;
  data: SceneState;
  createdAt: number;
}

export interface SavedCharacter {
  id: string;
  name: string;
  data: CharacterState;
  createdAt: number;
}

export interface PromptHistoryItem {
  id: string;
  prompt: string;
  state: PromptState;
  createdAt: number;
}

export const initialPromptState: PromptState = {
  scene: {
    location: '',
    timeOfDay: '',
    weather: '',
    envDescription: '',
    sensoryDetails: '',
  },
  characters: {
    count: 0,
    ageGroup: '',
    attire: '',
    role: '',
    gestures: '',
    emotions: '',
    props: '',
    culturalNotes: '',
  },
  camera: {
    shotType: '',
    angle: '',
    movement: '',
    lensStyle: '',
    aspectRatio: '',
    notes: '',
  },
  emotion: {
    mood: '',
    pacing: '',
    colorGrade: '',
    nuance: '',
  },
  dialogue: {
    language: '',
    style: '',
    delivery: '',
    lines: '',
    ambience: '',
  },
  technical: {
    resolution: '',
    motionFidelity: '',
    realismLevel: '',
    safetyRating: '',
    constraints: '',
  },
};
