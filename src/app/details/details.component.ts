import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { parse } from 'yamljs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CreamiProductType, PintDetails, PintType } from '../pint';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import {create, all} from 'mathjs'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatSelectModule, MatListModule, MatButtonToggleModule, MatChipsModule],
  providers: [HttpClient],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  pintDetails: PintDetails | undefined;
  pintType: PintType = PintType.iceCream;
  pintName: string = '';

  originalCreamiIngredients: string[] = []
  deluxeCreamiIngredients: string[] = []
  
  selectedNinjaProduct: CreamiProductType | undefined

  ngOnInit(): void {
    this.getPint();
  }

  getImageUrl(pintType: string, urlName:string){
    return `assets/${pintType}/${urlName}/recipe.jpg`
  }

  getPint(): void {
    this.pintType = this.route.snapshot.paramMap.get('pintType') as PintType;
    this.pintName = this.route.snapshot.paramMap.get('pintName') as string;

    this.http.get(`assets/${this.pintType}/${this.pintName}/recipe.yml`, {
      observe: 'body',
      responseType: "text"
    }).pipe(
      map(yamlString => parse(yamlString))
    ).subscribe(data => {
      this.pintDetails = data
      this.selectedNinjaProduct = this.pintDetails?.creamiProductType

      if (this.pintDetails?.creamiProductType == CreamiProductType.deluxe) {
        this.deluxeCreamiIngredients = this.pintDetails.ingredients
        this.originalCreamiIngredients = this.convertIngredients(CreamiProductType.deluxe, CreamiProductType.original, this.pintDetails.ingredients)

      } else if (this.pintDetails?.creamiProductType == CreamiProductType.original || this.pintDetails?.creamiProductType == CreamiProductType.breeze) {
        this.originalCreamiIngredients = this.pintDetails.ingredients
        this.deluxeCreamiIngredients = this.convertIngredients(CreamiProductType.original, CreamiProductType.deluxe, this.pintDetails.ingredients)
      }
    });
  }

  convertIngredients(fromPint: CreamiProductType, toPint: CreamiProductType, ingredients: string[]): string[] {

    const measurementTypes = [
      "c",
      "tsp",
      "oz",
      "tbsp"
    ]

    const convertedList = []

    if ((fromPint == toPint) ||
        (fromPint == CreamiProductType.original && toPint == CreamiProductType.breeze) ||
        (fromPint == CreamiProductType.breeze && toPint == CreamiProductType.original)) {

          // nothing to convert, return original ingredietns
          return ingredients
    }

    const math = create(all, {number: 'Fraction'})

    for (const ingredient of ingredients) {
      const measuresAndMaterials = ingredient.split(",")
      const splitMultipleAmounts = measuresAndMaterials[0].split("+")
      const multipleMeasurements = []

      for (const eachAmount of splitMultipleAmounts) {
        let recordedMeasurementType = ""
        const amountsAndMeasurementTypes = eachAmount.trim().split(" ")

        let totalAmount = math.fraction(0)

        for (const value of amountsAndMeasurementTypes) {
          try {
            totalAmount = math.add(totalAmount, math.fraction(value))
          } catch {
            // we have reached a non fractional value, treat as measurement type
            for (const measurementType of measurementTypes) {
              if (eachAmount.includes(measurementType)) {
                recordedMeasurementType = measurementType
                break;
              }
            }
          }
        }

        let convertedAmount: any;
        let finalAmount: string;

        if (toPint == CreamiProductType.deluxe) {
          convertedAmount = math.evaluate(totalAmount + '* 24 / 16')

        } else {
          convertedAmount = math.evaluate(totalAmount + ' * 16 / 24')
        }

        const numerator = convertedAmount.n
        const denominator = convertedAmount.d

        if (numerator == denominator) {
          finalAmount = "1"
        } else if (numerator > denominator) {
          const wholeNumber = Math.floor(numerator / denominator)

          const remainder = numerator % denominator

          if (remainder == 0) {
            finalAmount = wholeNumber.toString()
          } else {
            finalAmount = wholeNumber.toString() + " " + remainder.toString() + "/" + denominator.toString()
          }
        } else {
          finalAmount = numerator + "/" + denominator
        }

        multipleMeasurements.push(finalAmount + " " + recordedMeasurementType)
      }
    
      convertedList.push(multipleMeasurements.join(" + ") + ', ' + measuresAndMaterials[1].trim())

    }

      return convertedList
  }

  getPintTypeCardLabel(pintType: PintType){
    if (pintType == PintType.iceCream) {
      return "Ice Cream"
    }
    return "Ice Cream"
  }
  
  getChipListValue(chipEvent: any) {
    this.selectedNinjaProduct = chipEvent.value
  }
}

