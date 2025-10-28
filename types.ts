export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface AdConfig {
  enabled: boolean;
  imageUrl: string;
  description: string;
  link: string;
}

export interface AppSettings {
  admin: AdminCredentials;
  ad: AdConfig;
}
