/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function AnimatedDrawer(maxDuration,durationRatio,xLoc,yLoc,text,color,font)
{
    this.maxDuration=maxDuration;
    this.counter=0;
    this.durationRatio=durationRatio;
    this.xLoc=xLoc;
    this.yLoc=yLoc;
    this.text=text;
    this.color=color;
    this.font=font;
}

AnimatedDrawer.prototype.draw=function(ctx)
{
    if(this.counter<this.maxDuration)
    {
        ctx.save();
        ctx.textalign= 'center';
        ctx.font= 15 * GAME_WIDTH/800.0+'px Verdana';
        var textWidth = ctx.measureText(this.text).width;
    
        drawShadedText(ctx,this.color,this.text,
            this.xLoc-textWidth/2.0,
            this.yLoc-this.counter*this.durationRatio * (GAME_WIDTH/800.0));
        ctx.restore();
        
        this.counter++;
        return false;
    }
    return true;
}

