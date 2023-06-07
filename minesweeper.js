
// number of mines (default 99)
// number of rows (default 16)
// number of columns (default 30)
// Create game button on top left

// generates game on first click

// on click, if 0, do flood. if number, reveal, if bomb, reveal all bombs and end game

let numberOfMines = 99;
let numberOfRows = 16;
let numberOfColumns = 30;
let twoDimensionalArray = [];

document.querySelector('.newGame-btn').addEventListener('click',handleNewGame);


function handleNewGame() {
    numberOfMines = document.querySelector('#inputMines').valueAsNumber;
    numberOfRows = document.querySelector('#inputRows').valueAsNumber;
    numberOfColumns = document.querySelector('#inputColumns').valueAsNumber;
    twoDimensionalArray = [];

    // delete any previous grid
    removeGrid();

    // exit function if inputs are invalid
    if((numberOfMines >0 && numberOfRows >0 && numberOfColumns >0)===false){
        document.querySelector('.display-text').innerText = 'All inputs must be positive numbers!';
        return;
    }

    if(numberOfColumns*numberOfRows-numberOfMines<=0){
        document.querySelector('.display-text').innerText = 'There must be more squares than bombs!';
        return;       
    }

    document.querySelector('.display-text').innerText = "Reveal all numbers to win! Don't click the bombs!";

    // create 2d array to store bombs and numbers of just 0s
    for(let i = 0; i<numberOfRows; i++){

    let rowArray = [];
    for (let j = 0; j<numberOfColumns; j++){
        rowArray.push(0);
    }
        twoDimensionalArray.push(rowArray);
    }

    // number is now stored in twoDimensionalArray[row][column]
    // create grid
    // create div for row and loop
    for(let i = 0; i<numberOfRows;i++){

        let newRowEl = document.createElement('div');
        newRowEl.classList.add('grid-wrapper');
        // insert divs for columns and divs for text
        for(let j = 0; j<numberOfColumns; j++){
            let newBoxEl = document.createElement('div');
            newBoxEl.classList.add('box');
            newBoxEl.classList.add('hideBox');
            newBoxEl.addEventListener('mouseover',handleBoxMouseOver);
            newBoxEl.addEventListener('mouseout',handleBoxMouseOut);
            newBoxEl.addEventListener('click',handleFirstBoxClick);
            newBoxEl.dataset.Row = i;
            newBoxEl.dataset.Column = j;

            let newTextEl = document.createElement('span');
            newTextEl.classList.add('hideText');
            newBoxEl.append(newTextEl);
            
            newRowEl.append(newBoxEl);
        }
        document.querySelector('.grid-area').append(newRowEl);
    }


}

function handleBoxMouseOver(event){
    // change box color on mouseover by changing class
    if(event.target.classList.contains('showBox')===false){
        event.target.classList.add('mouseover');
    } else if(event.target.classList.contains('mouseover')){
        event.target.classList.remove('mouseover');
    }
}

function handleBoxMouseOut(event){
    if(event.target.classList.contains('mouseover')){
        event.target.classList.remove('mouseover');
    }
}

function handleFirstBoxClick(event){
    // get clicked box coordinates
    let clickedRow = Number(event.target.dataset.Row);
    let clickedColumn = Number(event.target.dataset.Column);
    
    // get bomb coordinates, skipping clicked box
    let coordinates = [];
    let bombCoordinates = [];
    for(let i = 0;i<numberOfRows;i++){
        for(let j = 0;j<numberOfColumns;j++){
            if((i===Number(clickedRow)&&j===Number(clickedColumn))===false)
            coordinates.push([i,j]);
        }
    }

    while(bombCoordinates.length<numberOfMines){
        let randomBombLocation = Math.floor(Math.random()*coordinates.length);
        bombCoordinates.push(coordinates[randomBombLocation]);
        coordinates.splice(randomBombLocation,1);
    }

    // place bombs
    for(let i = 0;i<bombCoordinates.length;i++){

        twoDimensionalArray[bombCoordinates[i][0]][bombCoordinates[i][1]] = -1;

    }


    // place numbers in array
    for(let i = 0;i<numberOfRows;i++){
        for(let j = 0;j<numberOfColumns;j++){
            if(twoDimensionalArray[i][j] !== -1){
                
                let bombAboveCheck = 0;
                let bombBelowCheck = 0;
                let bombLeftCheck = 0;
                let bombRightCheck = 0;
                let bombAboveLeftCheck = 0;
                let bombAboveRightCheck = 0;
                let bombBelowLeftCheck = 0;
                let bombBelowRightCheck = 0;


                if(i===0){
                    bombAboveCheck = 0;
                } else if(twoDimensionalArray[i-1][j] === -1){
                    bombAboveCheck = 1;
                }

                if(i===numberOfRows-1){
                    bombBelowCheck = 0;
                } else if(twoDimensionalArray[i+1][j] === -1){
                    bombBelowCheck = 1;
                }

                if(j===0){
                    bombLeftCheck = 0;
                } else if(twoDimensionalArray[i][j-1] === -1){
                    bombLeftCheck = 1;
                }

                if(j===numberOfColumns-1){
                    bombRightCheck = 0;
                } else if(twoDimensionalArray[i][j+1] === -1){
                    bombRightCheck = 1;
                }
                if(i===0 || j===0){
                    bombAboveLeftCheck = 0;
                } else if(twoDimensionalArray[i-1][j-1] === -1){
                    bombAboveLeftCheck = 1;
                }
                if(i===0 || j===numberOfColumns-1){
                    bombAboveRightCheck = 0;
                } else if(twoDimensionalArray[i-1][j+1] === -1){
                    bombAboveRightCheck = 1;
                }
                if(i===numberOfRows-1 || j===0){
                    bombBelowLeftCheck = 0;
                } else if(twoDimensionalArray[i+1][j-1] === -1){
                    bombBelowLeftCheck = 1;
                }
                if(i===numberOfRows-1 || j===numberOfColumns-1){
                    bombBelowRightCheck = 0;
                } else if(twoDimensionalArray[i+1][j+1] === -1){
                    bombBelowRightCheck = 1;
                }

                twoDimensionalArray[i][j] = bombAboveCheck + bombBelowCheck + bombLeftCheck + bombRightCheck + bombAboveLeftCheck + bombAboveRightCheck + bombBelowLeftCheck + bombBelowRightCheck;



            }

        }
    }

    // set css classes on boxes
    let allBoxes = document.querySelectorAll('.box');

    let shownNumberClasses = ['show0','show1','show2','show3','show4','show5','show6','show7','show8',];

    for (box of allBoxes){
        if(twoDimensionalArray[Number(box.dataset.Row)][Number(box.dataset.Column)]===-1){
            box.classList.add('bomb');
            box.querySelector('span').classList.add('bombText');
        } else {
        box.classList.add(shownNumberClasses[twoDimensionalArray[Number(box.dataset.Row)][Number(box.dataset.Column)]]);
        }
    }
   

    // set innerText on Boxes
    for (box of allBoxes){
        if(twoDimensionalArray[Number(box.dataset.Row)][Number(box.dataset.Column)]===-1){
            box.querySelector('span').innerText= '0';
        } else {
            box.querySelector('span').innerText= twoDimensionalArray[Number(box.dataset.Row)][Number(box.dataset.Column)];
        }
    }    

    // perform fill or reveal number at click location
    if(twoDimensionalArray[clickedRow][clickedColumn]===0){
        let floodCoordinates = [];
        floodCoordinates = getFlood(Number(clickedRow),Number(clickedColumn));
        for(let box of allBoxes){
            for(let floodCoordinate of floodCoordinates){
                if(Number(box.dataset.Row) === floodCoordinate[0] && Number(box.dataset.Column) === floodCoordinate[1]){
                    box.removeEventListener('mouseover',handleBoxMouseOver);
                    box.removeEventListener('mouseout',handleBoxMouseOut);
                    if(box.classList.contains('mouseover')){
                        box.classList.remove('mouseover');
                    }
                    if(box.classList.contains('hideBox')){
                        box.classList.remove('hideBox');
                    }
                    if(!box.classList.contains('showBox')){
                        box.classList.add('showBox');
                    }
                    if(box.querySelector('span').classList.contains('hideText')){
                        box.querySelector('span').classList.remove('hideText');
                    } 
                }
            }
        }

    } else {
        event.target.removeEventListener('mouseover',handleBoxMouseOver);
        event.target.removeEventListener('mouseout',handleBoxMouseOut);
        if(event.target.classList.contains('mouseover')){
            event.target.classList.remove('mouseover');
        }
        if(event.target.classList.contains('hideBox')){
            event.target.classList.remove('hideBox');
        }
        if(!event.target.classList.contains('showBox')){
            event.target.classList.add('showBox');
        }
        if(event.target.querySelector('span').classList.contains('hideText')){
            event.target.querySelector('span').classList.remove('hideText');
        } 
    }

    // revealBox(event,clickedRow,clickedColumn);

    // remove handleFirstBoxClick on all boxes and add handleBoxClick

    for (box of allBoxes){
        box.removeEventListener('click',handleFirstBoxClick);
        if((Number(box.dataset.Row)===clickedRow && Number(box.dataset.Column)=== clickedColumn )===false){
            box.addEventListener('click',handleBoxClick);
        } 
    }
    
    // victory condition
    if(document.querySelectorAll('.hideBox').length === numberOfMines){
        document.querySelector('.display-text').innerText = "Victory! Play again?";
        for(box of allBoxes){
            box.removeEventListener('click',handleBoxClick);
            if(box.classList.contains('bomb')){
                box.classList.add('bombVictory');
            }
        }
    }

}

function handleBoxClick(event){
    let clickedRow = Number(event.target.dataset.Row);
    let clickedColumn = Number(event.target.dataset.Column);
    let allBoxes = document.querySelectorAll('.box');
    if(twoDimensionalArray[clickedRow][clickedColumn]===-1){
        // change text to defeat text
            document.querySelector('.display-text').innerText = 'Defeat! Play again?';

        // reveal all boxes and remove eventListener
        for (box of allBoxes){
            box.removeEventListener('click',handleBoxClick);
            box.removeEventListener('mouseover',handleBoxMouseOver);
            box.removeEventListener('mouseout',handleBoxMouseOut);
            if(box.classList.contains('mouseover')){
                box.classList.remove('mouseover');
            }
            if(box.classList.contains('hideBox')){
                box.classList.remove('hideBox');
            }
            if(!box.classList.contains('showBox')){
                box.classList.add('showBox');
            }
            if(box.querySelector('span').classList.contains('hideText')){
                box.querySelector('span').classList.remove('hideText');
            } 

        } 
    } else if(twoDimensionalArray[clickedRow][clickedColumn]===0){
        //Flood fill for connected 0 tiles
        // reveal all flood fill tiles and remove eventListener
        let floodCoordinates = [];
        floodCoordinates = getFlood(Number(clickedRow),Number(clickedColumn));
        for(let box of allBoxes){
            for(let floodCoordinate of floodCoordinates){
                if(Number(box.dataset.Row) === floodCoordinate[0] && Number(box.dataset.Column) === floodCoordinate[1]){
                    box.removeEventListener('click',handleBoxClick);
                    box.removeEventListener('mouseover',handleBoxMouseOver);
                    box.removeEventListener('mouseout',handleBoxMouseOut);
                    if(box.classList.contains('mouseover')){
                        box.classList.remove('mouseover');
                    }
                    if(box.classList.contains('hideBox')){
                        box.classList.remove('hideBox');
                    }
                    if(!box.classList.contains('showBox')){
                        box.classList.add('showBox');
                    }
                    if(box.querySelector('span').classList.contains('hideText')){
                        box.querySelector('span').classList.remove('hideText');
                    }  
                }
            }
        }

    } else {
        // reveal number and remove eventListener
        event.target.removeEventListener('click',handleBoxClick);
        event.target.removeEventListener('mouseover',handleBoxMouseOver);
        event.target.removeEventListener('mouseout',handleBoxMouseOut);
        if(event.target.classList.contains('mouseover')){
            event.target.classList.remove('mouseover');
        }
        if(event.target.classList.contains('hideBox')){
            event.target.classList.remove('hideBox');
        }
        if(!event.target.classList.contains('showBox')){
            event.target.classList.add('showBox');
        }
        if(event.target.querySelector('span').classList.contains('hideText')){
            event.target.querySelector('span').classList.remove('hideText');
        } 



    }


    // victory condition
    if(document.querySelectorAll('.hideBox').length === numberOfMines){
        document.querySelector('.display-text').innerText = "Victory! Play again?";
        for(box of allBoxes){
            box.removeEventListener('click',handleBoxClick);
            if(box.classList.contains('bomb')){
                box.classList.add('bombVictory');
            }
        }
    }
}

function removeGrid(){
    while (document.querySelector('.grid-area').firstChild) {
        document.querySelector('.grid-area').removeChild(document.querySelector('.grid-area').firstChild);
    }
}

//function to return list of coordinates that are part of flood
// at each step, check up, down, left and right
function getFlood(Row,Column){
    let toCheckArray = [[Row,Column]];
    let outputArray = [];
    let checkedArray = [];
    let rowToCheck = Row;
    let columnToCheck = Column;

    for(let i = 0; i<numberOfRows; i++){

        let rowArray = [];
        for (let j = 0; j<numberOfColumns; j++){
            rowArray.push(0);
        }
            checkedArray.push(rowArray);
    }

    while(toCheckArray.length>0){
        
        // if value checked, add to output
        if(!arrayContains([toCheckArray[0][0],toCheckArray[0][1]],outputArray)){
            outputArray.push(toCheckArray[0]);
        }
        // if matches 0 and if 8 directions are not in checked, add to toCheck
        if(twoDimensionalArray[toCheckArray[0][0]][toCheckArray[0][1]] === 0){
            if(toCheckArray[0][0]>0){
                rowToCheck = toCheckArray[0][0]-1;
                columnToCheck = toCheckArray[0][1];
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][0]< numberOfRows-1){
                rowToCheck = toCheckArray[0][0]+1;
                columnToCheck = toCheckArray[0][1];
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][1]>0){
                rowToCheck = toCheckArray[0][0];
                columnToCheck = toCheckArray[0][1]-1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][1]<numberOfColumns-1){
                rowToCheck = toCheckArray[0][0];
                columnToCheck = toCheckArray[0][1]+1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][0]>0 && toCheckArray[0][1]>0){
                rowToCheck = toCheckArray[0][0]-1;
                columnToCheck = toCheckArray[0][1]-1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][0]>0 && toCheckArray[0][1]<numberOfColumns-1){
                rowToCheck = toCheckArray[0][0]-1;
                columnToCheck = toCheckArray[0][1]+1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][0]< numberOfRows-1 && toCheckArray[0][1]>0){
                rowToCheck = toCheckArray[0][0]+1;
                columnToCheck = toCheckArray[0][1]-1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }
            if(toCheckArray[0][0]< numberOfRows-1 && toCheckArray[0][1]<numberOfColumns-1){
                rowToCheck = toCheckArray[0][0]+1;
                columnToCheck = toCheckArray[0][1]+1;
                if(checkedArray[rowToCheck][columnToCheck] === 0 && !arrayContains([rowToCheck,columnToCheck],toCheckArray)){
                    toCheckArray.push([rowToCheck,columnToCheck]);
                }
            }

        }
        
        // add to checked
        checkedArray[toCheckArray[0][0]][toCheckArray[0][1]] = 1;
        // remove from toCheck
        toCheckArray.shift();



    }

    return outputArray;
}

function arrayContains(childArray, parentArray){
    let arrayContainsChecker = 0;
    for(let i = 0;i<parentArray.length;i++){
        if(childArray[0]===parentArray[i][0] && childArray[1]===parentArray[i][1]){
            arrayContainsChecker = 1;
        }
    }
    if (arrayContainsChecker > 0){
        return true;
    } else {

        return false;
    }
}