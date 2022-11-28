let spaceship = {
    x: 10,
    y: 280,
    health: 3,
    bullet_damage: 1,
    is_invulnerable: 1 // {0: TRUE, 1: FALSE}
}

let enemy_drone = () => {
    return {
        title: "drone",
        x: GAME_WIDTH,
        y:(Math.floor(Math.random() * 700) + 1),
        health: 2,
        earn_score: 100,
        shoot_bullet: null,
        shootBullet: function (){
            let shoot_time = (Math.floor(Math.random() * 4) + 1) * 1000;
            // console.log(this.x, this.y, shoot_time);
            enemy_bullets.push({x: this.x-30, y:this.y+5});
    
            this.shoot_bullet = setTimeout(() => {
                this.shootBullet();
            }, shoot_time);
     
            if(this.health === 0){
                clearTimeout(this.shoot_bullet); 
            }
        },
        moveEnemy: function (){
            let enemy_move_time = (Math.floor(Math.random() * 4) + 1) * 35;
            this.x -= ENEMIES_SPEED;

            const move_enemy = setTimeout(() => {
                this.moveEnemy();
            }, enemy_move_time);
        }
    };
} 

let enemy_bumblebee = () => {
    return {
        title: "bumblebee",
        x: (Math.floor(Math.random() * 700) + 1),
        y: GAME_HEIGHT,
        health: 2,
        earn_score: 100,
        moveEnemy: function (){
            let enemy_move_time = (Math.floor(Math.random() * 4) + 1) * 35;
            this.y -= ENEMIES_SPEED;
            const move_enemy = setTimeout(() => {
                this.moveEnemy();
            }, enemy_move_time);
        }
    }
}

let enemies = [];
let bullets = [];
let enemy_bullets = [];
let score = 0;
let GAME_HEIGHT =  768;
let GAME_WIDTH =  1024;
let SPACESHIP_SPEED = 20;
let ENEMIES_SPEED = 10;
let BULLET_MOVE_SPEED = 10; /** 1px/0.33s OR 60px/1s */
let FPS = 60;
let GAME_TIMER = Math.floor(1000/FPS);
let MAX_ENEMIES = 10;

/** EVENT LISTENERS */ 
document.addEventListener("DOMContentLoaded", () => {
    initializeGame(); 

    gameLoop();

    document.addEventListener("keydown", spaceshipControls);      
});


/** EVENT HANDLERS: */

function gameLoop(){
    // moveSpaceshipBullets();
    // moveEnemyBullets();
    // moveEnemies();
    spaceshipBulletEnemyCollision();
    spaceshipBulletEnemyBulletCollision();
    spaceshipEnemyCollision();
    spaceshipEnemyBulletCollision();
    displaySpaceship( );
    displayEnemies();
    // displaySpaceshipBullets();
    // displayEnemyBullets();
    displayBullets("bullets", "right", "bullets");
    displayBullets("enemy_bullets", "left", "enemy_bullets");
    // /* spaceship bullets */ expectedFunction(bullets_array, direction, element_layer);
    // /* enemy bullets */ expectedFunction(bullet_type, direction, element_layer);
    displayScore();

    const game_loop = setTimeout(gameLoop, 33);

    if(spaceship.health === 0){
        clearTimeout(game_loop);
        alert("Game Over!");
        location.reload();
    }
}

function spaceshipControls(){
    if(event.keyCode === 37 && spaceship.x > 0){
        spaceship.x-=SPACESHIP_SPEED;
    }
    else if(event.keyCode === 39 && spaceship.x < 700){
        spaceship.x+=SPACESHIP_SPEED;
    }
    else if(event.keyCode === 38 && spaceship.y > 0){
        spaceship.y-=SPACESHIP_SPEED;
    }
    else if(event.keyCode === 40 && spaceship.y < 700){
        spaceship.y+=SPACESHIP_SPEED;
    }
    else if(event.keyCode === 32){
        bullets.push({x: spaceship.x+60, y:spaceship.y+2})
    }
}
function displaySpaceship(){
    let spaceship_element = document.getElementById("spaceship");
    spaceship_element.style["top"] = spaceship.y +"px";
    spaceship_element.style["left"] = spaceship.x +"px";
}

function initializeEnemies(){
    addDroneEnemy();
    addBumblebeeEnemy();
}

function addDroneEnemy(){
    if(enemies.length < MAX_ENEMIES){
        let enemy_spawn = enemy_drone();
        let spawn_drone = (Math.floor(Math.random() * 4) + 1) * 1000;
        
        enemy_spawn.y = (Math.floor(Math.random() * 700) + 1);
        enemies.push(enemy_spawn);
        enemy_spawn.shootBullet();
        enemy_spawn.moveEnemy();
        setTimeout(addDroneEnemy, spawn_drone);
    }
}

function addBumblebeeEnemy(){
    if(enemies.length < MAX_ENEMIES){
        let enemy_spawn = enemy_bumblebee();
        let spawn_bumblebee = (Math.floor(Math.random() * 4) + 1) * 1000;
        
        enemy_spawn.x = (Math.floor(Math.random() * 700) + 1);
        enemies.push(enemy_spawn);
        enemy_spawn.moveEnemy();
        setTimeout(addBumblebeeEnemy, spawn_bumblebee);
    }
}

function initializeGame(){
    initializeEnemies();
}

function displayEnemies(){
    let output = "";
    for(enemy_id = 0; enemy_id < enemies.length; enemy_id++){
        output += `<div class='${ enemies[enemy_id].title }' style='top: ${ enemies[enemy_id].y }px; left: ${ enemies[enemy_id].x }px;'></div>`; 
        if(enemies[enemy_id].x < -65){
            enemies.shift();
        }
    } 
    document.getElementById("enemies").innerHTML = output;
}

function displayBullets(bullet_array, direction, element_layer){
    let output = "";
    document.getElementById(element_layer).innerHTML = "";
    // for(bullet_id = 0; bullet_id < bullet_array.length; bullet_id++){
    //     // console.log(bullets_array);
    //     output += `<div class='${ element_layer }' style='top: ${ bullet_array[bullet_id].y }px; left: ${ bullet_array[bullet_id].x }px;'></div>`;
    //     if(direction === 'right'){
    //         bullet_array[bullet_id].x += BULLET_MOVE_SPEED;
    //     }
    //     else{
    //         bullet_array[bullet_id].x -= BULLET_MOVE_SPEED;
    //     }
    // }
    if(bullet_array === 'bullets'){
        for(bullet_id = 0; bullet_id < bullets.length; bullet_id++){
            // console.log(bullets_array);
            output += `<div class='${ element_layer }' style='top: ${ bullets[bullet_id].y }px; left: ${ bullets[bullet_id].x }px;'></div>`;
            if(direction === 'right'){
                bullets[bullet_id].x += BULLET_MOVE_SPEED;
            }
            if(bullets[bullet_id].x > 988){ 
                // bullets[bullet_id] = bullets[bullets.length-1];
                // bullets.pop();
                bullets.shift();
            }
        }
    }
    else{
        for(bullet_id = 0; bullet_id < enemy_bullets.length; bullet_id++){
            // console.log(bullets_array);
            output += `<div class='${ element_layer }' style='top: ${ enemy_bullets[bullet_id].y }px; left: ${ enemy_bullets[bullet_id].x }px;'></div>`;
            if(direction === 'left'){
                enemy_bullets[bullet_id].x -= BULLET_MOVE_SPEED;
            }
            if(enemy_bullets[bullet_id].x < -10){
                enemy_bullets[bullet_id] = enemy_bullets[enemy_bullets.length-1];
                enemy_bullets.pop();
                // enemy_bullets.shift();
            }
        }
    }
    document.getElementById(element_layer).innerHTML = output;
}

// function displaySpaceshipBullets(){
//     let output = "";
//     document.getElementById("bullets").innerHTML = "";

//     for(bullet_id = 0; bullet_id < bullets.length; bullet_id++){
//         output += `<div class='bullets' style='top: ${ bullets[bullet_id].y }px; left: ${ bullets[bullet_id].x }px;'></div>`;
//     }

//     document.getElementById("bullets").innerHTML = output;
// }

// function displayEnemyBullets(){
//     let output = "";
//     document.getElementById("enemy_bullets").innerHTML = "";

//     for(let enemy_bullet_id = 0; enemy_bullet_id < enemy_bullets.length; enemy_bullet_id++){
//         output += `<div class='enemy_bullets' style='top: ${ enemy_bullets[enemy_bullet_id].y }px; left: ${ enemy_bullets[enemy_bullet_id].x }px;'></div>`;
//     }
    
//     document.getElementById("enemy_bullets").innerHTML = output;
// }

function displayScore(){
    document.getElementById('score').innerHTML = score;
}

function moveSpaceshipBullets(){
    for(bullet_id = 0; bullet_id < bullets.length; bullet_id++){
        bullets[bullet_id].x += BULLET_MOVE_SPEED;

        if(bullets[bullet_id].x > 988){ 
            // bullets[bullet_id] = bullets[bullets.length-1];
            // bullets.pop();
            bullets.shift();
        }
    }
}

function moveEnemyBullets(){
    for (enemy_bullet_id = 0; enemy_bullet_id < enemy_bullets.length; enemy_bullet_id++){
        enemy_bullets[enemy_bullet_id].x -= 10;

        if(enemy_bullets[enemy_bullet_id].x < -10){
            enemy_bullets[enemy_bullet_id] = enemy_bullets[enemy_bullets.length-1];
            enemy_bullets.pop();
            // enemy_bullets.shift();
        }
    }
} 

function spaceshipBulletEnemyCollision(){ 
    for(let bullet_id = 0; bullet_id < bullets.length; bullet_id++){ 
        for(let enemy_id = 0; enemy_id < enemies.length; enemy_id++){ 
            if (bullets[bullet_id] && Math.abs(enemies[enemy_id].x - bullets[bullet_id].x) < 50 
            && Math.abs(enemies[enemy_id].y - bullets[bullet_id].y) < 20){
                enemies[enemy_id].health = enemies[enemy_id].health - spaceship.bullet_damage;
                bullets[bullet_id] = bullets[bullets.length-1];
                bullets.pop();
                // bullets.splice(bullet_id, 1);
            }
            if (enemies[enemy_id].health === 0){
                score += enemies[enemy_id].earn_score;
                enemies[enemy_id] = enemies[enemies.length-1];
                enemies.pop();
 
                // enemies.splice(enemies_id);
                // clearTimeout(enemies[enemy_id].shoot_bullet); 

                /** Clear timeout for shootBullet */
            }
        }
    } 
}
 
function spaceshipBulletEnemyBulletCollision(){
    for(let bullet_id = 0; bullet_id < bullets.length; bullet_id++){
        for(let enemy_bullet_id = 0; enemy_bullet_id < enemy_bullets.length; enemy_bullet_id++){
            if (bullets[bullet_id] && enemy_bullets[enemy_bullet_id] 
                && Math.abs(bullets[bullet_id].x - enemy_bullets[enemy_bullet_id].x) < 20 
                && Math.abs(bullets[bullet_id].y - enemy_bullets[enemy_bullet_id].y) < 20){
                bullets[bullet_id] = bullets[bullets.length-1];
                bullets.pop();
                enemy_bullets[enemy_bullet_id] = enemy_bullets[enemy_bullets.length-1];
                enemy_bullets.pop();
                // bullets.splice(bullet_id);
                // bullets = bullets.filter(Boolean);
                // enemy_bullets.splice(enemy_bullet_id);
                // enemy_bullets = enemy_bullets.filter(Boolean);
            }
        }
    }
}

function spaceshipEnemyBulletCollision(){
    for(let enemy_bullet_id = 0; enemy_bullet_id < enemy_bullets.length; enemy_bullet_id++){
        
        if (spaceship.is_invulnerable === 1){
            
            if (Math.abs(enemy_bullets[enemy_bullet_id].x - spaceship.x) < 50 && Math.abs(enemy_bullets[enemy_bullet_id].y - spaceship.y) < 20){
                enemy_bullets[enemy_bullet_id] = enemy_bullets[enemy_bullets.length-1];
                enemy_bullets.pop();
                // enemy_bullets.splice(enemy_bullet_id);
                spaceship.y = (Math.random()*500) * -1;
                spaceship.x = (Math.random()*500) * -1;
                spaceship.health = spaceship.health - 1;
                reduceSpaceshipLife();
                spaceship.y = 280;
                spaceship.x = 10;
                spaceshipInvulnerable();
                setTimeout(spaceshipVulnerable, 3000);   
            }
        }
        else{

            if (Math.abs(enemy_bullets[enemy_bullet_id].x - spaceship.x) < 50 && Math.abs(enemy_bullets[enemy_bullet_id].y - spaceship.y) < 20){
                enemy_bullets[enemy_bullet_id] = enemy_bullets[enemy_bullets.length-1];
                enemy_bullets.pop();
                // enemy_bullets.splice(enemy_bullet_id);
            }
        }
    }
}

function spaceshipEnemyCollision(){
    for(let enemy_id = 0; enemy_id < enemies.length; enemy_id++){
        
        if (spaceship.is_invulnerable === 1){

            if (Math.abs(spaceship.x - enemies[enemy_id].x) < 50 && Math.abs(spaceship.y - enemies[enemy_id].y) < 50){
                spaceship.y = 0;
                spaceship.x = (Math.random()*500) * -1;
                spaceship.health = spaceship.health - 1;
                reduceSpaceshipLife();
                spaceship.y = 280;
                spaceship.x = 10;
                spaceshipInvulnerable();
                setTimeout(spaceshipVulnerable, 3000);      
            }
        }
        else{

            if (Math.abs(spaceship.x - enemies[enemy_id].x) < 50 && Math.abs(spaceship.y - enemies[enemy_id].y) < 50){
                enemies[enemy_id] = enemies[enemies.length-1];
                enemy_bullets.pop();
                // enemy_bullets.splice(enemy_bullet_id);
            }
        }
    }
}

function reduceSpaceshipLife(){
    let lives = document.getElementById("life_list");
    lives.removeChild(lives.lastElementChild);
}

function moveEnemies(){
    for(enemy_id = 0; enemy_id < enemies.length; enemy_id++){
        enemies[enemy_id].x -= ENEMIES_SPEED;

        if(enemies[enemy_id].x < -65){
            enemies.shift();
        }
    }
}

function spaceshipInvulnerable(){
    spaceship.is_invulnerable = 0;
    document.getElementById("spaceship").style.opacity = "0.5";
}

function spaceshipVulnerable(){
    spaceship.is_invulnerable = 1;
    document.getElementById("spaceship").style.opacity = "1";
}