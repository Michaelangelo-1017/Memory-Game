import { useState,useEffect } from 'react'
import './App.css'

function shuffle(array){
  const arr = [...array];
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [arr[i], arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

function App() {
  const [clickCount,setClickCount] = useState(0);
  const [clickedCards,setClickedCards] = useState([])
  const [data, setData] = useState([]);
  const [score,setScore] = useState(0);
  const [bestScore,setBestScore] = useState(0);
  const [haveWon,setHaveWon] = useState(false);
  function handleCardClick(name){
    setClickCount(c => c+1);
    if(score+1 == 12){
      setHaveWon(true);
    }
    if(!clickedCards.includes(name)){
      setClickedCards((prevArr)=>[...prevArr,name]);
      setScore(clickedCards.length+1);
    }
    else{
      setClickedCards([]);
      setScore(0);
      if(score > bestScore){
        setBestScore(score)
      }
    }
  }
  useEffect(() => {
      const pokemonArray = ['pikachu','bulbasaur','charmander','squirtle','jigglypuff','meowth','psyduck','snorlax','eevee','gengar','mewtwo','lucario'];
    const shuffled = shuffle(pokemonArray);

    Promise.all(
      shuffled.map(name=> 
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(res => res.json())
      )
    )
      .then(results => setData(results))
      .catch((err) => console.error(err));
    }
    , [clickCount]);

  return (
    <div className='main-container'>
      <h1>Pokémon Memory Game</h1>
      <p>Get points by clicking on an image but don't click on any more than once!</p>
      <div>
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>
      <div className={haveWon ?'cards-container disabled' : 'cards-container'}>
        {data.map(pokemon => (

        <div key={pokemon.id} className='pokemon-card' onClick={()=>handleCardClick(pokemon.name)} >
          <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
          <p>{pokemon.name.toUpperCase()}</p>
          
        </div>
      )
      )}
      </div>
      <p>The Array now is : {JSON.stringify(clickedCards)}</p>
    </div>
  );
}

export default App
