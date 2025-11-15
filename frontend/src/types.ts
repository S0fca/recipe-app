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