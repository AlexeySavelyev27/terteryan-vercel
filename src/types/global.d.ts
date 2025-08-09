// Global types for the application
declare global {
  interface Window {
    // Rich text editor functions
    richTextEditorCommand?: (command: string, value?: string) => void;
    richTextEditorIsActive?: (command: string) => boolean;
    richTextEditorTriggerChange?: () => void;
    
    // Music player functions
    adminMusicTracks?: Array<{
      id: string;
      title: string;
      artist: string;
      url: string;
      file?: File;
    }>;
    updateAdminMusicTracks?: (tracks: Array<{
      id: string;
      title: string;
      artist: string;
      url: string;
      file?: File;
    }>) => void;
  }
}

export {};
