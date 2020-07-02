/*
uso de variables 
local:bandera si se puede usar localStorage
estado:bandera si se usa Firefox
totalObj: total de objetos creados de dato
list:array de datos, se cargar si existe datos en localStorage
res:bandera para borrar lo que se muestra en res 
*/
let estado=0,totalObj=0,local=0;
let list=[],res;

class Dato{
    constructor(nombre, fecha, color) {
        this.nombre = nombre;
        this.fecha = fecha;
        this.color = color;
    }
}
function actualizarLS(){
    localStorage.setItem("List", JSON.stringify(list));
    localStorage.setItem("total",new String(totalObj));
}

function cargarLS(){
    list=JSON.parse(localStorage.getItem("List"));
    list.forEach(element => {
        crear(element);
    });
}

window.onload=function(even){
  let navegador = navigator.userAgent.indexOf('Firefox');
   if(navegador==66) cargarFirefox();
   if (typeof(Storage) !== "undefined"){
      local=1;
      totalObj=parseInt(localStorage.getItem("total"));
      if(totalObj>0){
         cargarLS();
      }else{
          localStorage.setItem("total","0");totalObj=0;
      }
   }else{
     local=0;
   }
}

function cargarDato(nombre,fecha,color){
  let dato=new Dato(nombre,fecha,color); list.push(dato);
}

function cargarFirefox() {
    let time=new Date(); estado=1;
    document.getElementById("Fecha").value=new String(time.getUTCFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+"T"+time.getHours()+":"+time.getMinutes());
}

document.addEventListener("click",function(even){
    if(res==0){
        respuesta(5);
    }else{
        res=0;
    }
});

function respuesta(tipo){
    let resp=document.getElementById("respuesta"); resp.innerHTML="";
    switch(tipo){
      case 1:
        resp.style.color="green"; resp.appendChild(document.createTextNode("Se agrego"));crear(list[totalObj]);totalObj++;
      break;
      case 2:
        resp.style.color="red"; resp.appendChild(document.createTextNode("formato de fecha incorrecto"));
      break;
      case 3:
        resp.style.color="green"; resp.appendChild(document.createTextNode("Se elimino con exito"));totalObj--;
      break;
      case 4:
        resp.style.color="black"; resp.appendChild(document.createTextNode("tarea mayor a cuatro letras"));
      break;
      case 5:
        resp.appendChild(document.createTextNode(""));
      break;        
    }
}

function operacionFecha(palabra,operacion){
    let respuesta=0;
    if(palabra.length>0){
           let contador=0;
           /*uso en Firefox*/
           for(let i=0;i<palabra.length;i++){
               if(palabra[i]=="-") contador++;
               if(palabra[i]=="T") contador++;
               if(palabra[i]==":") contador++;
           }
           if(contador<4) return respuesta;
    }else{
        return respuesta;
    }
    let token=palabra.split("T");
    let tokenFecha=token[0].split("-");
    let tokenHora=token[1].split(":");
    let time=new Date();
    /*
    operacion 1: saber si esta en el rango
    operacion 2: retornar sin formato T  
    */
    if(tokenFecha.length>1&&tokenHora.length>0){
        switch(operacion){
            case 1:
                if((parseInt(tokenFecha[0],10))>time.getUTCFullYear()){
                   respuesta=1;
                }else if(parseInt(tokenFecha[0],10)==time.getUTCFullYear()){
                       if(parseInt(tokenFecha[1],10)>(time.getMonth()+1)){
                           respuesta=1;
                       }else if(parseInt(tokenFecha[1],10)==(time.getMonth()+1)){
                            if(parseInt(tokenFecha[2],10)>time.getDate()){
                               respuesta=1;
                            }else if(parseInt(tokenFecha[2],10)==time.getDate()){
                                if(parseInt(tokenHora[0],10)>time.getHours()){
                                    respuesta=1;
                                }else if(parseInt(tokenHora[0],10)==time.getHours()){
                                    if(parseInt(tokenHora[1],10)>time.getMinutes()){
                                        respuesta=1;
                                    }
                                }
                            }
                       }
                }           
            break;
            case 2:
            respuesta="";
            respuesta=tokenFecha[2]+"/"+tokenFecha[1]+"/"+tokenFecha[0]+" "; 
            let aux=parseInt(tokenHora[0]),ban=0,a=[" a.m. "," p.m. "];
            if(aux>12){
                aux-=12; ban=1;
            }
            respuesta+=aux+":"+tokenHora[1]+a[ban];
            break;
        }
    }
    return respuesta;
}

const colorHe="0123456789abcdef";

function buscarColor(color){

    let segundo="#";

    let res=[];

    for(let i=1;i<color.length;i++){
        
        let cont=-1,ban=0,j=0;

        while(ban==0&&j<16){         
            if(color.charAt(i)==colorHe.charAt(j)){
                ban=1;
                if((j+cont)<=15&&(j+cont)>=0){
                    segundo+=colorHe[j+cont];                
                }else {
                    segundo+=colorHe[j-cont];
                }
            }
            j++;
        }
    }
    res.push(color);res.push(segundo);
    return res;
    
}

function crear(obj){
   
    const padre=document.getElementById("lista");
    const newDiv=document.createElement("div"); newDiv.id="div"+totalObj;
    const div1=document.createElement("div");
    const div2=document.createElement("div");
    const bot=document.createElement("button");
    const res=buscarColor(obj.color);

    newDiv.className="barra";
    div1.className="barra-nombre";
    div2.className="barra-fecha";
    bot.className="barra-eliminar"; bot.id="barra-eliminar"+totalObj;
    div2.style.background=res[1];
    newDiv.style.background="linear-gradient(to left,"+res[1]+" 50%,"+res[0]+" 50%)";
    bot.style.background="linear-gradient(to left,"+res[1]+" 50%,"+res[0]+" 50%)";

    div1.appendChild(document.createTextNode(obj.nombre));
    div2.appendChild(document.createTextNode(operacionFecha(obj.fecha,2)));
    bot.appendChild(document.createTextNode("X"));
    bot.setAttribute("onclick","eliminar(this)");
    
    padre.appendChild(newDiv);
    newDiv.insertBefore(bot,null);
    newDiv.insertBefore(div1,bot);
    newDiv.insertBefore(div2,div1);
}

function eliminar(nodo){
    const obj=nodo.parentNode.children[1].textContent;
    const p=document.getElementById("lista");
    const remove=nodo.parentNode;
    let pos=list.indexOf(obj);

    res=1;

    list.splice(pos,1);
    p.removeChild(remove); 
    respuesta(3);  
    if(local==1) actualizarLS(); 
}


function agregar(){
        const nombre = document.getElementById("Nombre").value;
        const fecha = new String(document.getElementById("Fecha").value);
        const color = document.getElementById("Color").value;

        if(operacionFecha(fecha,1)==1&&nombre.length>4){
            cargarDato(nombre,fecha,color);respuesta(1);
            if(local==1) actualizarLS();
            if(estado==1){
                cargarFirefox();
                document.getElementById("Nombre").value=" ";
             }else{
                 document.getElementById("Fecha").value="";
                 document.getElementById("Nombre").value="";
             }
             /*document.getElementById("Color").value="#000000";*/
        }else if(nombre.length<=4){
            respuesta(4);
        }else{
            respuesta(2);
        }

    return false;
}

/* codigo que se actualizo pero que dejo por ser interesante */
/* reconocer que elemento se esta haciendo click*/
/*
document.addEventListener("click",function(even){
    var lista; console.log(even);
    
    respuesta(5);
    if(estado!=1){
        lista=even.path[0].className;

    }else if(estado==1){
        lista=even.explicitOriginalTarget.className;
    }
    
    console.log(lista);
    
});
*/
