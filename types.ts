
export enum AnalysisType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE'
}

export interface UrlRisk {
  url: string;
  risk: 'High' | 'Medium' | 'Low' | 'Safe';
  issues: string[];
}

export interface ScanResult {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM' | 'UNCERTAIN';
  scam_score: number; // 0-100
  red_flags: string[];
  urls: UrlRisk[];
  summary: string;
  ai_image_probability?: number; // 0-1.0
  image_analysis_details?: {
    skin_smoothness: string;
    background_warping: string;
    reflection_symmetry: string;
    edge_consistency: string;
  };
  extracted_text_preview?: string;
}

export interface FileData {
  name: string;
  type: string;
  base64: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'apple';
}
