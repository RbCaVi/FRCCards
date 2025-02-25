var purple='#8c1b53';
var blue='#4ba2fd';
var green='#7bd540';
var red='#dc301a';
var yellow='#f8d841';
var black='#000000';

var typeLetters={
  'mentor':'M',
  'event':'E',
  'team':'T',
  'robot':'R',
  'student':'S',
};

var typeColors={
  'mentor':green,
  'event':purple,
  'team':blue,
  'robot':red,
  'student':yellow,
};

function componentToHex(c) {
  var hex = Math.floor(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function shade(color){
  var factor=0.6;
  color=hexToRgb(color);
  color.r*=factor;
  color.g*=factor;
  color.b*=factor;
  return rgbToHex(color.r,color.g,color.b);
}

function roundRect(ctx,color,left,top,right,bottom,r,r2=r){
  var pi=Math.PI;
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(left+r,top+r,r2,pi,1.5*pi);
  ctx.arc(right-r,top+r,r2,1.5*pi,2*pi);
  ctx.arc(right-r,bottom-r,r2,0,0.5*pi);
  ctx.arc(left+r,bottom-r,r2,0.5*pi,pi);
  ctx.fill('evenodd');
}

function makeCard(cardColor,type,name,cardImg,desc){
  var typeLetter=typeLetters[type];
  var typeColor=typeColors[type];

  var pi=Math.PI;
  var radius=30;
  var radius2=15;
  var outerBorder=radius-radius2;
  var thinBorder=outerBorder/2;
  var w=430;
  var h=753;
  var textH=20;
  var typeH=15;

  var canvas = document.createElement('canvas');
  canvas.width=w;
  canvas.height=h;
  var ctx=canvas.getContext('2d');

  // card
  roundRect(ctx,shade(typeColor),0,0,w,h,radius);
  roundRect(ctx,black,0,0,w,h,radius,radius2);

  // image
  var cardW=cardImg.width;
  var cardH=cardImg.height;
  ctx.drawImage(cardImg,w/6,5*h/12-w/3*cardH/cardW,2*w/3,2*w/3*cardH/cardW);

  // description
  roundRect(ctx,shade(cardColor),outerBorder,2*h/3,w-outerBorder,h-outerBorder,radius);
  roundRect(ctx,cardColor,outerBorder,2*h/3,w-outerBorder,h-outerBorder,radius,radius2);
  drawText(ctx,desc,textH*0.8,
    outerBorder*2.5,
    2*h/3+outerBorder*1.5,
    w-outerBorder*5,
    h/3-outerBorder*5);

  // name
  roundRect(ctx,shade(cardColor),outerBorder*2,outerBorder*2,3*w/5,outerBorder*2+thinBorder*2+textH*2,textH+thinBorder);
  roundRect(ctx,cardColor,outerBorder*2,outerBorder*2,3*w/5,outerBorder*2+thinBorder*2+textH*2,textH+thinBorder,textH);
  ctx.font = "bold "+textH+"px  sans";
  ctx.fillStyle=black;
  ctx.fillText(name,outerBorder*2+textH,outerBorder*2+thinBorder+4*textH/3);

  // type
  ctx.fillStyle=shade(typeColor);
  ctx.beginPath();
  ctx.arc(w-3.5*outerBorder,3.5*outerBorder,1.5*outerBorder,0,2*pi);
  ctx.fill();
  ctx.fillStyle=typeColor;
  ctx.beginPath();
  ctx.arc(w-3.5*outerBorder,3.5*outerBorder,1.5*outerBorder-thinBorder,0,2*pi);
  ctx.fill();
  ctx.font = "bold "+typeH+"px sans";
  ctx.fillStyle=black;
  var typeSize=ctx.measureText(typeLetter);
  ctx.fillText(typeLetter,w-3.5*outerBorder-typeSize.width/2,3.5*outerBorder+2*typeH/5);

  var imageData = canvas.toDataURL("image/png");
  return imageData;
}

var cardimage=document.querySelector('img.card');
var carddownload=document.querySelector('a.download');
var button=document.querySelector('button.generate');

function generate(){
  try{
    var typebuttons=document.querySelectorAll('input.typepicker');
    for (var i = typebuttons.length - 1; i >= 0; i--) {
      if(typebuttons[i].checked){
        var type=typebuttons[i].id;
      }
    }
    var colorinput=document.querySelector('input.color');
    var cardColor=colorinput.value??"#000000";
    var nameinput=document.querySelector('input.name');
    var name=nameinput.value;
    var descinput=document.querySelector('textarea.desc');
    var desc=descinput.value;
    var cardImg = document.createElement('img');
    cardImg.crossOrigin='anonymous';
    var urlinput=document.querySelector('input.url');
    cardImg.src=urlinput.value;
    if(urlinput.value.length==0){
      cardImg.src='https://cdn.discordapp.com/avatars/953758541666209852/bef0d0db32303ff9587ad1e313e2cc23.webp';
    }

    cardImg.addEventListener('load',()=>{
      var imageData=makeCard(cardColor,type,name,cardImg,desc);

      cardimage.src = imageData;
      carddownload.href = imageData.replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
    });
  }catch(e){
    
  }
}

button.addEventListener('click',generate);


// https://stackoverflow.com/a/16599668
function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element#comment79378090_16599668
function getLinesForParagraphs(ctx, text, maxWidth) {
  return text.split("\n").map(para => getLines(ctx, '- '+para, maxWidth)).reduce((a, b) => a.concat(b),[]);
}

function drawText(ctx,text,textH,x,y,width,height){
  ctx.font = textH+"px sans";
  var lines=getLinesForParagraphs(ctx,text,width);
  while((lines.length-1)*textH*1.2+textH>height){
    textH*=0.99;
    ctx.font = textH+"px sans";
    var lines=getLinesForParagraphs(ctx,text,width);
  }

  ctx.fillStyle=black;
  for(var i = 0; i < lines.length; i++){
    var line=lines[i];
    var dy=textH+i*textH*1.2;
    var w = ctx.measureText(line).width;
    ctx.fillText(line, x+width/2-w/2, y+dy);
  }
}