class Game {
    constructor() {
        this.screen = this.loadScreenComponents();
        this.mapImg = this.loadGameMap(),
        this.mapCoord = {
            X: 0,
            Y: 0,
            W: this.screen.canvas.width,
            H: this.screen.canvas.height
        };

        this.fpsControl = {
            fps: 60,
            fpsInterval: 0,
            now: 0,
            then: 0,
            elapsed: 0,
            current: 0
        };

        this.userInput = {};
        this.registerKeyboardListener();

        //Keep track of every object that will be displayed on canvas
        this.gameObjectsOnScreen = {};
        
        //Create the Hero Character at the center of the canvas
        this.gameObjectsOnScreen["currentPlayer"] = new GameObject('hero', this.screen.canvas.width, this.screen.canvas.height);
    }

    loadGameMap() {
        const mapImage = new Image();
        mapImage.src = "./images/gamemap.png";
        return mapImage;
    }

    loadScreenComponents() {
        //Load rendering area
        const screenComponents = {};
        screenComponents.canvas  = document.getElementById('canvas1');
        screenComponents.context = screenComponents.canvas.getContext('2d');

        //Display loading game message
        screenComponents.context.clearRect(0,0,screenComponents.canvas.width, screenComponents.canvas.heigth);
        screenComponents.context.font = "30px Arial";
        screenComponents.context.fillText("Loading game...", 10, 50); 

        return screenComponents;
    }

    registerKeyboardListener() {
        window.addEventListener('keydown', (keyPressed) => { 
            this.userInput[keyPressed.key] = true;
        });
        
        window.addEventListener('keyup', (keyPressed) => { 
            delete this.userInput[keyPressed.key];
        });
    }

    start() {

        this.startTime = Date.now();

        //Control for Game FPS
        this.fpsControl.fpsInterval = 1000 / this.fpsControl.fps;
        this.fpsControl.then = this.startTime;

        //Start Animating Stuff
        this.animate();

    }

    handleUserInput() {
        if ((this.userInput.s || this.userInput.S) && (this.mapCoord.Y < this.mapImg.height - (this.screen.canvas.height / 2) - (this.gameObjectsOnScreen["currentPlayer"].imgPosition.H / 2))){
            this.mapCoord.Y += this.gameObjectsOnScreen["currentPlayer"].speed;
        }

        if ((this.userInput.w || this.userInput.W) && (this.mapCoord.Y > 0 - (this.screen.canvas.height / 2) + (this.gameObjectsOnScreen["currentPlayer"].imgPosition.H) / 2)){
            this.mapCoord.Y -= this.gameObjectsOnScreen["currentPlayer"].speed;
        }

        if ((this.userInput.a || this.userInput.A) && (this.mapCoord.X > 0 - (this.screen.canvas.width / 2) + (this.gameObjectsOnScreen["currentPlayer"].imgPosition.W / 2))){
            this.mapCoord.X -= this.gameObjectsOnScreen["currentPlayer"].speed;
        }

        if ((this.userInput.d || this.userInput.D) && (this.mapCoord.X < this.mapImg.width - (this.screen.canvas.width / 2) - (this.gameObjectsOnScreen["currentPlayer"].imgPosition.W / 2))){
            this.mapCoord.X += this.gameObjectsOnScreen["currentPlayer"].speed;
        }

        for(const el in this.gameObjectsOnScreen){
            this.gameObjectsOnScreen[el].handleUserInput(this.userInput, this.fpsControl.fps, this.fpsControl.current);
        }

    }

    animate(){

        this.fpsControl.now = Date.now();
        this.fpsControl.elapsed = this.fpsControl.now - this.fpsControl.then;
        if(this.fpsControl.elapsed > this.fpsControl.fpsInterval){
            this.fpsControl.then = this.fpsControl.now - (this.fpsControl.elapsed % this.fpsControl.fpsInterval);

            this.fpsControl.current += 1;
            if (this.fpsControl.current > this.fpsControl.fps - 1) this.fpsControl.current = 0;
            
            this.handleUserInput();

            //Clear Canvas to redraw everything
            this.screen.context.clearRect(0,0,this.screen.canvas.width, this.screen.canvas.height);
    
            //Draw Bakcground (map)
            this.screen.context.drawImage(
                this.mapImg,                                         //Imagem a ser desenhada na tela
                this.mapCoord.X, this.mapCoord.Y,                    //Posição X e Y da parte da imagem que deve ser desenhada
                this.mapCoord.W, this.mapCoord.H,                    //Posição final X e Y da parte da imagem que deve ser desenhada
                0, 0,                                                //Posição X e Y onde a imagem deve ser desenhada no browser
                this.screen.canvas.width, this.screen.canvas.height  //Largura e Altura que deve ser desenhado
            );
    
            for(const el in this.gameObjectsOnScreen){
                if (this.gameObjectsOnScreen[el].imgPosition.W){
                    this.screen.context.drawImage(
                        this.gameObjectsOnScreen[el].objImg,                                            //Imagem a ser desenhada na tela
                        this.gameObjectsOnScreen[el].imgPosition.X, this.gameObjectsOnScreen[el].imgPosition.Y, //Posição X e Y da parte da imagem que deve ser desenhada
                        this.gameObjectsOnScreen[el].imgPosition.W, this.gameObjectsOnScreen[el].imgPosition.H, //Posição final X e Y da parte da imagem que deve ser desenhada
                        this.gameObjectsOnScreen[el].scrPosition.X, this.gameObjectsOnScreen[el].scrPosition.Y, //Posição X e Y onde a imagem deve ser desenhada no canvas
                        this.gameObjectsOnScreen[el].scrPosition.W, this.gameObjectsOnScreen[el].scrPosition.H  //Largura e Altura que deve ser desenhado no canvas
                );
            }}
            
        }

        requestAnimationFrame(()=>{this.animate();});

    }
}

class GameObject {
    constructor(imgName, canvasW, canvasH) {
        this.imgPosition = {
            X: 0,
            Y: 0,
            W: 0, 
            H: 0  
        };
        this.scrPosition = {
            X: 0,  
            Y: 0,  
            W: 0,
            H: 0
        };
        this.spriteFpsControl = {
            fps: 6,
            displayingFrame: 0
        };          
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 5;
        
        this.objImg = new Image();
        this.objImg.onload = () => {
            this.imgPosition = {
                X: 0,
                Y: 0,
                W: parseInt(this.objImg.width  / 4), //Considering there are 4 frames
                H: parseInt(this.objImg.height / 4)  //Considering there are 4 positions
            };
            this.scrPosition = {
                X: parseInt(canvasW / 2 - this.imgPosition.W / 2),  //Position itself on center of canvas
                Y: parseInt(canvasH / 2 - this.imgPosition.H / 2),  //Position itself on center of canvas
                W: this.imgPosition.W,
                H: this.imgPosition.H
            };          
        };
        this.objImg.src = './images/'+ imgName + '.png';       
    }

    handleUserInput(userInput, gameFps, currFps){
        this.moving = false;
        if (userInput.s || userInput.S){
            this.frameY = 0;
            this.moving = true;
        }
        
        if (userInput.w || userInput.W){
            this.frameY = 1;
            this.moving = true;
        }

        if (userInput.d || userInput.D){
            this.frameY = 2;
            this.moving = true;  
        }     
        
        if (userInput.a || userInput.A){
            this.frameY = 3;
            this.moving = true;
        }

        if(this.moving){
                
            const ammountOfFrames = gameFps / this.spriteFpsControl.fps;
            const currentFrame = Math.floor(currFps / ammountOfFrames);
            if (currentFrame > this.spriteFpsControl.fps) //Avoid glitches (hope so)
                currentFrame = this.spriteFpsControl.fps;

            if (currentFrame !== this.spriteFpsControl.displayingFrame){
                this.spriteFpsControl.displayingFrame = currentFrame;
                this.frameX++;
                if(this.frameX > 3) { this.frameX = 0; }                     
            }

        }else{
            this.frameX = 0;
        }        

        this.imgPosition.X = this.objImg.width / 4 * this.frameX;
        this.imgPosition.Y = this.objImg.height / 4 * this.frameY;
        
    }    

}

const newGame = new Game();
newGame.start();
