enchant();

var Token = "O7sR1zID6M-tZBhyEqN_uUn-Jdfw0Wy5pupomxXMdYs";
var Sheet = "1RPsV5Ix8tnUW9C2ia0W9Uwn4ghfcLSncGKSwmZONHw4";
var EXE = "https://script.google.com/macros/s/AKfycbz03l-fzarHO99PxRpoLjH5SrXREKVBIhUQzeuFFxx4Qfq-sZWjdPhfq7djB2FLDfIQ/exec";//画像管理
//EXE = "https://script.google.com/macros/s/AKfycbwi6ekqJT9R4EB4hcX5bJ-UwZ_1SMYVVwRCsA6VAZxhVGmx--cV/exec";
var Password = window.localStorage.getItem("コード");

function Game_load(width,height){
  var game = new Game(width,height);
  game.fps = 20;
  game.onload = function(){

    var Loading_Scene = function(){
      var scene = new Scene();

      var Background = new Entity();
      Background._element = document.createElement("img");
      Background._element.src = "https://raw.githubusercontent.com/compromise-satisfaction/novel_game/gh-pages/画像/半透明(黒).png";
      Background.width = width;
      Background.height = height;

      var Loading = new Entity();
      Loading._element = document.createElement("img");
      Loading._element.src = "https://raw.githubusercontent.com/compromise-satisfaction/novel_game/gh-pages/画像/読み込み中.gif";
      Loading.width = width;
      Loading.height = width/5;
      Loading.y = height/2 - Loading.height/2;

      scene.addChild(Background);
      scene.addChild(Loading);

      return scene;
    };

    var Result_Scene = function(Datas){
      var scene = new Scene();

      var Datas_s = [];

      for(var I = 0; I < Datas.length; I++){
        Datas_s[I] = JSON.parse(Datas[I][0]);
      };

      Datas = [];

      for(var I = Datas_s.length - 1; I >= 0; I--){
        Datas[Datas.length] = Datas_s[I];
      };

      var Buttons = [];
      var Selects = [];
      var Text_Areas = [];
      var Json_Data = {};

      var Images_size = new Image();

      var Images = new Sprite();
      Images._element = document.createElement("img");
      Images.y = height/10*2;
      Images.width = width;
      Images.height = width/16*9;
      scene.addChild(Images);

      var Label1 = new Label();
      Label1.y = height/10*1 + height/20*1;
      Label1.font = height/20 + "px 'Arial'";
      scene.addChild(Label1);

      var Label2 = new Label();
      Label2.y = height/10*6;
      Label2.font = height/20 + "px 'Arial'";
      scene.addChild(Label2);

      Create_Select(0,height/10*0,width,height/10);
      Create_Text_Area(0,height/10*7,width,height/10,Password,"削除キーを入力");
      Create_Text_Area(0,height/10*8,width,height/10,"","URLっす");
      Create_Button(0,height/10*9,width,height/10,"これを消す");

      function Create_Select(X,Y,W,H){
       I = Selects.length;
       Selects[I] = new Entity();
       Selects[I].moveTo(X,Y);
       Selects[I].width = W;
       Selects[I].height = H;
       Selects[I]._element = document.createElement("select");

       Option = [];

       for (var i = 0; i < Datas.length; i++){
         Option[i] = document.createElement("option");
         Json_Data[Datas[i].URL] = {Time:Datas[i].Time,ID:Datas[i].ID};
         Images._element.src = Datas[i].URL;
         Images_size.src = Datas[i].URL;
         Option[i].value = Datas[i].URL;
         Option[i].text = Datas[i].Name;
         Selects[I]._element.appendChild(Option[i]);
       };

       Images._element.src = "";

       scene.addChild(Selects[I]);
       return;
     };

      function Create_Button(X,Y,W,H,V){
          I = Buttons.length;
          Buttons[I] = new Entity();
          Buttons[I].moveTo(X,Y);
          Buttons[I].width = W;
          Buttons[I].height = H;
          Buttons[I]._element = document.createElement("input");
          Buttons[I]._element.type = "submit";
          Buttons[I]._element.value = V;
          Buttons[I]._element.Number = I;
          Buttons[I].backgroundColor = "buttonface";
          scene.addChild(Buttons[I]);
          Buttons[I]._element.onclick = function(e){
            console.log(ID);
            game.replaceScene(Loading_Scene());
            fetch(EXE,
                  {
                    method: 'POST',
                    body: JSON.stringify({消去:ID,コード:Password,Token:Token,Sheet:Sheet})
                  }
                 )
              .then(res => res.json())
              .then(result => {
              game.replaceScene(Result_Scene(result));
            },);
          };
          return;
        };

      function Create_Text_Area(X,Y,W,H,V,P){
        J = Text_Areas.length;
        Text_Areas[J] = new Entity();
        Text_Areas[J].moveTo(X,Y);
        Text_Areas[J].width = W;
        Text_Areas[J].height = H;
        Text_Areas[J]._element = document.createElement("input");
        Text_Areas[J]._element.type = "textarea";
        Text_Areas[J]._element.value = V;
        Text_Areas[J]._element.placeholder = P;
        scene.addChild(Text_Areas[J]);
        return;
      };

      var W = 0;
      var H = 0;
      var Time = null;
      var Times = null;
      var ID = null;

      scene.addEventListener("enterframe",function(){
        Times = new Date();
        Time = [];
        Time[0] = Times.getFullYear();
        Time[1] = Times.getMonth() + 1;
        Time[2] = Times.getDate();
        Time[3] = Times.getHours();
        Time[4] = Times.getMinutes();
        Time[5] = Times.getSeconds();
        for(var I = 0; I < Time.length; I++) if(Time[I]<10) Time[I] = "0" + Time[I];
        Times = Time[0] + "/";
        Times += Time[1] + "/";
        Times += Time[2] + " ";
        Times += Time[3] + ":";
        Times += Time[4] + ":";
        Times += Time[5];
        Label2.text = Times;
        if(Password!=Text_Areas[0]._element.value){
          Password = Text_Areas[0]._element.value;
          window.localStorage.setItem("コード",Password);
        };
        if(Images.URL!=Selects[0]._element.value){
          Images.URL = Selects[0]._element.value;
          Images_size.src = Images.URL
          Images._element.src = Images.URL;
          Label1.text = Json_Data[Images.URL].Time;
          ID = Json_Data[Images.URL].ID;
          Text_Areas[1]._element.value = Images.URL;
        };
        if(W!=Images_size.width||H!=Images_size.height){
          W = Images_size.width;
          H = Images_size.height;
          Images.width = width;
          Images.height = width/W*H;
          if(Images.height < height/10*4) Images.x = 0;
          else{
            Images.height = height/10*4;
            Images.width = Images.height*W/H;
            Images.x = (width-Images.width)/2;
          };
        };
      });

      return scene;
    };

    result = [];
    game.replaceScene(Result_Scene(result));
    fetch(EXE,
          {
            method: 'POST',
            body: JSON.stringify({Sheet:Sheet})
          }
         )
      .then(res => res.json())
      .then(result => {
        game.replaceScene(Result_Scene(result));
    },);
    return;
};
game.start();
};
