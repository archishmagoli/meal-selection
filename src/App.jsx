import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css'

function App() {
  const URL = 'https://www.themealdb.com/api/json/v1/1/random.php';

  const [meal, setMeal] = useState();
  const [banned, setBanned] = useState(new Set());
  const [mealHistory, setMealHistory] = useState([]);
  const MAX_RETRIES = 25;

  const getMeal = async () => {
    try {
      let response = await axios.get(URL);
      let testMeal = response.data.meals ? response.data.meals[0] : null;
      let previousMeal = null;
      let retries = 0;
  
      while (
        !testMeal ||
        banned.has(testMeal.strMeal) ||
        banned.has(testMeal.strCategory) ||
        banned.has(testMeal.strArea) ||
        banned.has(testMeal.strIngredient1) ||
        previousMeal === testMeal
      ) {
        retries++;
        if (retries >= MAX_RETRIES) {
          alert('Too many banned items. Remove some items to get unique results.');
          return;
        }
  
        response = await axios.get(URL);
        previousMeal = testMeal;
        testMeal = response.data.meals ? response.data.meals[0] : null;
      }
  
      setMeal(testMeal);
      retries = 0;
    } catch (error) {
      console.error('Error fetching meal:', error);
    }
  };

  const handleClick = () => {
    if (meal) {
      setMealHistory([...mealHistory, meal]);
    }

    getMeal();
  }

  const banItems = (e) => {
    setBanned(new Set([...banned, e.target.value]));
  }

  const Meal = () => {
    if (meal) {
      return (
        <div>
          <h3>{meal.strMeal}</h3>
          <button onClick={banItems} value={meal.strCategory}>{meal.strCategory}</button>
          <br />
          <br />
          <button onClick={banItems} value={meal.strArea}>{meal.strArea}</button>
          <br />
          <br />
          <button onClick={banItems} value={meal.strIngredient1}>{meal.strIngredient1}</button>
          <br />
          <br />
          <img className= 'previewImage' src={meal.strMealThumb} />
        </div>
      )
    }
  }

  return (
    <>
      <button onClick={handleClick}>Discover</button>
      <br />
      <br />
      <Meal />
      <h2>Banned List</h2>
      {
        [...banned].map((bannedItem) => <p key={bannedItem}>{bannedItem}</p>)
      }

      <h2>Meal History</h2>
      {
        mealHistory.map((seenMeal, index) => 
          <div key={String(seenMeal.idMeal + "-" + index)}>
            <p>{seenMeal.strMeal}</p>
            <p>{seenMeal.strArea}</p>
            <p>{seenMeal.strCategory}</p>
            <p>{seenMeal.strIngredient1}</p>
            <img className= 'historyImage' src={seenMeal.strMealThumb} />
          </div>)
      }
    </>
  )
}

export default App
