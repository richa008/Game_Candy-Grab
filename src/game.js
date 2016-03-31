Candy.Game = function(game){
    this.candyGroup = null; // Used only in Candy.Game
    this.spawnCandyTimer = 0;
    Candy.scoreText = null; //Can be used in other states and objects
    Candy.score = 0;
    Candy.health = 0;
};

Candy.Game.prototype = {   
    create: function(){       
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = Math.floor(Math.random() * (190 - 130)) + 130;
        this.add.sprite(-30, Candy.GAME_HEIGHT - 160, 'floor');
        this.add.sprite(10, 5, 'score-bg');
        this.add.button(Candy.GAME_WIDTH - 106, 5, 'button-pause', this.managePause, this);        
        this.spawnCandyTimer = 0;
        Candy.health = 10; 
        this.fontStyle = { font: "40px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "center" };
        Candy.scoreText = this.add.text(120, 20, "0", this.fontStyle);        
        this.candyGroup = this.add.group();
        Candy.item.spawnCandy(this);
    },
    managePause: function(){        
        this.game.paused = true; //Everything is frozen until paused is set to true
        var pausedText = this.add.text(100, 250, "Game paused,\n Click anywhere to continue..", this.fontStyle);
        this.input.onDown.add(function(){
            pausedText.destroy();
            this.game.paused = false;
        }, this);
    },
    update: function(){ //Executed on every frame of the game
        this.spawnCandyTimer += this.time.elapsed;
        if(this.spawnCandyTimer > 1000){ //1000 milliseconds
            this.spawnCandyTimer = 0;
            Candy.item.spawnCandy(this);
        }
        this.candyGroup.forEach(function(candy){
           candy.angle += candy.rotateMe; 
        });
        if(Candy.health <= 0){
            this.game.paused = true;
            var gameOverText = this.add.text(100, 250, "Sorry.. Game Over", this.fontStyle);
        }
    }
};

Candy.item = {
    spawnCandy: function(game){
        var dropPos = Math.floor(Math.random()*Candy.GAME_WIDTH);
        var dropOffset = [-27, -36, -36, -38, -48];
        var candyType = Math.floor(Math.random()*5);
        var candy = game.add.sprite(dropPos, dropOffset[candyType], 'candy');
        candy.animations.add('candyAnimation', [candyType], 10, true);
        candy.animations.play('candyAnimation');
        
        game.physics.enable(candy, Phaser.Physics.ARCADE);
        candy.inputEnabled = true;
        candy.events.onInputDown.add(this.clickCandy, this);
        
        candy.checkWorldBounds = true; //candy fires an event when it leaves the screen boundaries
        candy.events.onOutOfBounds.add(this.removeCandy, this);
        candy.anchor.setTo(0.5, 0.5);
        candy.rotateMe = (Math.random()*4) - 2;
        game.candyGroup.add(candy);
    },
    clickCandy: function(candy){
        candy.kill();
        Candy.score += 1;
        Candy.scoreText.setText(Candy.score);
    },
    removeCandy: function(candy){
         candy.kill();
        Candy.health -= 10;
    }    
};