// Content types for better TypeScript support

export interface HomepageContent {
  composer: {
    firstName: string;
    lastName: string;
  };
  description: string[];
  buttons: {
    primary: string;
    secondary: string;
  };
}

export interface BiographySection {
  type: 'paragraph' | 'heading' | 'works';
  level?: number; // For headings
  content?: string;
  title?: string; // For works section
  items?: string[]; // For works section
}

export interface BiographyContent {
  title: string;
  sections: BiographySection[];
}

export interface MediaContent {
  title: string;
  subtitle: string;
  tracks: Array<{
    id: string;
    title: string;
    composer: string;
    duration: string;
    src: string;
  }>;
}

export interface ContactContent {
  title: string;
  subtitle: string;
  form: {
    fields: {
      [key: string]: {
        label: string;
        placeholder: string;
        required: boolean;
      };
    };
    captcha: {
      label: string;
      refreshText: string;
    };
    submitButton: {
      text: string;
      loadingText: string;
    };
    successMessage: {
      title: string;
      text: string;
    };
  };
}
