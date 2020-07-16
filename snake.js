/* <style>
#root {display: grid; grid-template-columns: repeat(20, 20px [col-start]);}
#root div {width: 20px; height: 20px; display: inline-block; border: solid 1px gray}
.cell0 {background-color: white;}
.cell1 {background-color: black;}
.cell2 {background-color: gray;;}
.cell3 {background-color: red;}

</style> */

import React,{useState,useEffect} from 'react';
import ReactDom from 'react-dom';


  const status = {
      empty:0,
      head: 1,
      body:2,
      star:3
  }

  const init = () => {
    const head = [11,10];
    const tail = [10,10];
    let board = Array.from({length:20},()=> {
      return Array.from({length:20},() => ({status:status.empty}))
    });

    board[head[0]][head[1]] = {status: status.head};
    board[tail[0]][tail[1]] = { status: status.body, from: [...head] };

    return {
      board: board,
      head : [...head],
      tail : [...tail]
    }
}

  const Line = (props) =>{
    return props.line.map((cell,j) => <Cell key={`c${j}`} cell={cell}/>)
  }  
  const Cell = (props) =>{
    return <div className={`cell${props.cell.status}`}></div>
  }
  const Board = () => {
    let [game,setGame] = useState(init());
    let [timeInterval,setTimeInterval] = useState(800);
    let [direction,setDirection] = useState([1,0]);
    let [staresSteps,setStaresSteps] = useState(0);
    let clearTick;
    
     useEffect(()=>{
          
          const gameOver = () => {
              return newHead[0] == -1 || newHead[0] == game.board.length || newHead[1] == -1 || newHead[1] == game.board.length || game.board[newHead[0]][newHead[1]].status == status.body
          }
          const stepOnStar = () => {
            return game.board[newHead[0]][newHead[1]].status == status.star;
          }

          const setCell = (loc,val) => {
            game.board[loc[0]][loc[1]] = val;
          }

          const getEmptyCells = () => {
            let emptyCells = [];
            game.board.map((line,i)=>{
                line.map((cell,j) => {
                  if(cell.status === 0){
                    emptyCells.push([i,j]);
                  }
                })
              });
              return emptyCells;
          }
          const newHead = [game.head[0] + direction[0],game.head[1] + direction[1]];
          const newTail = game.board[game.tail[0]][game.tail[1]].from;

          if(gameOver()){
            clearTimeout(clearTick);
            return;
          }
          
          if(stepOnStar()){
            setStaresSteps(staresSteps + 3);
          }else{
            setStaresSteps(staresSteps===0?0:staresSteps-1);
          }
          
          setCell(newHead,{status:status.head});
          setCell(game.head,{status: status.body, from:newHead});

          if(staresSteps == 0){
            setCell(game.tail,{status: status.empty, from: null});
            game.tail = newTail;
          }
          
          const emptyCells = getEmptyCells();

          const chanceForStar = emptyCells.length/(game.board.length*game.board.length)/10;

          if(Math.random()>0.9 - chanceForStar){
            const star = emptyCells[Math.floor(Math.random()*emptyCells.length)];
            game.board[star[0]][star[1]].status = status.star;
          }
          game.head = newHead;
          
          setGame({...game});
    },[timeInterval]);

    const tick = () => {
      clearTimeout(clearTick);
      if(timeInterval > 100){
        setTimeInterval(timeInterval -1);
      }
    }

  useEffect(()=>{
    clearTick = setTimeout(tick,timeInterval);
    return ()=> {clearTimeout(clearTick);}
  },[game])

    useEffect(() => {
      const keyPress = k=>{
        switch(k.key){
          case 'ArrowRight': setDirection([0,1]); break;
          case 'ArrowLeft': setDirection([0,-1]); break;
          case 'ArrowDown': setDirection([1,0]); break;
          case 'ArrowUp': setDirection([-1,0]); break;
        }
      };
      window.addEventListener('keydown', keyPress);
      return () => {
        window.removeEventListener('keydown', keyPress);
      };
    }, []); 
  
    const restart = () => {
      clearTimeout(clearTick);
      setStaresSteps(0);
      setTimeInterval(800);
      setGame(init());
    }
    return (<>{
      game.board.map((line,i) => (<Line key={`l${i}`} line={line} />))
      }<p>{staresSteps}</p>
      <input type="button" onClick={restart} value="Restart" />
      </>
    )
  }

  ReactDom.render(
      <Board />,
      document.querySelector('#root')
  )