import { Employee } from '../employees/types';
import { Relation } from '../relations/relations.types';
import { getBusinesDaysInMonth } from '../../utils/getBusinessDaysInMonth';

export type TravelingExpense = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
  status: number;
};

export type TravelingExpenseCDTO = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
};

export const newTravelingExpenseCDTO = () => {
  let now = new Date(Date.now());

  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  return {
    id: 0,
    year: year,
    month: month,
    creation_date: ''
  } as TravelingExpenseCDTO;
};

export type TravelingExpenseWithDetails = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
  employees_with_relation: EmployeeWithRelations[];
  maxNonTaxedValue: number;
  status: number;
  preracun_na_bruto: number;
  stopa: number;
};

export type EmployeeWithRelations = {
  id: number;
  employee_id: number;
  traveling_expense_id: number;
  employee: Employee;
  relations_with_days: RelationWithDays[];
};

export type RelationWithDays = {
  days: 0;
  id: 5;
  relation_id: 1;
  traveling_expense_employee_id: 15;
  relation: Relation;
};

type TravelingExpenseCalculation={
  neto:number,
  oporezivo:number,
  neoporezivo:number,
  brutoOporezivo:number,
  porez:number

}
export class EmployeeTravelingExpenseCalculator{
  private _maxNeoporeziviIznos:number;
  private _month:number;
  private _year:number;
  private _preracunNaBruto:number;
  private _stopa:number;


  constructor(year:number,month:number,maxNeoporeziviIznos:number,preracunNaBruto:number,stopa:number){
    this._year=year;
    this._month=month;
    this._maxNeoporeziviIznos=maxNeoporeziviIznos;
    this._preracunNaBruto=preracunNaBruto;
    this._stopa=stopa;
  }
  public getCalculation=(employeeWithRelations:EmployeeWithRelations) :TravelingExpenseCalculation=>{
    let calculation : TravelingExpenseCalculation = {
      neto:0,
      oporezivo:0,
      neoporezivo:0,
      brutoOporezivo:0,
      porez:0
    }
    let days=0;
    employeeWithRelations.relations_with_days.map(relationWithDays=>{
      calculation.neto+=relationWithDays.days*relationWithDays.relation.price;
      days+=relationWithDays.days;
    })

    calculation.neoporezivo=this.calculateNonTaxedValue(days,calculation.neto);
    calculation.oporezivo = calculation.neto - calculation.neoporezivo;
    calculation.brutoOporezivo = calculation.oporezivo * this._preracunNaBruto;
    calculation.porez = (calculation.brutoOporezivo * this._stopa) / 100;

    return calculation;
  }

  private calculateNonTaxedValue = (days:number,sum: number  ) :number => {
    let brojRadnihDana = getBusinesDaysInMonth(this._month, this._year);
    let potencijalnaNeoporezivaSuma = days * (this._maxNeoporeziviIznos / brojRadnihDana);
    let neoporezivo =
      potencijalnaNeoporezivaSuma > this._maxNeoporeziviIznos ? this._maxNeoporeziviIznos : potencijalnaNeoporezivaSuma;
    neoporezivo = neoporezivo > sum ? sum : neoporezivo;

    return neoporezivo
  };
}
