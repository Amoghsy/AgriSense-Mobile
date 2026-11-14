import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiseaseDetection } from '../types';
import { initialDetectionHistory, sampleDiseaseResults } from '../constants/mockData';

interface DetectionContextType {
  history: DiseaseDetection[];
  latestResult: DiseaseDetection | null;
  isAnalyzing: boolean;
  analyzeImage: (imageUri: string) => Promise<DiseaseDetection>;
  clearHistory: () => Promise<void>;
  setLatestResult: (result: DiseaseDetection | null) => void;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);
const HISTORY_KEY = '@agrisense_detection_history';

export const DetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<DiseaseDetection[]>(initialDetectionHistory);
  const [latestResult, setLatestResult] = useState<DiseaseDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (e) {
      console.warn('Failed to load detection history', e);
    }
  };

  const analyzeImage = async (imageUri: string): Promise<DiseaseDetection> => {
    setIsAnalyzing(true);

    // Simulate realistic AI model inference time (1.6s)
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // Cycle through rich sample diseases for realistic variation
    const pool = [
      sampleDiseaseResults.earlyBlight,
      sampleDiseaseResults.powderyMildew,
      sampleDiseaseResults.healthy,
    ];
    const picked = pool[Math.floor(Math.random() * pool.length)];

    const newDetection: DiseaseDetection = {
      ...picked,
      id: `diag_${Date.now()}`,
      imageUri: imageUri || picked.imageUri,
      date: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      isDemo: true,
    };

    const updated = [newDetection, ...history];
    setHistory(updated);
    setLatestResult(newDetection);
    setIsAnalyzing(false);

    try {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save detection history', e);
    }

    return newDetection;
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem(HISTORY_KEY);
  };

  return (
    <DetectionContext.Provider
      value={{
        history,
        latestResult,
        isAnalyzing,
        analyzeImage,
        clearHistory,
        setLatestResult,
      }}
    >
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};
