import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { parse } from 'yamljs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { ProductType, PintDetails, PintType } from '../pint';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import {create, all} from 'mathjs'
import { PINTS } from '../data';
import { Pint } from '../pint';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatSelectModule, MatListModule, MatButtonToggleModule, MatChipsModule, RouterLink],
  providers: [HttpClient],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  pints = PINTS

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  pintDetails: PintDetails | undefined;
  pintType: PintType = PintType.iceCream;
  pintName: string = '';

  originalCreamiIngredients: string[] = []
  deluxeCreamiIngredients: string[] = []
  ice21Ingredients: string[] = []

  medal: string = '';
  medal_description: string = ''
  
  selectedProduct: ProductType | undefined

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
      this.selectedProduct = this.pintDetails?.productType

      if (this.pintDetails?.productType == ProductType.ncDeluxe) {
        this.deluxeCreamiIngredients = this.pintDetails.ingredients
        this.originalCreamiIngredients = this.convertIngredients(ProductType.ncDeluxe, ProductType.ncOriginal, this.pintDetails.ingredients)
        this.ice21Ingredients = this.convertIngredients(ProductType.ncDeluxe, ProductType.ice21, this.pintDetails.ingredients)
      } else if (this.pintDetails?.productType == ProductType.ncOriginal || this.pintDetails?.productType == ProductType.ncBreeze) {
        this.originalCreamiIngredients = this.pintDetails.ingredients
        this.deluxeCreamiIngredients = this.convertIngredients(ProductType.ncOriginal, ProductType.ncDeluxe, this.pintDetails.ingredients)
        this.ice21Ingredients = this.convertIngredients(ProductType.ncOriginal, ProductType.ice21, this.pintDetails.ingredients)
      } else if (this.pintDetails?.productType == ProductType.ice21) {
        this.ice21Ingredients = this.pintDetails.ingredients
        this.originalCreamiIngredients = this.convertIngredients(ProductType.ice21, ProductType.ncOriginal, this.pintDetails.ingredients)
        this.deluxeCreamiIngredients = this.convertIngredients(ProductType.ice21, ProductType.ncDeluxe, this.pintDetails.ingredients)
      }

      [this.medal, this.medal_description] = this.getMedalAndDescription(this.pintName, this.pints)
    });
  }

  getMedalAndDescription(name: string, pints: Pint[]): [string, string] {
    const index = pints.findIndex(p => p.urlName === name);
    if (index === -1) return ['',''];
  
    const percentile = index / pints.length;
  
    if (percentile <= 0.10) return ['🥇', 'Top 10% of ' + pints.length];
    else if (percentile <= 0.25) return ['🥈', 'Top 25% of ' + pints.length];
    else if (percentile <= 0.5) return ['🥉', 'Top 50% of ' + pints.length];
    else return ['',''];
  }

  convertIngredients(fromPint: ProductType, toPint: ProductType, ingredients: string[]): string[] {

    const measurementTypes = [
      "c",
      "tsp",
      "oz",
      "tbsp",
      "g"
    ]

    const convertedList = []

    if ((fromPint == toPint) ||
        (fromPint == ProductType.ncOriginal && toPint == ProductType.ncBreeze) ||
        (fromPint == ProductType.ncBreeze && toPint == ProductType.ncOriginal)) {

          // nothing to convert, return original ingredients
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

        if (fromPint == ProductType.ncDeluxe) {
          if (toPint == ProductType.ncBreeze || toPint == ProductType.ncOriginal) {
            convertedAmount = math.evaluate(totalAmount + ' * 16 / 24')
          } else if (toPint == ProductType.ice21) {
            convertedAmount = math.evaluate(totalAmount + ' * 32 / 24')
          }
        }

        if (fromPint == ProductType.ncOriginal || fromPint == ProductType.ncBreeze) {
          if (toPint == ProductType.ncDeluxe) {
            convertedAmount = math.evaluate(totalAmount + ' * 24 / 16')
          } else if (toPint == ProductType.ice21) {
            convertedAmount = math.evaluate(totalAmount + ' * 32 / 16')
          }
        }

        if (fromPint == ProductType.ice21) {
          if (toPint == ProductType.ncBreeze || toPint == ProductType.ncOriginal) {
            convertedAmount = math.evaluate(totalAmount + ' * 16 / 32')
          } else if (toPint == ProductType.ncDeluxe) {
            convertedAmount = math.evaluate(totalAmount + ' * 24 / 32')
          }
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
    } else if (pintType == PintType.sorbet) {
      return "Sorbet"
    } else if (pintType == PintType.milkShake) {
      return "Milk Shake"
    }
    return pintType
  }
  
  getChipListValue(chipEvent: any) {
    this.selectedProduct = chipEvent.value
  }
}

