// //Create variables here
// var dog, happyDog, database, position, foodStock, feedPetButton, addFoodButton,milkObj;
// var feed,add,addFood,FeedTime,changeGameState,readGameState,washroom,bedroom,garden,bgImg,bg;
// var gameState = "Hungry ";
// var lastFedTime = 10;

// function preload()
// {
//   //load images here
//   dogImg = loadImage("images/dogImg.png");
//   happyDogImg = loadImage("images/happy dog.png");
//   washroom = loadImage("images/Wash Room.png");
//   bedroom = loadImage("images/Bed Room.png");
//   garden = loadImage("images/Garden.png");
//   sadDog = loadImage("images/deadDog.png");
//   bgImg = loadImage("images/blueSky.jpg");
// }

// function setup() {
//   createCanvas(400,500);


//   database = firebase.database();
//   // console.log(database);

//   milkObj = new Food();

//   foodStock = database.ref('Food'); 
//   foodStock.on("value", readStock);
 

//   dog = createSprite(200,400,150,150);
//   dog.addImage(dogImg);
//   dog.scale = 0.15;

//   feed = createButton("FEED THE DOG");
//   feed.position(700,95);
//   feed.mousePressed(feedDog);

//   add = createButton("ADD FOOD");
//   add.position(800,95);
//   add.mousePressed(addFood);

//   readGameState = database.ref("gameState");
//   readGameState.on("value", function(data){
//   gameState = data.val();


//   })
// }


// function draw() {  
//   background(46, 139, 87);
//   // update();
//   milkObj.display();

//   if (gameState!="Hungry") {
//     feed.hide();
//     add.hide();
//     dog.remove();
//   }else{
//     feed.show();
//     add.show();
//     dog.addImage(sadDog);
//   }

//   drawSprites();
// }

// function readStock(data){
//   position = data.val();
//   milkObj.updateFoodStock(position);
// }

// function addFood(){
//   position = position + 1;
//   database.ref('/').update({
//   'Food':position
//   })
// }

// function feedDog(){
//     dog.addImage(happyDogImg);
//     milkObj.updateFoodStock(milkObj.getFoodStock()-1);
//     database.ref('/').update({
//     Food:milkObj.getFoodStock(),
//     FeedTime:hour()
//   });
// }

// function showError(){
//   console.log("Error in writing to the database");
// }

// function update(state) {
//     database.ref("/").update({
//     gameState:state
//   });
// }
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload(){
sadDog=loadImage("images/dogImg.png");
happyDog=loadImage("images/happy dog.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}