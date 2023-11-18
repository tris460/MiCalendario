import { Component, OnInit } from '@angular/core';
import { addDays, format } from 'date-fns';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import esLocale from 'date-fns/locale/es';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { Alignment, PageOrientation, PageSize } from "pdfmake/interfaces";
import { parseDate } from 'src/app/utils/parseDate';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.page.html',
  styleUrls: ['./cycles.page.scss'],
})
export class CyclesPage implements OnInit {
  lastPeriodDate: Date | undefined;
  lastPeriodFormatted: any;
  userId: string | undefined;
  symptomsExist: boolean = false;
  menstrualCycle = 28;
  nextPeriod: any[] = [];
  emotionTitles: any = {
    '🙂': 'Feliz',
    '🙃': 'Feliz invertido',
    '😉': 'Feliz guiñando',
    '🫠': 'Derritiendose',
    '😊': 'Feliz tierno',
    '😇': 'Bendecido',
    '😀': 'Muy feliz',
    '😄': 'Divertido',
    '😁': 'Demasiado feliz',
    '😆': 'Demasiado divertido',
    '😅': 'Dudoso',
    '😂': 'Carcajadas',
    '🥰': 'Amoroso',
    '😍': 'Enamorado',
    '🤩': 'Maravillado',
    '😘': 'Cariñoso',
    '😗': 'Afectuoso',
    '😚': 'Besable',
    '🥲': 'Conmovido',
    '😋': 'Delicioso',
    '😛': 'Loco',
    '😜': 'Alocado',
    '🤪': 'Muy alocado',
    '🤑': 'Millonario',
    '🤗': 'Agradecido',
    '🫢': 'Sorprendido',
    '🤭': 'Riseño',
    '🫣': 'Reflexivo',
    '🤫': 'Silencioso',
    '🤔': 'Pensativo',
    '🫡': 'Obediente',
    '🤐': 'Silencioso',
    '🤨': 'Dudoso',
    '😐': 'Serio',
    '😑': 'Molesto',
    '😶': 'Sin palabras',
    '🫥': 'Diferente',
    '😏': 'Pervertido',
    '😒': 'Descepcionado',
    '🙄': 'Desafiante',
    '😬': 'Ansioso',
    '😮‍💨': 'Cansado',
    '🤥': 'Mentiroso',
    '😌': 'Calmado',
    '😔': 'Triste',
    '😪': 'Cansado',
    '🤤': 'Antojado',
    '😴': 'Muy somnoliento',
    '🤯': 'Desconcertado',
    '😵‍💫': 'Mareado',
    '🥳': 'Fiestero',
    '🥸': 'Desconfiado',
    '🫤': 'Confuso',
    '😕': 'Nerioso',
    '😟': 'Desilusionado',
    '🙁': 'Desanimado',
    '😮': 'Sorprendido',
    '😳': 'Avergonzado',
    '🥺': 'Tierno',
    '🥹': 'Muy tierno',
    '😦': 'Asustado',
    '😨': 'Preocupado',
    '😰': 'Muy preocupado',
    '😢': 'Melancólico',
    '😭': 'Muy triste',
    '😱': 'Muy asustado',
    '😖': 'Irritado',
    '😓': 'Desgastado',
    '😩': 'Desesperado',
    '🥱': 'Somnoliento',
    '😤': 'Molesto',
    '😡': 'Enojado',
    '🤬': 'Muy enojado',
    '😠': 'Muy molesto',
  };

  symptomTitles: any = {
    '😷': 'Enfermedad general',
    '😴': 'Somnoliento',
    '🤒': 'Febril',
    '🤕': 'Dolor de cabeza',
    '🤢': 'Nauseas',
    '🤮': 'Vómito',
    '🤧': 'Estornudos',
    '🥵': 'Calor',
    '🥶': 'Frio',
    '🥴': 'Mareos',
    '🤯': 'Migraña',
    '💩': 'Diarrea',
    '👃': 'Congestion nasal',
    '🧠': 'Dolor cerebral',
    '🫀': 'Dolor de corazon',
    '🫁': 'Dolor de pulmones',
    '🦷': 'Dolor de muelas',
    '🦴': 'Dolor de huesos'
  };
  isLoading: boolean = false;

  constructor(private sharedService: SharedService, private userService: UserService) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    });

    this.getLastPeriod();
  }

  ngOnInit() { }

  /**
   * This function obtains the date of the last period
   */
  getLastPeriod() {
    this.isLoading = true;
    this.userService.getSymptoms(this.userId!)
      .then((res: any) => {
        if (res.data) {
          res.data.forEach((item: any) => {
            item.date = item.date ? new Date(item.date) : null;
          });

          res.data.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
          for (let i = res.data.length -1; i >= 0; i--) {
            if (res.data[i].periodStarts) {
              this.lastPeriodDate = res.data[i].date;
              this.lastPeriodDate = new Date(this.lastPeriodDate!);
              this.lastPeriodFormatted = format(this.lastPeriodDate, "EEEE d 'de' MMMM 'de' yyyy", {locale: esLocale});
              this.symptomsExist = true;

              // Calculate the next periods
              for (let i = 1; i <= 12; i++) {
                const date: string | Date = addDays(this.lastPeriodDate, this.menstrualCycle * i);
                const formattedDate = format(date, "EEEE d 'de' MMMM 'de' yyyy", {locale: esLocale});
                this.nextPeriod.push(formattedDate);
              }

              break;
            } else {
              this.symptomsExist = false;
            }
          }

        } else {
          this.symptomsExist = false;
        }
      })
      .catch(err => {})
      .finally(() => this.isLoading = false)
  }

  /**
   * This function generates a PDF with the data of the symptoms
   */
  generatePDF(): void {
    this.isLoading = true;
    this.userService.getSymptoms(this.userId!)
      .then((res: any) => {
        let originalDate;

        res.data.forEach((item: any) => {
          originalDate = item.date;
          const newDate = new Date(originalDate);
          newDate.setDate(newDate.getDate() + 1);
          item.date = newDate;
        });

        res.data.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());

        const documentDefinition = {
          pageOrientation: "landscape" as PageOrientation,
          pageSize: 'A3' as PageSize,
          content: [
            { text: 'Mi Calendario - Reporte de Síntomas', style: 'header' },
            { text: '\n\n' },
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto','auto', 'auto', 'auto','auto', 'auto', 'auto','auto', 'auto', 'auto','auto'],
                body: [
                  [
                    { text: 'Fecha', style: 'tableHeader' },
                    { text: 'Anticonceptivos', style: 'tableHeader' },
                    { text: 'Anticonceptivo de emergencia', style: 'tableHeader' },
                    { text: 'Emociones', style: 'tableHeader' },
                    { text: 'Peso', style: 'tableHeader' },
                    { text: 'Altura', style: 'tableHeader' },
                    { text: 'Inicio del periodo', style: 'tableHeader' },
                    { text: 'Fin del periodo', style: 'tableHeader' },
                    { text: 'Embarazo', style: 'tableHeader' },
                    { text: 'Semanas de embarazo', style: 'tableHeader' },
                    { text: 'Horas de sueño', style: 'tableHeader' },
                    { text: 'Síntomas', style: 'tableHeader' },
                    { text: 'Temperatura', style: 'tableHeader' },
                  ],
                  ...res.data.map((symptom: any) => [
                    parseDate(symptom.date),
                    symptom.contraceptives ? symptom.contraceptives.join(', ') : '',
                    { text: symptom.emergencyPill ? 'X' : '', style: 'center' },
                    this.getTitle(symptom.emotions, this.emotionTitles),
                    { text: symptom.weight ? `${symptom.weight}Kg` : '', style: 'center' },
                    { text: symptom.height ? `${symptom.height}cm` : '', style: 'center' },
                    { text: symptom.periodStarts ? 'X' : '', style: 'center' },
                    { text: symptom.periodEnds ? 'X' : '', style: 'center' },
                    { text: symptom.pregnant ? 'X' : '', style: 'center' },
                    { text: symptom.pregnancyWeeks ? symptom.pregnancyWeeks : '', style: 'center' },
                    { text: symptom.sleep ? `${symptom.sleep}hr` : '', style: 'center' },
                    this.getTitle(symptom.symptoms, this.symptomTitles),
                    { text: symptom.temperature ? `${symptom.temperature}°C` : '', style: 'center' },
                  ]),
                ],
              },
            },
          ],
          styles: {
            header: {
              fontSize: 18,
              bold: true,
            },
            tableHeader: {
              bold: true,
              alignment: 'center' as Alignment,
            },
            center: {
              alignment: 'center' as Alignment,
            }
          },
        };

        pdfMake.createPdf(documentDefinition).download(`${originalDate}_reporte_sintomas_Mi_Calendario.pdf`);
      })
      .catch(err => {})
      .finally(() => this.isLoading = false)
  }

  /**
   * This function converts the emojis sended into a string with the titles of those symptoms
   * @param emojis Emojis selected
   * @param titles Titles of the emojis
   * @returns A string wuth the titles
   */
  getTitle(emojis: string[], titles: any): string {
    let text = '';

    for (let i=0; i<emojis.length; i++) {
      const emoji: any = emojis[i];
      text += `${titles[emoji]}, `;
    }
    return text;
  }

}
