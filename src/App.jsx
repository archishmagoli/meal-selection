import axios from 'axios';
import { useState } from 'react';
import './App.css'

function App() {
  const URL = 'https://www.themealdb.com/api/json/v1/1/random.php';

  const [meal, setMeal] = useState(null);
  const [banned, setBanned] = useState([]);
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
        banned.includes(testMeal.strMeal) ||
        banned.includes(testMeal.strCategory) ||
        banned.includes(testMeal.strArea) ||
        banned.includes(testMeal.strIngredient1) ||
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
    if (!banned.includes(e.target.value)) {
      setBanned([...banned, e.target.value]);
    } else {
      setBanned([...banned]);
    }
  }

  const Meal = () => {
    if (meal) {
      return (
        <div>
          <h3>{meal.strMeal}</h3>
          <button className="propertyButton" onClick={banItems} value={meal.strCategory}>{meal.strCategory}</button>
          <button className="propertyButton" onClick={banItems} value={meal.strArea}>{meal.strArea}</button>
          <button className="propertyButton" onClick={banItems} value={meal.strIngredient1}>{meal.strIngredient1}</button>
          <br />
          <br />
          <img className="previewImage" src={meal.strMealThumb} />
        </div>
      )
    }
  }

  const unbanItem = (e) => {
    setBanned(banned.filter(item => item !== e.target.value));
  }

  return (
    <>
      <div id="container">

        <div id="history">
          <h2>Meal History</h2>
          <h4><i>Which meals have we seen so far?</i></h4>
          {
            mealHistory.toReversed().map((seenMeal, index) => 
              <div className="previousMeal" key={index}>
                <img className= "historyImage" src={seenMeal.strMealThumb} />
                <p>{seenMeal.strMeal}</p>
              </div>)
          }
        </div>

        <div id="discover">
          <div id="discoverContent">
            <h1>Bon Appetit!</h1>
            <h3>Embrace the symphony of flavors life offers and select a new meal below!</h3>
            <button id="discoverButton" onClick={handleClick}>Discover 💫</button>
            <br />
            <br />
            <Meal />
          </div>
        </div>
        
        <div id="banned">
          <h2>Banned List</h2>
          <h4><i>Select an attribute in your listing to ban it.</i></h4>
          {
            banned.map((bannedItem, index) => 
              <>
                <button className='bannedButton' key={index} value={bannedItem} onClick={unbanItem}>{bannedItem}</button>
                <br /> <br />
              </>
            
            )
          }
        </div>

      </div>
    </>
  )
}

export default App
