package com.example.recipeapp.config;

import com.example.recipeapp.dto.IngredientDTO;
import com.example.recipeapp.dto.RecipeDTO;
import com.example.recipeapp.model.Recipe;
import com.example.recipeapp.model.Tag;
import com.example.recipeapp.model.User;
import com.example.recipeapp.repository.RecipeRepository;
import com.example.recipeapp.repository.TagRepository;
import com.example.recipeapp.repository.UserRepository;
import com.example.recipeapp.services.RecipeService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RecipeRepository recipeRepository, RecipeService recipeService, UserRepository userRepository, TagRepository tagRepository, PasswordEncoder passwordEncoder) {
        return args -> {

            List<String> defaultTags = List.of("vegan", "vegetarian", "gluten-free", "lactose-free", "dairy-free");
            for (String tagName : defaultTags) {
                if (tagRepository.findByName(tagName).isEmpty()) {
                    tagRepository.save(new Tag(tagName));
                }
            }
            System.out.println("Default tags added.");


            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setPassword(passwordEncoder.encode("user1234"));
                userRepository.save(user);
                System.out.println("User created");
            }

            User user = userRepository.findByUsername("user").orElse(null);
            if (user != null) {

                List<String> tags = List.of("gluten-free", "dairy-free", "lactose-free");

                List<IngredientDTO> ingredients = List.of(
                        new IngredientDTO(null, "ground meat", "as needed"),
                        new IngredientDTO(null, "oil", "as needed"),
                        new IngredientDTO(null, "salt, pepper", "to taste"),
                        new IngredientDTO(null, "oregano", "to taste"),
                        new IngredientDTO(null, "tomato purée", "as needed"),
                        new IngredientDTO(null, "garlic", "1–3 cloves"),
                        new IngredientDTO(null, "water", "as needed")
                );

                RecipeDTO recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Bolognese");
                recipeDTO.setDescription("Traditional meat-based Italian sauce.");
                recipeDTO.setInstructions(
                        "1. Add oil and ground meat to a pot.\n" +
                                "2. Season with salt, pepper, and oregano.\n" +
                                "3. Brown the meat.\n" +
                                "4. Add tomato purée, water, and garlic.\n" +
                                "5. Simmer for about one hour."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                Optional<Recipe> existing = recipeRepository.findByTitle("Bolognese");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Bolognese");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Bolognese");
                }

                //

                tags = List.of("vegan", "vegetarian", "gluten-free", "lactose-free", "dairy-free");

                ingredients = List.of(
                        new IngredientDTO(null, "beans", "as needed"),
                        new IngredientDTO(null, "oil", "as needed"),
                        new IngredientDTO(null, "ground red paprika", "to taste"),
                        new IngredientDTO(null, "chili (optional)", "to taste"),
                        new IngredientDTO(null, "cumin", "1 tsp"),
                        new IngredientDTO(null, "cinnamon", "½ tsp"),
                        new IngredientDTO(null, "garlic", "1–2 cloves"),
                        new IngredientDTO(null, "marjoram", "to taste"),
                        new IngredientDTO(null, "tomato paste", "1 tbsp"),
                        new IngredientDTO(null, "salt, pepper", "to taste"),
                        new IngredientDTO(null, "tomato purée", "as needed"),
                        new IngredientDTO(null, "water", "as needed"),
                        new IngredientDTO(null, "sugar", "a pinch"),
                        new IngredientDTO(null, "corn", "as needed"),
                        new IngredientDTO(null, "dark chocolate", "1 cube")
                );

                recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Bean Chili");
                recipeDTO.setDescription("Hearty vegetarian/vegan chili with beans and spices.");
                recipeDTO.setInstructions(
                        "1. Heat oil in a pot and add spices.\n" +
                                "2. Stir in 1 tablespoon of tomato paste.\n" +
                                "3. Add salt, pepper, tomato purée, water, and a pinch of sugar.\n" +
                                "4. Bring to a boil and simmer briefly.\n" +
                                "5. Add beans, corn, and a piece of dark chocolate.\n" +
                                "6. Cook for about 15 minutes.\n" +
                                "7. Serve with rice or tortillas and optionally top with cheese."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                existing = recipeRepository.findByTitle("Bean Chili");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Bean Chili");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Bean Chili");
                }

                //

                tags = List.of("vegetarian", "gluten-free");

                ingredients = List.of(
                        new IngredientDTO(null, "butter", "1–2 tbsp"),
                        new IngredientDTO(null, "mixed vegetables", "as needed"),
                        new IngredientDTO(null, "potatoes", "as needed"),
                        new IngredientDTO(null, "carrots", "as needed"),
                        new IngredientDTO(null, "corn", "as needed"),
                        new IngredientDTO(null, "peas", "as needed"),
                        new IngredientDTO(null, "flour (gluten-free)", "1–2 tbsp"),
                        new IngredientDTO(null, "salt, pepper", "to taste"),
                        new IngredientDTO(null, "cumin", "to taste"),
                        new IngredientDTO(null, "goulash seasoning", "to taste"),
                        new IngredientDTO(null, "water", "as needed"),
                        new IngredientDTO(null, "egg (for dumplings)", "1"),
                        new IngredientDTO(null, "semolina (for dumplings)", "as needed"),
                        new IngredientDTO(null, "salt (for dumplings)", "a pinch")
                );

                recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Vegetable Soup");
                recipeDTO.setDescription("Vegetable soup (with dumplings).");
                recipeDTO.setInstructions(
                        "1. Melt butter in a pot and sauté the vegetables (potatoes, carrots, corn, peas).\n" +
                                "2. Sprinkle with gluten-free flour and add spices (salt, pepper, cumin, goulash seasoning).\n" +
                                "3. Pour in water and bring to a boil. Simmer until vegetables are tender.\n" +
                                "4. For dumplings: mix egg, semolina, and salt into a dough.\n" +
                                "5. Add small pieces of dough into the soup and cook until they float."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                existing = recipeRepository.findByTitle("Vegetable Soup");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Vegetable Soup");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Vegetable Soup");
                }

                //

                tags = List.of("vegetarian");

                ingredients = List.of(
                        new IngredientDTO(null, "eggs", "2 pcs"),
                        new IngredientDTO(null, "milk", "300 ml"),
                        new IngredientDTO(null, "flour", "100 g"),
                        new IngredientDTO(null, "salt", "a pinch"),
                        new IngredientDTO(null, "oil or butter", "for frying")
                );

                recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Crepes");
                recipeDTO.setDescription("Thin pancakes.");
                recipeDTO.setInstructions(
                        "1. Mix flour, eggs, milk, and a pinch of salt into a smooth batter.\n" +
                                "2. Heat a lightly oiled pan over medium heat.\n" +
                                "3. Pour a small amount of batter into the pan and tilt to spread evenly.\n" +
                                "4. Cook until golden on one side, then flip and cook the other side.\n" +
                                "5. Serve with jam, Nutella, or fruit as desired."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                existing = recipeRepository.findByTitle("Crepes");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Crepes");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Crepes");
                }


                //

                tags = List.of("vegetarian", "gluten-free");

                ingredients = List.of(
                        new IngredientDTO(null, "eggs", "3–4 pcs"),
                        new IngredientDTO(null, "cream cheese or spreadable butter", "100 g"),
                        new IngredientDTO(null, "Dijon mustard", "1 tsp"),
                        new IngredientDTO(null, "salt", "to taste"),
                        new IngredientDTO(null, "pepper", "to taste")
                );

                recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Egg Spread");
                recipeDTO.setDescription("A simple and creamy egg spread.");
                recipeDTO.setInstructions(
                        "1. Hard boil the eggs and let them cool.\n" +
                                "2. Peel and finely chop the eggs.\n" +
                                "3. Mix with cream cheese or spreadable butter.\n" +
                                "4. Add a small amount of Dijon mustard.\n" +
                                "5. Season with salt and pepper to taste.\n" +
                                "6. Mix well and chill before serving."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                existing = recipeRepository.findByTitle("Egg Spread");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Egg Spread");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Egg Spread");
                }


                //

                tags = List.of("vegetarian");

                ingredients = List.of(
                        new IngredientDTO(null, "pasta", "250 g"),
                        new IngredientDTO(null, "butter", "2 tbsp"),
                        new IngredientDTO(null, "flour", "2 tbsp"),
                        new IngredientDTO(null, "milk", "400 ml"),
                        new IngredientDTO(null, "grated cheese (cheddar or similar)", "200 g"),
                        new IngredientDTO(null, "salt", "to taste"),
                        new IngredientDTO(null, "pepper", "to taste")
                );

                recipeDTO = new RecipeDTO();
                recipeDTO.setTitle("Mac and Cheese");
                recipeDTO.setDescription("Creamy stovetop mac and cheese – quick and easy comfort food.");
                recipeDTO.setInstructions(
                        "1. Cook pasta in salted water according to package instructions.\n" +
                                "2. In a saucepan, melt butter over medium heat.\n" +
                                "3. Add flour and whisk for 1 minute to create a roux.\n" +
                                "4. Gradually whisk in milk, stirring until smooth and thickened.\n" +
                                "5. Add grated cheese and stir until melted into a smooth sauce.\n" +
                                "6. Season with salt and pepper.\n" +
                                "7. Stir in cooked pasta and mix until fully coated."
                );
                recipeDTO.setIngredients(ingredients);
                recipeDTO.setTags(tags);

                existing = recipeRepository.findByTitle("Mac and Cheese");

                if (existing.isPresent()) {
                    recipeDTO.setId(existing.get().getId());
                    recipeService.updateRecipe(recipeDTO, user);
                    System.out.println("Recipe updated: Mac and Cheese");
                } else {
                    recipeService.addRecipe(recipeDTO, user);
                    System.out.println("Recipe created: Mac and Cheese");
                }

            }
        };
    }
}
