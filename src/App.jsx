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
  const [first12Names,setFirst12Names] = useState([]);
  
  
  function handleCardClick(name){
    setClickCount(c => c+1);
    if(score+1 == 12){
      setBestScore(12);
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

  /*function handleReset(){
    setHaveWon(false);
    setBestScore(0);
    setScore(0);
    setClickedCards([]);
    setClickCount(0);
  }*/

  

  useEffect(() => {
    const pokemonArray = ["bulbasaur","ivysaur","venusaur", "charmander","charmeleon","charizard","squirtle","wartortle","blastoise","caterpie","metapod","butterfree","weedle","kakuna","beedrill","pidgey","pidgeotto","pidgeot","rattata","raticate","spearow","fearow","ekans","arbok","pikachu","raichu","sandshrew","sandslash","nidoran-f","nidorina"];
    const shuffled = shuffle(pokemonArray);
    setFirst12Names(shuffled.slice(0,12))
  }, [])

  useEffect(() => {
    if(first12Names.length === 0) return;
    const shuffled = shuffle(first12Names);
    Promise.all(
      shuffled.map(name=> 
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(res => res.json())
      )
    )
      .then(results => setData(results))
      .catch((err) => console.error(err));
    }
    , [clickCount,first12Names]);

  return (
    <div className='main-container'>
      <h1>Pokémon Memory Game</h1>
      <p>Get points by clicking on an image but don't click on any more than once!</p>
      <div className='scores'>
        <span>Score: {score}</span>
        <span>Best Score: {bestScore}</span>
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
      <div className={haveWon ? 'winner-display' : 'winner-display disabled'}>
        <h2>YOU WIN!!!!!!!</h2>
        <p>Would you like to restart?</p>
        <button type='button' onClick={() => window.location.reload()}id='reset-button'>Restart?</button>
      </div>
    </div>
  );
}

export default App
