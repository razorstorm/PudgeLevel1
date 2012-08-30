/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



function drawShadedText(ctx,color,string,x,y)
{
    ctx.fillStyle='rgb(0,0,0)';
    ctx.fillText(string,x+GAME_WIDTH*0.002,y+GAME_WIDTH*0.0018);
    
    ctx.fillStyle='rgb('+color.join(',')+')';
    ctx.fillText(string,x,y);
}