export type Recipe = {
    id: number;
    title: string;
    description: string;
    instructions: string;
    createdByUsername: string;
    createdByUserId: number;
    tags: string[];
    ingredients: RecipeIngredient[];
    favourite: boolean;
};

export type RecipeIngredient = {
    id: number;
    name: string;
    quantity: string;
};

export type Tag = {
    id: number;
    name: string;
}

export type UserProfile = {
    id: number;
    username: string;
    bio: string;
    profileImageUrl: string;
}

export type UserBasic = {
    id: number;
    username: string;
};

export type Cookbook = {
    id: number;
    title: string;
    description: string;
    imageUrl?: string | null;
    owner: UserBasic;
    collaborators: UserBasic[];
    recipes: Recipe[];
};

export type CreateCookbookRequest = {
    title: string;
    description: string;
};

export type CookbookDTO = {
    id: number;
    title: string;
    description: string;
    imageUrl?: string | null;
    owner: UserBasic;
    collaborators: UserBasic[];
    recipes: Recipe[];
};
