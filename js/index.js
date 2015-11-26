window.onload = function() {
	//создаем указатель сортировки
	var jsort = 0;
	
	//создаем таймер
	var Timer0Def = 500;
	var Timer0 = Timer0Def;
	
	//Создаем фон и его функции
	var canvas = document.getElementById("flying-bubbles");
	var ctx = canvas.getContext("2d");
	
	//Устанавливаем размеры фона равные размеру окна
	var W = window.innerWidth, H = window.innerHeight - window.innerHeight*0.2;
	canvas.width = W;
	canvas.height = H;
	
	//Создаем массив кругов 
	var circles = []; 
	for(var i = 0; i < 10; i++ ){
		circles.push(new create_circle(i));	
	}
	
	//Функции генерации кругов
	function create_circle(n) {
		//номер круга
		this.n = n;
		//позиция
		this.x = W*n/10 + 40; 
		this.y = H-H*0.25;
		this.x_store = this.x; 
		this.y_store = H-H*0.5;
		
		//скорость
		this.vx = 0; 
		this.vy = 0; 
		//ускорение
		this.ax = 0;
		this.ay = 0;
		this.day = -0.1;
		
		//значение
		this.value = parseInt(Math.random()*10);
		this.value_store = this.value;
		
		//радиус
		this.r = 50;
	}

	
	//Функции прорисовки 
	function draw() {
		//считаем время события сортировки
		Timer0-=1;
		if(Timer0<=1){
			Timer0 = Timer0Def;
			var c = circles[jsort];
			var c2 = circles[jsort+1];
			if(c.value>c2.value){
				var tmp = c.value;
				c.value = c2.value;
				c2.value = tmp;
				
				var tmp = c.x;
				c.x = c2.x;
				c2.x = tmp;
			}
			jsort+=1;
			if(jsort>8) jsort=0;
			for(var j = 0; j < circles.length; j++) {
				var c = circles[j];
				c.y = H-H*0.25;
				c.day = -0.1;
				c.vy=0;
			}
		}
	
		//Градиент
		var grad = ctx.createLinearGradient(0, 0, W, H);
		grad.addColorStop(0, 'rgb(19, 105, 168)');
		grad.addColorStop(1, 'rgb(0, 0, 0)');
		
		//Заполнение фона градиентом
		ctx.globalCompositeOperation = "source-over";
		ctx.fillStyle = grad;
		ctx.fillRect(0,0,W,H);

		//Заполняем фон кругами
			
		for(var j = 0; j < circles.length; j++) {
			var c = circles[j];
			if((j-1)>=0) var c0 = circles[(j-1)];
			if((j+1)<=circles.length) var c2 = circles[(j+1)];
			var c0x = W*(j-1)/10 + 40; 
			var c2x = W*(j+1)/10 + 40;
			
			//рисуем круги и размытие
			ctx.beginPath();
			ctx.globalCompositeOperation = "lighter";		
			ctx.fillStyle = grad;
			ctx.arc(c.x, c.y, c.r, Math.PI*2, false);
			ctx.fill();
				
				
			//выводим значение текстом
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";
			ctx.fillStyle = "#F00";
			ctx.font = 'bold 30px sans-serif';
			ctx.fillText(c.value, c.x, c.y);
			ctx.fillText(c.value_store, c.x_store, c.y_store);
			
			
			
			ctx.strokeStyle = "#F00";
			ctx.shadowColor = "#F00";
			ctx.shadowOffsetX = 5;
			ctx.shadowOffsetY = 5;
			ctx.shadowBlur = 5;
			var text = "";
			text = j;
			ctx.strokeText(text, c.x_store, c.y_store-100);
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
			ctx.font = 'bold 18px sans-serif';
			text = "Ячейка"
			ctx.strokeText(text, c.x_store, c.y_store-150);
			
			//сортируем используем ускорение, скорость
			if(j==jsort)
			{
				if(c.vy>2 || c.vy<-2) c.day = -c.day; 		
				if(c.value>c2.value){
					c.ay=c.day;
					if(c.x<c2x) c.x+=0.5;
					else if(c.x >= c2x){
						c.x = c2x;
					}
				}
				else{	
					c.ay=-c.day;
				}
				
				c.vx += c.ax;
				c.vy += c.ay;
				
				c.x += c.vx; 
				c.y += c.vy;
			}
			if(j==(jsort+1))
			{
				if(c.vy>2 || c.vy<-2) c.day = -c.day; 		
				
				if(c.value>=c0.value){
					c.ay=c.day;
				}
				else {
					c.ay=-c.day;
					if(c.x>c0x) c.x-=0.5;
					else if(c.x <= c0x){
						c.x = c0x;
					}
				}
				
				c.vx += c.ax;
				c.vy += c.ay;
				
				c.x += c.vx; 
				c.y += c.vy;
			}
			
			//Предотвращаем выход кругов за рамки
			if(c.x < -50) c.x = W+50;
			if(c.y < -50) c.y = H+50;
			if(c.x > W+50) c.x = -50;
			if(c.y > H+50) c.y = -50;
		}
		
	}
	
	setInterval(draw, 25);
} 