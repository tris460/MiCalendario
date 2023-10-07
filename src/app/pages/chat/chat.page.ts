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
      this.preguntaActual = 3;
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
    },
    // Agrega más preguntas y respuestas según sea necesario
  ];
  preguntaActualAyuda = 0;

  mostrarPreguntaAyuda(respuestaAyuda: string) {
    if (respuestaAyuda === "Sí") {
      // Si la respuesta es "Sí", avanzar a la siguiente pregunta
      this.preguntaActualAyuda++;
    } else if (respuestaAyuda === "No") {
      // Manejar lógica para respuesta "No" si es necesario
    }
    // Puedes agregar lógica adicional aquí según tus necesidades

  } 
}


