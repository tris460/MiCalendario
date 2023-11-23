import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  constructor() {
   }

   ngOnInit() {
    
  }
  preguntasFallo = [
    {
      preguntaFallo: "¿Te gustaria reportar algun fallo?",
      respuestasFallo: ["Sí", "No"],
    },
    {
      informacion: "Envia un correo a Sebas@gmail.com",
      preguntaFallo: "¿Te gustaria conocer mas sobre nuestra aplicacion?",
      Input: "",
      respuestasFallo: ["Sí", "No"],
    },
    {
      informacion: "Ingresa al siguiente Link para conocer sobre la aplicacion link.con",
      preguntaFallo: "¿Quieres conocer nuestros horarios de atencion?",
      respuestasFallo: ["Sí", "No"],
    },
    {
      informacion: "El horario de atencion de nuestros empleados son de lunes a viernes de 8:30 a 17:30 hrs",
      
      respuestasFallo: ["Sí", "No"],
    },
  ];
  preguntaActual = 0;

  mostrarPreguntaFallo(respuestaFallo: string) {
    if (respuestaFallo === "Sí") {
      // Si la respuesta es "Sí", avanzar a la siguiente pregunta
      this.preguntaActual++;
    } else if (respuestaFallo === "No") {
      // Manejar lógica para respuesta "No" si es necesario
      this.preguntaActual = 4;
    }
    // Puedes agregar lógica adicional aquí según tus necesidades

  }

  preguntasAyuda = [
    {
      preguntaAyuda: "¿Necesitas ayuda con la aplicacion?",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Quieres agregar más detalles?",
      respuestasAyuda: ["Sí", "No"],
    },{
      preguntaAyuda: "¿Experimentaste algún error o mensaje de error específico?",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Puedes describir con más detalle cuándo y cómo ocurrió el fallo?",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Has intentado alguna solución por tu cuenta? (por ejemplo, reiniciar la aplicación)",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿En qué parte de la aplicación ocurrió el fallo? (por ejemplo, en la pantalla de inicio, al realizar una acción específica)",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Puedes proporcionar detalles sobre el dispositivo o navegador que estabas usando cuando ocurrió el fallo?",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Has recibido algún mensaje de error en particular? Si es así, ¿puedes proporcionar el texto del mensaje?",
      respuestasAyuda: ["Sí", "No"],
    },
    {
      preguntaAyuda: "¿Estás utilizando la versión más reciente de la aplicación?",
      respuestasAyuda: ["Sí", "No"],
    },

  ];
  preguntaActualAyuda = 0;

  mostrarPreguntaAyuda(respuestaAyuda: string) {
    if (respuestaAyuda === "Sí") {
      // Si la respuesta es "Sí", avanzar a la siguiente pregunta
      this.preguntaActualAyuda++;
    } else if (respuestaAyuda === "No") {
      this.preguntaActualAyuda = 8;
    }
    // Puedes agregar lógica adicional aquí según tus necesidades

  } 
}


