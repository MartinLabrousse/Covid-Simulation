# Covid-Simulation
Some simulation about Covid, &amp; impact on key figures depending on policy


// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.fillStyle = "#FF0000";

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Global Variable

let Scenario = 1;
let OldScenario=1;



var ProbTransfer =[];
const NumberBall = Math.trunc(width * height/320000 * 80) ;
const BallSize=5;
const MaxSpeed=4
const DelayBefDisease = 2;
var DeathRate = [];
var RetentionStart = [];
var RetentionPerf =[];
const DiseaseDurationMin = 8;
const DiseaseDurationMax = 8;

'// for Remy to update'
// Scenario 1
 DeathRate[1] = 0.01;
 ProbTransfer[1] = 0.1;
 RetentionPerf[1]=0;
 RetentionStart[1] = 10;

// Scenario 2
 DeathRate[2] = 0.01;
 ProbTransfer[2] = 0.8;
 RetentionStart[2] = 10;
 RetentionPerf[2]=0;

// Scenario 3
 DeathRate[3] = 0.01;
 ProbTransfer[3] = 0.8;
 RetentionStart[3] = 5;
 RetentionPerf[3] = 0.5;

// Scenario 4
 DeathRate[4] = 0.01;
 ProbTransfer[4] = 0.8;
 RetentionStart[4] = 5;
 RetentionPerf[4]=0.5;

 // Scenario 5
 DeathRate[5] = 0.01;
 ProbTransfer[5] = 0.8;
 RetentionStart[5] = 5;
 RetentionPerf[5]=0.97;

 // Scenario 6 : vaccin
 DeathRate[6] = 0.01;
 ProbTransfer[6] = 0;
 RetentionStart[6] = 5;
 RetentionPerf[6]=0;

const Normal = 'rgb(' + 0 + ',' + 128 + ',' + 0 +')'; //green
const Sick = 'rgb(' + 255 + ',' + 0 + ',' + 0 +')';//red
const Cured = 'rgb(' + 0 + ',' + 0 + ',' + 255 +')';//blue
const Dead = 'rgb(' + 0 + ',' + 0 + ',' + 0 +')';// black
const Screen = 'rgb(' + 255 + ',' + 255 + ',' + 255 +')'; // White


let now = new Date();
let BegTime = now.getTime();

// manage matrix

function Create2DArray(rows) {
  var overlap = [];

  for (var i=0;i<rows;i++) {
     overlap[i] = [];
  }

  return overlap;
}

var overlap = Create2DArray(NumberBall);



// function to generate random number

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// define ScenarioParamater

// define Ball constructor

function Ball(x, y, velX, velY, color, size, nextphase,retention) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
  this.nextphase=nextphase;
  this.retention=retention;


}

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  //ctx.fillText("1", this.x+10, this.y);
  ctx.fill();
};



// define ball update method

Ball.prototype.update = function() {
  if(this.color != Dead)
  {
    if((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  else {
    this.velX=0;
    this.velY=0;
  }
// retention manage
  let Rnow = new Date();
  let RnowT = Rnow.getTime();

  if(RnowT>RetentionStart[Scenario]*1000+BegTime && (this.retention<RetentionPerf[Scenario]*100) )

    {

    this.velX=0;
    this.velY=0;
    }


};

// define ball updatecolor method

Ball.prototype.updatecolor = function() {
  let Rnow = new Date();
  let RnowT = Rnow.getTime();

  if(RnowT>this.nextphase && (this.color==Sick) )

  {
    if(DeathRate[Scenario]*100>random(0,100))
    {this.color =Dead}
    else
    {this.color =Cured}
    ;
  }

};

// define ball collision detection

Ball.prototype.collisionDetect = function(i) {
  for(let j = 0; j < balls.length; j++) {


    //manage first infection
    Rnow = new Date();
    RnowT = Rnow.getTime();
    if( j==0 && balls[j].color== Normal && RnowT>BegTime+DelayBefDisease*1000)
    {
      balls[j].color=Sick;
      balls[j].nextphase=RnowT+1000*random(DiseaseDurationMin,DiseaseDurationMax)

    };

    //



    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        //manage 2 balls touching
        // to manage overlap and not do 10 times the loop
         if(overlap[i][j]!=1&& overlap[j][i]!=1)
         {

            overlap[i][j]=1;
            overlap[j][i]=1;
        // 1 normal and 1 sick
          if(balls[j].color==Sick && this.color==Normal && random(0,100)<ProbTransfer[Scenario]*100)
          {
            this.color = Sick
            this.nextphase=RnowT+1000*random(DiseaseDurationMin,DiseaseDurationMax)

          };
          if(balls[j].color==Normal && this.color==Sick && random(0,100)<ProbTransfer[Scenario]*100)
          {
            balls[j].color = Sick
            balls[j].nextphase=RnowT+1000*random(DiseaseDurationMin,DiseaseDurationMax)

          }
         }

      }
      else{
         overlap[i][j]=0;
         overlap[j][i]=0;
      }
    }
  }
};

// define array to store balls and populate it


let balls = [];

while(balls.length < NumberBall) {
  const size = BallSize;
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-MaxSpeed,MaxSpeed),
    random(-MaxSpeed,MaxSpeed),
    Normal,
    size,
    0,
    random(0,100)
  );
  balls.push(ball);
}

// define ball reinit

Ball.prototype.reinit = function() {

    const size = BallSize;
    this.x=random(0 + size,width - size);
    this.y=random(0 + size,height - size);
    this.velX=random(-MaxSpeed,MaxSpeed);
    this.velY=random(-MaxSpeed,MaxSpeed);
    this.color=Normal;
    this.size=size;


};

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = Screen;
  ctx.fillRect(0,0,width,height);

    CountNormal=0;
    CountSick=0;
    CountCured=0;
    CountDead=0;

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
      // pour afficher les num de balle
      ctx.beginPath();
    //  ctx.fillText("", balls[i].x+10, balls[i].y);
      ctx.fill();

    balls[i].updatecolor();
    balls[i].update();
    balls[i].collisionDetect(i);

    if(balls[i].color==Normal) {
        CountNormal=CountNormal+1;
    }
    else if (balls[i].color==Sick){
        CountSick=CountSick+1;
    }
    else if (balls[i].color==Cured){
        CountCured=CountCured+1;
    }
    else if (balls[i].color==Dead){
        CountDead=CountDead+1;
    }

  }
  //Rnow = new date();
  Rnow = new Date();
  RnowT = Rnow.getTime();


  ctx.fillStyle = Dead;
  ctx.fillText(''.concat("Temps : ",Math.trunc((RnowT - BegTime)/1000)) , 10, 10);

  ctx.fillStyle=Normal;
  ctx.fillText("Sains : " , 10, 30);
  ctx.fillText(CountNormal , 50, 30);
  ctx.fillStyle=Sick;
  ctx.fillText("Malades : " , 10, 40);
  ctx.fillText(CountSick , 50, 40);
  ctx.fillStyle=Cured;
  ctx.fillText("Guéris : " , 10, 50);
  ctx.fillText(CountCured , 50, 50);
  ctx.fillStyle=Dead;
  ctx.fillText("Décès : " , 10, 60);
  ctx.fillText(CountDead , 50, 60);

  Scenario = document.getElementById('Scénario').value;
  if(Scenario!=OldScenario)
  {
    for(let i = 0; i < NumberBall; i++) {
      balls[i].reinit();
    }
   now = new Date();
   BegTime = now.getTime();

  }

  OldScenario = Scenario
  //ctx.fillText(Math.trunc(width * height/320000), 30, 20);

  //ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();

  requestAnimationFrame(loop);
}

loop();
