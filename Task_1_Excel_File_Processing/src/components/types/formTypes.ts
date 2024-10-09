export interface IFormInputs {
  startTime: string;
  endTime: string;
}

export interface Transaction {
  date: string;
  time: string;
  amount: number;
}

export interface FormTransactionProps {
  uniqueDates: string[];
  onFormSubmit: (values: IFormInputs, selectedDate: string) => void;
}
