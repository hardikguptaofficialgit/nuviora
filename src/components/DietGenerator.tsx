import React, { useState } from 'react';
import { Utensils, ChevronDown, ChevronUp, X, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { generateDietPlan, getDietTypes, getHealthGoals, getAllergies } from '@/services/dietService';

interface DietPlan {
  meals: Meal[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}

const DietGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  
  // Form state
  const [dietType, setDietType] = useState('balanced');
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState('');
  
  const dietTypes = getDietTypes();
  const healthGoals = getHealthGoals();
  const allergies = getAllergies();
  
  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };
  
  const toggleAllergy = (allergyId: string) => {
    if (selectedAllergies.includes(allergyId)) {
      setSelectedAllergies(selectedAllergies.filter(id => id !== allergyId));
    } else {
      setSelectedAllergies([...selectedAllergies, allergyId]);
    }
  };
  
  const addExcludedIngredient = () => {
    if (excludeInput.trim() && !excludedIngredients.includes(excludeInput.trim())) {
      setExcludedIngredients([...excludedIngredients, excludeInput.trim()]);
      setExcludeInput('');
    }
  };
  
  const removeExcludedIngredient = (ingredient: string) => {
    setExcludedIngredients(excludedIngredients.filter(item => item !== ingredient));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExcludedIngredient();
    }
  };
  
  const handleGenerateDietPlan = async () => {
    setIsGenerating(true);
    
    try {
      const plan = await generateDietPlan({
        dietType,
        calorieTarget,
        goals: selectedGoals,
        allergies: selectedAllergies,
        excludeIngredients: excludedIngredients
      });
      
      setDietPlan(plan);
      setShowForm(false);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      // Handle error
    } finally {
      setIsGenerating(false);
    }
  };
  
  const toggleMealExpansion = (mealType: string) => {
    if (expandedMeal === mealType) {
      setExpandedMeal(null);
    } else {
      setExpandedMeal(mealType);
    }
  };
  
  const resetForm = () => {
    setDietPlan(null);
    setShowForm(true);
    setExpandedMeal(null);
  };
  
  return (
    <div className="mb-6">
      <Card className="border border-neon-dim overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-black/80 border-b border-neon-dim p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Utensils className="text-neon" size={20} />
              <h2 className="text-xl font-medium text-white">AI Diet Generator</h2>
            </div>
            <Badge variant="outline" className="bg-neon/10 text-neon border-neon">
              Powered by NuviChef
            </Badge>
          </div>
          
          {/* Content */}
          <div className="p-4 bg-black/50 backdrop-blur-sm">
            {showForm ? (
              <div className="space-y-6">
                {/* Diet Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Diet Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {dietTypes.map(type => (
                      <Button
                        key={type.id}
                        variant={dietType === type.id ? "default" : "outline"}
                        className={dietType === type.id ? "bg-neon text-black" : "border-neon-dim hover:bg-neon-dim/20"}
                        onClick={() => setDietType(type.id)}
                      >
                        {type.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Calorie Target */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Calorie Target: {calorieTarget} kcal
                  </label>
                  <Slider
                    value={[calorieTarget]}
                    min={1200}
                    max={3500}
                    step={50}
                    onValueChange={(value) => setCalorieTarget(value[0])}
                    className="my-4"
                  />
                  <div className="flex justify-between text-xs opacity-70">
                    <span>1200 kcal</span>
                    <span>3500 kcal</span>
                  </div>
                </div>
                
                {/* Health Goals */}
                <div>
                  <label className="block text-sm font-medium mb-2">Health Goals (Select up to 3)</label>
                  <div className="flex flex-wrap gap-2">
                    {healthGoals.map(goal => (
                      <Badge
                        key={goal.id}
                        variant="outline"
                        className={`cursor-pointer ${
                          selectedGoals.includes(goal.id)
                            ? "bg-neon text-black border-neon"
                            : "border-neon-dim hover:bg-neon-dim/20"
                        }`}
                        onClick={() => toggleGoal(goal.id)}
                      >
                        {selectedGoals.includes(goal.id) && <Check size={12} className="mr-1" />}
                        {goal.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium mb-2">Allergies & Intolerances</label>
                  <div className="flex flex-wrap gap-2">
                    {allergies.map(allergy => (
                      <Badge
                        key={allergy.id}
                        variant="outline"
                        className={`cursor-pointer ${
                          selectedAllergies.includes(allergy.id)
                            ? "bg-red-500/20 text-red-300 border-red-500"
                            : "border-neon-dim hover:bg-neon-dim/20"
                        }`}
                        onClick={() => toggleAllergy(allergy.id)}
                      >
                        {selectedAllergies.includes(allergy.id) && <X size={12} className="mr-1" />}
                        {allergy.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Excluded Ingredients */}
                <div>
                  <label className="block text-sm font-medium mb-2">Exclude Ingredients</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={excludeInput}
                      onChange={(e) => setExcludeInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g., mushrooms, cilantro"
                      className="flex-1 px-3 py-2 bg-black/30 border border-neon-dim rounded-md focus:outline-none focus:ring-1 focus:ring-neon"
                    />
                    <Button
                      onClick={addExcludedIngredient}
                      disabled={!excludeInput.trim()}
                      className="bg-neon text-black hover:bg-neon/80"
                    >
                      Add
                    </Button>
                  </div>
                  {excludedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {excludedIngredients.map(ingredient => (
                        <Badge
                          key={ingredient}
                          variant="outline"
                          className="bg-red-500/20 text-red-300 border-red-500"
                        >
                          {ingredient}
                          <X
                            size={12}
                            className="ml-1 cursor-pointer"
                            onClick={() => removeExcludedIngredient(ingredient)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Generate Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleGenerateDietPlan}
                    disabled={isGenerating}
                    className="bg-neon text-black hover:bg-neon/80 px-8 py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="mr-2 animate-spin" />
                        Generating Your Plan...
                      </>
                    ) : (
                      <>
                        <Utensils size={20} className="mr-2" />
                        Generate Diet Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : dietPlan ? (
              <div className="space-y-6">
                {/* Diet Plan Summary */}
                <div className="bg-black/30 rounded-lg p-4 border border-neon-dim">
                  <h3 className="text-lg font-medium mb-3 text-white">Your Personalized Diet Plan</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs opacity-70">CALORIES</p>
                      <p className="text-2xl font-bold text-neon">{dietPlan.calories}</p>
                      <p className="text-xs">kcal</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">PROTEIN</p>
                      <p className="text-2xl font-bold text-neon">{dietPlan.protein}</p>
                      <p className="text-xs">g</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">CARBS</p>
                      <p className="text-2xl font-bold text-neon">{dietPlan.carbs}</p>
                      <p className="text-xs">g</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">FAT</p>
                      <p className="text-2xl font-bold text-neon">{dietPlan.fat}</p>
                      <p className="text-xs">g</p>
                    </div>
                  </div>
                </div>
                
                {/* Meals */}
                <div className="space-y-4">
                  {dietPlan.meals.map((meal) => (
                    <div
                      key={meal.type}
                      className="border border-neon-dim rounded-lg overflow-hidden"
                    >
                      {/* Meal Header */}
                      <div
                        className="flex justify-between items-center p-3 bg-black/40 cursor-pointer"
                        onClick={() => toggleMealExpansion(meal.type)}
                      >
                        <div className="flex items-center gap-2">
                          <Badge className="bg-neon text-black">
                            {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                          </Badge>
                          <h4 className="font-medium">{meal.name}</h4>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm opacity-80">{meal.calories} kcal</span>
                          {expandedMeal === meal.type ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Meal Details */}
                      {expandedMeal === meal.type && (
                        <div className="p-4 bg-black/20">
                          <div className="flex flex-col md:flex-row gap-4">
                            {meal.imageUrl && (
                              <div className="md:w-1/3">
                                <div className="rounded-lg overflow-hidden h-48 md:h-full">
                                  <img
                                    src={meal.imageUrl}
                                    alt={meal.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className={meal.imageUrl ? "md:w-2/3" : "w-full"}>
                              <div className="flex justify-between mb-3">
                                <div className="flex gap-3 text-sm">
                                  <span>{meal.protein}g protein</span>
                                  <span>{meal.carbs}g carbs</span>
                                  <span>{meal.fat}g fat</span>
                                </div>
                              </div>
                              
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">Ingredients:</h5>
                                <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
                                  {meal.ingredients.map((ingredient, idx) => (
                                    <li key={idx}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-1">Instructions:</h5>
                                <p className="text-sm opacity-80">{meal.instructions}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Reset Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={resetForm}
                    className="bg-neon text-black hover:bg-neon/80"
                  >
                    Generate New Plan
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietGenerator;
