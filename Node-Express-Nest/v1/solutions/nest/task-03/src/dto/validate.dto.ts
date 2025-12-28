export class ValidateDto {
  readonly name: string;
  readonly email: string;
  readonly age: number;
  
  constructor(name: string, email: string, age: number) {
    this.name = name;
    this.email = email;
    this.age = age;
  }
}
