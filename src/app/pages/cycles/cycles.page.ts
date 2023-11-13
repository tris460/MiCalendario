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
  }

  /**
   * This function generates a PDF with the data of the symptoms
   */
  generatePDF(): void {
    this.userService.getSymptoms(this.userId!)
      .then((res: any) => {
        console.log(res) //TODO: Ver porque trae fechas mal (un dia despues de lo registrado)
        res.data.forEach((item: any) => {
          item.date = new Date(item.date);
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
                    symptom.emergencyPill ? 'X' : '',
                    symptom.emotions ? symptom.emotions.join(', ') : '',
                    symptom.weight ? `${symptom.weight}Kg` : '',
                    symptom.height ? `${symptom.height}cm` : '',
                    symptom.periodStarts ? 'X' : '',
                    symptom.periodEnds ? 'X' : '',
                    symptom.pregnant ? 'X' : '',
                    symptom.pregnancyWeeks ? symptom.pregnancyWeeks : '',
                    symptom.sleep ? `${symptom.sleep}hr` : '',
                    symptom.symptoms ? symptom.symptoms.join(', ') : '',
                    symptom.temperature ? `${symptom.temperature}°C` : '',
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
          },
        };

        pdfMake.createPdf(documentDefinition).download('reporte_sintomas.pdf'); //TODO: Update file name
      })
      .catch(err => {});
  }
}
