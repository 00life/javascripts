function fn01_flap(e) {
    if(e.isPaused) return
    e.bird.body.velocity.y = - FLAP_VELOCITY;
}

function fn01_youlose(e) {
    let condition1 = e.bird.y <= 0;
    let condition2 = e.bird.getBounds().bottom >= config.height;

    if(condition1 || condition2) {
        fn01_gameOver(e);
    }; 
}

function fn01_placePipe(upperpipe, lowerpipe, pipes, e) {
    let pipGapDistance = Phaser.Math.Between(...e.difficulties[e.currentDifficulty].PIPE_GAP_RANGE);
    let pipeVerticalPos = Phaser.Math.Between(0 + 20, config.height - 20 - pipGapDistance);
    let btwPipeDistance = Phaser.Math.Between(...e.difficulties[e.currentDifficulty].BTW_PIPE_RANGE);
   
    let rightMostX = pipes.getChildren().reduce((acc, item) => item.x >= acc ? item.x : acc, 0);
    let pipeXPos = config.width;
    
    if(rightMostX > config.width) pipeXPos = btwPipeDistance + rightMostX;

    upperpipe.x = pipeXPos + upperpipe.width;
    upperpipe.y = pipeVerticalPos;

    lowerpipe.x = pipeXPos + upperpipe.width;
    lowerpipe.y = upperpipe.y + pipGapDistance;
    
    upperpipe.body.gravity.y = - GRAVITY_Y;
    lowerpipe.body.gravity.y = - GRAVITY_Y;
}

function fn01_inputControls(e) {
    e.input.on('pointerdown', ()=>fn01_flap(e));
    e.input.keyboard.on('keydown-SPACE', ()=>fn01_flap(e));
}

function fn01_recyclePipes(pipes, e) {
    let tempPipe = [];
    pipes.getChildren().forEach(pipe => {
        if(pipe.getBounds().right <=0 ) tempPipe.push(pipe);

        if(tempPipe.length === 3) {
            fn01_placePipe(tempPipe[0], tempPipe[1], pipes, e);
            fn01_increaseScore(e);
            fn01_increaseDifficulty(e);
        };
    })
}

function fn01_createColliders(e) {
    e.physics.add.collider(e.bird, e.pipes, ()=>fn01_gameOver(e), ()=>{}, e);
}

function fn01_gameOver(e) {
    e.bird.setTint(0xEE4824);
    e.physics.pause();

    fn01_saveBestScore(e)

    e.time.addEvent({
        delay:1000,
        callback: ()=>e.scene.restart(),
        loop:false
    });
}

function fn01_createScore(e) {
    e.score = 0;
    e.scoreText = e.add.text(16, 16, `Score: ${0}`, {fontSize:'32px', fill:'#000'}).setOrigin(0,0);
    const bestScore = localStorage.getItem('bestScore');
    e.add.text(16, 52, `Best score: ${bestScore || 0}`, {fontSize:'18px', fill:'#000'});
}

function fn01_increaseScore(e) {
    e.score++;
    e.scoreText.setText(`Score: ${e.score}`);
}

function fn01_saveBestScore(e) {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    if(!bestScore || e.score > bestScore) localStorage.setItem('bestScore', e.score);
}

function fn01_increaseDifficulty(e) {
    if(e.score === 1) e.currentDifficulty = 'normal';
    if(e.score === 3) e.currentDifficulty = 'hard';
}

function fn01_createPause(e) {
    e.isPaused = false;
    const pause = e.add.image(0, 0, 'pause').setOrigin(1, 1);
    pause.x = e.config.width - 10;
    pause.y = e.config.height - 10;
    pause.setScale(3);
    pause.setInteractive();
    
    pause.on('pointerdown', ()=>{
        e.isPaused = true;
        e.physics.pause();
        e.scene.pause();
        e.scene.launch('PauseScene');
    });
}

function fn01_createMenu(e) {
    let heightSpace = 0;
    
    e.menu.forEach(item => {
        const menuPos = [e.config.width / 2, heightSpace + e.config.height / 2 ];
        const menuItem = e.add.text(...menuPos, item.text, e.fontOpt)
            .setOrigin(0.5, 1)
            .setInteractive()
            .on('pointerover', ()=>menuItem.setStyle({fill: '#FF0'}))
            .on('pointerout', ()=>menuItem.setStyle({fill: '#FFF'}))
        heightSpace += 42;

        menuItem.on('pointerup',()=>{
            // item.scene && e.scene.start(item.scene);
            if(item.text === 'Score') e.scene.start('ScoreScene');
            if(item.text === 'Play') e.scene.start('PlayScene');
            if(item.text === 'Exit') e.game.destroy(true);
            if(item.text === 'Continue') {
                e.scene.stop('PauseScene');
                e.scene.resume('PlayScene');
            };
            
            if(item.text === 'Menu') {
                e.scene.stop('PlayScene');
                e.scene.start('MenuScene');
            };
        })
    })
}

function fn01_listenToEvents(e) {
    if(e.pauseEvent) return;

    const centerScreen = [e.config.width / 2, e.config.height / 2 ];
    const fontOpt = {fontSize: '32px', fill: '#FFF'};

    e.pauseEvent = e.events.on('resume', ()=>{
        e.initialTime = 3;
        e.countDownText = e.add.text(...centerScreen, 'Fly in: ' + e.initialTime, fontOpt )
            .setOrigin(0.5, 0)

        e.timedEvent = e.time.addEvent({
            delay: 1000,
            callback: ()=>{
                e.initialTime--;
                e.countDownText.setText('Fly in: ' + e.initialTime);
                if(e.initialTime <= 0) {
                    e.isPaused = false;
                    e.countDownText.setText('');
                    e.physics.resume();
                    e.timedEvent.remove();
                };
            },
            callbackScope: e,
            loop:true
        });
    })

}